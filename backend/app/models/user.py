from sqlalchemy import String
from sqlalchemy.types import UUID
import uuid
from sqlalchemy.orm import Mapped,mapped_column
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    
    user_id : Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid = True),
        primary_key = True,
        default = uuid.uuid4,
        index = True,
    )
    email : Mapped[str] = mapped_column(String, unique = True, index = True, nullable = False)
    hashed_password : Mapped[str] = mapped_column(String, nullable = False)
    role : Mapped[str] = mapped_column(String, nullable = False)
    
