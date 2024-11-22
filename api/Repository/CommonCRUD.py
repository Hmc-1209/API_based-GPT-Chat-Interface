from models import User
from schemas import CompleteUser
from database import db
import os
import aiofiles
import json
from cryptography.fernet import Fernet


async def check_user(user_id: int) -> CompleteUser:
    stmt = User.select().where(User.c.user_id == user_id)
    return await db.fetch_one(stmt)


async def check_user_name(name: str) -> CompleteUser:
    stmt = User.select().where(User.c.name == name)
    return await db.fetch_one(stmt)


async def decrypt_content(chat_record_path, key_path):
    try:
        async with aiofiles.open(key_path, "rb") as key_file:
            encryption_key = await key_file.read()

        fernet = Fernet(encryption_key)
        async with aiofiles.open(chat_record_path, "rb") as chat_file:
            encrypted_content = await chat_file.read()
        print(encrypted_content)
        decrypted_content = fernet.decrypt(encrypted_content).decode()
        print(decrypted_content)
        return json.loads(decrypted_content)

    except Exception as e:
        return False
