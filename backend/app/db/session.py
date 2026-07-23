import os
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings

# 1. Clean up DATABASE_URL dynamically if pgbouncer parameter sneaks in
db_url = settings.DATABASE_URL
if "?pgbouncer=true" in db_url:
    db_url = db_url.replace("?pgbouncer=true", "")
if "&pgbouncer=true" in db_url:
    db_url = db_url.replace("&pgbouncer=true", "")

# 2. Add connect_args to safely support PgBouncer transaction pooling
engine = create_async_engine(
    db_url,
    echo=False,
    pool_pre_ping=True,      # Checks if connection is alive before using it
    pool_size=5,             # Limit connections per lambda instance
    max_overflow=10,
    connect_args={
        "prepared_statement_name_func": lambda: "",
        "statement_cache_size": 0,
        "prepared_statement_cache_size": 0,
    }
)


AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)