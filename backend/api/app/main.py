from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.user import router as user_router

app = FastAPI()

# TODO: Add your origins here
origins = [
    "http://localhost:3000",
    "https://*.devinapps.com",
    "https://www.*.devinapps.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix="/user")
