# QWERTY — Autonomous AI Companion & Software Engineer

QWERTY is an autonomous conversational, voice-enabled, and tool-augmented AI agent built with a **Python (FastAPI)** backend and a **Next.js** frontend. Her design is inspired by the architecture of Nous Research's [Hermes Agent](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture).

---

## 🌟 Current Status: Milestone 1 (Conversational Core MVP)

- **Backend:** FastAPI with unified multi-provider LLM routing via LiteLLM.
- **Frontend:** Modern Next.js 14 App Router with sleek dark glassmorphic styling (Vanilla CSS), status orb, and streaming chat interface.
- **Dual IDE Support:** Ready out-of-the-box for **Antigravity IDE** and **VS Code**.
- **Live Task Tracking:** Single source of truth in [`TASK_GUIDE.md`](./TASK_GUIDE.md).

---

## 🚀 Quick Start

### 1. Configure Your API Key
QWERTY supports any major LLM provider (Google Gemini, OpenAI, Groq, Anthropic).  
Edit `.env` at the root of the project (or use the web UI **Config** modal):

```env
# Choose your preferred provider and paste your key:
GEMINI_API_KEY=your_gemini_api_key_here
# or
OPENAI_API_KEY=your_openai_api_key_here
# or
GROQ_API_KEY=your_groq_api_key_here
```

### 2. Start QWERTY (Single Command)
From the workspace root:
```bash
# Double-click start.bat in File Explorer, or run in terminal:
.\start.bat
# or
python run.py
```
This automatically:
- Checks and frees up ports 8000 and 3000 to prevent `EADDRINUSE`.
- Starts the FastAPI backend on `http://localhost:8000`.
- Starts the Next.js frontend on `http://localhost:3000`.
- Automatically opens your browser to **`http://localhost:3000`**.
- Press `Ctrl+C` anytime in the terminal to stop both servers cleanly.

---

## 💻 Dual IDE Workflow (VS Code & Antigravity IDE)

Both editors share the same configuration:
- **Run / Debug:** Press `F5` in VS Code or Antigravity IDE to launch `QWERTY: Full Stack` (runs both backend and frontend concurrently with debugger attached).
- **Tasks:** Run `Start Backend (FastAPI)` or `Start Frontend (Next.js)` via `Terminal -> Run Task...`.
- **Interpreter:** Configured in `.vscode/settings.json`.

---

## 🗺️ Roadmap Milestones

| Milestone | Focus | Status |
|---|---|---|
| **Milestone 1** | Text Conversational Core (FastAPI + LiteLLM + Next.js UI) | **Completed** |
| **Milestone 2** | Full-Duplex Voice Dialogue with Real-Time Interruptions (STT + TTS + VAD) | **Next Up** |
| **Milestone 3** | Voice-Driven Workspace Tools (Folder creation & code editing) | Planned |

Track real-time progress in [TASK_GUIDE.md](file:///d:/Projects/QWERTY/TASK_GUIDE.md).
