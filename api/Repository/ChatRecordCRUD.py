from fastapi import HTTPException, status
from database import db
from sqlalchemy import insert
from cryptography.fernet import Fernet

from datetime import datetime
from config import data_storage_path
from models import ChatRecord
from schemas import BaseChatRecord, CreateChatRecord, ReadChatRecord
from exception import bad_request
from Repository.CommonCRUD import *
from database import execute_stmt_in_tran
import secrets
import os
import aiofiles
import json


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
        data = {}
        json_data = json.dumps(data)
        encrypted_json = fernet.encrypt(json_data.encode())

        async with aiofiles.open(bson_file_path, "wb") as bson_file:
            await bson_file.write(encrypted_json)

        async with aiofiles.open(key_file_path, "wb") as key_file:
            await key_file.write(encryption_key)

        return True

    except Exception as e:
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


async def send_chat_request(record_id: int, chat_message: str, user_id: int) -> bool:

    return False
