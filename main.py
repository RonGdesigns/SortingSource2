import sys
import os

# ==========================================
# 0. LOAD .ENV.LOCAL (FOR SAAS CLOUD MODE)
# ==========================================
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env.local')
if os.path.exists(env_path):
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if '=' in line and not line.startswith('#'):
                k, v = line.split('=', 1)
                os.environ[k] = v
# ==========================================
# 1. THE ULTIMATE PLAYWRIGHT PATH FIX
# ==========================================
# Force Playwright to store the browser in your permanent AppData folder
if os.environ.get("RENDER"):
    APPDATA_DIR = "/var/data"
    if not os.path.exists(APPDATA_DIR):
        APPDATA_DIR = "/app/data"
    if not os.path.exists(APPDATA_DIR):
        os.makedirs(APPDATA_DIR, exist_ok=True)
    # On Render, we use the default baked-in Playwright browser path from the Docker image
else:
    APPDATA_DIR = os.path.join(os.environ.get('APPDATA', os.path.expanduser('~')), 'SortingSource')
    BROWSER_DIR = os.path.join(APPDATA_DIR, 'browsers')
    if not os.path.exists(APPDATA_DIR):
        os.makedirs(APPDATA_DIR, exist_ok=True)
    if not os.path.exists(BROWSER_DIR):
        os.makedirs(BROWSER_DIR, exist_ok=True)
    os.environ["PLAYWRIGHT_BROWSERS_PATH"] = BROWSER_DIR

# ==========================================
# 2. THE PYINSTALLER PATH FIX
# ==========================================
if hasattr(sys, '_MEIPASS'):
    os.chdir(sys._MEIPASS)
    sys.path.append(sys._MEIPASS)


from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import sqlite3
import asyncio
import aiohttp
import re
from playwright.async_api import async_playwright
import json
import smtplib
import imaplib
import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import time
import traceback
import uuid
import hashlib
import requests
import imaplib
import email
from email.header import decode_header
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

# 1. Define the incoming request structure
class IMAPRequest(BaseModel):
    email: str
    password: str
    imap_server: str = "imap.gmail.com"
    
app = FastAPI()

# 2. Add the route to your FastAPI app
@app.post("/api/check-replies")
async def check_replies(req: IMAPRequest):
    try:
        # Secure SSL connection
        mail = imaplib.IMAP4_SSL(req.imap_server)
        mail.login(req.email, req.password)
        mail.select("inbox")

        # Search for all emails
        status_, messages = mail.search(None, 'ALL')
        email_ids = messages[0].split()
        
        # Get the 10 most recent
        latest_10 = email_ids[-10:]
        replies = []

        for e_id in reversed(latest_10):
            res_, msg_data = mail.fetch(e_id, "(RFC822)")
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    
                    # Decode Subject
                    subject, encoding = decode_header(msg["Subject"])[0]
                    if isinstance(subject, bytes):
                        subject = subject.decode(encoding if encoding else "utf-8")
                    
                    # Decode Sender
                    sender, encoding = decode_header(msg.get("From"))[0]
                    if isinstance(sender, bytes):
                        sender = sender.decode(encoding if encoding else "utf-8")
                    
                    # Extract plain text body
                    body = ""
                    if msg.is_multipart():
                        for part in msg.walk():
                            if part.get_content_type() == "text/plain":
                                body = part.get_payload(decode=True).decode()
                                break
                    else:
                        body = msg.get_payload(decode=True).decode()

                    replies.append({
                        "date": msg.get("Date"),
                        "sender": sender,
                        "subject": subject,
                        "body": body[:1000]
                    })

        mail.logout()
        return {"replies": replies}

    except imaplib.IMAP4.error:
        raise HTTPException(status_code=401, detail="IMAP Authentication failed. Check App Password.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# (I removed the google.generativeai import since Google is depreciating it and it was throwing that warning, but if you need it later, just add it back!)

# ==========================================
# 4. THE FORCED BROWSER DOWNLOADER
# ==========================================
def ensure_playwright_browsers():
    import subprocess
    import os
    
    # 1. Define the path
    if os.environ.get("RENDER"):
        return # Skip this entirely on Render since it's baked into the Docker image
        
    _appdata = os.path.join(os.environ.get('APPDATA', os.path.expanduser('~')), 'SortingSource')
    _browser_dir = os.path.join(_appdata, 'browsers')
    os.environ["PLAYWRIGHT_BROWSERS_PATH"] = _browser_dir
    
    # 2. Check if the Chromium folder already exists
    # We look for the 'chromium' folder inside the browser directory
    if os.path.exists(_browser_dir) and len(os.listdir(_browser_dir)) > 0:
        print(f">>> BROWSER DETECTED: Skipping download check.")
        return

    print(f"Targeting Browser Directory: {BROWSER_DIR}")
    
    try:
        print(">>> NO BROWSER FOUND. Starting download (this will take a moment)...")
        # We run this with shell=True and NO capture so you can see if it moves
        result = subprocess.run(
            ["npx", "playwright", "install", "chromium"],
            capture_output=True,
            text=True,
            shell=True,
            encoding="utf-8", # <--- Add this magic line
            errors="ignore"   # <--- And this one as a backup
        )
        print("> Browser check/install successful.")

    except Exception as e:
        print(f"\n!!! BROWSER INSTALL ERROR: {str(e)}")

# --- INITIALIZE APP ---
app = FastAPI(title="SortingSource Core Engine")

# ==========================================
# 5. "GOD MODE" CORS MIDDLEWARE
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=".*",  
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def force_cors_headers(request: Request, call_next):
    if request.method == "OPTIONS":
        return Response(status_code=200, headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        })
    
    try:
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    except Exception as e:
        import traceback
        print("INTERNAL CRASH:", traceback.format_exc())
        return JSONResponse(
            status_code=500, 
            content={"detail": "Engine crashed", "error": str(e)},
            headers={"Access-Control-Allow-Origin": "*"}
        )

# ==========================================
# 6. ENTERPRISE DATA PATHING
# ==========================================
SECRET_SALT = "OutboundAI_Enterprise_2024"

DB_FILE = os.path.join(APPDATA_DIR, "outbound_crm.db")
CONFIG_FILE = os.path.join(APPDATA_DIR, "config.json")

def save_config(api_key: str):
    with open(CONFIG_FILE, "w") as f:
        json.dump({"api_key": api_key}, f)

def load_config():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, "r") as f:
            return json.load(f).get("api_key", "")
    return ""
LICENSE_FILE = os.path.join(APPDATA_DIR, "license.dat")

GUMROAD_PRODUCTS = {
    "OrrFSc94F9HJITilrZZcIg==": 1,
    "v12Klsupttp1EF5FtA6gRA==": 5,
    "KxT76gzj6d75FgwzqUtaLw==": 10
}

def get_db_conn():
    conn = sqlite3.connect(DB_FILE, timeout=15, check_same_thread=False)
    conn.execute('PRAGMA journal_mode=WAL;')
    return conn

def get_hw_id():
    return str(uuid.getnode())

def generate_license_hash(license_key, hw_id):
    raw_string = f"{license_key}-{hw_id}-{SECRET_SALT}"
    return hashlib.sha256(raw_string.encode()).hexdigest()

# --- DATA BLUEPRINTS ---
class LicenseCheck(BaseModel):
    license_key: str

class HuntRequest(BaseModel):
    niche: str
    city: str
    region: str
    zip_code: Optional[str] = "Optional" 
    intl_postal: Optional[str] = ""
    country: Optional[str] = ""
    max_results: int
    api_key: str
    campaign_name: str
    clear_table: bool = False
    use_blacklist: bool = True  # The "Skip Known" Toggle
    international: bool = False 
    power_search: bool = False   # Keeping your Power Search logic
    save_key: bool = False
    places_model_override: Optional[str] = "v1"
    

class ReplyScanRequest(BaseModel):
    app_password: str
    campaign_name: str

class SendEmailRequest(BaseModel):
    target_email: str
    target_name: Optional[str] = "Valued Business" # Default if missing
    subject: str
    body: str
    sender_email: str
    app_password: str
    smtp_server: Optional[str] = "smtp.gmail.com"  # Default to Gmail
    smtp_port: Optional[int] = 587                 # Default to Gmail port
    campaign_name: str
    
class SendSMSRequest(BaseModel):
    target_phone: str
    body: str
    twilio_sid: str
    twilio_token: str
    from_number: str
    campaign_name: str
    twilio_version: Optional[str] = "2010-04-01"

# --- API ENDPOINTS ---
@app.post("/api/license/verify")
async def verify_license(data: LicenseCheck):
    hw_id = get_hw_id()
    url = "https://api.gumroad.com/v2/licenses/verify"
    key_valid = False
    found_tier = ""
    
    for prod_id, max_seats in GUMROAD_PRODUCTS.items():
        payload = {"product_id": prod_id, "license_key": data.license_key}
        try:
            res = requests.post(url, data=payload)
            response_json = res.json()
            if response_json.get("success") == True:
                uses = response_json.get("uses", 0)
                if uses > max_seats:
                    raise HTTPException(status_code=403, detail=f"License seat limit ({max_seats}) reached.")
                key_valid = True
                found_tier = prod_id
                break
        except Exception:
            continue

    if key_valid:
        final_hash = generate_license_hash(data.license_key, hw_id)
        with open(LICENSE_FILE, "w") as f:
            json.dump({"key": data.license_key, "hash": final_hash, "tier": found_tier}, f)
        return {"success": True, "local_hash": final_hash}
    else:
        raise HTTPException(status_code=401, detail="Invalid License Key")

# --- THE PLAYWRIGHT SCRAPER (CLEANED) ---
async def extract_and_audit(context, url):
    # --- 1. PRE-FLIGHT CHECK ---
    if not url or url in ['No Website Found', 'N/A', '', 'None']: 
        return {
            "Email": "N/A", "Instagram": "N/A", "Facebook": "N/A", 
            "Twitter": "N/A", "TikTok": "N/A"
        }
    
    # --- 2. UPDATED BLACKLIST ---
    # This filters out platform-specific "fake" emails and generic hosting addresses
    BLACKLIST = [
        "example.com", "sentry.io", "domain.com", "wix.com", "squarespace.com", "wordpress.com", 
        "shopify.com", "godaddy.com", "mailchimp.com", "constantcontact.com", "sendgrid.com", 
        "mailgun.com", "woocommerce.com", "weebly.com", "jimdo.com", "strikingly.com", 
        "webflow.com", "bigcartel.com", "volusion.com", "3dcart.com", "squareup.com", 
        "yola.com", "webnode.com", "site123.com", "ucraft.com", "simplesite.com", 
        "gator.com", "bluehost.com", "hostgator.com", "inmotionhosting.com", "a2hosting.com", 
        "dreamhost.com", "greenhost.com", "1and1.com", "hostinger.com", "namecheap.com", 
        "ovh.com", "fastly.com", "cloudflare.com", "stackpath.com", "akamai.com", 
        "cdn77.com", "maxcdn.com", "cloudfront.net", "leaflet", "bootstrap", "template", 
        "support@web", "png", "jpg", "email@email.com", "sentry.wixpress.com", "@company.com", 
        "@business.com", "@email.com", "@example.com", "@test.com", "@demo.com", 
        "@sample.com", "@placeholder.com", "@18.3.1", "200..800", "sentry-next.wixpress.com"
    ]

    async def scan_page(page_url):
        page = await context.new_page()
        try:
            # Block heavy assets to speed up extraction
            await page.route("**/*", lambda route: route.abort() 
                if route.request.resource_type in ["image", "media", "font", "stylesheet"] 
                else route.continue_())
            
            await page.goto(page_url, timeout=8000, wait_until="domcontentloaded")
            html_text = await page.content()
            
            # Find all emails and filter them against the blacklist
            found_emails = set(re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', html_text))
            valid_emails = [e for e in found_emails if not any(b in e.lower() for b in BLACKLIST)]
            
            # Extract all links for social handle detection
            hrefs = await page.evaluate('() => Array.from(document.querySelectorAll("a")).map(a => a.href)')
            
            return {"emails": valid_emails, "hrefs": hrefs}
        except: 
            return None
        finally: 
            await page.close()

    # --- 3. EXECUTION ---
    # Step 1: Scan Homepage
    data = await scan_page(url)
    if not data:
        return {"Email": "N/A", "Instagram": "N/A", "Facebook": "N/A", "Twitter": "N/A", "TikTok": "N/A"}

    # Step 2: Deep Scan for Contact/About Page if homepage email is missing
    final_email = data["emails"][0] if data["emails"] else "N/A"
    if final_email == "N/A":
        contact_link = next((l for l in data["hrefs"] if any(k in l.lower() for k in ["contact", "about", "reach", "support"])), None)
        if contact_link:
            target_url = contact_link if contact_link.startswith("http") else url.rstrip("/") + "/" + contact_link.lstrip("/")
            contact_data = await scan_page(target_url)
            if contact_data and contact_data["emails"]:
                final_email = contact_data["emails"][0]

    # --- 4. DATA SYNTHESIS ---
    return {
        "Email": final_email,
        "Instagram": next((l for l in data["hrefs"] if "instagram.com" in l.lower()), "N/A"),
        "Facebook": next((l for l in data["hrefs"] if "facebook.com" in l.lower()), "N/A"),
        "Twitter": next((l for l in data["hrefs"] if "twitter.com" in l.lower() or "x.com" in l.lower()), "N/A"),
        "TikTok": next((l for l in data["hrefs"] if "tiktok.com" in l.lower()), "N/A")
    }

# --- UPDATED HUNT ENDPOINT ---
@app.post("/api/hunt")
async def execute_hunt(request: HuntRequest):
    print(f"\n>>> [HUNTER] Launching Scan. Power Search: {'ON' if request.power_search else 'OFF'}")
    try:
        # --- 1. CLEAN QUERY PREP ---
        niche = request.niche.strip()
        city = request.city.strip()
        region = request.region.strip()
        country = request.country.strip()
        postal = (request.intl_postal or request.zip_code or "").strip()

        search_query = f"{niche} in {city}, {region}, {country} {postal}".strip()
        search_query = search_query.replace(", ,", ",").replace("  ", " ")
        print(f">>> [DEBUG] TARGET QUERY: {search_query}")

        # --- 2. DATABASE & BLACKLIST LOGIC (THE FIX) ---
        conn = get_db_conn()
        cursor = conn.cursor()
        
        # Ensure table exists
        cursor.execute('''CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            campaign_name TEXT, Name TEXT, Rating TEXT, Reviews INTEGER, 
            Website TEXT, Email TEXT, Instagram TEXT, Facebook TEXT, 
            Twitter TEXT, TikTok TEXT, Phone TEXT, Address TEXT, 
            Maps_Link TEXT, Drafted_Email TEXT, 
            UNIQUE(Name, Website)
        )''')
        
        # RESET LOGIC: Only skip known names if the toggle is ON
        existing_names = set()
        if request.use_blacklist:
            cursor.execute("SELECT Name FROM leads WHERE campaign_name=?", (request.campaign_name,))
            existing_names = {row[0] for row in cursor.fetchall()}
            print(f">>> [LOG] Skip Known is ACTIVE. Filtering {len(existing_names)} targets.")
        else:
            print(">>> [LOG] Skip Known is INACTIVE. Full refresh mode.")

        # --- 3. GOOGLE PLACES FETCHING (Power Search Logic) ---
        # Hard lock max results to 60 due to API pagination limits and performance constraints
        safe_max = min(60, request.max_results)
        fetch_goal = 40 if request.power_search else safe_max
        raw_pool = []
        next_token = None
        
        api_version = request.places_model_override or "v1"
        url = f'https://places.googleapis.com/{api_version}/places:searchText'
        google_key = request.api_key.strip() if request.api_key else os.environ.get("GOOGLE_API_KEY", "")
        headers = {
            'Content-Type': 'application/json', 
            'X-Goog-Api-Key': google_key, 
            'X-Goog-FieldMask': 'places.displayName,places.websiteUri,places.rating,places.userRatingCount,places.formattedAddress,places.nationalPhoneNumber,places.googleMapsUri,nextPageToken'
        }

        async with aiohttp.ClientSession() as session:
            while len(raw_pool) < fetch_goal:
                payload = {'textQuery': search_query, 'pageSize': 20}
                if next_token: payload['pageToken'] = next_token

                async with session.post(url, headers=headers, json=payload) as res:
                    data = await res.json()
                    if res.status != 200:
                        print(f"!!! GOOGLE API ERROR: {data}")
                        raise HTTPException(status_code=res.status, detail=f"Google Places API Error: {data.get('error', {}).get('message', str(data))}")
                    places = data.get('places', [])
                    if not places: break

                    for p in places:
                        name = p.get('displayName', {}).get('text', 'N/A')
                        # Filter against the existing_names set (which is empty if blacklist is OFF)
                        if name not in existing_names:
                            raw_pool.append(p)
                        if len(raw_pool) >= fetch_goal: break
                    
                    next_token = data.get('nextPageToken')
                    if not next_token or len(raw_pool) >= fetch_goal: break
                    await asyncio.sleep(1.5)

        if not raw_pool:
            conn.close()
            return {"status": "success", "leads_found": 0}

        # --- 4. PARALLEL AUDIT ---
        # Reduce concurrency on Render to prevent memory thrashing on small instances
        concurrent_limit = 5 if os.environ.get("RENDER") else 20
        sem = asyncio.Semaphore(concurrent_limit) 

        async def throttled_audit(context, pl):
            async with sem:
                url = pl.get('websiteUri', 'N/A')
                audit = await extract_and_audit(context, url)
                return {**pl, "audit": audit}

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context()
            tasks = [throttled_audit(context, pl) for pl in raw_pool]
            results = await asyncio.gather(*tasks)
            await browser.close()

        # --- 5. POWER SORT & DATA MAPPING ---
        if request.power_search:
            # Prioritize leads where an email was actually found
            results.sort(key=lambda x: 0 if x["audit"]["Email"] and x["audit"]["Email"] != "N/A" else 1)
        
        final_leads = results[:safe_max]

        save_data = []
        for item in final_leads:
            pl = item
            audit = item["audit"]
            save_data.append({
                "campaign_name": request.campaign_name,
                "Name": pl.get('displayName', {}).get('text', 'N/A'),
                "Rating": str(pl.get('rating', 'N/A')),
                "Reviews": pl.get('userRatingCount', 0),
                "Website": pl.get('websiteUri', 'N/A'),
                "Email": audit["Email"],
                "Instagram": audit["Instagram"],
                "Facebook": audit["Facebook"],
                "Twitter": audit["Twitter"],
                "TikTok": audit.get("TikTok", "N/A"),
                "Phone": pl.get('nationalPhoneNumber', 'N/A'),
                "Address": pl.get('formattedAddress', 'N/A'),
                "Maps_Link": pl.get('googleMapsUri', 'N/A'),
                "Drafted_Email": ""
            })

        # --- 6. FINAL SAVE (REPLACE INSTEAD OF IGNORE) ---
        # INSERT OR REPLACE ensures that if you wipe a campaign and re-run it, 
        # or if you turn off Skip Known, the data updates correctly.
        cursor.executemany('''
            INSERT OR REPLACE INTO leads (
                campaign_name, Name, Rating, Reviews, Website, Email, 
                Instagram, Facebook, Twitter, TikTok, Phone, Address, 
                Maps_Link, Drafted_Email
            ) VALUES (
                :campaign_name, :Name, :Rating, :Reviews, :Website, :Email, 
                :Instagram, :Facebook, :Twitter, :TikTok, :Phone, :Address, 
                :Maps_Link, :Drafted_Email
            )''', save_data)
        
        conn.commit()
        conn.close()
        
        return {"status": "success", "leads_found": len(save_data)}

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(f"!!! CRITICAL FAILURE:\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=traceback.format_exc())
    
class WipeRequest(BaseModel):
    campaign_name: str

@app.post("/api/wipe")
async def wipe_campaign(request: WipeRequest):
    try:
        conn = get_db_conn()
        cursor = conn.cursor()
        # This deletes all leads for the specific campaign
        cursor.execute("DELETE FROM leads WHERE campaign_name=?", (request.campaign_name,))
        conn.commit()
        conn.close()
        print(f">>> [DATABASE] Wiped campaign: {request.campaign_name}")
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class DeleteLeadRequest(BaseModel):
    campaign_name: str
    lead_name: str

@app.post("/api/delete-lead")
async def delete_lead(request: DeleteLeadRequest):
    try:
        conn = get_db_conn()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM leads WHERE campaign_name=? AND Name=?", (request.campaign_name, request.lead_name))
        conn.commit()
        conn.close()
        print(f">>> [DATABASE] Deleted lead {request.lead_name} from campaign: {request.campaign_name}")
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/leads/{campaign_name}")
def get_campaign_leads(campaign_name: str):
    try:
        conn = get_db_conn()
        conn.execute('''CREATE TABLE IF NOT EXISTS leads 
                       (id INTEGER PRIMARY KEY AUTOINCREMENT, campaign_name TEXT, Name TEXT, 
                        Rating TEXT, Reviews INTEGER, Website TEXT, Email TEXT, 
                        Instagram TEXT, Facebook TEXT, Twitter TEXT, 
                        Phone TEXT, Address TEXT, Maps_Link TEXT, Drafted_Email TEXT, UNIQUE(Name, Website))''')
        
        conn.row_factory = sqlite3.Row 
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM leads WHERE campaign_name=?", (campaign_name,))
        leads = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return {"leads": leads}
    except Exception as e:
        print(f"DATABASE ERROR: {e}")
        return {"leads": [], "error": str(e)}
    
from pydantic import BaseModel

# --- 1. Update the Data Model ---
class PitchRequest(BaseModel):
    business_name: str
    lead_email: str
    your_name: str
    profession: str
    credibility:  Optional[str] = ""
    core_offer: str
    easy_cta: str
    number: Optional[str] = ""
    tone: str
    ai_provider: str
    gemini_key: Optional[str] = ""
    openai_key: Optional[str] = ""
    huggingface_key: Optional[str] = ""
    gemini_model: Optional[str] = "gemini-3.5-flash" # Upgraded to newest model
    openai_model: Optional[str] = "gpt-5.4-mini"    # New field with default
    huggingface_model: Optional[str] = ""
    campaign_name: str
    use_custom_mode: bool = False
    custom_directives: Optional[str] = ""
    max_words: int = 80

@app.post("/api/generate-pitch")
async def generate_pitch(request: PitchRequest):
    print(f">>> [DEBUG] Custom Mode Active: {request.use_custom_mode}")
    
    try:
        # --- 1. PROMPT SELECTION (KEEPING YOUR WORDING EXACTLY) ---
        if request.use_custom_mode:
            prompt = f"""
            TASK: {request.custom_directives}
            
            CONTEXT FOR RECIPIENT:
            - Target Business: {request.business_name}
            - Sender Name: {request.your_name}
            - Sender Profession: {request.profession}
            - Contact Info: {request.number}
            - Preferred Tone: {request.tone}
            
            STRICT OUTPUT RULES:
            1. Max Length: {request.max_words} words.
            2. Output ONLY the email/message body text.
            3. Do NOT include subject lines, placeholders, or conversational filler.
            """
        else:
            # YOUR ORIGINAL ALGORITHM - UNTOUCHED
            prompt = f"""
            TASK: You are an AI assistant writing a 1-to-1, direct outreach email for a user.
            
            SENDER: {request.your_name}, a {request.profession}.
            RECIPIENT: {request.business_name}.
            TONE: {request.tone}

            MESSAGE CONTENT:
            1."Start the email with a casual, one-sentence observation about {request.business_name} doing great things lately, and state that this positive momentum is the reason I decided to drop them a note. Use diverse phrasing for each generation—sometimes focus on their 'vibe', sometimes on their 'growth', or sometimes on their 'innovation'."
            2. Introduce me and my background by combining my role as a {request.profession} with my track record of {request.credibility}. Crucial constraint: Do NOT use the robotic formula 'I am a [profession] who has helped...'. Instead, weave these two facts together naturally. Vary the syntax every time: sometimes lead with the profession, sometimes lead with the results, and sometimes frame it as 'In my experience as a...'."
            3.Build directly off my previous sentence about my background to introduce {request.core_offer}. Connect the offer to a highly specific, AI-generated business outcome (e.g., driving more walk-ins, reducing wasted ad spend). Constraint: Ensure the transition feels effortless. Use varied verbs and structures so it never sounds like a generic pitch template, and always ensure the bottom-line benefit is front and center in the same sentence as the offer."
            4. Seamlessly integrate {request.easy_cta} into a casual, wrap-up question. Make it sound like a natural, confident end to a conversation. Instruct the prospect on the next step without using any desperate language like 'please reply soon'. Use highly varied, conversational phrasing for each generation, such as 'Any interest in X?', 'Worth exploring?', or 'Should we bounce some ideas around?'"

            STRICT LIMITS:
            - ZERO corporate jargon, buzzwords, or marketing fluff. Strictly avoid words like 'elevate', 'synergy', 'unlock', 'delve', 'supercharge', or 'innovative'.
            - Reading Level: 8th grade. Write conversationally, as if texting a colleague.
            - MAXIMUM {request.max_words} words. Keep sentences punchy and mobile-friendly.
            - Do NOT use marketing fluff like 'elevate your brand', 'synergy', or 'unlock growth'. 
            -: Speak ONLY in terms of tangible business outcomes (saving time, reducing costs, or increasing efficiency).
            - Output ONLY the exact text of the email body. Do NOT include a subject line, do NOT use placeholders like [Your Name], and do NOT include conversational filler like "Here is the email:".
            """

        # --- 2. MODEL DEFINITION (MOVED OUTSIDE TO PREVENT FRITZING) ---
        g_model = request.gemini_model if request.gemini_model and request.gemini_model.strip() else "gemini-3.5-flash"
        o_model = request.openai_model if request.openai_model and request.openai_model.strip() else "gpt-5.4-mini"
        hf_model = request.huggingface_model if request.huggingface_model and request.huggingface_model.strip() else "Qwen/Qwen2.5-72B-Instruct"
        
        # --- 3. EXECUTION ---
        if request.ai_provider == "openai":
            url = "https://api.openai.com/v1/chat/completions"
            headers = {"Authorization": f"Bearer {request.openai_key}", "Content-Type": "application/json"}
            payload = {"model": o_model, "messages": [{"role": "user", "content": prompt}]}
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            res_json = response.json()
            if response.status_code != 200 or "error" in res_json:
                raise Exception(f"OpenAI Error: {res_json.get('error', {}).get('message', str(res_json))}")
            generated_text = res_json['choices'][0]['message']['content']
        elif request.ai_provider == "huggingface":
            # 1. Hugging Face's OpenAI-Compatible Router
            url = "https://router.huggingface.co/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {request.huggingface_key}", 
                "Content-Type": "application/json"
            }
            payload = {
                "model": hf_model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": request.max_words * 5
            }
            
            # 2. Execute Request
            response = requests.post(url, json=payload, headers=headers, timeout=60)
            
            # 3. Catch actual server errors
            if response.status_code != 200:
                print(f"!!! HF API ERROR: {response.text}")
                raise Exception(f"Hugging Face API Error: {response.text}")
            
            # 4. THE FIX: Drill down into the JSON to grab ONLY the written email
            # This is the ONLY parsing you need now.
            generated_text = response.json()['choices'][0]['message']['content']
                
        else:
            # Default to Gemini
            gemini_key = request.gemini_key if request.gemini_key else os.environ.get("GEMINI_API_KEY", "")
            url = f"https://generativelanguage.googleapis.com/v1/models/{g_model}:generateContent?key={gemini_key}"
            payload = {"contents": [{"parts": [{"text": prompt}]}]}
            response = requests.post(url, json=payload, timeout=30)
            res_json = response.json()
            if response.status_code != 200 or "error" in res_json:
                raise Exception(f"Gemini Error: {res_json.get('error', {}).get('message', str(res_json))}")
            
            if "candidates" not in res_json:
                block_reason = res_json.get("promptFeedback", {}).get("blockReason", "Unknown")
                raise Exception(f"Gemini API returned an invalid response (Blocked: {block_reason}). Raw: {res_json}")
                
            try:
                generated_text = res_json['candidates'][0]['content']['parts'][0]['text']
            except (KeyError, IndexError):
                raise Exception(f"Gemini generated a response but no text was found. Safety Reason: {res_json['candidates'][0].get('finishReason', 'Unknown')}")

        # --- 4. DATABASE & RETURN ---
        # --- 4. DATABASE & RETURN ---
        # The AI naturally signs off, so we just take its exact output.
        final_email = generated_text.strip()

        conn = get_db_conn()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE leads SET Drafted_Email=? WHERE Name=? AND campaign_name=?",
            (final_email, request.business_name, request.campaign_name)
        )
        conn.commit()
        conn.close()
        
        return {"status": "success", "pitch": final_email}

    except Exception as e:
        print(f"!!! ENGINE ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
class UpdateDraftRequest(BaseModel):
    campaign_name: str
    lead_name: str
    draft_body: str

@app.post("/api/update-draft")
async def update_draft(request: UpdateDraftRequest):
    try:
        conn = get_db_conn()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE leads SET Drafted_Email=? WHERE Name=? AND campaign_name=?",
            (request.draft_body, request.lead_name, request.campaign_name)
        )
        conn.commit()
        conn.close()
        return {"status": "success"}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/scan_replies")
async def scan_replies(request: ReplyScanRequest):
    try:
        conn = get_db_conn()
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='leads'")
        if not cursor.fetchone():
            return {"status": "success", "replies_found": 0}

        cursor.execute("SELECT Email FROM leads WHERE campaign_name=?", (request.campaign_name,))
        tracked_emails = [row[0] for row in cursor.fetchall() if row[0] != "N/A"]
        
        if not tracked_emails:
            return {"status": "success", "replies_found": 0}

        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(request.email, request.app_password)
        mail.select("inbox")
        _, data = mail.search(None, 'UNSEEN')
        replies_found = 0

        for num in data[0].split():
            _, msg_data = mail.fetch(num, "(RFC822)")
            raw_email = msg_data[0][1]
            msg = email.message_from_bytes(raw_email)
            sender_raw = msg.get("From")
            if sender_raw:
                extracted_emails = re.findall(r'[\w\.-]+@[\w\.-]+', sender_raw)
                if extracted_emails:
                    sender_email = extracted_emails[0]
                    if sender_email in tracked_emails:
                        cursor.execute("UPDATE leads SET Drafted_Email='🔥 REPLIED' WHERE Email=? AND campaign_name=?", (sender_email, request.campaign_name))
                        replies_found += 1

        conn.commit()
        conn.close()
        mail.logout()
        return {"status": "success", "replies_found": replies_found}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/send-email")
def send_email(request: SendEmailRequest):
    print(f">>> [DISPATCH] Attempting email to: {request.target_email}")
    try:
        msg = MIMEMultipart()
        msg['From'] = request.sender_email
        msg['To'] = request.target_email
        msg['Subject'] = request.subject
        msg.attach(MIMEText(request.body, 'plain'))
        
        # Use defaults if not provided in request
        server_addr = request.smtp_server or "smtp.gmail.com"
        server_port = request.smtp_port or 587

        server = smtplib.SMTP(server_addr, server_port)
        server.starttls()
        server.login(request.sender_email, request.app_password)
        server.send_message(msg)
        server.quit()
        
        # LOGGING TO THE CORRECT DB
        conn = get_db_conn()
        conn.execute('''CREATE TABLE IF NOT EXISTS logs 
                       (date_sent TEXT, business_name TEXT, email_sent_to TEXT, email_body TEXT, status TEXT)''')
        
        conn.execute("INSERT INTO logs (date_sent, business_name, email_sent_to, email_body, status) VALUES (?, ?, ?, ?, ?)", 
                     (time.strftime("%Y-%m-%d %H:%M:%S"), request.target_name, request.target_email, request.body, "Sent"))
        
        # This updates the status so the UI shows "✅ SENT"
        conn.execute("UPDATE leads SET Drafted_Email='✅ SENT' WHERE campaign_name=? AND Email=?", 
                     (request.campaign_name, request.target_email))
        
        conn.commit()
        conn.close()
        print(f">>> [SUCCESS] Email delivered to {request.target_email}")
        return {"status": "success"}
        
    except Exception as e:
        print(f"!!! SMTP FAILURE: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    
from twilio.rest import Client

app.post("/api/send-sms")
async def send_sms(request: SendSMSRequest):
    print(f">>> [SMS] Dispatching via version: {request.twilio_version}")
    try:
        # Note: Most Twilio SDK features are version-stable, but you can 
        # use this version string for logging or custom URL construction if needed.
        client = Client(request.twilio_sid, request.twilio_token)
        
        # Send the message
        message = client.messages.create(
            body=request.body,
            from_=request.from_number,
            to=request.target_phone
        )

        # Update the database so the UI shows "📱 SMS SENT"
        conn = get_db_conn()
        conn.execute(
            "UPDATE leads SET Drafted_Email='📱 SMS SENT' WHERE campaign_name=? AND Phone=?", 
            (request.campaign_name, request.target_phone)
        )
        conn.commit()
        conn.close()

        return {"status": "success", "sid": message.sid}
    except Exception as e:
        print(f"!!! SMS FAILURE: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Twilio Error: {str(e)}")

@app.get("/api/logs")
def get_email_logs():
    try:
        conn = get_db_conn()
        conn.row_factory = sqlite3.Row
        conn.execute('''CREATE TABLE IF NOT EXISTS logs (date_sent TEXT, business_name TEXT, email_sent_to TEXT, email_body TEXT, status TEXT)''')
        logs = [dict(r) for r in conn.execute("SELECT * FROM logs ORDER BY date_sent DESC").fetchall()]
        conn.close()
        return {"logs": logs}
    except Exception:
        return {"logs": []}

@app.get("/api/config/api-key")
async def get_saved_api_key():
    return {"api_key": load_config()}

if __name__ == "__main__":
    import multiprocessing
    multiprocessing.freeze_support()
    
    import uvicorn
    
    print("--- CHECKPOINT 1: Engine Started ---")
    
    print("--- CHECKPOINT 2: Checking/Downloading Browsers (This may take a moment) ---")
    ensure_playwright_browsers()
    
    print("--- CHECKPOINT 3: Browser check complete ---")
    
    print("--- CHECKPOINT 4: Launching Uvicorn on Port 8000 ---")
    uvicorn.run(app, host="127.0.0.1", port=8000, log_config=None)

    import sqlite3
conn = sqlite3.connect("leads.db")
try:
    conn.execute("ALTER TABLE leads ADD COLUMN Drafted_Email TEXT")
    print(">>> Fixed: Added Drafted_Email column to Database.")
except:
    print(">>> Info: Drafted_Email column already exists.")
conn.close()

import sqlite3

def fix_database():
    # Use the DB_FILE variable defined at the top of your script!
    conn = sqlite3.connect(DB_FILE)
    try:
        conn.execute("ALTER TABLE leads ADD COLUMN Drafted_Email TEXT")
        print(">>> Database Updated: Added Drafted_Email column to AppData DB.")
    except sqlite3.OperationalError:
        print(">>> Database Check: Drafted_Email column already exists.")
    conn.close()
    
# ==========================================
# 7. DATABASE MAINTENANCE
# ==========================================
def fix_database():
    # Called safely by test_start.py on startup
    conn = sqlite3.connect(DB_FILE)
    try:
        conn.execute("ALTER TABLE leads ADD COLUMN Drafted_Email TEXT")
        print(">>> Database Updated: Added Drafted_Email column to AppData DB.")
    except sqlite3.OperationalError:
        pass # Column already exists, all good!
    conn.close()