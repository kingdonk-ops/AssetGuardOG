from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class AssetCreate(BaseModel):
    asset_name: str
    asset_type: str
    material: str
    install_date: datetime
    design_life_years: float
    corrosion_allowance_mm: float
    current_thickness_mm: float
    min_required_thickness_mm: float
    operating_pressure: float
    operating_temperature: float


class AssetUpdate(BaseModel):
    asset_name: Optional[str] = None
    asset_type: Optional[str] = None
    material: Optional[str] = None
    current_thickness_mm: Optional[float] = None
    min_required_thickness_mm: Optional[float] = None
    operating_pressure: Optional[float] = None
    operating_temperature: Optional[float] = None
    status: Optional[str] = None


class AssetResponse(BaseModel):
    id: str
    user_id: str
    asset_name: str
    asset_type: str
    material: str
    install_date: datetime
    design_life_years: float
    corrosion_allowance_mm: float
    current_thickness_mm: float
    min_required_thickness_mm: float
    operating_pressure: float
    operating_temperature: float
    risk_level: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class AssetStats(BaseModel):
    total_assets: int
    critical_risk: int
    inspection_due: int
    avg_remaining_life: float
