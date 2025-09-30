from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models.user import User
from backend.models.portfolio import Portfolio, Stock
from backend.schemas.portfolio import StockCreate, Stock as StockSchema, StockPrice, StockUpdate
from backend.services.auth import get_current_user
from backend.services.stock_service import get_stock_price, get_stock_historical_data, get_stock_info
from backend.services.portfolio_service import calculate_portfolio_performance, calculate_stock_profit_loss

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])

@router.post("/add")
async def add_stock(
    stock_data: StockCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()
    if not portfolio:
        portfolio = Portfolio(user_id=current_user.id)
        db.add(portfolio)
        db.commit()
        db.refresh(portfolio)
    
    price_data = get_stock_price(stock_data.symbol)
    if not price_data:
        raise HTTPException(status_code=404, detail="Stock symbol not found")
    
    new_stock = Stock(
        portfolio_id=portfolio.id,
        symbol=stock_data.symbol.upper(),
        shares=stock_data.shares,
        purchase_price=stock_data.purchase_price
    )
    db.add(new_stock)
    db.commit()
    
    return {"message": "Investment added successfully"}

@router.get("/stocks", response_model=List[StockSchema])
async def get_stocks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()
    if not portfolio:
        return []
    
    stocks = db.query(Stock).filter(Stock.portfolio_id == portfolio.id).all()
    return stocks

@router.get("/stock/{symbol}/price", response_model=StockPrice)
async def get_stock_price_endpoint(symbol: str):
    price_data = get_stock_price(symbol)
    if not price_data:
        raise HTTPException(status_code=404, detail="Stock symbol not found")
    return price_data

@router.get("/stock/{symbol}/history")
async def get_stock_history(symbol: str, period: str = "1mo"):
    data = get_stock_historical_data(symbol, period)
    if not data:
        raise HTTPException(status_code=404, detail="Unable to fetch historical data")
    return data

@router.get("/stock/{symbol}/info")
async def get_stock_information(symbol: str):
    info = get_stock_info(symbol)
    if not info:
        raise HTTPException(status_code=404, detail="Unable to fetch stock information")
    return info

@router.get("/analytics")
async def get_portfolio_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    analysis = calculate_portfolio_performance(portfolio, db)
    return analysis

@router.get("/stock/{stock_id}/profit-loss")
async def get_stock_pl(
    stock_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stock = db.query(Stock).filter(Stock.id == stock_id).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    portfolio = db.query(Portfolio).filter(Portfolio.id == stock.portfolio_id).first()
    if not portfolio or portfolio.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    pl_data = calculate_stock_profit_loss(stock)
    return pl_data

@router.put("/stock/{stock_id}")
async def update_stock(
    stock_id: int,
    update: StockUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stock = db.query(Stock).filter(Stock.id == stock_id).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    portfolio = db.query(Portfolio).filter(Portfolio.id == stock.portfolio_id).first()
    if portfolio.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")
    stock.shares = update.shares
    stock.purchase_price = update.purchase_price
    db.commit()
    return {"message": "Stock updated"}

@router.delete("/stock/{stock_id}")
async def delete_stock(
    stock_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stock = db.query(Stock).filter(Stock.id == stock_id).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    portfolio = db.query(Portfolio).filter(Portfolio.id == stock.portfolio_id).first()
    if portfolio.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")
    db.delete(stock)
    db.commit()
    return {"message": "Stock deleted"}
