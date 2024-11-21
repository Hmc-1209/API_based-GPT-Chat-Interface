from fastapi import HTTPException, status
from database import db

from datetime import datetime
from config import data_storage_path
from models import ChatRecord
from schemas import BaseChatRecord, CreateChatRecord
from exception import bad_request
from Repository.CommonCRUD import *
from database import execute_stmt_in_tran


async def create_new_chat_record(user_id: int):
    """
    Create a new chat record.

    This endpoint creates a new chat record with current time and user id.

    :param user_id: The current user's id.
    :return: HTTP code for successful / failed to create new chat record.
    """

    stmt = ChatRecord.insert().values(user_id=user_id,
                                      chat_name="New Chat",
                                      created_at=datetime.utcnow(),
                                      updated_at=datetime.utcnow())

    if not await execute_stmt_in_tran(stmt):
        raise bad_request
