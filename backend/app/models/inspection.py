import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum as SAEnum, Text
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import enum


class InspectionType(str, enum.Enum):
    visual = "visual"
    ultrasonic = "ultrasonic"
    radiographic = "radiographic"
    magnetic = "magnetic"
    eddy_current = "eddy_current"


class InspectionStatus(str, enum.Enum):
    scheduled = "scheduled"
    completed = "completed"
    overdue = "overdue"


class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("assets.id"), nullable=False, index=True)
    inspection_date = Column(DateTime(timezone=True), nullable=False)
    inspection_type = Column(SAEnum(InspectionType), nullable=False)
    inspector = Column(String(255), nullable=False)
    findings = Column(Text, nullable=True)
    corrosion_rate_mm_yr = Column(Float, nullable=True)
    remaining_life_years = Column(Float, nullable=True)
    next_inspection_due = Column(DateTime(timezone=True), nullable=True)
    status = Column(SAEnum(InspectionStatus), default=InspectionStatus.scheduled)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
