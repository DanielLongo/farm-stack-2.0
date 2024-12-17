from pydantic import BaseModel, Field
from typing import Optional, List
from app.core.fields import PyObjectId


class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    auth0_user_id: str
    name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    role: Optional[str] = None
    organizations: Optional[List[str]] = None
