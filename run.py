import os
import sys
import time
import signal
import subprocess
import threading
import webbrowser
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

def get_python_executable():
    venv_py = ROOT_DIR / ".venv" / "Scripts" / "python.exe"
    if venv_py.exists():
        return str(venv_py)
    return sys.executable

def kill_port_owner(port: int):
    """Free up port if lingering process exists from a previous run."""
    try:
        if os.name == "nt":
            cmd = f'netstat -ano | findstr ":{port} "'
            out = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            pids = set()
            for line in out.stdout.splitlines():
                parts = line.strip().split()
                if len(parts) >= 5 and "LISTENING" in parts:
                    pid = parts[-1]
                    if pid != "0" and pid != str(os.getpid()):
                        pids.add(pid)
            for pid in pids:
                try:
                    subprocess.run(f"taskkill /F /PID {pid}", shell=True, capture_output=True)
                except Exception:
                    pass
    except Exception:
        pass

def stream_logs(process, prefix, color_code):
    """Stream process stdout/stderr with branded prefixes."""
    try:
        for line in iter(process.stdout.readline, ""):
            if not line:
                break
            clean = line.rstrip()
            if clean:
                print(f"\033[{color_code}m[{prefix}]\033[0m {clean}")
    except Exception:
        pass

def wait_for_service(url, timeout=20):
    import urllib.request
    start = time.time()
    while time.time() - start < timeout:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "QWERTY-HealthCheck"})
            with urllib.request.urlopen(req, timeout=1.5) as resp:
                if resp.status in (200, 304):
                    return True
        except Exception:
            time.sleep(0.5)
    return False

def main():
    os.system("") # Enable ANSI colors on Windows console
    print("\n" + "=" * 65)
    print("  \033[95m🤖 QWERTY — Autonomous AI Companion & Software Engineer\033[0m")
    print("  \033[90mStarting Full Stack (FastAPI Backend + Next.js Frontend)...\033[0m")
    print("=" * 65 + "\n")

    # 1. Clean up ports 8000 and 3000 if occupied
    print("🔍 Checking ports 8000 and 3000...")
    kill_port_owner(8000)
    kill_port_owner(3000)
    time.sleep(0.5)

    py_exe = get_python_executable()
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"

    # 2. Launch Backend
    print("🚀 Starting FastAPI Backend on http://localhost:8000...")
    backend_proc = subprocess.Popen(
        [py_exe, "run.py"],
        cwd=str(BACKEND_DIR),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        universal_newlines=True
    )

    # 3. Launch Frontend
    print("🚀 Starting Next.js Frontend on http://localhost:3000...")
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=str(FRONTEND_DIR),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        universal_newlines=True
    )

    processes = [backend_proc, frontend_proc]

    # Threads for non-blocking log output
    t_back = threading.Thread(target=stream_logs, args=(backend_proc, "Backend", "36"), daemon=True)
    t_front = threading.Thread(target=stream_logs, args=(frontend_proc, "Frontend", "35"), daemon=True)
    t_back.start()
    t_front.start()

    def cleanup(*args):
        print("\n\n\033[33m🛑 Shutting down QWERTY stack...\033[0m")
        for p in processes:
            try:
                if os.name == "nt":
                    subprocess.run(f"taskkill /F /T /PID {p.pid}", shell=True, capture_output=True)
                else:
                    p.terminate()
            except Exception:
                pass
        print("\033[32m✔ All services stopped cleanly. Goodbye!\033[0m\n")
        sys.exit(0)

    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    # Wait for backend and frontend to be online
    print("⏳ Waiting for services to initialize...")
    backend_ready = wait_for_service("http://localhost:8000/api/health", timeout=15)
    frontend_ready = wait_for_service("http://localhost:3000", timeout=20)

    print("\n" + "=" * 65)
    if backend_ready and frontend_ready:
        print("  \033[92m✔ QWERTY IS LIVE & READY!\033[0m")
    else:
        print("  \033[93m⚠ Services launched (waiting for initial compile)...\033[0m")
    print("  👉 Web App:  \033[96mhttp://localhost:3000\033[0m")
    print("  👉 API Docs: \033[96mhttp://localhost:8000/docs\033[0m")
    print("  👉 Press \033[91mCtrl+C\033[0m in this terminal to stop both servers.")
    print("=" * 65 + "\n")

    # Automatically launch browser
    try:
        webbrowser.open("http://localhost:3000")
    except Exception:
        pass

    try:
        while True:
            time.sleep(1)
            # Check if any process died unexpectedly
            if backend_proc.poll() is not None:
                print("\033[91mBackend process stopped unexpectedly.\033[0m")
                cleanup()
            if frontend_proc.poll() is not None:
                print("\033[91mFrontend process stopped unexpectedly.\033[0m")
                cleanup()
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    main()
