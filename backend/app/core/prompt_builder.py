from pathlib import Path
from typing import List, Dict, Optional
from ..prompts.system import QWERTY_SYSTEM_PROMPT
from ..config import settings

class PromptBuilder:
    def __init__(self, workspace_dir: Optional[str] = None):
        self.workspace_dir = Path(workspace_dir or settings.WORKSPACE_DIR)
        self.storage_dir = self.workspace_dir / "storage"

    def _read_optional_file(self, filename: str) -> Optional[str]:
        target = self.storage_dir / filename
        if target.exists() and target.is_file():
            try:
                content = target.read_text(encoding="utf-8").strip()
                if content:
                    return content
            except Exception as e:
                print(f"Warning: Failed reading {filename}: {e}")
        return None

    def build_effective_system_prompt(self) -> str:
        prompt_parts = [QWERTY_SYSTEM_PROMPT.strip()]

        # Tiered Durable Memory Injection (Hermes Pattern)
        user_facts = self._read_optional_file("USER.md")
        if user_facts:
            prompt_parts.append(f"\n### User Preferences & Context:\n{user_facts}")

        durable_memory = self._read_optional_file("MEMORY.md")
        if durable_memory:
            prompt_parts.append(f"\n### Persistent Workspace Memory:\n{durable_memory}")

        return "\n\n".join(prompt_parts)

    def assemble_messages(self, history: List[Dict[str, str]], current_message: Optional[str] = None) -> List[Dict[str, str]]:
        messages = [{"role": "system", "content": self.build_effective_system_prompt()}]
        messages.extend(history)
        if current_message:
            messages.append({"role": "user", "content": current_message})
        return messages

prompt_builder = PromptBuilder()
