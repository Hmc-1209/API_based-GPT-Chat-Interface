from pydantic import BaseModel, Field
from datetime import datetime


class BaseUser(BaseModel):
    name: str | None = None
    password: str | None = None


class CompleteUser(BaseUser):
    user_id: int
    api_key: str | None = None

    class Config:
        from_attributes = True


class BaseChatRecord(BaseModel):
    chat_name: str | None = None
    created_at: datetime | None = Field(default_factory=datetime.utcnow)
    updated_at: datetime | None = Field(default_factory=datetime.utcnow)


class CompleteChatRecord(BaseChatRecord):
    chat_id: int
    user_id: int
    chat_encryption_key_path: str
    record_path: str


class ReadChatRecord(BaseChatRecord):
    chat_id: int
