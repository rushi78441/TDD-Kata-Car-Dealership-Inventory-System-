from fastapi import APIRouter, Query, Depends, status,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.vehicle import Vehicle
from app.api.dependencies import get_db
from app.api.dependencies import get_current_user

inventory_router = APIRouter()


@inventory_router.post("/{vehicle_id}/purchase")
async def purchase_vehicle(
    vehicle_id: int,
    db: AsyncSession = Depends(get_db),
    _current_user = Depends(get_current_user)
):
    """
    Purchase a vehicle (decreases available quantity by 1). Protected for logged-in users.
    """
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.scalars().first()

    if not vehicle:
        raise HTTPException(status_code = 404, detail="Vehicle not found")

    if vehicle.quantity <= 0:
        raise HTTPException(status_code = 400, detail="Vehicle is out of stock")

    vehicle.quantity = vehicle.quantity -  1
    await db.commit()
    await db.refresh(vehicle)

    return {
        "message": "Purchase successful",
        "vehicle_id": vehicle.id,
        "quantity": vehicle.quantity
    }