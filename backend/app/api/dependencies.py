from typing import AsyncGenerator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.core.config import settings
from app.models.user import User

# Configures Swagger UI to show a Login button for bearer tokens
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Yields an async database session for request handling.
    """
    async with AsyncSessionLocal() as session:
        yield session
        

async def get_current_user(
    token : str = Depends(oauth2_scheme),
    db : AsyncSession = Depends(get_db)
) -> User: 
    """
    Decode Jwt Access token and returns the current authenticated user
    """

    try:
        credential_expresssion = HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Could not validate credentials",
            headers = {"WWW-Authenticate" : "Bearer"}
        )
        
        
        payload = jwt.decode(token, key = settings.SECRET_KEY, algorithms = [settings.ALGORITHM])
        email: str = payload.get("sub")
        
        # if email not found
        if not email:
            raise credential_expresssion
    except jwt.PyJWTError:
        raise credential_expresssion
        
    
    ## Query User from Database
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar().first()
    
    if user is None:
        raise credential_expresssion
    
    
async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Enforce Role -based Access Control (RBAC) -- Admin only
    """
    
    if current_user.role != "admin":
        raise HTTPException(
            status_code = status.HTTP_403_FORBIDDEN,
            detail = "Admin access required" 
        )
    return current_user
    
    