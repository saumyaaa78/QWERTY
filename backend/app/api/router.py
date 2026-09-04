from fastapi import APIRouter
from .endpoints.health import router as health_router
from .endpoints.chat import router as chat_router

api_router = APIRouter()
api_router.include_router(health_router, tags=["Health"])
api_router.include_router(chat_router, tags=["Chat"])
