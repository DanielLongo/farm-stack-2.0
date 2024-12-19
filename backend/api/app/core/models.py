from pydantic import BaseModel, Field
from typing import Optional, List
from app.core.fields import PyObjectId
from datetime import datetime


class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.now)
    google_auth_user_id: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    role: Optional[str] = None
    organizations: Optional[List[str]] = None
