from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.vehicle import VehicleCreate, VehicleOut
from app.models.vehicle import Vehicle
from app.api.dependencies import get_db, require_admin

vehicle_router = APIRouter()


@vehicle_router.post("", response_model=VehicleOut, status_code=status.HTTP_201_CREATED)
async def create_vehicle(
    vehicle_in: VehicleCreate,
    db: AsyncSession = Depends(get_db),
    _admin = Depends(require_admin)
):
    """
    Adds a new vehicle to the dealership inventory (Admin only).
    """
    vehicle = Vehicle(**vehicle_in.model_dump())
    db.add(vehicle)
    await db.commit()
    await db.refresh(vehicle)
    return vehicle

