import os
import fastapi
from fastapi import Depends, HTTPException, Request
from pydantic import BaseModel
import httpx
from app.core.models import User
from app.core.dependencies import get_user
from app.core.auth import get_authorization_header_elements, validate_token
from app.integrations.clients.mongo_client import MongoClient
from app.core.exceptions import (
    BadCredentialsException,
    RequiresAuthenticationException,
)


router = fastapi.APIRouter()


@router.get("/")
async def get_user_info(user: User = Depends(get_user)):
    return user


@router.get("/paying_status")
async def get_paying_status(user: User = Depends(get_user)):

    print("user", user)
    return {"payingStatus": True}
