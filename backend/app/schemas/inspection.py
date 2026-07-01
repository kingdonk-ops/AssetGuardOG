from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class InspectionCreate(BaseModel):
    asset_id: str
    inspection_date: datetime
    inspection_type: str
    inspector: str
    findings: Optional[str] = None
    corrosion_rate_mm_yr: Optional[float] = None
    remaining_life_years: Optional[float] = None
    next_inspection_due: Optional[datetime] = None


class InspectionUpdate(BaseModel):
    findings: Optional[str] = None
    corrosion_rate_mm_yr: Optional[float] = None
    remaining_life_years: Optional[float] = None
    next_inspection_due: Optional[datetime] = None
    status: Optional[str] = None


class InspectionResponse(BaseModel):
    id: str
    user_id: str
    asset_id: str
    inspection_date: datetime
    inspection_type: str
    inspector: str
    findings: Optional[str]
    corrosion_rate_mm_yr: Optional[float]
    remaining_life_years: Optional[float]
    next_inspection_due: Optional[datetime]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
