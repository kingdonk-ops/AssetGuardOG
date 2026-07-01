from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.models.asset import Asset, RiskLevel, AssetStatus
from app.schemas.asset import AssetCreate, AssetUpdate
from app.agents.rbi_engine import assess_risk_level, calculate_remaining_life
from datetime import datetime, timezone


async def create_asset(db: AsyncSession, user_id: str, data: AssetCreate) -> Asset:
    years_in_service = (datetime.now(timezone.utc) - data.install_date).days / 365.25
    corrosion_rate = 0.0
    if years_in_service > 0:
        corrosion_rate = max(
            0,
            (data.corrosion_allowance_mm - data.current_thickness_mm)
            / years_in_service,
        )
    remaining_life = calculate_remaining_life(
        data.current_thickness_mm, data.min_required_thickness_mm, corrosion_rate
    )
    risk = assess_risk_level(corrosion_rate, remaining_life, data.operating_pressure)
    asset = Asset(
        user_id=user_id,
        asset_name=data.asset_name,
        asset_type=data.asset_type,
        material=data.material,
        install_date=data.install_date,
        design_life_years=data.design_life_years,
        corrosion_allowance_mm=data.corrosion_allowance_mm,
        current_thickness_mm=data.current_thickness_mm,
        min_required_thickness_mm=data.min_required_thickness_mm,
        operating_pressure=data.operating_pressure,
        operating_temperature=data.operating_temperature,
        risk_level=risk["category"],
    )
    db.add(asset)
    await db.commit()
    await db.refresh(asset)
    return asset


async def get_assets(db: AsyncSession, user_id: str) -> List[Asset]:
    result = await db.execute(
        select(Asset).where(Asset.user_id == user_id).order_by(Asset.created_at.desc())
    )
    return result.scalars().all()


async def get_asset(db: AsyncSession, asset_id: str, user_id: str) -> Optional[Asset]:
    result = await db.execute(
        select(Asset).where(Asset.id == asset_id, Asset.user_id == user_id)
    )
    return result.scalar_one_or_none()


async def update_asset(
    db: AsyncSession, asset_id: str, user_id: str, data: AssetUpdate
) -> Optional[Asset]:
    asset = await get_asset(db, asset_id, user_id)
    if not asset:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(asset, key, value)
    if "current_thickness_mm" in update_data or "min_required_thickness_mm" in update_data:
        corrosion_rate = 0.0
        years = (datetime.now(timezone.utc) - asset.install_date).days / 365.25
        if years > 0:
            corrosion_rate = max(
                0, (asset.corrosion_allowance_mm - asset.current_thickness_mm) / years
            )
        remaining_life = calculate_remaining_life(
            asset.current_thickness_mm, asset.min_required_thickness_mm, corrosion_rate
        )
        risk = assess_risk_level(corrosion_rate, remaining_life, asset.operating_pressure)
        asset.risk_level = risk["category"]
    await db.commit()
    await db.refresh(asset)
    return asset


async def delete_asset(db: AsyncSession, asset_id: str, user_id: str) -> bool:
    asset = await get_asset(db, asset_id, user_id)
    if not asset:
        return False
    await db.delete(asset)
    await db.commit()
    return True


async def get_asset_stats(db: AsyncSession, user_id: str) -> dict:
    assets = await get_assets(db, user_id)
    total = len(assets)
    critical = sum(1 for a in assets if a.risk_level == RiskLevel.critical)
    inspection_due = sum(1 for a in assets if a.status == AssetStatus.inspection_due)
    total_life = 0.0
    count_life = 0
    for a in assets:
        years = (datetime.now(timezone.utc) - a.install_date).days / 365.25
        cr = 0.0
        if years > 0:
            cr = max(0, (a.corrosion_allowance_mm - a.current_thickness_mm) / years)
        rl = calculate_remaining_life(a.current_thickness_mm, a.min_required_thickness_mm, cr)
        if rl >= 0:
            total_life += rl
            count_life += 1
    avg_life = total_life / count_life if count_life else 0.0
    return {
        "total_assets": total,
        "critical_risk": critical,
        "inspection_due": inspection_due,
        "avg_remaining_life": round(avg_life, 2),
    }
