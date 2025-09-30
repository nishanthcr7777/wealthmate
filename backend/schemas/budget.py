from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BudgetBase(BaseModel):
    category: str
    amount: float
    type: str  # e.g., "income" or "expense"

class BudgetCreate(BudgetBase):
    date: Optional[datetime] = None

class Budget(BudgetBase):
    id: int
    date: datetime

    class Config:
        from_attributes = True

class FinancialGoalBase(BaseModel):
    name: str
    target_amount: float
    deadline: Optional[datetime] = None

class FinancialGoalCreate(FinancialGoalBase):
    pass

class FinancialGoal(FinancialGoalBase):
    id: int
    current_amount: float
    created_at: datetime

    class Config:
        from_attributes = True

class AnalyticsSummary(BaseModel):
    total_balance: float
    investments: float
    savings: float
    monthly_expenses: float

class BudgetListResponse(BaseModel):
    budgets: List[Budget]
    goals: List[FinancialGoal]