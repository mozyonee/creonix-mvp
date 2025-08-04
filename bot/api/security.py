import os

from dotenv import load_dotenv, find_dotenv
from fastapi import HTTPException, status, Security, Request
from fastapi.security.api_key import APIKeyHeader

load_dotenv(find_dotenv())

MASTER_TOKEN = os.getenv("MASTER_API_TOKEN")

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

api_key_header = APIKeyHeader(name="Authorization", auto_error=False)

async def verify_auth(request: Request, authorization: str = Security(api_key_header)) -> bool:
    # Skip authentication for OPTIONS requests (CORS preflight)
    if request.method == "OPTIONS":
        return True

    if not authorization:
        raise credentials_exception

    if 'Bearer ' in authorization:
        access_token = authorization.split(' ')[1]
    else:
        access_token = authorization

    if access_token != MASTER_TOKEN:
        raise credentials_exception

    return True