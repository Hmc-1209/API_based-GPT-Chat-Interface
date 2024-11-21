from fastapi import HTTPException, status, APIRouter, Depends
from database import db

from models import User
from schemas import BaseUser
from Repository.CommonCRUD import *
from Repository.ChatRecordCRUD import create_new_chat_record
from Authentication import hashing
from Authentication.JWTtoken import get_current_user
from database import execute_stmt_in_tran

router = APIRouter(prefix="/chat_record", tags=["ChatRecord"])


@router.post('/chat')
async def add_new_chat_record(current_user=Depends(get_current_user)) -> None:
    """
    Create a new chat record.

    This endpoint will create a new chat record for user.
    :return: HTTP code for successful / failed to create new chat record.
    """

    if not await create_new_chat_record(current_user.user_id):
        raise bad_request
