from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.asset import AssetCreate, AssetUpdate, AssetResponse, AssetStats
from app.services.asset_service import (
    create_asset,
    get_assets,
    get_asset,
    update_asset,
    delete_asset,
    get_asset_stats,
)

router = APIRouter(prefix="/api/assets", tags=["assets"])


@router.get("/stats", response_model=AssetStats)
async def stats_endpoint(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_asset_stats(db, str(user.id))


@router.post("", response_model=AssetResponse, status_code=201)
async def create_endpoint(
    data: AssetCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await create_asset(db, str(user.id), data)


@router.get("", response_model=list[AssetResponse])
async def list_endpoint(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_assets(db, str(user.id))


@router.get("/{asset_id}", response_model=AssetResponse)
async def get_endpoint(
    asset_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    asset = await get_asset(db, asset_id, str(user.id))
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.put("/{asset_id}", response_model=AssetResponse)
async def update_endpoint(
    asset_id: str,
    data: AssetUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    asset = await update_asset(db, asset_id, str(user.id), data)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.delete("/{asset_id}", status_code=204)
async def delete_endpoint(
    asset_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    deleted = await delete_asset(db, asset_id, str(user.id))
    if not deleted:
        raise HTTPException(status_code=404, detail="Asset not found")
