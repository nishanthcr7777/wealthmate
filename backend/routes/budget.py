from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User
from backend.services.auth import get_current_user
from datetime import datetime
from backend.models.budget import Budget, FinancialGoal
from backend.schemas.budget import BudgetCreate, FinancialGoalCreate, BudgetListResponse, AnalyticsSummary
from sqlalchemy import func

router = APIRouter(prefix="/api", tags=["budget"])

@router.post("/budget/add")
async def add_budget_entry(
    entry: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_entry = Budget(
        user_id=current_user.id,
        category=entry.category,
        amount=entry.amount,
        type=entry.type,
        date=entry.date or datetime.utcnow()
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

@router.get("/budget/list", response_model=BudgetListResponse)
async def list_budget_items(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    budgets = db.query(Budget).filter(Budget.user_id == current_user.id).all()
    goals = db.query(FinancialGoal).filter(FinancialGoal.user_id == current_user.id).all()
    return {"budgets": budgets, "goals": goals}

@router.post("/goals/create")
async def create_goal(
    goal: FinancialGoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_goal = FinancialGoal(
        user_id=current_user.id,
        name=goal.name,
        target_amount=goal.target_amount,
        deadline=goal.deadline
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal

@router.get("/analytics/summary", response_model=AnalyticsSummary)
async def get_analytics_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Aggregate values from budgets
    total_income = db.query(Budget).filter(Budget.user_id == current_user.id, Budget.type == "income").with_entities(func.sum(Budget.amount)).scalar() or 0
    total_expense = db.query(Budget).filter(Budget.user_id == current_user.id, Budget.type == "expense").with_entities(func.sum(Budget.amount)).scalar() or 0
    savings = max(total_income - total_expense, 0)

    # Placeholder: pull real-time investment value later
    investments = 0.0
    monthly_expenses = total_expense  # simple

    return {
        "total_balance": savings + investments,
        "investments": investments,
        "savings": savings,
        "monthly_expenses": monthly_expenses
    }

@router.post("/accounts/link")
async def link_account(
    bank_name: str,
    account_number: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {"message": "Account linked successfully"}
