from models import User
from schemas import CompleteUser
from database import db


async def check_user(user_id: int) -> CompleteUser:
    stmt = User.select().where(User.c.user_id == user_id)
    return await db.fetch_one(stmt)


async def check_user_name(name: str) -> CompleteUser:
    stmt = User.select().where(User.c.name == name)
    return await db.fetch_one(stmt)
