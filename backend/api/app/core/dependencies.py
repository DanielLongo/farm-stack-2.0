from bson import ObjectId
from fastapi import Depends
from app.core.models import User
from app.core.auth import JsonWebToken, get_bearer_token
from app.integrations.clients.mongo_client import MongoClient


async def get_user(token: str = Depends(get_bearer_token)) -> User:
    user_id = JsonWebToken(token).validate().get("sub")
    assert user_id is not None
    mongo_client = MongoClient()
    try:
        user = await mongo_client.get_user(user_id)
        return user
    except Exception as e:
        print("user not found", e)
        # handle create new user

        new_user = User(
            name="",
            email="",
            role="",
            auth0_user_id=user_id,
        )
        user = new_user.model_dump(by_alias=True)
        user["_id"] = ObjectId(user["_id"])
        await mongo_client.db_client["users"].insert_one(user)
        return new_user
