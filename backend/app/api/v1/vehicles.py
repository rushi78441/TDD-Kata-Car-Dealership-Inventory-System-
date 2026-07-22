from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.schemas.vehicle import VehicleCreate, VehicleOut, VehicleUpdate
from app.models.vehicle import Vehicle
from app.api.dependencies import get_db, require_admin
from typing import Optional

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


@vehicle_router.get("", response_model = list[VehicleOut] , status_code = status.HTTP_200_OK)
async def get_all_vehicles(
    skip : int = 0,
    limit : int = 50,
    db : AsyncSession = Depends(get_db)
):
    """
    View a list of all available vehicles (with pagination).
    """
    response = await db.execute(select(Vehicle).offset(skip).limit(limit))
    return response.scalars()


@vehicle_router.get("/search", response_model=list[VehicleOut])
async def search_vehicles(
    make: Optional[str] = None,
    model: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Search for vehicles by make, model, catgory, or price range
    """
    query = select(Vehicle)

    if make:
        query = query.where(Vehicle.make.ilike(f"%{make}%"))
    if model:
        query = query.where(Vehicle.model.ilike(f"%{model}%"))
    if category:
        query = query.where(Vehicle.category.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.where(Vehicle.price >= min_price)
    if max_price is not None:
        query = query.where(Vehicle.price <= max_price)
        
    response = await db.execute(query) 
    return response.scalars()


from fastapi import HTTPException


@vehicle_router.put("/{vehicle_id}", response_model=VehicleOut)
async def update_vehicle(
    vehicle_id: int,
    vehicle_in: VehicleUpdate,
    db: AsyncSession = Depends(get_db),
    _admin = Depends(require_admin)
):
    """
    Update details of an existing vehicle (Admin only).
    """
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.scalars().first()

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    # Update only provided fields
    update_data = vehicle_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(vehicle, field, value)

    await db.commit()
    await db.refresh(vehicle)
    return vehicle


@vehicle_router.delete("/{vehicle_id}")
async def delete_vehicle(
    vehicle_id: int,
    db: AsyncSession = Depends(get_db),
    _admin = Depends(require_admin)
):
    """
    Delete a vehicle from inventory (Admin only).
    """
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.scalars().first()
    
    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    await db.delete(vehicle)
    await db.commit()
    return {"message": "Vehicle deleted successfully"}
    
    