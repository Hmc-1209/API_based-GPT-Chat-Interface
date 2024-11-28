from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from schemas import BaseUser, CreateUser, CompleteUser
from exception import bad_request, password_error, confirm_password_error, username_repeated
from Repository.UserCRUD import create_user, patch_user_data, update_user_password, get_current_user_api_key
from Repository.CommonCRUD import check_user_name
from Authentication.JWTtoken import get_current_user
from Authentication.hashing import hashing_password, verify_password

router = APIRouter(prefix="/user", tags=["User"])


@router.post("/")
async def create_new_user(user: CreateUser) -> None:
    """
    Create a new user.

    This endpoint is used to create a new user.

    :param user: The name and password for the user.
    :return: HTTP code for successful / failed creation of the new user.
    """

    if await check_user_name(user.name):
        raise username_repeated

    if not await create_user(user):
        raise bad_request


@router.get("/")
async def get_self_user(current_user=Depends(get_current_user)) -> CompleteUser:
    """
    Retrieve the current user.

    This endpoint is used to retrieve the current user's data.

    :param current_user: The user from the token of current request.
    :return: The current user's data.
    """

    return current_user


@router.get("/api-key")
async def get_self_api_key(current_user=Depends(get_current_user)) -> str:
    """
    Retrieve the current user's api_key

    This endpoint is used to retrieve the current user's api_key.

    :param current_user: The user from the token of current request.
    :return: The current user's api_key.
    """

    result = await get_current_user_api_key(current_user.user_id)
    if not result:
        raise bad_request

    return result


@router.patch("/")
async def patch_user(mode: int, val: str, current_user=Depends(get_current_user)) -> None:
    """
    Patch the current user.

    This endpoint is used to patch the current user's data.

    :param mode: The mode of patching, 1 for username, 2 for api key.
    :param val: The value to patch.
    :param current_user: The user from the token of current request.
    :return: HTTP code for successful / failed to patch the user.
    """

    if mode == 1 and await check_user_name(val):
        raise username_repeated

    if not await patch_user_data(mode, val, current_user.user_id):
        raise bad_request


@router.patch("/password")
async def update_password(old_password: str, password: str, confirm_password: str,
                          current_user=Depends(get_current_user)) -> None:
    """
    Update the current password.

    This endpoint is used to update the current user's password.

    :param old_password: The old password.
    :param password: The new password.
    :param confirm_password: Confirm the new password.
    :param current_user: The user from the token of current request.
    :return: HTTP code for successful / failed to patch the user password.
    """

    if not verify_password(old_password, current_user.password):
        raise password_error

    if password != confirm_password:
        raise confirm_password_error

    if not await update_user_password(password, current_user.user_id):
        raise bad_request
