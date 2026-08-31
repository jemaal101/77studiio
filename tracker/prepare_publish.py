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

if data.get("v") and data["v"] < 4:
    # stock used to be counted one-for-one; a roll stays one roll until you say
    # how many cars it does, so no count moves
    for pr in data.get("products") or []:
        if not pr.get("uses"):
            pr["uses"] = 1
    data["v"] = 4
    print("migrated the carried-over data to v4")

if data.get("v") and data["v"] < 5:
    # invoices arrive empty; nothing existing has one and none is invented
    meta = data.setdefault("meta", {})
    meta.setdefault("biz", {"terms": 14, "gst": False, "gstRate": 10, "prefix": "INV-"})
    meta.setdefault("invNext", 1)
    data["v"] = 5
    print("migrated the carried-over data to v5")

if data.get("v") and data["v"] < 6:
    # an invoice used to hang off a job; it is its own record now
    meta = data.setdefault("meta", {})
    data.setdefault("invoices", [])
    for i, j in enumerate(data.get("jobs") or []):
        inv = j.pop("inv", None)
        if inv and inv.get("no"):
            data["invoices"].append({
                "id": "iv%d" % i, "jobId": j.get("id"), "no": inv.get("no"),
                "date": inv.get("date"), "due": inv.get("due"),
                "lines": inv.get("lines") or [], "note": inv.get("note") or "",
                "sent": bool(inv.get("sent")),
            })
    biz = meta.setdefault("biz", {})
    m = re.match(r"^(.*?)(\d+)$", str(biz.get("prefix") or ""))
    if m:
        # a whole number typed into the old "starts with" box
        biz["prefix"] = m.group(1)
        biz["numWidth"] = len(m.group(2))
        if int(meta.get("invNext") or 1) <= 1:
            meta["invNext"] = max(1, int(m.group(2)))
    data["v"] = 6
    print("migrated the carried-over data to v6")

out = BLOCK.sub(
    lambda m: m.group(1) + json.dumps(data).replace("<", "\\u003c") + m.group(3),
    SRC.read_text(encoding="utf-8"), count=1)
pathlib.Path(args.out).write_text(out, encoding="utf-8")
print(f"wrote {args.out} ({len(out)/1024:.0f} KB)")
