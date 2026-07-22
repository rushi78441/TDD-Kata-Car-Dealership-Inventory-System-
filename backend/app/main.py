from fastapi import FastAPI
from fastapi.middleware import cors
from app.api.v1.auth import auth_router

app = FastAPI(title = "Car Dealership Inventory System")

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])

@app.get("/")
async def root():
    return {"message": "API is running"}