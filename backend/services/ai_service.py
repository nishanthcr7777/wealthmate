import os
from openai import OpenAI
from typing import List, Dict
from backend.models.portfolio import Stock, Portfolio
from backend.services.stock_service import get_stock_price, get_stock_info
from backend.schemas.ai import InvestmentRecommendation

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_financial_advice(user_message: str, context: str = None) -> str:
    try:
        system_prompt = "You are WealthMate, a knowledgeable financial advisor AI assistant. Provide helpful, accurate, and concise financial advice."
        
        if context:
            system_prompt += f"\n\nAdditional context: {context}"
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        return response.choices[0].message.content
    except Exception as e:
        return f"I apologize, but I'm having trouble processing your request at the moment. Please try again later."

def analyze_portfolio_with_ai(portfolio: Portfolio, stocks_data: List[Stock]) -> Dict:
    try:
        portfolio_summary = []
        total_value = 0
        
        for stock in stocks_data:
            current_price_data = get_stock_price(stock.symbol)
            if current_price_data:
                current_value = stock.shares * current_price_data.current_price
                purchase_value = stock.shares * stock.purchase_price
                profit_loss = current_value - purchase_value
                
                total_value += current_value
                portfolio_summary.append(f"{stock.symbol}: {stock.shares} shares at ${current_price_data.current_price:.2f} (P/L: ${profit_loss:.2f})")
        
        prompt = f"""Analyze this investment portfolio and provide:
1. Overall risk assessment
2. Diversification analysis
3. Specific recommendations for improvement
4. Rebalancing suggestions

Portfolio:
{chr(10).join(portfolio_summary)}
Total Portfolio Value: ${total_value:.2f}

Provide a concise analysis with actionable recommendations."""
        
        analysis = get_financial_advice(prompt)
        
        return {
            "total_value": total_value,
            "analysis": analysis,
            "stocks_count": len(stocks_data)
        }
    except Exception as e:
        return {
            "total_value": 0,
            "analysis": "Unable to analyze portfolio at this time.",
            "stocks_count": 0
        }

def get_investment_recommendations(risk_profile: str, budget: float) -> List[InvestmentRecommendation]:
    try:
        prompt = f"""As a financial advisor, recommend 3-5 stocks or ETFs for an investor with:
- Risk Profile: {risk_profile}
- Investment Budget: ${budget}

Provide recommendations in this format for each:
- Symbol
- Action (Buy/Hold)
- Reason (1-2 sentences)
- Confidence (0-100)
- Risk Level (Low/Medium/High)"""
        
        response = get_financial_advice(prompt)
        
        return []
    except Exception as e:
        return []

def assess_portfolio_risk(stocks_data: List[Stock]) -> Dict:
    try:
        sectors = {}
        total_value = 0
        
        for stock in stocks_data:
            info = get_stock_info(stock.symbol)
            sector = info.get('sector', 'Unknown')
            
            current_price_data = get_stock_price(stock.symbol)
            if current_price_data:
                value = stock.shares * current_price_data.current_price
                sectors[sector] = sectors.get(sector, 0) + value
                total_value += value
        
        diversification_score = len(sectors) / max(len(stocks_data), 1) * 100
        
        risk_level = "Low" if diversification_score > 70 else "Medium" if diversification_score > 40 else "High"
        
        return {
            "diversification_score": round(diversification_score, 2),
            "risk_level": risk_level,
            "sector_allocation": {k: round(v/total_value*100, 2) for k, v in sectors.items()},
            "total_value": round(total_value, 2)
        }
    except Exception as e:
        return {
            "diversification_score": 0,
            "risk_level": "Unknown",
            "sector_allocation": {},
            "total_value": 0
        }
