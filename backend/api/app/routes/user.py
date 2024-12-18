import os
import fastapi
from fastapi import Depends, HTTPException
from pydantic import BaseModel
import httpx
from app.core.models import User
from app.core.dependencies import get_user
from app.core.auth import validate_token
from app.integrations.clients.mongo_client import MongoClient

router = fastapi.APIRouter()

# Add API key and URLs
WEB_API_KEY = os.getenv("WEB_API_KEY", "YOUR_WEB_API_KEY_HERE")
SEND_VERIFICATION_CODE_URL = f"https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key={WEB_API_KEY}"
SIGN_IN_WITH_PHONE_NUMBER_URL = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key={WEB_API_KEY}"


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


@router.get("/")
async def get_user_info(user: User = Depends(get_user)):
    return user


@router.post("/register")
async def register_user(user_data: dict, token: dict = Depends(validate_token)):
    auth0_user_id = token.get("sub")
    user = User(auth0_user_id=auth0_user_id, name=user_data.get("name"))
    mongo_client = MongoClient()
    created_user = await mongo_client.create_user(user)
    return created_user


@router.post("/send-code", response_model=SendCodeResponse)
async def send_verification_code(payload: SendCodeRequest):
    """
    Sends a verification code via SMS to the provided phone number using Google Identity Platform.
    """
    data = {
        "phoneNumber": payload.phoneNumber,
        "recaptchaToken": payload.recaptchaToken,
    }

    async with httpx.AsyncClient() as client:
        r = await client.post(SEND_VERIFICATION_CODE_URL, json=data)
        if r.status_code != 200:
            error_data = r.json()
            raise HTTPException(
                status_code=400,
                detail=error_data.get("error", {}).get("message", "Unknown error"),
            )

        response_data = r.json()
        if "sessionInfo" not in response_data:
            raise HTTPException(
                status_code=400, detail="No sessionInfo returned from API"
            )

        return SendCodeResponse(sessionInfo=response_data["sessionInfo"])


@router.post("/verify-code", response_model=VerifyCodeResponse)
async def verify_code(payload: VerifyCodeRequest):
    """
    Verifies the SMS code the user received. On success, returns an ID token and user info.
    """
    data = {"sessionInfo": payload.sessionInfo, "code": payload.code}

    async with httpx.AsyncClient() as client:
        r = await client.post(SIGN_IN_WITH_PHONE_NUMBER_URL, json=data)
        if r.status_code != 200:
            error_data = r.json()
            raise HTTPException(
                status_code=400,
                detail=error_data.get("error", {}).get("message", "Unknown error"),
            )

        response_data = r.json()
        if "idToken" not in response_data:
            raise HTTPException(status_code=400, detail="No idToken returned from API")

        return VerifyCodeResponse(
            idToken=response_data["idToken"],
            refreshToken=response_data.get("refreshToken", ""),
            localId=response_data.get("localId", ""),
            phoneNumber=response_data.get("phoneNumber", ""),
        )
