from fastapi import HTTPException, status
from database import db
from sqlalchemy import insert
from cryptography.fernet import Fernet

from datetime import datetime
from config import data_storage_path
from models import ChatRecord
from schemas import BaseChatRecord, CreateChatRecord, ReadChatRecord
from exception import bad_request, api_key_error
from Repository.CommonCRUD import *
from Repository.UserCRUD import get_current_user_api_key
from database import execute_stmt_in_tran
import secrets
import os
import aiofiles
import json
import openai


async def create_new_chat_record(user_id: int):
    """
    Create a new chat record.

    This endpoint creates a new chat record with current time and user id.

    :param user_id: The current user's id.
    :return: HTTP code for successful / failed to create new chat record.
    """

    stmt = ChatRecord.insert().values(
        user_id=user_id,
        chat_name="New Chat",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    record_id = await execute_stmt_in_tran([stmt], ret=True)

    if not record_id:
        return False

    try:
        chat_record_folder = os.path.join(data_storage_path, "ChatRecord", "user-id-" + str(user_id))
        key_folder = os.path.join(data_storage_path, "Key", "user-id-" + str(user_id))
        os.makedirs(chat_record_folder, exist_ok=True)
        os.makedirs(key_folder, exist_ok=True)

        bson_file_path = os.path.join(chat_record_folder, f"chat-id-{record_id}.bson")
        key_file_path = os.path.join(key_folder, f"chat-id-{record_id}.txt")
        encryption_key = Fernet.generate_key()
        fernet = Fernet(encryption_key)

        data = [
            {"role": "system", "content": "You're an assistant for answering questions."}
        ]
        json_data = json.dumps(data)
        encrypted_json = fernet.encrypt(json_data.encode())

        async with aiofiles.open(bson_file_path, "wb") as bson_file:
            await bson_file.write(encrypted_json)

        async with aiofiles.open(key_file_path, "wb") as key_file:
            await key_file.write(encryption_key)

        return True

    except:
        delete_stmt = ChatRecord.delete().where(ChatRecord.c.record_id == record_id)
        await execute_stmt_in_tran([delete_stmt])

        if os.path.exists(bson_file_path):
            os.remove(bson_file_path)
        if os.path.exists(key_file_path):
            os.remove(key_file_path)

        return False


async def get_all_chat_record_info(user_id: int) -> list[ReadChatRecord]:
    """
    Get all chat record info.

    This endpoint returns all chat record info.

    :param user_id: The current user's id.
    :return: All chat record info for current user.
    """

    stmt = ChatRecord.select().where(ChatRecord.c.user_id == user_id)

    return await db.fetch_all(stmt)


async def get_chat_record_content(record_id: int, user_id: int) -> json:
    """
    Get chat record content.

    This endpoint returns chat record content.

    :param record_id: The target chat record id.
    :param user_id: The current user id.
    :return: The chat record content.
    """

    stmt = ChatRecord.select().where(ChatRecord.c.record_id == record_id)
    if (await db.fetch_one(stmt)).user_id != user_id:
        return False

    chat_record_path = os.path.join(data_storage_path, "ChatRecord", "user-id-" + str(user_id), "chat-id-" + str(record_id) + ".bson")
    key_path = os.path.join(data_storage_path, "Key", "user-id-" + str(user_id), "chat-id-" + str(record_id) + ".txt")

    return await decrypt_content(chat_record_path, key_path)


async def delete_chat_record_content(record_id: int, user_id: int) -> bool:
    """
    Delete chat record content.

    This endpoint deletes chat record content.
    :param record_id: The target chat record id.
    :param user_id: The current user id.
    :return: HTTP code for successful / failed to delete chat record content.
    """

    stmt = ChatRecord.select().where(ChatRecord.c.record_id == record_id)
    chat_record = await db.fetch_one(stmt)

    if not (chat_record and chat_record.user_id == user_id):
        return False

    bson_file_path = os.path.join(data_storage_path, "ChatRecord", "user-id-" + str(user_id),
                                  f"chat-id-{record_id}.bson")
    key_file_path = os.path.join(data_storage_path, "Key", "user-id-" + str(user_id),
                                 f"chat-id-{record_id}.txt")

    try:
        delete_stmt = ChatRecord.delete().where(ChatRecord.c.record_id == record_id)
        result = await execute_stmt_in_tran([delete_stmt])

        if result:
            if os.path.exists(bson_file_path):
                os.remove(bson_file_path)
            else:
                raise FileNotFoundError(f"BSON file not found: {bson_file_path}")

            if os.path.exists(key_file_path):
                os.remove(key_file_path)
            else:
                raise FileNotFoundError(f"Key file not found: {key_file_path}")

            return True
        else:
            return False

    except Exception as e:
        print(f"Error during deletion: {e}")
        return False


async def send_chat_request(record_id: int, chat_message: str, user_id: int, use_record: bool, model: str) -> dict:
    """
    Send the chatting request.

    This endpoint is used to send chat request to gpt api.

    :param record_id: The target chat record id.
    :param chat_message: The message to send.
    :param user_id: The current user id.
    :param use_record: Whether to use chat record or not.
    :param model: The gpt model to use.
    :return: Response from gpt api.
    """

    try:
        openai.api_key = await get_current_user_api_key(user_id)
        if openai.api_key == "none":
            raise api_key_error

        message = await get_chat_record_content(record_id, user_id) if use_record else [
            {"role": "system", "content": "You're an assistant for answering questions."}
        ]
        message.append({"role": "user", "content": chat_message})

        response = openai.chat.completions.create(
            model=model,
            messages=message
        )
        print("* Response from gpt api.")

        key_file_path = os.path.join(data_storage_path, "Key", "user-id-" + str(user_id), f"chat-id-{record_id}.txt")
        async with aiofiles.open(key_file_path, "rb") as key_file:
            key = await key_file.read()

        fernet = Fernet(key)
        response_data = {"role": "assistant", "content": response.choices[0].message.content}
        message.append(response_data)
        bson_file_path = os.path.join(data_storage_path, "ChatRecord", "user-id-" + str(user_id),
                                      f"chat-id-{record_id}.bson")

        if not use_record:
            message = message[1:]
            async with aiofiles.open(bson_file_path, "rb") as bson_file:
                old_msg = await bson_file.read()
                decrypted_msg = json.loads(fernet.decrypt(old_msg).decode('utf-8'))

                if isinstance(decrypted_msg, list):
                    decrypted_msg.extend(message)
                    message = decrypted_msg
                else:
                    raise ValueError("Decrypted message format is not a list.")

        async with aiofiles.open(bson_file_path, "wb") as bson_file:
            content = fernet.encrypt(json.dumps(message).encode())
            await bson_file.write(content)

        return response_data

    except Exception as e:
        print(f"Call Openai API Error: {e}")

        if "invalid_api_key" in str(e):
            raise api_key_error


async def patch_chat_record(record_id: int, mode: int, value: str = None):
    """
    Patch char record data.

    This endpoint is used to patch the chat record data (updated_at and chat_name).

    :param record_id: The target chat record.
    :param mode: The mode of patching, 1 for updated_at, 2 for chat_name.
    :return: HTTP code for successful / failed to patch.
    """


    if mode == 1:
        stmt = ChatRecord.update().where(ChatRecord.c.record_id==record_id).values(updated_at=datetime.utcnow())
        return await execute_stmt_in_tran([stmt], ret=True)
    elif mode == 2:
        stmt = ChatRecord.update().where(ChatRecord.c.record_id==record_id).values(chat_name=value)
        stmt2 = ChatRecord.update().where(ChatRecord.c.record_id==record_id).values(updated_at=datetime.utcnow())
        return await execute_stmt_in_tran([stmt, stmt2], ret=True)
    else:
        return False
