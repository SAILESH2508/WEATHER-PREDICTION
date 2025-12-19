import os
import sys
import subprocess
import threading
import time
import webbrowser

def run_backend():
    print("🚀 Starting Backend (Waitress)...")
    # Use cwd argument instead of os.chdir to avoid race conditions
    subprocess.run([sys.executable, '-m', 'waitress', '--listen=127.0.0.1:8000', 'weather_system.wsgi:application'], cwd='backend')

def run_frontend():
    print("🚀 Starting Frontend (Preview)...")
    # Use shell=True for Windows 'npm' resolution
    subprocess.run(['npm', 'run', 'preview'], cwd='frontend', shell=True)

if __name__ == "__main__":
    print("🌍 Simulating Production Environment...")
    
    # Start Backend in thread
    backend_thread = threading.Thread(target=run_backend)
    backend_thread.daemon = True
    backend_thread.start()
    
    # Give backend a moment
    time.sleep(2)
    
    # Start Frontend
    frontend_thread = threading.Thread(target=run_frontend)
    frontend_thread.daemon = True
    frontend_thread.start()
    
    print("✅ Servers started. Press Ctrl+C to stop.")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping servers...")
