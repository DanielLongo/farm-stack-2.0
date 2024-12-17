import fastapi
from fastapi import Depends
from app.core.models import User
from app.core.dependencies import get_user

router = fastapi.APIRouter()


@router.get("/")
async def get_user_info(user: User = Depends(get_user)):
    return user
