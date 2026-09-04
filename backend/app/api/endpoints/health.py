from fastapi import APIRouter
from ...config import settings

router = APIRouter()

@router.get("/health")
async def health_check():
    has_gemini = bool(settings.GEMINI_API_KEY)
    has_openai = bool(settings.OPENAI_API_KEY)
    has_anthropic = bool(settings.ANTHROPIC_API_KEY)
    has_groq = bool(settings.GROQ_API_KEY)

    return {
        "status": "online",
        "agent": "QWERTY",
        "version": settings.VERSION,
        "active_model": settings.get_effective_model(),
        "configured_providers": {
            "gemini": has_gemini,
            "openai": has_openai,
            "anthropic": has_anthropic,
            "groq": has_groq,
        },
        "has_any_key": any([has_gemini, has_openai, has_anthropic, has_groq])
    }
