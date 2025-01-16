from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated

from Repository.TokenCRUD import generate_access_token, validate_access_token
from exception import no_such_user

router = APIRouter(prefix="/token", tags=["Token"])


@router.post("/")
async def create_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], response: Response):
    """
    The endpoint of generating new access_token.

    Sets the access_token as an HttpOnly cookie.
    """

    data = {
        "name": form_data.username,
        "password": form_data.password
    }

    token = await generate_access_token(data)

    if not token:
        raise no_such_user

    response.set_cookie(
        key="access_token",
        value=f"{token}",
        httponly=True,
        secure=True,
        samesite="None"
    )

    return None


@router.post("/validate_access_token")
async def validate_the_access_token() -> None:
    """The endpoint of validate the access_token's availability"""

    return await validate_access_token()
