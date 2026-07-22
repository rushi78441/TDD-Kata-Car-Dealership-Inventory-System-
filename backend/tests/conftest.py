import pytest
import pytest_asyncio
from httpx import ASGITransport,AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import NullPool

from app.db.base import Base
from app.core.config import settings
from app.main import app
from app.api.dependencies import get_db

## Engine Using Dedicated Databse URL
test_engine = create_async_engine(
    settings.TEST_DATABASE_URL,
    echo = False,
    poolclass = NullPool,
)
TestingSessionLocal = async_sessionmaker(
    bind = test_engine,
    class_ = AsyncSession,
    expire_on_commit = False 
)

@pytest_asyncio.fixture(scope = "function")
async def db_session():
    """
    Fixture to create a fresponseh set of tables per test and clean up afterwards.
    """
    
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    async with TestingSessionLocal() as session:
        yield session

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        

@pytest_asyncio.fixture(scope = "function")
async def client(db_session):
    """
    Fixture for AsyncClient with DB session override.
    """
    async def override_get_db():
        yield db_session
        
    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(transport =  ASGITransport(app = app) , base_url = "http://test") as ac:
        yield ac
        
    app.dependency_overrides.clear()


