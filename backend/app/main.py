import sys
import os
# Add the 'backend' directory to the Python path so 'app' module can be resolved
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.auth import auth_router
from app.api.v1.vehicles import vehicle_router
from app.api.v1.inventory import inventory_router
from app.core.rate_limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.db.session import engine
from app.db.base import Base  # Imports all your models (User, Vehicle, etc.)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create missing tables on app startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

# FastAPI Application
app = FastAPI(title = "Car Dealership Inventory System", lifespan = lifespan)

# Rate Limiter Setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# App Routers inclusion
app.include_router(auth_router, prefix = "/api/auth", tags = ["auth"])
app.include_router(vehicle_router, prefix = "/api/vehicles", tags = ["Vehicles"])
app.include_router(inventory_router, prefix = "/api/vehicles", tags = ["Inventory"])

# middlewares
app.add_middleware(SlowAPIMiddleware)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "API is running"}