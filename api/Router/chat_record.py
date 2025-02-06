from fastapi import HTTPException, status, APIRouter, Depends
from fastapi.responses import JSONResponse
from database import db

from schemas import ReadChatRecord
from exception import bad_request
from Repository.CommonCRUD import *
from Repository.ChatRecordCRUD import (create_new_chat_record,
                                       get_all_chat_record_info,
                                       get_chat_record_content,
                                       delete_chat_record_content,
                                       send_chat_request,
                                       patch_chat_record)
from Authentication import hashing
from Authentication.JWTtoken import get_current_user
from database import execute_stmt_in_tran


router = APIRouter(prefix="/chat_record", tags=["ChatRecord"])


@router.post('/')
async def add_new_chat_record(current_user=Depends(get_current_user)) -> None:
    """
    Create a new chat record.

    This endpoint will create a new chat record for user.

    :param current_user: The user from the token of current request.
    :return: HTTP code for successful / failed to create new chat record.
    """

    if not await create_new_chat_record(current_user.user_id):
        raise bad_request


@router.get('/')
async def get_all_chat_record(current_user=Depends(get_current_user)) -> list[ReadChatRecord]:
    """
    Get chat record.

    This endpoint will get all chat records belongs to current user.

    :param current_user: The user from the token of current request.
    :return: All chat records' name and their id.
    """

    records = await get_all_chat_record_info(current_user.user_id)

    if not records and records != []:
        raise bad_request

    return records


@router.get('/{record_id}')
async def get_chat_record(record_id: int, current_user=Depends(get_current_user)) -> JSONResponse:
    """
    Get chat record.

    This endpoint will get chat record by record id.

    :param record_id: The chat record id.
    :param current_user: The user from the token of current request.
    :return: Chat record content.
    """

    record = await get_chat_record_content(record_id, current_user.user_id)

    if not record and record != {}:
        raise bad_request

    return record


@router.delete('/{record_id}')
async def delete_chat_record(record_id: int, current_user=Depends(get_current_user)) -> None:
    """
    Delete chat record.

    This endpoint will delete chat record by given record id.
    :param record_id: The target record id.
    :param current_user: The user from the token of current request.
    :return: HTTP code for successful / failed to delete chat record.
    """

    if not await delete_chat_record_content(record_id, current_user.user_id):
        raise bad_request


@router.post('/chat')
async def chat_request(record_id: int, chat_message: str, use_record: bool, model: str,
                       current_user=Depends(get_current_user)) -> dict:
    """
    Chat request.

    This endpoint will send chat request to using given chat record id and save the response to file.

    :param record_id: The target chat record.
    :param chat_message: The message to chat with LLM.
    :param current_user: The user from the token of current request.
    :param use_record: Whether to use history chat record.
    :param model: The gpt model to use.
    :return: HTTP code for successful / failed to send chat request.
    """

    response = await send_chat_request(record_id, chat_message, current_user.user_id, use_record, model)

    if not response:
        raise bad_request
        
    update = await chat_update(record_id, 1)

    if not update:
        raise bad_request

    return response


@router.patch('/chat')
async def chat_update(record_id: int, mode: int, value: str = None, current_user=Depends(get_current_user)) -> None:
    """
    Chat data patch.

    This endpoint is used to patch the chat record data (updated_at and chat_name).

    :param record_id: The target chat record.
    :param mode: The mode of patching, 1 for updated_at, 2 for chat_name.
    :return: HTTP code for successful / failed to patch.
    """

    if not current_user:
        return False

    response = await patch_chat_record(record_id, mode, value)
    print("response", response)
    if not response:
        raise bad_request
