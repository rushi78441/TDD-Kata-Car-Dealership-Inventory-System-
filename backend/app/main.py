from fastapi import FastAPI
from fastapi.middleware import cors

app = FastAPI(title = "Car Dealership Inventory System")

@app.get("/")
async def root():
    return {"message": "API is running"}