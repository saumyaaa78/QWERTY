import os
from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

# Base workspace directory
WORKSPACE_ROOT = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "QWERTY Agent Backend"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]

    # Workspace
    WORKSPACE_DIR: str = str(WORKSPACE_ROOT)

    # LLM Settings & Provider Keys
    DEFAULT_MODEL: str = "gemini/gemini-3.5-flash"
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None

    # Fallback / active model auto-detection
    def get_effective_model(self, requested_model: Optional[str] = None) -> str:
        if requested_model:
            return requested_model
        # If specific key is available, intelligently default
        if self.GEMINI_API_KEY:
            return "gemini/gemini-3.5-flash"
        if self.OPENAI_API_KEY:
            return "gpt-4o-mini"
        if self.GROQ_API_KEY:
            return "groq/llama-3.3-70b-versatile"
        if self.ANTHROPIC_API_KEY:
            return "claude-3-5-sonnet-20241022"
        return self.DEFAULT_MODEL

    model_config = SettingsConfigDict(
        env_file=(
            str(WORKSPACE_ROOT / ".env"),
            str(WORKSPACE_ROOT / "backend" / ".env")
        ),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
