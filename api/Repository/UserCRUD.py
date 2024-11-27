from fastapi import HTTPException, status
from database import db

from models import User
from schemas import BaseUser
from Repository.CommonCRUD import *
from Authentication import hashing
from exception import username_repeated
from database import execute_stmt_in_tran
from config import data_storage_path


async def create_user(user: BaseUser):
    """
    Creates new user.

    Check the username and create the user.

    :param user: The username to create.
    :return: HTTP code for successful / failed creation of the new user.
    """

    api_key_folder = os.path.join(data_storage_path, "API-Key")
    os.makedirs(api_key_folder, exist_ok=True)
    encryption_key = Fernet.generate_key()

    stmt = User.insert().values(
        name=user.name,
        password=hashing.hashing_password(user.password),
        api_key_encryption_key=encryption_key,
    )

    return await execute_stmt_in_tran([stmt])


async def get_current_user_api_key(user_id: int):
    """
    Get the user's API key.

    This endpoint is used for getting the user's API key by given id.

    :param user_id: The user's id.
    :return: The user's API key.
    """

    stmt = User.select().where(User.c.user_id == user_id)
    user = await db.fetch_one(stmt)

    if not user:
        return False

    fernet = Fernet(user.api_key_encryption_key)
    api_key_file_path = os.path.join(data_storage_path, "API-Key", f"api-key-id-{user_id}.bson")
    if not os.path.exists(api_key_file_path):
        return "None"

    with open(api_key_file_path, "rb") as bson_file:
        api_key = bson_file.read()
        api_key = fernet.decrypt(api_key)
    return api_key.decode()


async def patch_user_data(mode: int, val: str, user_id: int):
    """
    Patch user data.

    Patch the user's data with given value.

    :param mode: The mode of patching, 1 for username, 2 for api key.
    :param val: The value to patch.
    :param user_id: The original user id.
    :return: HTTP code for successful / failed to patch the user.
    """

    if mode == 1:
        stmt = User.update().where(User.c.user_id == user_id).values(name=val)
        return await execute_stmt_in_tran([stmt])
    else:
        try:
            stmt = User.select().where(User.c.user_id == user_id)
            user = await db.fetch_one(stmt)

            if not user:
                return False

            fernet = Fernet(user.api_key_encryption_key)
            data = fernet.encrypt(val.encode())
            api_key_file_path = os.path.join(data_storage_path, "API-Key", f"api-key-id-{user_id}.bson")

            async with aiofiles.open(api_key_file_path, "wb") as bson_file:
                await bson_file.write(data)

            return True

        except Exception as e:
            print(f"Exception while patching user data: {e}")
            return False


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
