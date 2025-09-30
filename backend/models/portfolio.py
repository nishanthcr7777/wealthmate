from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, default="My Portfolio")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="portfolios")
    stocks = relationship("Stock", back_populates="portfolio", cascade="all, delete-orphan")

class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=False)
    symbol = Column(String, nullable=False)
    shares = Column(Float, nullable=False)
    purchase_price = Column(Float, nullable=False)
    purchase_date = Column(DateTime, default=datetime.utcnow)
    
    portfolio = relationship("Portfolio", back_populates="stocks")
    transactions = relationship("Transaction", back_populates="stock", cascade="all, delete-orphan")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    stock_id = Column(Integer, ForeignKey("stocks.id"), nullable=False)
    transaction_type = Column(String, nullable=False)
    shares = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    transaction_date = Column(DateTime, default=datetime.utcnow)
    
    stock = relationship("Stock", back_populates="transactions")
