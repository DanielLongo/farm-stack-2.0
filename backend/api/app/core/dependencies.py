from bson import ObjectId
from fastapi import Depends, HTTPException
from app.core.models import User
from app.core.auth import JsonWebToken, get_bearer_token
from app.integrations.clients.mongo_client import MongoClient
import firebase_admin
from firebase_admin import app_check, auth


default_app = firebase_admin.initialize_app(options={"projectId": "the-thrive-app"})


def parse_user_firebase_info(user_info: dict) -> dict:
    """
    finds if email or phone number is in user_info

    {
        "iss": "https://securetoken.google.com/the-thrive-app",
        "aud": "the-thrive-app",
        "auth_time": 1734599187,
        "user_id": "mjaoAdaY7iZpC7Na7QV5wsFX3G22",
        "sub": "mjaoAdaY7iZpC7Na7QV5wsFX3G22",
        "iat": 1734599187,
        "exp": 1734602787,
        "phone_number": "+16505551234",
        "firebase": {
            "identities": {"phone": ["+16505551234"]},
            "sign_in_provider": "phone",
        },
        "uid": "mjaoAdaY7iZpC7Na7QV5wsFX3G22",
    }
    """
    res = {}
    if "firebase" in user_info:
        if "identities" in user_info["firebase"]:
            if "phone" in user_info["firebase"]["identities"]:
                res["phone_number"] = user_info["firebase"]["identities"]["phone"][0]
            elif "email" in user_info["firebase"]["identities"]:
                res["email"] = user_info["firebase"]["identities"]["email"][0]
    return res


async def get_user(
    token: str = Depends(get_bearer_token), create_new_user: bool = True
) -> User:
    user_info = auth.verify_id_token(token)

    assert user_info["aud"] == "the-thrive-app", f"Invalid audience: {user_info['aud']}"
    google_auth_user_id = user_info["uid"]

    mongo_client = MongoClient()
    user = await mongo_client.get_user(google_auth_user_id=google_auth_user_id)
    if user is None and create_new_user:
        new_user = User(
            google_auth_user_id=google_auth_user_id,
        )
        user_firebase_info = parse_user_firebase_info(user_info)
        if user_firebase_info.get("phone_number"):
            new_user.phone_number = user_firebase_info.get("phone_number")
        elif user_firebase_info.get("email"):
            new_user.email = user_firebase_info.get("email")
        await mongo_client.create_user(new_user)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user
