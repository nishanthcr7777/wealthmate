import yfinance as yf
from typing import Dict, Optional
from backend.schemas.portfolio import StockPrice

def get_stock_price(symbol: str) -> Optional[StockPrice]:
    try:
        stock = yf.Ticker(symbol)
        info = stock.info
        hist = stock.history(period="1d")
        
        if hist.empty:
            return None
        
        current_price = hist['Close'].iloc[-1]
        day_high = hist['High'].iloc[-1]
        day_low = hist['Low'].iloc[-1]
        volume = int(hist['Volume'].iloc[-1])
        
        prev_close = info.get('previousClose', current_price)
        change_percent = ((current_price - prev_close) / prev_close) * 100 if prev_close else 0
        
        return StockPrice(
            symbol=symbol.upper(),
            current_price=float(current_price),
            change_percent=float(change_percent),
            day_high=float(day_high),
            day_low=float(day_low),
            volume=volume
        )
    except Exception as e:
        print(f"Error fetching stock price for {symbol}: {e}")
        return None

def get_stock_historical_data(symbol: str, period: str = "1mo") -> Dict:
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period=period)
        
        return {
            "symbol": symbol.upper(),
            "dates": hist.index.strftime('%Y-%m-%d').tolist(),
            "prices": hist['Close'].tolist(),
            "volumes": hist['Volume'].tolist()
        }
    except Exception as e:
        print(f"Error fetching historical data for {symbol}: {e}")
        return {}

def get_stock_info(symbol: str) -> Dict:
    try:
        stock = yf.Ticker(symbol)
        info = stock.info
        
        return {
            "symbol": symbol.upper(),
            "name": info.get('longName', symbol),
            "sector": info.get('sector', 'Unknown'),
            "industry": info.get('industry', 'Unknown'),
            "market_cap": info.get('marketCap', 0),
            "pe_ratio": info.get('trailingPE', 0),
            "dividend_yield": info.get('dividendYield', 0),
            "52_week_high": info.get('fiftyTwoWeekHigh', 0),
            "52_week_low": info.get('fiftyTwoWeekLow', 0)
        }
    except Exception as e:
        print(f"Error fetching stock info for {symbol}: {e}")
        return {}
