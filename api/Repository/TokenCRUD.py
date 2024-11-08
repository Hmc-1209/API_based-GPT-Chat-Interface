from Authentication import JWTtoken, hashing
from models import User
from database import db


async def generate_access_token(data: dict) -> str | bool:
    stmt = User.select().where(User.c.name == data["name"])
    user = await db.fetch_one(stmt)

    if user:
        if hashing.verify_password(data["password"], user.password):
            data["id"] = user.user_id
            return JWTtoken.generate_access_token(data)

    return False


async def validate_access_token(token: str):
    await JWTtoken.get_current_user(token)
