import sqlalchemy
from sqlalchemy import Column, ForeignKey
from database import metadata

User = sqlalchemy.Table(
    "User",
    metadata,
    Column("user_id", sqlalchemy.INTEGER, primary_key=True, index=True),
    Column("name", sqlalchemy.VARCHAR(50), nullable=False, unique=True),
    Column("password", sqlalchemy.CHAR(64), nullable=False),
    Column("api_key", sqlalchemy.CHAR(255)),
)

ChatRecord = sqlalchemy.Table(
    "ChatRecord",
    metadata,
    Column("record_id", sqlalchemy.INTEGER, primary_key=True, index=True),
    Column("user_id", sqlalchemy.INTEGER, nullable=False),
    Column("chat_name", sqlalchemy.VARCHAR(50), nullable=False),
    Column("created_at", sqlalchemy.TIMESTAMP, nullable=False),
    Column("updated_at", sqlalchemy.TIMESTAMP, nullable=False),
)
