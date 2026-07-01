from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class AlertResponse(BaseModel):
    id: str
    user_id: str
    asset_id: Optional[str]
    title: str
    alert_type: str
    severity: str
    status: str
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class AlertStats(BaseModel):
    total_active: int
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
