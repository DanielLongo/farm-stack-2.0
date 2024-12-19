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
import firebase_admin
from firebase_admin import app_check, auth


default_app = firebase_admin.initialize_app(options={"projectId": "the-thrive-app"})

router = fastapi.APIRouter()


# Add Pydantic models
class SendCodeRequest(BaseModel):
    phoneNumber: str
    recaptchaToken: str


class SendCodeResponse(BaseModel):
    sessionInfo: str


class VerifyCodeRequest(BaseModel):
    sessionInfo: str
    code: str


class VerifyCodeResponse(BaseModel):
    idToken: str
    refreshToken: str
    localId: str
    phoneNumber: str


def get_token_from_request(request: Request):
    authorization_header = request.headers.get("Authorization")
    print("authorization_header", authorization_header)
    assert len(authorization_header.split("Bearer ")) == 2
    return authorization_header.split("Bearer ")[1]


def get_firebase_user(token: str = Depends(get_token_from_request)):
    print("token", token)
    try:
        return auth.verify_id_token(token)
    except Exception as e:  # Catching the general exception for demonstration
        print("Error verifying token:", e)
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@router.get("/")
async def get_user_info(user: User = Depends(get_user)):
    return user


@router.get("/paying_status")
async def get_paying_status(user: User = Depends(get_firebase_user)):

    print("user", user)
    return {"payingStatus": True}
