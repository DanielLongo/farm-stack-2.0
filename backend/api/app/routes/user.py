import fastapi
from fastapi import Depends
from app.core.models import User
from app.core.dependencies import get_user
from app.core.auth import validate_token
from app.integrations.clients.mongo_client import MongoClient

router = fastapi.APIRouter()


@router.get("/")
async def get_user_info(user: User = Depends(get_user)):
    return user


@router.post("/register")
async def register_user(
    user_data: dict,
    token: str = Depends(validate_token)
):
    auth0_user_id = token.get("sub")
    user = User(
        auth0_user_id=auth0_user_id,
        name=user_data.get("name")
    )
    mongo_client = MongoClient()
    created_user = await mongo_client.create_user(user)
    return created_user
