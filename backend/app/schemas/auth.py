from pydantic import BaseModel,EmailStr,Field
import uuid

## Auth Schemas for User Validation

class UserCreate(BaseModel):
    """
    User Registration Request Payload Validation Schema
    """
    email : EmailStr
    password : str = Field(max_length = 30)
    role : str
    
class UserLogin(BaseModel):
    """
    User Login Request payload Validation schema
    """
    email : EmailStr
    password : str = Field(max_length = 30)
    
class UserOut(BaseModel):
    """
    User Logout Validation Schema
    """
    id : uuid.UUID = Field(
        validation_alias="user_id",
        serialization_alias="id",
    )
    email : EmailStr
    role : str

    model_config = {"from_attributes": True}
    
class TokenResponse(BaseModel):
    """
    Token Response Validation schema
    """
    access_token : str
    token_type : str