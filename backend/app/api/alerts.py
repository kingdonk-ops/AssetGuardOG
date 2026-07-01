from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.alert import AlertResponse, AlertStats
from app.services.alert_service import get_alerts, update_alert_status, get_alert_stats

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("/stats", response_model=AlertStats)
async def stats_endpoint(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_alert_stats(db, str(user.id))


@router.get("", response_model=list[AlertResponse])
async def list_endpoint(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_alerts(db, str(user.id))


@router.patch("/{alert_id}/status", response_model=AlertResponse)
async def update_status_endpoint(
    alert_id: str,
    status: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    alert = await update_alert_status(db, alert_id, str(user.id), status)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert
