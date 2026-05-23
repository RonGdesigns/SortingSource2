import sys
import asyncio
import uvicorn

# 1. Force the correct Windows Event Loop BEFORE Uvicorn wakes up
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

# 2. Boot the server manually (without the buggy reloader)
if __name__ == "__main__":
    print("🚀 Igniting SortingSource Engine (Windows Subprocess Mode)...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000)