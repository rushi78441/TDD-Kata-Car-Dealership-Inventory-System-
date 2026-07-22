from fastapi import FastAPI
from fastapi.middleware import cors
from app.api.v1.auth import auth_router
from app.api.v1.vehicles import vehicle_router
from app.api.v1.inventory import inventory_router
from app.core.rate_limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

app = FastAPI(title = "Car Dealership Inventory System")

# Rate Limiter Setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# App Routers inclusion
app.include_router(auth_router, prefix = "/api/auth", tags = ["auth"])
app.include_router(vehicle_router, prefix = "/api/vehicles", tags = ["Vehicles"])
app.include_router(inventory_router, prefix = "/api/vehicles", tags = ["Inventory"])


@app.get("/")
async def root():
    return {"message": "API is running"}