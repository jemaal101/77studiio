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
- **Jobs** — one card per car. Customer, vehicle, the work as chips, the price,
  and one button that moves it along: Start it → Finished → Got paid.
- **Stock** — what is on the shelf, plus an "on order" section underneath.
- **Money** — bills and ad spend going out, paid jobs coming in, ROAS.
- **Contacts** — suppliers with tap-to-call, WhatsApp and email.

Settings holds the price list, the business name, light/dark, and backups.

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
