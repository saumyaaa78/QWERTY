import os
import json
import asyncio
from typing import AsyncGenerator, Dict, Any, Optional, List
import litellm
from ..config import settings
from .session import session_manager
from .prompt_builder import prompt_builder

# Disable noisy telemetry and loggings from litellm if desired
litellm.telemetry = False

class AIAgent:
    """
    QWERTY AIAgent Execution Loop (Inspired by Hermes Agent architecture).
    Coordinates prompt construction, provider calls, streaming chunks, and session persistence.
    """

    def __init__(self):
        self.settings = settings
        self.session_manager = session_manager
        self.prompt_builder = prompt_builder

    def _prepare_api_keys(self, custom_api_key: Optional[str] = None, model: Optional[str] = None):
        """Ensure provider API keys from environment or custom request are configured."""
        if self.settings.GEMINI_API_KEY:
            os.environ["GEMINI_API_KEY"] = self.settings.GEMINI_API_KEY
        if self.settings.OPENAI_API_KEY:
            os.environ["OPENAI_API_KEY"] = self.settings.OPENAI_API_KEY
        if self.settings.ANTHROPIC_API_KEY:
            os.environ["ANTHROPIC_API_KEY"] = self.settings.ANTHROPIC_API_KEY
        if self.settings.GROQ_API_KEY:
            os.environ["GROQ_API_KEY"] = self.settings.GROQ_API_KEY

        # If user supplied custom API key in the UI request
        if custom_api_key and model:
            if "gemini" in model.lower():
                os.environ["GEMINI_API_KEY"] = custom_api_key
            elif "claude" in model.lower() or "anthropic" in model.lower():
                os.environ["ANTHROPIC_API_KEY"] = custom_api_key
            elif "groq" in model.lower():
                os.environ["GROQ_API_KEY"] = custom_api_key
            else:
                os.environ["OPENAI_API_KEY"] = custom_api_key

    async def chat_stream(
        self,
        message: str,
        session_id: Optional[str] = None,
        model: Optional[str] = None,
        api_key: Optional[str] = None,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Execute streaming conversation with QWERTY.
        Yields structured event dicts:
          - {'event': 'start', 'session_id': ..., 'model': ...}
          - {'event': 'token', 'text': ...}
          - {'event': 'done', 'session_id': ..., 'full_text': ...}
          - {'event': 'error', 'message': ...}
        """
        session = self.session_manager.get_or_create_session(session_id)
        active_model = self.settings.get_effective_model(model)
        self._prepare_api_keys(api_key, active_model)

        # Record user message in session
        self.session_manager.add_message(session.id, "user", message)

        # Get historical context
        history = self.session_manager.get_messages_for_llm(session.id)
        # The last message is already in history, so we assemble without passing current_message again
        messages = self.prompt_builder.assemble_messages(history=history[:-1], current_message=message)

        yield {
            "event": "start",
            "session_id": session.id,
            "model": active_model
        }

        full_response_text = ""

        try:
            # Resilient fallbacks for transient provider demand
            fallbacks = []
            if "gemini" in active_model:
                fallbacks = ["gemini/gemini-flash-latest", "gemini/gemini-3.1-flash-lite-preview"]

            # LiteLLM asynchronous streaming call
            response = await litellm.acompletion(
                model=active_model,
                messages=messages,
                stream=True,
                api_key=api_key,
                num_retries=2,
                fallbacks=fallbacks if fallbacks else None
            )

            async for chunk in response:
                delta = chunk.choices[0].delta
                content = delta.content or ""
                if content:
                    full_response_text += content
                    yield {
                        "event": "token",
                        "text": content
                    }

            # Record assistant message in session
            self.session_manager.add_message(session.id, "assistant", full_response_text)

            yield {
                "event": "done",
                "session_id": session.id,
                "full_text": full_response_text
            }

        except Exception as e:
            error_msg = str(e)
            print(f"Error in AIAgent chat_stream: {error_msg}")
            
            # Helpful error guidance
            guidance = ""
            if "API key" in error_msg or "authentication" in error_msg.lower() or "401" in error_msg:
                guidance = " (Please ensure an API key like GEMINI_API_KEY, OPENAI_API_KEY, or GROQ_API_KEY is configured in backend/.env or the Settings panel)"
            
            yield {
                "event": "error",
                "message": f"QWERTY encountered an error: {error_msg}{guidance}"
            }

agent = AIAgent()
