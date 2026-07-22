# backend/interfaces.py
from typing import Protocol, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.schemas.auth import UserCreate


class IUserRepository(Protocol):
    """
    Abstract interface for User repository operations.
    """
    
    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        ...

    async def create(self, db: AsyncSession, user_in: UserCreate) -> User:
        ...


class IAuthService(Protocol):
    """
    Abstract interface for Authentication service logic.
    """
    
    async def register_user(self, db: AsyncSession, user_in: UserCreate) -> User:
        ...

    async def authenticate_user(self, db: AsyncSession, email: str, password: str) -> Optional[User]:
        ...