from typing import Optional
from app.integrations.clients.base_client import BaseClient
from datetime import datetime
import json

from app.integrations.clients.secret_manager_client import SecretManagerClient
from app.core.models import User
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from app.core.fields import PyObjectId
from app.core.constants import DATABASE_NAME


class MongoClient(BaseClient):

    def _init_client(self, database_name: str = DATABASE_NAME):
        self.mongo_uri = SecretManagerClient().get_secret("MONGO")["mongo_uri"]
        assert self.mongo_uri is not None, "MONGO_URI environment variable not set"
        self.db_client = AsyncIOMotorClient(self.mongo_uri)[database_name]

    async def get_user(self, google_auth_user_id: str) -> Optional[User]:
        user = await self.db_client.users.find_one(
            {"google_auth_user_id": google_auth_user_id}
        )
        if user is None:
            return None
        return User(**user)

    async def create_user(self, user: User) -> User:
        user_dict = user.model_dump(by_alias=True)
        await self.db_client.users.insert_one(user_dict)
        return user
