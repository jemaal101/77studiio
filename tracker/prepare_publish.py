#!/usr/bin/env python3
"""Build a publish candidate that carries the artifact's existing data forward.

Republishing the source as-is would ship its empty starter blob and drop
whatever is in the live artifact. So: read the live page, lift its app-data
blob, and drop it into the new build. Nothing of the owner's data is ever
written into the repo -- the output goes wherever --out points, outside it.

  python3 tracker/prepare_publish.py --live <downloaded.html> --out /tmp/publish.html
"""
import argparse, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "tracker" / "kitted-lab-tracker.html"
BLOCK = re.compile(r'(<script type="application/json" id="app-data">)(.*?)(</script>)', re.S)

ap = argparse.ArgumentParser()
ap.add_argument("--live", required=True, help="HTML of the currently published artifact")
ap.add_argument("--out", required=True, help="where to write the publish candidate")
args = ap.parse_args()

live = pathlib.Path(args.live).read_text(encoding="utf-8")
found = BLOCK.search(live)
if not found:
    sys.exit("no app-data block in the live page - refusing to publish blind")

data = json.loads(found.group(2).replace("\\u003c", "<"))
if data.get("fresh"):
    print("live copy is still the empty starter state; nothing to carry over")
else:
    counts = {k: len(data.get(k) or []) for k in
              ("services", "jobs", "products", "orders", "expenses", "suppliers")}
    print("carrying over:", ", ".join(f"{k} {v}" for k, v in counts.items()))

# the app migrates on load, but stamping the version here means the published
# page is already current even before anyone opens it
if data.get("v") and data["v"] < 3:
    for sv in data.get("services") or []:
        if not sv.get("mode"):
            nm = (sv.get("name") or "").lower()
            sv["mode"] = ("soon" if ("wrap" in nm or "chrome delete" in nm)
                          else "varies" if any(w in nm for w in ("install", "supply only", "per hour", "labour"))
                          else "fixed")
    data["v"] = 3
    print("migrated the carried-over data to v3")

out = BLOCK.sub(
    lambda m: m.group(1) + json.dumps(data).replace("<", "\\u003c") + m.group(3),
    SRC.read_text(encoding="utf-8"), count=1)
pathlib.Path(args.out).write_text(out, encoding="utf-8")
print(f"wrote {args.out} ({len(out)/1024:.0f} KB)")
