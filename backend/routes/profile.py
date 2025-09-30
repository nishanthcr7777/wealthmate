from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User
from backend.schemas.user import UserUpdate
from backend.services.auth import get_current_user

router = APIRouter(prefix="/api/profile", tags=["profile"])

@router.post("/update")
async def update_profile(
    profile_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_data.full_name is not None:
        current_user.full_name = profile_data.full_name
    if profile_data.phone is not None:
        current_user.phone = profile_data.phone
    if profile_data.location is not None:
        current_user.location = profile_data.location
    
    db.commit()
    return {"message": "Profile updated successfully"}
