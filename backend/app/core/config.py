from pydantic_settings import BaseSettings,SettingsConfigDict
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Car Dealership Inventory System"
    DATABASE_URL: str
    TEST_DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    model_config = SettingsConfigDict(env_file = ".env", extra = "ignore")
    

settings = Settings()