# Kitted Lab Tracker

One self-contained HTML file that runs the shop: jobs on cars (tinting,
detailing, wrapping, installation and parts), the stock behind them, money in
and out, and supplier contacts.

Ships completely empty. The only thing pre-filled is a starter price list of the
services a shop like this sells — every price on it is zero until the owner sets
it.

## The six screens

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

## Changing it without losing data

The source ships an empty starter blob, so republishing it as-is would drop
whatever is in the live artifact. Never do that. The sequence is:

1. `Artifact` `action: "read"` on the live URL.
2. `python3 tracker/prepare_publish.py --live <that file> --out /tmp/publish.html`
   — lifts the live `app-data` blob, migrates it, and drops it into a fresh
   build. The output goes outside the repo; the owner's data is never committed.
3. Publish `/tmp/publish.html` with `url:` set to the artifact.

Three things back this up: `loadState` keeps whichever copy has the newer
`stamp`, so a device holding real data wins over an empty published page and
re-saves it; `migrate()` runs on whichever copy wins, so it does not matter
which device saw the new version first; and the artifact keeps version history
to roll back to.

## Service charging modes

Not everything has a set price. Each service carries a `mode`:

- `fixed` — a set price that auto-fills the job.
- `varies` — priced per job (an install depends on the part). Offered when
  booking, marked "quote", contributes nothing to the auto-filled price, and
  the form says which of the picked services is per-job.
- `soon` — not being offered yet. Kept in Settings under a "Coming soon"
  heading and hidden from the job screen, unless a job already has it on, in
  which case it still shows so nothing already booked can vanish.

Defaults, applied to the starter list and by `migrate()` to any older saved
state: anything matching wrap or chrome delete is `soon`, anything matching
install or supply-only is `varies`, everything else `fixed`.

## Stock that gets shared across cars

A roll of tint is not one thing you sell, it is five cars' worth of a thing you
use. A stock item therefore carries `uses` — how many cars one of them does —
and everything downstream is counted in cars once that is above 1:

- `carsLeft(p)` = `qty × uses`, `costPerCar(p)` = `cost ÷ uses`.
- The low-stock threshold (`reorder`) is read in cars, so "tell me when I am
  down to 2" means two cars, not two rolls.
- Job lines are entered in cars' worth and cost the job `costPerCar`. Order
  lines stay in whole rolls, because that is how you buy them.
- Each job line snapshots `per` (the `uses` at the time), so `applyLines`
  divides by it. Old lines still balance if you later change how many cars a
  roll does.
- `qty` therefore goes fractional. It is rounded to three decimals on every
  move and shown as cars, with the roll count as a smaller second line.
- A stocktake on a shared item is counted in cars too and divided back out.

The Stock page carries a card that writes the sum out — `$150.00 ÷ 5 cars` →
`$30.00 a car` — and the job drawer carries a live strip showing what the price
is left with once the shelf and the materials are paid for.

## Three states, not six

Nobody running a shop sits in an app marking a car as started and then
finished. A job is **Booked → Done → Paid** (plus Cancelled), and an order is
**Ordered → On the way → Arrived**. Enquiry and In progress fold into Booked;
Paid for folds into Ordered, and In transit / At customs into On the way. The
v7 migration does the folding, so nothing is lost — only simplified.

A card therefore shows **one** forward button at a time: "It is done", then
"They paid $X". Home is one board of three cards in that same order, with no
separate row of tiles repeating the same figures above it.

## Reading it

All-caps is harder to read, so it is kept for short labels only — the page
title and section headings. Card titles, form labels, empty-state headings and
eyebrows are sentence case. Base type is 18px. `simple.js` asserts both: no
`text-transform: uppercase` on `.card-h h3`, `.field label` or `.empty h3`, and
a body size of at least 18px.

## How the numbers work

- A job counts as **money in** only when it is marked paid. Before that it sits
  under "still owed".
- **Profit on a job** = price − parts taken off the shelf − materials.
- **Profit for the month** = everything paid − what those jobs cost − bills.
- Parts and materials are counted on the job, so they are deliberately *not*
  logged again under Money. Only bills a job does not cover go there.
- Stock moves itself: parts added to a job come off the count; an order marked
  arrived goes on. Edits compute the delta rather than re-applying.

## Invoices

An invoice is its own record in `S.invoices`, always carrying the `jobId` of
the job behind it. No number is spent until one is actually raised
(`meta.invNext` increments in `raiseInvoice`, not before).

**Three ways in, because one was not findable:**

1. **+ Add something → Write an invoice**, the first entry on the list. This
   asks who, which car, and what for, and *creates the job behind it* — an
   invoice is one car and one price, which is exactly what a job is, so the
   money keeps counting itself and nothing is double-entered.
2. **Money → Invoices**, the tab Money now opens on: every invoice in one
   list, filterable by not sent / not paid / paid, with the totals above it.
3. **Make an invoice** on any job card, which seeds it from that job.

- **The number is one field.** You type the whole next number the way it
  should read — `INV-0010` — and `setNextNo` splits it: trailing digits are the
  count, everything in front is the prefix, and how many digits you typed is
  how wide it stays. Two fields (a prefix and a hidden counter) invited a whole
  number into the prefix box; the v6 migration repairs one typed that way.
- A job-seeded draft takes each fixed-price service as its own line, and
  whatever is left against the agreed price becomes one more, named after the
  per-job work if there is any. Then the lines are yours to rewrite — an
  invoice says whatever you want it to say. Priced services show as one-tap
  buttons under the line editor, and the total runs live as you type.
- Marking one paid from the sheet marks the job paid, so it lands in the
  month's money in.
- Deleting a job deletes its invoice with it.
- `meta.biz` holds everything printed on it, filled in once under Settings →
  What goes on an invoice: name, ABN, address, contact, bank details, number
  prefix, days to pay, GST, and a footer.
- GST is treated the Australian way: prices already include it, so the sheet
  shows the ex-GST subtotal, the GST inside the price, and the same total.
- A deposit already on the job comes off and leaves an amount due.
- `invoiceSheet()` builds the paper; `PAPER_CSS` is one string used both by the
  app (injected into `<head>` at boot) and by the standalone file, so what is
  printed is exactly what was on screen. Print uses a media query that hides
  the app shell; Save a copy writes a complete self-contained HTML document.
- An invoice raised but not marked sent shows on Home under Needs doing.

## Orders

Orders run exactly like jobs, on their own tab: a board across the top
(placed / paid / on its way / landed) you tap into, then cards you step forward
one button at a time (`nextOrderStep`). The Stock page keeps only the "coming
in" summary and a link across. The late count sits on the Orders tab's badge;
Stock's badge is low stock alone.

## Where a low count actually shows up

Three places, and the field hint on `reorder` names all three so the answer is
where the question gets asked:

1. The item goes red on the Stock page (`levelBar`, plus the Low filter).
2. It appears under **Needs doing** on Home with how many cars are left and
   whether anything is on order.
3. The Stock tab carries a count (`alerts()` → the `.pip` in `renderChrome`).

## Buying from overseas

Contacts default to Alibaba and China, because that is where nearly everything
comes from. Each one holds a chat link (`link`, run through `safeUrl` so a
`javascript:` string can never become an href) that surfaces on the card as
"Open Alibaba", plus `leadTime` in days.

An order's arrival date fills itself in from that lead time — or from the
shipping method's typical days (`SHIP_DAYS`) when the supplier has none — and
`syncEta` stands down the moment a real date is typed in. Open orders show how
far through the window they are: "day 12 of about 40".

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
