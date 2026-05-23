import sys
import os
import multiprocessing

# ==========================================
# 1. THE ULTIMATE PLAYWRIGHT PATH FIX
# ==========================================
APPDATA_DIR = os.path.join(os.environ.get('APPDATA', os.path.expanduser('~')), 'SortingSource')
BROWSER_DIR = os.path.join(APPDATA_DIR, 'browsers')
os.makedirs(APPDATA_DIR, exist_ok=True)
os.makedirs(BROWSER_DIR, exist_ok=True)
os.environ["PLAYWRIGHT_BROWSERS_PATH"] = BROWSER_DIR

# ==========================================
# 2. THE PYINSTALLER PATH FIX
# ==========================================
if hasattr(sys, '_MEIPASS'):
    os.chdir(sys._MEIPASS)
    sys.path.append(sys._MEIPASS)

# ==========================================
# 3. THE --NOCONSOLE CRASH FIX
# ==========================================
# This MUST happen before any print() statements execute!
if sys.stdout is None:
    sys.stdout = open(os.devnull, "w")
if sys.stderr is None:
    sys.stderr = open(os.devnull, "w")

# ==========================================
# 4. PYINSTALLER PACKING LIST
# ==========================================
import fastapi
from fastapi import FastAPI, HTTPException, Request, Response, APIRouter
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn
import starlette
import sqlite3
import asyncio
import aiohttp
import requests
import re
import json
from playwright.async_api import async_playwright
import smtplib
import imaplib
import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import decode_header
import time
import traceback
import uuid
import hashlib
import twilio
from twilio.rest import Client

# ==========================================
# 5. START THE ENGINE (MANUAL OVERRIDE)
# ==========================================
import main

if __name__ == "__main__":
    # Required for PyInstaller when using Playwright/Uvicorn
    multiprocessing.freeze_support() 
    
    # 1. Manually run your database fix
    try:
        if hasattr(main, 'fix_database'):
            main.fix_database()
    except Exception:
        pass

    # 2. Manually trigger Playwright to ensure browsers exist
    try:
        if hasattr(main, 'ensure_playwright_browsers'):
            main.ensure_playwright_browsers()
    except Exception:
        pass

    # 3. Start the Uvicorn Server! (log_config=None helps prevent crashes)
    uvicorn.run(main.app, host="127.0.0.1", port=8000, log_config=None)