import os
from dotenv import load_dotenv

load_dotenv()


PROJECT_ID = "TEMPLATE_PROJECT_ID"
DATABASE_NAME = "TEMPLATE_DATABASE_NAME"
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN") or "TEMPLATE_AUTH0_DOMAIN"
AUTH0_AUDIENCE = os.getenv("AUTH0_AUDIENCE") or "TEMPLATE_AUTH0_AUDIENCE"


assert AUTH0_DOMAIN, "AUTH0_DOMAIN environment variable not set"
assert AUTH0_AUDIENCE, "AUTH0_AUDIENCE environment variable not set"
