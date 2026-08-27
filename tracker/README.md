# Kitted Lab Tracker

A single self-contained HTML file that runs the Kitted Lab car-parts business:
stock, incoming shipments, sales, money out (including ad spend) and supplier
contacts.

## What it does

- **Dashboard** — net profit and margin for the month, what is on the way with
  ETAs, and anything running low or running late.
- **Stock** — every part with cost, sell price, margin, stock value, reorder
  point and where it sits.
- **Incoming** — shipments with line items, ETA, freight and duty. Marking one
  received adds its units to stock.
- **Sales** — one row per item sold. Logging a sale takes the units off stock
  and freezes the cost price of that day so historical profit stays correct.
- **Money out** — ad spend by platform with ROAS, plus freight, packaging,
  software, rent and everything else.
- **Suppliers** — contacts with click-to-call, email, WhatsApp, lead time and
  payment terms.

Every list has a **Paste in** button that reads rows copied straight out of
Excel, Sheets or Numbers, matching columns by header name.

## How it saves

The page has no server. Data lives in the HTML itself:

- Every edit is mirrored to `localStorage` immediately, so nothing is lost on a
  refresh.
- Pressing **Save** calls the Claude Artifact `publish` capability, which
  rebuilds the whole document from its own `#app-css` and `#app-js` plus the
  current data and publishes it as a new version. That is what makes the data
  follow you between devices.

Opened anywhere without that capability (a plain file, another host) it still
runs and still remembers on that device — it just shows "This device only".

## Working on it

The file is authored without `<!doctype>`, `<html>`, `<head>` or `<body>` because
the Artifact publisher wraps it. `serialize()` in the script emits the full
document for republishing, so any structural change to the page shell must be
mirrored in `BODY_MARKUP` and `FONT_LINK` there.
