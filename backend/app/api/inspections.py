from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.inspection import InspectionCreate, InspectionUpdate, InspectionResponse
from app.services.inspection_service import (
    create_inspection,
    get_inspections,
    get_inspection,
    update_inspection,
)

router = APIRouter(prefix="/api/inspections", tags=["inspections"])


@router.post("", response_model=InspectionResponse, status_code=201)
async def create_endpoint(
    data: InspectionCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await create_inspection(db, str(user.id), data)


@router.get("", response_model=list[InspectionResponse])
async def list_endpoint(
    asset_id: Optional[str] = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_inspections(db, str(user.id), asset_id)


@router.get("/{inspection_id}", response_model=InspectionResponse)
async def get_endpoint(
    inspection_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    insp = await get_inspection(db, inspection_id, str(user.id))
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection not found")
    return insp


@router.put("/{inspection_id}", response_model=InspectionResponse)
async def update_endpoint(
    inspection_id: str,
    data: InspectionUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    insp = await update_inspection(db, inspection_id, str(user.id), data)
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection not found")
    return insp
