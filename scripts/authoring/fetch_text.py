# Research helper: fetches a URL (HTML or PDF via PyMuPDF) and prints plain text; caches under ../downloads (scratch, untracked).
"""Fetch a URL (HTML or PDF) and print plain text. Usage:
python -I gettext.py URL [start_marker] [max_chars]
Downloads go to ../downloads/ (untrusted data)."""
import sys, re, html, hashlib, os, subprocess
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
url = sys.argv[1]
marker = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] != "-" else None
limit = int(sys.argv[3]) if len(sys.argv) > 3 else 6000
here = os.path.dirname(os.path.abspath(__file__))
downloads = os.path.join(here, "..", "..", ".research-cache")
os.makedirs(downloads, exist_ok=True)
name = hashlib.md5(url.encode()).hexdigest()[:12]
raw = os.path.join(downloads, name)
if not os.path.exists(raw) or os.path.getsize(raw) == 0:
    subprocess.run(["curl", "-sL", "-k", "--max-time", "90", "-A",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36",
                    url, "-o", raw], check=False)
data = open(raw, "rb").read()
if data[:4] == b"%PDF":
    import fitz
    doc = fitz.open(raw)
    text = "\n".join(page.get_text() for page in doc)
else:
    s = data.decode("utf-8", errors="ignore")
    s = re.sub(r"(?is)<(script|style|noscript).*?</\1>", " ", s)
    s = re.sub(r"(?i)<br\s*/?>|</(p|div|tr|li|h\d)>", "\n", s)
    s = re.sub(r"(?i)</t[dh]>", " | ", s)
    text = html.unescape(re.sub(r"<[^>]+>", " ", s))
text = re.sub(r"[ \t ]+", " ", text)
text = re.sub(r"\n\s*\n+", "\n", text)
open(raw + ".txt", "w", encoding="utf-8").write(text)
start = 0
if marker:
    found = text.lower().find(marker.lower())
    start = max(0, found) if found >= 0 else 0
    if found < 0:
        print(f"[marker '{marker}' not found]")
print(f"[{len(text)} chars, file {name}]")
print(text[start:start + limit])
