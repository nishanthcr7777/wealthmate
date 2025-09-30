from typing import List, Dict
from sqlalchemy.orm import Session
from backend.models.portfolio import Portfolio, Stock, Transaction
from backend.services.stock_service import get_stock_price
from backend.schemas.ai import PortfolioAnalysis

def calculate_portfolio_performance(portfolio: Portfolio, db: Session) -> PortfolioAnalysis:
    try:
        stocks = db.query(Stock).filter(Stock.portfolio_id == portfolio.id).all()
        
        total_value = 0
        total_cost = 0
        recommendations = []
        
        for stock in stocks:
            current_price_data = get_stock_price(stock.symbol)
            if current_price_data:
                current_value = stock.shares * current_price_data.current_price
                purchase_value = stock.shares * stock.purchase_price
                
                total_value += current_value
                total_cost += purchase_value
                
                profit_loss_pct = ((current_value - purchase_value) / purchase_value) * 100
                
                if profit_loss_pct < -10:
                    recommendations.append(f"Consider reviewing {stock.symbol} - down {abs(profit_loss_pct):.1f}%")
                elif profit_loss_pct > 20:
                    recommendations.append(f"Consider taking profits on {stock.symbol} - up {profit_loss_pct:.1f}%")
        
        total_profit_loss = total_value - total_cost
        profit_loss_percentage = (total_profit_loss / total_cost * 100) if total_cost > 0 else 0
        
        num_stocks = len(stocks)
        diversification_score = min(num_stocks * 20, 100)
        
        if num_stocks < 3:
            risk_assessment = "High Risk - Low Diversification"
            recommendations.append("Consider adding more stocks to diversify your portfolio")
        elif num_stocks < 7:
            risk_assessment = "Medium Risk - Moderate Diversification"
        else:
            risk_assessment = "Lower Risk - Well Diversified"
        
        if not recommendations:
            recommendations.append("Your portfolio is performing well. Continue monitoring regularly.")
        
        return PortfolioAnalysis(
            total_value=round(total_value, 2),
            total_profit_loss=round(total_profit_loss, 2),
            profit_loss_percentage=round(profit_loss_percentage, 2),
            diversification_score=diversification_score,
            risk_assessment=risk_assessment,
            recommendations=recommendations
        )
    except Exception as e:
        return PortfolioAnalysis(
            total_value=0,
            total_profit_loss=0,
            profit_loss_percentage=0,
            diversification_score=0,
            risk_assessment="Unable to assess",
            recommendations=["Error calculating portfolio performance"]
        )

def calculate_stock_profit_loss(stock: Stock) -> Dict:
    try:
        current_price_data = get_stock_price(stock.symbol)
        if not current_price_data:
            return {
                "symbol": stock.symbol,
                "error": "Unable to fetch current price"
            }
        
        current_value = stock.shares * current_price_data.current_price
        purchase_value = stock.shares * stock.purchase_price
        profit_loss = current_value - purchase_value
        profit_loss_percentage = (profit_loss / purchase_value * 100) if purchase_value > 0 else 0
        
        return {
            "symbol": stock.symbol,
            "shares": stock.shares,
            "purchase_price": stock.purchase_price,
            "current_price": current_price_data.current_price,
            "purchase_value": round(purchase_value, 2),
            "current_value": round(current_value, 2),
            "profit_loss": round(profit_loss, 2),
            "profit_loss_percentage": round(profit_loss_percentage, 2)
        }
    except Exception as e:
        return {
            "symbol": stock.symbol,
            "error": str(e)
        }
