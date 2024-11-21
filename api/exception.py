from fastapi import HTTPException, status

no_such_user = HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                             detail="Username or password incorrect.")

token_expired = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                              detail="Could not validate credentials.",
                              headers={"WWW-Authenticate": "Bearer"})

username_repeated = HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                  detail="The username has been registered.")

bad_request = HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Request failed.")

password_error = HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                               detail="Password incorrect.")

confirm_password_error = HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                       detail="Confirm password inconsistent.")
