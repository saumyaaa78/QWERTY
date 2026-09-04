import json
import uuid
from pathlib import Path
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class Message(BaseModel):
    role: str
    content: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class Session(BaseModel):
    id: str
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    messages: List[Message] = Field(default_factory=list)

class SessionManager:
    def __init__(self, storage_dir: Optional[Path] = None):
        if storage_dir is None:
            storage_dir = Path(__file__).resolve().parent.parent.parent.parent / "storage" / "sessions"
        self.storage_dir = storage_dir
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self._sessions: Dict[str, Session] = {}
        self._load_persisted_sessions()

    def _get_file_path(self, session_id: str) -> Path:
        return self.storage_dir / f"{session_id}.json"

    def _load_persisted_sessions(self):
        try:
            for file in self.storage_dir.glob("*.json"):
                try:
                    with open(file, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        session = Session(**data)
                        self._sessions[session.id] = session
                except Exception as e:
                    print(f"Failed to load session {file.name}: {e}")
        except Exception as e:
            print(f"Error loading sessions: {e}")

    def get_or_create_session(self, session_id: Optional[str] = None) -> Session:
        if not session_id or session_id not in self._sessions:
            new_id = session_id or str(uuid.uuid4())
            session = Session(id=new_id)
            self._sessions[new_id] = session
            self._persist_session(session)
            return session
        return self._sessions[session_id]

    def add_message(self, session_id: str, role: str, content: str) -> Message:
        session = self.get_or_create_session(session_id)
        msg = Message(role=role, content=content)
        session.messages.append(msg)
        self._persist_session(session)
        return msg

    def get_messages_for_llm(self, session_id: str, limit: int = 20) -> List[Dict[str, str]]:
        session = self.get_or_create_session(session_id)
        recent = session.messages[-limit:] if len(session.messages) > limit else session.messages
        return [{"role": m.role, "content": m.content} for m in recent]

    def _persist_session(self, session: Session):
        file_path = self._get_file_path(session.id)
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(session.model_dump(), f, indent=2)
        except Exception as e:
            print(f"Failed to persist session {session.id}: {e}")

    def clear_session(self, session_id: str) -> bool:
        if session_id in self._sessions:
            del self._sessions[session_id]
            file_path = self._get_file_path(session_id)
            if file_path.exists():
                file_path.unlink()
            return True
        return False

# Global instance
session_manager = SessionManager()
