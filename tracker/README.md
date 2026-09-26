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
- `invoiceMissing()` is the one judge of whether that is finished, and it asks
  the only question that matters: would this invoice actually work? So it wants
  a way to be contacted (phone or email), an address, an ABN *if* GST is on,
  and all three bank fields, because an invoice nobody can pay is not an
  invoice. A business name is not on the list — it falls back to the business
  name on its own. `invoiceReady()` is the empty check, and it is what the Home
  checklist ticks, so the tick can never appear before the invoice is real.
  Each gap names the field it belongs to; Settings turns them into buttons that
  put the cursor in that box, and marks the same boxes **needed**.
- **Empty this card and start again** blanks every printed detail so they can be
  typed fresh. It deliberately keeps the invoice number, days to pay and GST
  rate: resetting the counter would reissue a number that has already gone out.
- GST is treated the Australian way: prices already include it, so the sheet
  shows the ex-GST subtotal, the GST inside the price, and the same total.
- A deposit already on the job comes off and leaves an amount due.
- `invoiceSheet()` builds the paper; `PAPER_CSS` is one string used both by the
  app (injected into `<head>` at boot) and by the standalone file, so what is
  printed is exactly what was on screen. Print uses a media query that hides
  the app shell; Save a copy writes a complete self-contained HTML document.
- An invoice raised but not marked sent shows on Home under Needs doing.

## An order is a thing on the way, not stock on the shelf

Order 2 was the first real use of the Orders tab, and it showed up the rule
that was missing. Nineteen new stock lines at zero, the day the order is
placed, made nineteen "running low" alarms on Home -- for parts that were in
a plane. `isLow()` now counts what is already on the way: something is only
low if the shelf *plus* the open orders will not cover it. The order itself
is one thing, and it surfaces on Home by itself the day it is late.

How a China order goes in:

- **A supplier** first; an order will not save without one.
- **Stock lines at zero**, one per line on the supplier's invoice, with the
  landed cost on each -- DDP shipping spread across the units by count, in
  the AUD he actually paid. The order's `freight` stays 0 because the
  shipping is already inside each line; the note on the order says so.
- **The order** with those lines, *On the way*, ordered date, express, ETA
  at the far end of the supplier's window. **It arrived** puts every unit on
  the shelf in one tap and cannot do it twice (`applied`).
- **A part bought for a customer is not stock.** It goes on that person's
  pre-order as the job's cost (`materials`), and the pre-order moves to
  Booked with no fitting date. So "money on the shelf" is only what can be
  sold to anyone, and the part's cost lands in profit when *that* job pays.
  The order's note lists these so its total is not a mystery.

## Tests live in the repo now

The first sixteen suites lived in a scratch directory and were lost when
the container was reclaimed. Everything from here on goes in
`tracker/tests/` and runs with `sh tracker/tests/run.sh`. `fixture.js`
builds a state: with `KL_LIVE=<read_db snapshot dir>` it uses the real rows
(that snapshot is never committed -- it has customers' names and addresses
in it), otherwise a synthetic set with the same ids. `KL_PAGE=<html>` points
a run at a built or publish file instead of the source, which is how the
exact file that gets published is verified.

## It has to be readable before it can be understood

Three times he said it was congested and hard to read, and twice the answer
was spacing. The third time he named it: *maybe it's the colour scheme*. He
was right. The workshop look -- concrete-grey ground, grey-white cards, grey
borders on everything, greyed secondary text, a condensed face at 18px, mono
figures, chips on every row -- was a designer's palette, not a reader's.
Everything was low contrast against everything else, so no amount of air
between the boxes made the boxes easier to read.

The readability layer is appended at the end of `#app-css` so it wins:

- **Black on white.** Ink `#141414` on white; secondary text no lighter than
  `#5C5C5C` (6.7:1). Every text/background pair in both palettes is checked
  with the WCAG formula; the worst in light mode is the orange chip at 4.9:1
  and nothing is below AA for its size. The dark palette is rebuilt on the
  same rule, with white labels on a deeper teal after the first cut measured
  2.6:1.
- **One legible face.** Atkinson Hyperlegible for everything, 19px body at
  1.65 line-height, two weights only. Roboto Mono stays for the invoice
  paper and nowhere else; tabular figures come from `font-variant-numeric`.
- **Fewer boxes.** Cards carry a soft shadow and 14px corners instead of a
  border; chips are borderless pills; a job's item name is plain bold words,
  not a pill; tables lose their header band. One hairline between rows.
- **Real hierarchy.** Titles 32px, section headings 25px, card headings 21px,
  the month figure up to 72px, uppercase eyebrows for labels.
- **More air, again.** 28px between cards, 20px inside rows, 44px above a
  section heading, and a 1120px cap on a desktop.

The cost sheet's total is coloured only when it is a profit: "$51.76 went
out" in green was wrong.

## Every number opens

"I don't know what money out means" -- and he was right to say it. A figure
you cannot open is a figure you have to take on trust. So any number you can
see, you can tap, and `openExplain(kind)` shows the exact rows that add up
to it with the total at the bottom: *came in* is every job paid this month;
*went out* is each part and material on those jobs plus every bill; *profit*
is the two of them as two lines you can drill into; the shelf total is each
item times what one cost; a pre-order's worth is sale minus cost for the
priced ones only; a paid job's profit opens its own little sum. Rows inside a
sheet open the job, bill or item they came from. Tappable figures carry a
dotted underline (`.open-num`) so you can tell.

The headline rounds to the dollar and the sheet does not, on purpose: "$52
went out" is easier to read, and the sheet underneath says $51.76.

## Breathing room

"It feels so congested" was a spacing complaint, and whitespace is what lets
you read one thing at a time. Cards now sit 24px apart with 20px inside,
rows and to-do lines are 18px tall, section headings get 36px above them,
body copy is 1.6 line-height, and the page is capped at 1180px on a desktop
so lines do not run the width of a monitor.

## One question per screen

Three times he said it was confusing, and three times a specific complaint
got fixed while the whole got busier. Screenshotting every screen on a phone
with his real data made the shape of it obvious: Home was three screens with
two empty panels and a chart of nothing; Jobs opened on a filter that was
*empty* for him, so his twenty records were hidden; Stock buried five items
under two screens of analytics; Settings was seven screens; the Add menu had
eight choices. It was a dashboard. He needed a list.

So every screen now answers one question, and says which under its title
(`TABS[].why`):

- **Home — what needs you today.** One line on the month, then `todoList()`:
  everything wanting a decision, worst first (owes you, late, unsent,
  running low, wants a part you have not priced, booked in). Then the strip
  of where everything is up to, then the last five things that happened.
  No charts, no empty panels, no checklist -- when there is nothing to do it
  says so in one line.
- **Jobs** opens on *Everything*, newest first. The filters are wrapping
  pills (`.pills`) so nothing clips off the edge of a phone. The cars-per-week
  chart moved to Money → Coming in, next to month-by-month.
- **Stock** shows the list first, one summary line above it; per-car cost,
  where the money sits and coming-in follow underneath.
- **Settings** is a list of headings. `fold()` gives a card a tappable header
  with a one-line summary and a closed body (`UI.folds` remembers what was
  opened this session). What goes on an invoice starts open while it is not
  ready; the setup list lives here now and closes itself once done.
- **The + button** asks *What happened?* and offers four things in his words
  -- sold something, someone wants a part, send a receipt or invoice, bought
  stock -- with the rest under *Less often*.
- **?** opens *How this works*: the four-step loop and where things live.
  It opens by itself the first time each device sees the page
  (`kittedlab.seen-help` in localStorage, deliberately per device and not in
  the shared store, so each co-owner sees it once).
- **Find anything** (the search button, or Ctrl/Cmd+K) searches jobs,
  invoices, stock, contacts and orders together, grouped, tap to open.

The test hooks -- `data-act` names, `.stage`, `[data-act="job-filter"]` --
are unchanged; what changed is what is on the screen.

## A gift with every purchase

The air fresheners are not stock to sell, they are a thank-you that goes out
with every job. Tick **one of these goes out with every job** on a stock item
and `giftLines()` puts it on each new job as an ordinary parts line.

Deliberately a real line rather than a hidden adjustment: it comes off the
shelf and off the profit through exactly the same path as anything else, so
editing, deleting and undoing a job all unwind it correctly with no new
plumbing — and it stays visible on the job, so he can take it off for the
customer who did not get one. Only new jobs get one, and never a pre-order,
because nothing has been sold yet.

Two things this turned up in the form layer, both real:

- `String(false).trim()` is `"false"`, which is truthy, so a checkbox could be
  ticked but never unticked. `t: 'check'` now saves a boolean.
- `n('')` is `0`, so an empty number field saved as zero. On `reorder` that
  silently undid "blank means never" the moment an item was edited in the
  app. Fields where empty is its own instruction now carry `blankOk`.

## Blank means never warn me

`lowStock()` only looks at an item whose reorder point has actually been
set. A steering wheel bought once is not "running low" the second it sells,
and an item you will never buy again should not sit under Needs doing for
the rest of time. So `warnsLow()` gates on the field having a value at all:
blank is never, zero still means tell me when it hits empty, and a new item
still starts at 2 so the warning is opt-out rather than opt-in.

## The pre-order list is a job that has not been ordered

Most of what he sells is a part he has not bought yet: somebody asks, he
finds it on Alibaba, and weeks later it lands. That is not an order (an
order is stock he has already bought) and it is not a booked job (there is
often no price yet). So it is a fifth job status, **Wanted**, sitting before
Booked, and it moves down the same line: Wanted -> Booked -> Done -> Paid.

- `wanted(j)`, `wantedList()` and `wantedWorth()` are the whole of it. Worth
  never adds a priced pre-order to an unpriced one, because a pre-order you
  have not priced is not money you can count on -- Home says "none priced
  yet" rather than inventing a number.
- `price` stops being required when the status is Wanted (`req` may now be a
  function of the form's values, not just a flag). A card with no price says
  **no price yet**, never `$0`.
- `link` holds the Alibaba or supplier page, run through `safeUrl()` before
  it ever reaches an `href`.
- A pre-order is deliberately kept out of everything that counts real work:
  `jobOpen()` still means Booked only, so it stays off Coming up; the
  cars-per-week chart skips it; and the card offers **I have ordered it**
  instead of an invoice, because you cannot bill for a part you have not
  bought. Raising an invoice on one is still possible once it exists.
- The list sorts oldest first. The ones that have been sitting longest are
  the ones nobody has chased.

## Receipts are the same document, settled

There is one document, not two. Unpaid it is a **Tax invoice** with a due date
and how to pay; the moment the job is marked paid it becomes a **Receipt** —
same number — carrying a PAID badge, when and how they paid, "paid in full,
nothing owing", and no request for payment. `invoiceSheet()` branches on
`invPaid(inv)` throughout, so the two can never disagree.

Getting paid asks the two things a receipt needs: **how** (`paidHow`, from
`PAY_WAYS`) and **when** (`paidOn`). For cash work with no invoice behind it,
**+ Add something → Write a receipt** takes the same form as an invoice, plus
how they paid, and creates the job already marked paid.

## Your logo

`meta.biz.logo` holds a data URI, set from Settings with a file picker.
`readLogo()` re-encodes whatever is handed over through a canvas at 660px wide,
so a 4MB phone photo does not end up inside every saved copy; anything that is
not an image, or over 12MB, is refused. It renders at the head of the sheet and
travels inside the saved file, so a printed or emailed copy carries it with no
hosting anywhere.

## Emailing one

`emailBody()` writes the whole document out as plain words — lines, totals, GST,
how to pay or when it was paid, and a sign-off — so the customer reads it in the
mail itself with nothing to open. **Email it** opens a drawer with their address
(from the job), a subject, and that text, editable. **Open my email** builds a
`mailto:` and clicks it; **Copy the message** is always there because a
sandboxed frame may refuse the handoff silently.

Note that a drawer and the invoice sheet share `#layer`, so `closeDrawer()`
re-renders the sheet when `INVOICE` still names one — otherwise closing the
email or edit drawer used to drop you out of the document.

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

## Sharing it

The data lives inside the page, so **sharing the link shares the data** —
customers, prices, invoices, bank details, the lot. Settings says so in as many
words rather than leaving it to be discovered.

The safe way out is `freshDoc()`: `buildDoc()` runs over `emptyState()` instead
of `S`, producing the whole working app with nothing personal in it — no jobs,
no invoices, no contacts, no ABN or bank details, and every starter price at
zero. Settings → Sharing it → **Give someone a blank copy** saves it as a file
they open and own. `share.js` asserts the file is a complete document, runs
standalone, and contains none of the owner's strings anywhere in it.

A viewer who opens a shared link cannot save (`publish` returns `not_writer`).
That used to surface only as a toast on the first save attempt; it now sets a
banner at the top of every screen saying their changes stay on their device.

## Three people, one tracker

Three people run the business, so the tracker cannot be a page one of them
owns and the other two read. When the artifact declares `capabilities: {db: {}}`
the rows live outside the page — **one document per row** —
`services/<id>`, `jobs/<id>`, `invoices/<id>`, `products/<id>`, `orders/<id>`,
`expenses/<id>`, `suppliers/<id>`, plus `meta/settings`. Everyone reads and
writes the same documents and `onSnapshot` delivers each other's edits live.

One document per row rather than one big blob, because the store is
last-writer-wins with no transactions: two people editing different jobs must
not clobber each other. Same-row collisions still resolve last-writer-wins,
which is the right trade for a three-person shop.

- **`SHARED.shadow`** holds a stable-stringified copy of what the store is
  believed to contain, so `pushShared()` (debounced 400 ms off `touch()`)
  writes only what actually changed and deletes what disappeared. `stable()`
  sorts keys, or key order alone would look like a change.
- **Seeding** happens once: the first page in finds no `meta/settings`, takes a
  short `acquire()` lease, re-checks, and writes what the page came with. A
  second page opening at the same moment sees the lease held and just reads.
- **Writes go five at a time** with a small gap — a burst trips the per-viewer
  budget and returns `resource_exhausted`.
- **Theme is stripped from `metaDoc()`** and kept in `localStorage`. Sharing it
  would have two pages pushing light and dark back at each other.
- **A logo has to fit one document** (256 KiB): `readLogo()` steps PNG → JPEG →
  half size, and refuses what still will not shrink.
- **Errors reach the save chip and Settings**: `quota_exceeded` says the store
  is full, `invalid_argument` on a write means look-only, anything else reads
  as offline.

Without the capability — a copy saved to disk, the blank one handed out —
`SHARED.on` stays false and nothing changes: `localStorage` plus the artifact
publish, exactly as before. `shared.js` drives two pages against one fake store
to prove both directions, the seeding race, deletes, the theme split and each
error path.

Note a db artifact is organisation-internal and cannot be shared publicly, so
everyone who opens it is a signed-in member of the owner's workspace.

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
