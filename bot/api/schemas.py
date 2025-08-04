from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class SendMessageRequest(BaseModel):
    user_id: int
    message: str
