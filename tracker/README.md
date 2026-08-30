# Kitted Lab Tracker

One self-contained HTML file that runs the shop: jobs on cars (tinting,
detailing, wrapping, installation and parts), the stock behind them, money in
and out, and supplier contacts.

Ships completely empty. The only thing pre-filled is a starter price list of the
services a shop like this sells — every price on it is zero until the owner sets
it.

## The five screens

- **Home** — profit for the month in one number, then what came in, what went
  out, what is still owed and the average job. Under that: what is booked in,
  and what needs chasing (unpaid jobs, low stock, late orders). A "start here"
  checklist appears until the basics are filled in, then disappears.
- **Jobs** — a list of cards, or a **month calendar**. Each card is one car:
  customer, vehicle, the work as chips, the price, and one button that moves it
  along: Start it → Finished → Got paid. The calendar shows every job on its day
  colour-coded by status — tap a name to open that job, tap a day to see the
  day and book into it. On a phone the days collapse to status dots.
- **Stock** — what is on the shelf, plus an "on order" section underneath.
- **Money** — bills and ad spend going out, paid jobs coming in, ROAS.
- **Contacts** — suppliers with tap-to-call, WhatsApp and email.

Settings holds the price list, the business name, light/dark, and backups.

## Two ways to run it

- **On the website** — `public/tracker.html`, built by `tracker/build.py` from the
  source fragment, served at `/tracker.html`. No account, no sign-in, works on a
  phone. `noindex`, its own favicon, and the meta tags that let iOS and Android
  add it to the home screen as a full-screen app.
- **As an Artifact** — the same source, published to claude.ai. This is the one
  in daily use: the `artifact` capability carries the data between devices with
  nothing to configure. It saves itself 12s after the last change (never while a
  drawer is open, since publishing reloads the view) and immediately on
  `visibilitychange` to hidden, which is the one moment a reload costs nothing.
  If a publish ever resolves without the shell reloading, a 6s timer un-sticks
  the save state rather than leaving it unable to save again.

The page detects which it is in: with the artifact runtime present it shows a
Save button and publishes new versions; without it, every edit is written to
`localStorage` immediately, the chip reads "Saved on this device", and backups
download as real files through a blob URL.

Rebuild the website copy after any source change:

```bash
python3 tracker/build.py     # tracker/kitted-lab-tracker.html -> public/tracker.html
```

## Look and feel

Not a stock dashboard. A workshop job-card system:

- **Graphite bezel** sidebar and tab bar in both themes, against a concrete
  ground. Flat panels, 3px radius, hairline rules — no drop shadows anywhere.
- **Type**: Barlow throughout at 17px base, with Roboto Mono reserved for
  figures that line up in columns (tables, axis ticks, calendar dates). Weight
  and letter-spacing carry hierarchy instead of a condensed face, which was
  hard to read at label sizes.
- **Palette**: petrol teal `#0092A0` / `#2CA3AC` for money in, burnt orange
  `#B4531B` / `#D07A2C` for money out, green and red reserved for status.
  Both pairs pass the full six-check colour validator (lightness band, chroma
  floor, CVD separation, normal-vision floor, contrast) in light and dark.
- Status is encoded structurally as well as in colour: a 4px left stripe on
  every job and order card, and a top stripe on each board column.

## Charts

Built as inline SVG in `buildMonths` / `buildColumns` / `buildSpark`. Each host
is measured after render and drawn at real pixel width, so type never scales
with the container; `drawCharts()` re-runs on a debounced resize.

- **Month by month** — grouped bars, money in vs costs & bills, one y-axis,
  legend, hover read-out, and a tap that opens that month.
- **Profit, last 6 months** — line with a zero rule and an emphasised endpoint.
- **Cars in, week by week** — twelve weekly columns on the Jobs page.
- **Ad spend, last 6 months** — columns in the cost colour, with a return-on-ads
  meter against a 3× target.
- **Ranked bars** for what earned the most, where the money went, and where
  stock value is sitting — one hue, values always directly labelled.
- **Level bars** in the stock table, showing each item against its reorder
  point, coloured by status.

No dual-axis charts, no pies, no value-ramps on nominal categories.

## Sync across devices (standalone build only)

Only relevant to the standalone `public/tracker.html`. The Artifact carries data
between devices through publishing, so this whole path stays dormant there — the
sandbox blocks outside calls anyway. Off until turned on.

**No account.** One sync code — `kl-xxxx-xxxx-xxxx`, 60 bits of entropy — typed
once per device. No email, no password, no reset.

**The server cannot read it.** The client derives an AES-GCM key from the code
with PBKDF2 (210k iterations, SHA-256, salted with the row id) and encrypts the
whole state before it leaves the browser. The row is addressed by
`SHA-256('kitted-lab-id|' + code)`, so knowing the address proves you knew the
code. Losing the code loses the data — by design, and the UI says so twice.

**The table is unreachable.** RLS is on with no policies and all grants revoked,
so `anon` cannot read or write `public.sync` at all. The only public surface is
two `SECURITY DEFINER` functions that require a 64-character id, which is what
stops enumeration. Verified by running the real `anon` role against them; see
`migrations/001_sync.sql`.

**Divergence is tracked, not guessed.** `sync_push` is a compare-and-set against
`p_base` — the version this device last agreed with. The client decides "I have
unsent edits" from `stamp > base`, never by comparing wall-clock timestamps,
which is what stops an edit made offline being thrown away when another device
saved later. When both moved, neither is written: the page shows both and asks
which to keep.

Pulls on open and on tab focus, pushes 2.5s after a change, queues while
offline and catches up when the signal returns.

## How the numbers work

- A job counts as **money in** only when it is marked paid. Before that it sits
  under "still owed".
- **Profit on a job** = price − parts taken off the shelf − materials.
- **Profit for the month** = everything paid − what those jobs cost − bills.
- Parts and materials are counted on the job, so they are deliberately *not*
  logged again under Money. Only bills a job does not cover go there.
- Stock moves itself: parts added to a job come off the count; an order marked
  arrived goes on. Edits compute the delta rather than re-applying.

## How it saves

No server. Data lives in the HTML:

- Every edit mirrors to `localStorage` immediately.
- **Save** calls the Artifact `publish` capability, which rebuilds the whole
  document from its own `#app-css` and `#app-js` plus the current data. That is
  what carries the data between devices.

Without that capability the page still runs and remembers on that one device —
it just says "This device only".

## Working on it

Authored without `<!doctype>`, `<html>`, `<head>` or `<body>`; the Artifact
publisher wraps it. `serialize()` emits the full document for republishing, so
any change to the page shell must be mirrored in `BODY_MARKUP` and `HEAD_LINKS`
there.
