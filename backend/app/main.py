from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .api.router import api_router

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="Autonomous AI Agent Backend for QWERTY (Hermes-Inspired Architecture)",
        debug=settings.DEBUG,
    )

    # Configure CORS for Next.js frontend
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount API routers
    app.include_router(api_router, prefix="/api")

    @app.get("/")
    async def root():
        return {
            "message": "QWERTY Agent Backend is running.",
            "docs": "/docs",
            "health": "/api/health"
        }

    return app

app = create_app()
