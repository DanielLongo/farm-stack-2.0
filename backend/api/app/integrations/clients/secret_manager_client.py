from google.cloud import secretmanager
import json


from app.integrations.clients.base_client import BaseClient
from app.core.constants import PROJECT_ID


class SecretManagerClient(BaseClient):
    def _init_client(self):
        self.client = secretmanager.SecretManagerServiceClient()

    def get_secret(self, secret_name: str) -> dict:
        name = f"projects/{PROJECT_ID}/secrets/{secret_name}/versions/latest"
        response = self.client.access_secret_version(name=name)
        assert (
            response.payload.data is not None
        ), f"Secret payload data for '{secret_name}' must not be None"
        return json.loads(response.payload.data.decode("UTF-8"))
