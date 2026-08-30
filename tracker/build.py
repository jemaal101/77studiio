#!/usr/bin/env python3
"""Wrap the tracker fragment into a standalone page served from public/.

tracker/kitted-lab-tracker.html is authored without <!doctype>/<html>/<head>/
<body> because the Artifact publisher supplies them. The website needs a
complete document, so this adds the shell plus the bits only a real site can
use: an icon, a theme colour, home-screen support and a noindex rule.
"""
import pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "tracker" / "kitted-lab-tracker.html"
OUT = ROOT / "public" / "tracker.html"
ICON = ROOT / "tracker" / "icon.b64"

src = SRC.read_text()
split = src.index("</style>") + len("</style>")
head, body = src[:split], src[split:]

icon_png = ICON.read_text().strip() if ICON.exists() else ""
touch = f'\n<link rel="apple-touch-icon" href="data:image/png;base64,{icon_png}">' if icon_png else ""

favicon = (
    '<link rel="icon" href="data:image/svg+xml,'
    "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E"
    "%3Crect width='32' height='32' rx='4' fill='%230092A0'/%3E"
    "%3Ctext x='16' y='22' font-family='Helvetica,Arial,sans-serif' font-size='15' font-weight='700'"
    " fill='%23fff' text-anchor='middle'%3EKL%3C/text%3E%3C/svg%3E\">"
)

doc = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#1A1F1E">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Kitted Lab">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
{favicon}{touch}
{head}
</head>
<body>
{body.strip()}
</body>
</html>
"""
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(doc)
print(f"built {OUT.relative_to(ROOT)}  ({len(doc) / 1024:.0f} KB)")
