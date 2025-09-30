from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None

class User(UserBase):
    id: int
    full_name: Optional[str]
    phone: Optional[str]
    location: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    token: str
    token_type: str = "bearer"
