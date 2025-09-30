from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User
from backend.models.chat import ChatHistory
from backend.models.portfolio import Portfolio, Stock
from backend.schemas.ai import ChatRequest, ChatResponse
from backend.services.auth import get_current_user
from backend.services.ai_service import get_financial_advice, analyze_portfolio_with_ai, assess_portfolio_risk

router = APIRouter(prefix="/api", tags=["ai"])

@router.post("/ai/advice", response_model=ChatResponse)
async def get_ai_advice(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    response_text = get_financial_advice(request.message, request.context)
    
    chat_entry = ChatHistory(
        user_id=current_user.id,
        message=request.message,
        response=response_text
    )
    db.add(chat_entry)
    db.commit()
    
    return {"response": response_text}

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    response_text = get_financial_advice(request.message, request.context)
    
    chat_entry = ChatHistory(
        user_id=current_user.id,
        message=request.message,
        response=response_text
    )
    db.add(chat_entry)
    db.commit()
    
    return ChatResponse(response=response_text)

@router.get("/ai/portfolio-analysis")
async def analyze_portfolio(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    stocks = db.query(Stock).filter(Stock.portfolio_id == portfolio.id).all()
    if not stocks:
        return {"message": "No stocks in portfolio to analyze"}
    
    analysis = analyze_portfolio_with_ai(portfolio, stocks)
    return analysis

@router.get("/ai/risk-assessment")
async def get_risk_assessment(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    stocks = db.query(Stock).filter(Stock.portfolio_id == portfolio.id).all()
    if not stocks:
        return {"message": "No stocks in portfolio to assess"}
    
    risk_data = assess_portfolio_risk(stocks)
    return risk_data
