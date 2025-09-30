from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User
from backend.services.auth import get_current_user

router = APIRouter(prefix="/api", tags=["budget"])

@router.post("/budget/add")
async def add_budget_entry(
    category: str,
    amount: float,
    type: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {"message": "Transaction added successfully"}

@router.post("/goals/create")
async def create_goal(
    name: str,
    target_amount: float,
    deadline: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {"message": "Goal created successfully"}

@router.post("/accounts/link")
async def link_account(
    bank_name: str,
    account_number: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {"message": "Account linked successfully"}

@router.get("/analytics/summary")
async def get_analytics_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    summary = {
        "totalBalance": 58200,
        "investments": 45750,
        "savings": 12450,
        "monthlyExpenses": 3200
    }
    return summary
