from fastapi import HTTPException, status
from database import db
from sqlalchemy import insert

from datetime import datetime
from config import data_storage_path
from models import ChatRecord
from schemas import BaseChatRecord, CreateChatRecord
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
        updated_at=datetime.utcnow(),
        record_path="pending",
        chat_encryption_key_path="pending"
    )
    record_id = await execute_stmt_in_tran([stmt], ret=True)

    chat_record_folder = os.path.join(data_storage_path, "ChatRecord", "user-id-" + str(user_id))
    key_folder = os.path.join(data_storage_path, "Key", "user-id-" + str(user_id))
    os.makedirs(chat_record_folder, exist_ok=True)
    os.makedirs(key_folder, exist_ok=True)

    json_file_path = os.path.join(chat_record_folder, f"chat-id-{record_id}.json")
    async with aiofiles.open(json_file_path, "w") as json_file:
        await json_file.write(json.dumps({}))

    encryption_key = secrets.token_hex(32)
    key_file_path = os.path.join(key_folder, f"chat-id-{record_id}.txt")
    async with aiofiles.open(key_file_path, "w") as key_file:
        await key_file.write(encryption_key)

    update_stmt = ChatRecord.update().where(
        ChatRecord.c.record_id == record_id
    ).values(record_path=json_file_path,
             chat_encryption_key_path=key_file_path)

    return await execute_stmt_in_tran([update_stmt])
