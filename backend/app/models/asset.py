import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import enum


class AssetType(str, enum.Enum):
    pipeline = "pipeline"
    vessel = "vessel"
    tank = "tank"
    valve = "valve"
    pump = "pump"
    compressor = "compressor"
    heat_exchanger = "heat_exchanger"
    column = "column"


class AssetStatus(str, enum.Enum):
    active = "active"
    decommissioned = "decommissioned"
    inspection_due = "inspection_due"


class RiskLevel(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class Asset(Base):
    __tablename__ = "assets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    asset_name = Column(String(255), nullable=False)
    asset_type = Column(SAEnum(AssetType), nullable=False)
    material = Column(String(255), nullable=False)
    install_date = Column(DateTime(timezone=True), nullable=False)
    design_life_years = Column(Float, nullable=False)
    corrosion_allowance_mm = Column(Float, nullable=False)
    current_thickness_mm = Column(Float, nullable=False)
    min_required_thickness_mm = Column(Float, nullable=False)
    operating_pressure = Column(Float, nullable=False)
    operating_temperature = Column(Float, nullable=False)
    risk_level = Column(SAEnum(RiskLevel), default=RiskLevel.low)
    status = Column(SAEnum(AssetStatus), default=AssetStatus.active)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
