from sqlalchemy import String, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[int] = mapped_column(Integer, primary_key = True, index = True)
    brand: Mapped[str] = mapped_column(String, index = True, nullable = False)
    model: Mapped[str] = mapped_column(String, index = True, nullable = False)
    category: Mapped[str] = mapped_column(String, index = True, nullable = False)
    price: Mapped[float] = mapped_column(Float, index = True, nullable = False)
    quantity: Mapped[int] = mapped_column(Integer, nullable = False, default = 0)