# QWERTY Agent — Task Guide & Execution Ledger

> **Notice for User and Agent:**  
> This file is the live single source of truth for the QWERTY project. It tracks what tasks have been completed, what is currently being worked on, what is planned next, and any blockers or notes. Whenever an agent finishes or starts a task, this file MUST be updated.

---

## Current Status Overview
* **Project Name:** QWERTY (Hermes-Inspired Autonomous Voice & Code Agent)
* **Active Milestone:** **Milestone 1 — Conversational Core (MVP) [COMPLETED]**
* **Next Milestone:** **Milestone 2 — Natural Voice & Interruptions**
* **System Health:** 🟢 Backend & Frontend Online & Verified
* **Last Updated:** 2026-09-04 21:05:00
* **Primary IDEs:** Antigravity IDE & VS Code

---

## 📍 Current Active Task
* **Task ID:** TASK-1.7
* **Task Description:** End-to-End Live Verification & Launch of QWERTY Full Stack
* **Status:** 🟢 Live & Running
* **Started At:** 2026-09-04 21:00:00
* **Immediate Next Action:** User interacts with QWERTY on http://localhost:3000, tests chat streaming, then initiates Milestone 2 (Voice & Interruptions).

---

## 🗺️ Milestone Roadmap & Progress

```
[ Milestones Tracker ]
├── [x] Phase 0: Architecture Research & PRD Creation
├── [x] Milestone 1: Conversational Core MVP ("Talk to QWERTY" via Text)
│   ├── [x] Task 1.1: Backend initialization (FastAPI, LiteLLM, .env setup)
│   ├── [x] Task 1.2: System prompt & QWERTY persona definition
│   ├── [x] Task 1.3: Streaming chat endpoint (`/api/chat` via SSE)
│   ├── [x] Task 1.4: Frontend initialization (Next.js 14+ App Router, modern dark UI)
│   ├── [x] Task 1.5: Chat UI components & streaming text integration
│   └── [x] Task 1.6: Dual IDE config (.vscode settings, tasks, launch configurations)
│
├── [ ] Milestone 2: Natural Voice Interaction & Interruptibility
│   ├── [ ] Task 2.1: Speech-to-Text (STT) streaming pipeline (Deepgram / Whisper)
│   ├── [ ] Task 2.2: Text-to-Speech (TTS) natural female voice stream (Cartesia / ElevenLabs)
│   ├── [ ] Task 2.3: Voice Activity Detection (VAD) & barge-in interruption handler
│   └── [ ] Task 2.4: Frontend voice visualizer (pulsing orb/wave) & mic integration
│
└── [ ] Milestone 3: Agentic Tools (Voice Folder Creation & Code Editing)
    ├── [ ] Task 3.1: Hermes-style Tool Registry & ReAct dispatch engine
    ├── [ ] Task 3.2: Filesystem tools (`create_directory`, `create_file`, `list_dir`)
    ├── [ ] Task 3.3: Code editing tools (`read_file`, `edit_code_file`)
    ├── [ ] Task 3.4: Voice command tool execution & audio feedback loop
    └── [ ] Task 3.5: Safety sandbox (restricted workspace execution)
```

---

## 📝 Task Execution History

| Timestamp | Task ID | Description | Status | Output / Files Changed | Notes |
|---|---|---|---|---|---|
| 2026-09-04 20:45 | TASK-000 | Hermes architecture review & PRD generation | Completed | [PRD.md](file:///d:/Projects/QWERTY/PRD.md), [TASK_GUIDE.md](file:///d:/Projects/QWERTY/TASK_GUIDE.md) | Comprehensive architecture and 3-milestone roadmap defined |
| 2026-09-04 20:55 | TASK-001 | Milestone 1: Conversational Core Implementation | Completed | [backend/](file:///d:/Projects/QWERTY/backend), [frontend/](file:///d:/Projects/QWERTY/frontend), [.vscode/](file:///d:/Projects/QWERTY/.vscode), [README.md](file:///d:/Projects/QWERTY/README.md) | Built FastAPI backend with LiteLLM, SSE streaming, Next.js dark glassmorphic UI, StatusOrb, dual-IDE config |
| 2026-09-04 21:05 | TASK-1.7 | Environment setup, LiteLLM Gemini 3.5 Flash update & live test | Completed | [.env](file:///d:/Projects/QWERTY/.env), [config.py](file:///d:/Projects/QWERTY/backend/app/config.py), [page.tsx](file:///d:/Projects/QWERTY/frontend/src/app/page.tsx), [SettingsModal.tsx](file:///d:/Projects/QWERTY/frontend/src/components/SettingsModal.tsx), [dev_backend.bat](file:///d:/Projects/QWERTY/scripts/dev_backend.bat) | Installed backend packages, verified API key with Gemini 3.5 Flash, launched both services |
| 2026-09-04 21:10 | TASK-1.8 | Unified Single-File Runner (`run.py`, `start.bat`) with auto-browser & port-cleanup | Completed | [run.py](file:///d:/Projects/QWERTY/run.py), [start.bat](file:///d:/Projects/QWERTY/start.bat), [run.bat](file:///d:/Projects/QWERTY/run.bat), [agent.py](file:///d:/Projects/QWERTY/backend/app/core/agent.py) | Created unified single-command runner, port-cleaner, and 503-fallback resilience |
| 2026-09-04 21:25 | TASK-1.9 | Scaffolded `QWERTY new` with upgraded Audio-First PRD & Task Guide | Completed | [PRD.md](file:///D:/Projects/QWERTY%20new/PRD.md), [TASK_GUIDE.md](file:///D:/Projects/QWERTY%20new/TASK_GUIDE.md), [README.md](file:///D:/Projects/QWERTY%20new/README.md) | Created `D:\Projects\QWERTY new` with Day-1 audio talk milestone and 4-milestone roadmap |
| 2026-10-07 16:44 | TASK-1.10 | Connected remote origin & pushed full Milestone 1 codebase to GitHub | Completed | [TASK_GUIDE.md](file:///d:/Projects/QWERTY/TASK_GUIDE.md), [run.py](file:///d:/Projects/QWERTY/run.py) | Linked to https://github.com/saumyaaa78/QWERTY and pushed main branch cleanly |

---

## 🛠️ Instructions for Updating This File

1. **Before starting a new task:**
   - Update `Current Active Task` with the Task ID, Description, and planned steps.
   - Update `System Health` or `Status` if blocked.
2. **During the task:**
   - Check off completed sub-tasks in the `Milestone Roadmap & Progress` section.
3. **After completing a task:**
   - Add a new row to the `Task Execution History` table with the timestamp, files changed (with clickable markdown links), and notes.
   - Update `Immediate Next Action`.
