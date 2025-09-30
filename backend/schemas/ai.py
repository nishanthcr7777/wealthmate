from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None

class ChatResponse(BaseModel):
    response: str

class InvestmentRecommendation(BaseModel):
    symbol: str
    action: str
    reason: str
    confidence: float
    risk_level: str

class PortfolioAnalysis(BaseModel):
    total_value: float
    total_profit_loss: float
    profit_loss_percentage: float
    diversification_score: float
    risk_assessment: str
    recommendations: list[str]
