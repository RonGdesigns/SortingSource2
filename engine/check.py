import requests

API_KEY = "YOUR_GEMINI_KEY_HERE"
url = f"https://generativelanguage.googleapis.com/v1/models?key={API_KEY}"

try:
    res = requests.get(url)
    data = res.json()
    print("\n--- YOUR PERMITTED MODELS ---")
    for m in data.get('models', []):
        # We want the ID (e.g., models/gemini-1.5-flash-8b)
        print(f"ID: {m['name']}")
except Exception as e:
    print(f"Error: {e}")