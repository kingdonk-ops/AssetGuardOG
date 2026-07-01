from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.models.inspection import Inspection, InspectionStatus
from app.models.asset import Asset, AssetStatus
from app.schemas.inspection import InspectionCreate, InspectionUpdate
from app.agents.rbi_engine import calculate_corrosion_rate, calculate_remaining_life, assess_risk_level
from datetime import datetime, timezone, timedelta


async def create_inspection(
    db: AsyncSession, user_id: str, data: InspectionCreate
) -> Inspection:
    insp = Inspection(
        user_id=user_id,
        asset_id=data.asset_id,
        inspection_date=data.inspection_date,
        inspection_type=data.inspection_type,
        inspector=data.inspector,
        findings=data.findings,
        corrosion_rate_mm_yr=data.corrosion_rate_mm_yr,
        remaining_life_years=data.remaining_life_years,
        next_inspection_due=data.next_inspection_due,
        status=InspectionStatus.completed,
    )
    db.add(insp)
    await db.commit()
    await db.refresh(insp)
    await _update_asset_from_inspection(db, data.asset_id, insp)
    return insp


async def _update_asset_from_inspection(db: AsyncSession, asset_id: str, insp: Inspection):
    result = await db.execute(select(Asset).where(Asset.id == asset_id))
    asset = result.scalar_one_or_none()
    if not asset or insp.corrosion_rate_mm_yr is None:
        return
    years_in_service = (datetime.now(timezone.utc) - asset.install_date).days / 365.25
    cr = insp.corrosion_rate_mm_yr
    rl = calculate_remaining_life(asset.current_thickness_mm, asset.min_required_thickness_mm, cr)
    risk = assess_risk_level(cr, rl, asset.operating_pressure)
    asset.risk_level = risk["category"]
    if rl < 2.0:
        asset.status = AssetStatus.inspection_due
    if rl >= 0:
        insp.remaining_life_years = round(rl, 2)
        insp.next_inspection_due = datetime.now(timezone.utc) + timedelta(days=int(rl * 365.25 * 0.5))
    await db.commit()


async def get_inspections(
    db: AsyncSession, user_id: str, asset_id: Optional[str] = None
) -> List[Inspection]:
    query = select(Inspection).where(Inspection.user_id == user_id)
    if asset_id:
        query = query.where(Inspection.asset_id == asset_id)
    query = query.order_by(Inspection.inspection_date.desc())
    result = await db.execute(query)
    return result.scalars().all()


async def get_inspection(db: AsyncSession, inspection_id: str, user_id: str) -> Optional[Inspection]:
    result = await db.execute(
        select(Inspection).where(Inspection.id == inspection_id, Inspection.user_id == user_id)
    )
    return result.scalar_one_or_none()


async def update_inspection(
    db: AsyncSession, inspection_id: str, user_id: str, data: InspectionUpdate
) -> Optional[Inspection]:
    insp = await get_inspection(db, inspection_id, user_id)
    if not insp:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(insp, key, value)
    await db.commit()
    await db.refresh(insp)
    return insp
