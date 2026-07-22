from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.schemas.auth import UserCreate, UserLogin, UserOut, Tokenresponse
from app.models.user import User
from app.core.security import get_hash_password, verify_password, create_access_token
from app.api.dependencies import get_db


auth_router = APIRouter()

# Auth Registration Route
@auth_router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Route Successfully Register User if not duplicated
    """
    # Check if email is already registered
    responseult = await db.execute(select(User).where(User.email == user.email))
    duplicate_user = responseult.scalar_one_or_none()
    
    if duplicate_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password using security module
    hashed_password = get_hash_password(user.password)
    
    user = User(
        email = user.email,
        hashed_password = hashed_password,
        role = user.role
    )
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@auth_router.post("/login" , response_model = Tokenresponse)
async def login(payload : UserLogin, db: AsyncSession = Depends(get_db)):
    ## check the user exists in db
    response = await db.execute(select(User).where(User.email == payload.email))
    user = response.scalar_one_or_none()
    
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Incorrect email or password"
        )
        
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "Bearer"}
        