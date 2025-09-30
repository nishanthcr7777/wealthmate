from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path

from backend.database import engine, Base
from backend.routes import auth, profile, portfolio, ai, budget

Base.metadata.create_all(bind=engine)

app = FastAPI(title="WealthMate API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_cache_control_headers(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(portfolio.router)
app.include_router(ai.router)
app.include_router(budget.router)

current_dir = Path(__file__).parent.parent
app.mount("/static", StaticFiles(directory=str(current_dir)), name="static")

@app.get("/")
async def serve_home():
    return FileResponse(current_dir / "wealthmate.html")

@app.get("/login")
async def serve_login():
    return FileResponse(current_dir / "login.html")

@app.get("/profile")
async def serve_profile():
    return FileResponse(current_dir / "profile.html")

@app.get("/budget")
async def serve_budget():
    return FileResponse(current_dir / "budget.html")

@app.get("/{filename}")
async def serve_file(filename: str):
    file_path = current_dir / filename
    if file_path.exists() and file_path.is_file():
        return FileResponse(file_path)
    return {"error": "File not found"}, 404

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
