@echo off
echo Starting QWERTY Backend (FastAPI)...
cd /d "%~dp0..\backend"
if exist "..\.venv\Scripts\python.exe" (
    ..\.venv\Scripts\python.exe run.py
) else (
    python run.py
)
pause
