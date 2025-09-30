from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class StockBase(BaseModel):
    symbol: str
    shares: float
    purchase_price: float

class StockCreate(StockBase):
    pass

class Stock(StockBase):
    id: int
    portfolio_id: int
    purchase_date: datetime

    class Config:
        from_attributes = True

class PortfolioBase(BaseModel):
    name: str = "My Portfolio"

class PortfolioCreate(PortfolioBase):
    pass

class Portfolio(PortfolioBase):
    id: int
    user_id: int
    created_at: datetime
    stocks: List[Stock] = []

    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    stock_id: int
    transaction_type: str
    shares: float
    price: float

class StockPrice(BaseModel):
    symbol: str
    current_price: float
    change_percent: float
    day_high: float
    day_low: float
    volume: int
