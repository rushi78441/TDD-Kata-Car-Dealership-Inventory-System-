from datetime import datetime, timedelta, timezone
import bcrypt
import jwt
from app.core.config import settings


def get_hash_password(password : str) -> str:
    """
    Function that generates Hashed Password
    """
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password= password.encode('utf-8'), salt=salt)
    return hashed_password.decode('utf-8')

def verify_password(plain_password : str, hashed_password : str) -> bool:
    """
    Function that verify incoming plain password that matches with stored hash password
    """
    return bcrypt.checkpw(plain_password.encode('utf-8') , hashed_password.encode('utf-8'))
        

def create_access_token(data : dict) -> str:
    """
    Function that generate stateless jwt access token
    """
    
    to_encode = data.copy()
    
    ## Calculate expire timestanp
    expire = datetime.now(timezone.utc) + timedelta(minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    ## # 'sub' (subject) represponseents the unique identifier, 'exp' represponseents the expiration claim
    to_encode.update({"exp" : expire})
    
    encoded_jwt = jwt.encode(to_encode, key = settings.SECRET_KEY, algorithm = settings.ALGORITHM)
    return encoded_jwt