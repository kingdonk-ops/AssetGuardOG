from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.models.alert import Alert, AlertStatus, AlertSeverity


async def create_alert(
    db: AsyncSession,
    user_id: str,
    asset_id: Optional[str],
    title: str,
    alert_type: str,
    severity: str,
    description: Optional[str] = None,
) -> Alert:
    alert = Alert(
        user_id=user_id,
        asset_id=asset_id,
        title=title,
        alert_type=alert_type,
        severity=severity,
        description=description,
    )
    db.add(alert)
    await db.commit()
    await db.refresh(alert)
    return alert


async def get_alerts(db: AsyncSession, user_id: str) -> List[Alert]:
    result = await db.execute(
        select(Alert)
        .where(Alert.user_id == user_id)
        .order_by(Alert.created_at.desc())
    )
    return result.scalars().all()


async def update_alert_status(
    db: AsyncSession, alert_id: str, user_id: str, status: str
) -> Optional[Alert]:
    result = await db.execute(
        select(Alert).where(Alert.id == alert_id, Alert.user_id == user_id)
    )
    alert = result.scalar_one_or_none()
    if not alert:
        return None
    alert.status = status
    await db.commit()
    await db.refresh(alert)
    return alert


async def get_alert_stats(db: AsyncSession, user_id: str) -> dict:
    result = await db.execute(
        select(Alert).where(Alert.user_id == user_id, Alert.status == AlertStatus.active)
    )
    alerts = result.scalars().all()
    total = len(alerts)
    critical = sum(1 for a in alerts if a.severity == AlertSeverity.critical)
    high = sum(1 for a in alerts if a.severity == AlertSeverity.high)
    medium = sum(1 for a in alerts if a.severity == AlertSeverity.medium)
    low = sum(1 for a in alerts if a.severity == AlertSeverity.low)
    return {
        "total_active": total,
        "critical_count": critical,
        "high_count": high,
        "medium_count": medium,
        "low_count": low,
    }
