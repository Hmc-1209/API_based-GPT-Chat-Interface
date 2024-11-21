from fastapi import HTTPException, status
from database import db

from models import User
from schemas import BaseUser
from Repository.CommonCRUD import *
from Authentication import hashing
from exception import username_repeated
from database import execute_stmt_in_tran


async def create_user(user: BaseUser):
    """
    Creates new user.

    Check the username and create the user.

    :param user: The username to create.
    :return: HTTP code for successful / failed creation of the new user.
    """

    stmt = User.insert().values(
        name=user.name,
        password=hashing.hashing_password(user.password),
    )

    return await execute_stmt_in_tran(stmt)


async def patch_user_data(mode: int, val: str, user_id: int):
    """
    Patch user data.

    Patch the user's data with given value.

    :param mode: The mode of patching, 1 for username, 2 for api key.
    :param val: The value to patch.
    :param user_id: The original user id.
    :return: HTTP code for successful / failed to patch the user.
    """

    stmt = User.update().where(User.c.user_id == user_id).values(name=val) if mode == 1\
        else User.update().where(User.c.user_id == user_id).values(api_key=val)

    return await execute_stmt_in_tran([stmt])


async def update_user_password(new_password: str, user_id: int):
    """
    Update user password.

    This endpoint is used to update the user's password.

    :param new_password: The new password to change to.
    :param user_id: The current user id.
    :return: HTTP code for successful / failed to patch the user.
    """

    stmt = User.update().where(User.c.user_id == user_id).values(password=hashing.hashing_password(new_password))
    return await execute_stmt_in_tran([stmt])
