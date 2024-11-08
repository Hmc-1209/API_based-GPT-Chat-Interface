from fastapi import APIRouter, Depends
from typing import Annotated
from schemas import BaseUser, CompleteUser
from exception import bad_request
from Repository.UserCRUD import create_user
from Authentication.JWTtoken import get_current_user
from Authentication.hashing import hashing_password

router = APIRouter(prefix="/user", tags=["User"])


@router.post("/")
async def create_new_user(user: BaseUser) -> None:

    if not await create_user(user):
        raise bad_request
