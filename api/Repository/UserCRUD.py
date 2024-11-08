from fastapi import HTTPException, status
from database import db

from models import User
# from schemas import CreateUser, UpdateUser, DeleteUser
from schemas import BaseUser
from Repository.CommonCRUD import *
from Authentication import hashing


async def create_user(user: BaseUser):
    """Check the username and create the user"""

    if await check_user_name(user.name):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The username has been registered.",
        )

    stmt = User.insert().values(
        name=user.name,
        password=hashing.hashing_password(user.password),
    )

    # Check effected row
    result = await db.execute(stmt)
    if result == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create user.",
        )

    return {"detail": "Done: Successfully created the user."}