import json
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from sse_starlette.sse import EventSourceResponse
from ...core.agent import agent
from ...core.session import session_manager

router = APIRouter()

class ChatRequest(BaseModel):
    message: str = Field(..., description="User message to QWERTY")
    session_id: Optional[str] = Field(None, description="Optional existing session ID")
    model: Optional[str] = Field(None, description="Optional override model name (e.g. gemini/gemini-2.5-flash, gpt-4o-mini)")
    api_key: Optional[str] = Field(None, description="Optional client-supplied API key")

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    async def event_generator():
        async for event in agent.chat_stream(
            message=request.message,
            session_id=request.session_id,
            model=request.model,
            api_key=request.api_key
        ):
            # Format SSE payload
            yield {
                "event": event.get("event", "message"),
                "data": json.dumps(event)
            }

    return EventSourceResponse(event_generator())

@router.get("/sessions/{session_id}")
async def get_session(session_id: str):
    session = session_manager.get_or_create_session(session_id)
    return session.model_dump()

@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    success = session_manager.clear_session(session_id)
    return {"success": success, "session_id": session_id}
