from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class VehicleBase(BaseModel):
    make: str
    model: str
    category: str
    price: float = Field(..., gt=0, description="Price must be greater than 0")
    quantity: int = Field(..., ge=0, description="Quantity cannot be negative")


class VehicleCreate(VehicleBase):
    """
    Payload for POST /api/vehicles
    """
    pass


class VehicleUpdate(BaseModel):
    """
    Payload for PUT /api/vehicles/:id (All fields optional for updates)
    """
    make: Optional[str] = None
    model: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    quantity: Optional[int] = Field(default=None, ge=0)


class VehicleOut(VehicleBase):
    """
    Response DTO for vehicle operations
    """
    id: int

    model_config = ConfigDict(from_attributes=True) 