from pydantic import BaseModel, Field
from datetime import datetime


class BaseUser(BaseModel):
    name: str | None = None


class CreateUser(BaseUser):
    password: str | None = None

    class Config:
        from_attributes = True
        

class CompleteUser(BaseUser):
    user_id: int
    api_key: str | None = None

    class Config:
        from_attributes = True


class BaseChatRecord(BaseModel):
    chat_name: str | None = None
    created_at: datetime | None = Field(default_factory=datetime.utcnow)
    updated_at: datetime | None = Field(default_factory=datetime.utcnow)


class CreateChatRecord(BaseChatRecord):
    user_id: int


class CompleteChatRecord(BaseChatRecord):
    record_id: int
    user_id: int


class ReadChatRecord(BaseChatRecord):
    record_id: int
