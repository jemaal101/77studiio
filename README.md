# Evolvejem

The website for Evolvejem — an AI-native creative studio for service businesses
and e-commerce brands across Melbourne and Australia.

Tagline: **Marketing, Evolved.**

---

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** with a tight design-token palette
- **Framer Motion** for choreographed scroll reveals
- **next/font** (Instrument Serif, Geist, JetBrains Mono)
- **lucide-react** for line icons

Single long-scroll page with anchored sections. No CMS — all copy lives in
`lib/content.ts`.

---

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve the production build
```

Node 18.18+ recommended (tested on Node 24).

---

## Edit content

Every line of marketing copy and every price is in **`lib/content.ts`**:

- `brand` — name, tagline, email, location, social links
- `navLinks` — top navigation
- `industries` — "Who it's for" grid
- `pillars` — "What we build" alternating editorial blocks
- `tiers` — Pricing bundles (Spark / Pulse / Engine)
- `oneOffs` — One-off services table
- `process` — "How it works" steps
- `why` — "Why Evolvejem" principles

---

## Logo + assets

The wordmark currently renders as text (`Instrument Serif`, italic accent on
"jem"). To swap in the real logo:

1. Drop your SVG into `public/logo.svg`.
2. In `components/sections/nav.tsx` (and `footer.tsx`), replace the wordmark
   block — search for `TODO: swap text wordmark` — with an `<img>` or inline
   SVG element.

Other placeholder assets:

| Path | Status | Notes |
|---|---|---|
| `public/favicon.svg` | Placeholder | Quick mark — replace with real favicon |
| `public/apple-touch-icon.png` | **Missing** | Add a 180×180 PNG |
| `public/og.png` | **Missing** | Add a 1200×630 OpenGraph card |
| Pillar visuals | Placeholder blocks | Search `HERO VISUAL PLACEHOLDER` in `components/sections/pillars.tsx` |

---

## Integration hooks (search for `TODO:` across the codebase)

### Stripe — pricing checkouts
In `lib/content.ts`, replace each tier's `checkoutHref: "#contact"` with a
[Stripe Payment Link](https://stripe.com/payment-links) URL:

```ts
{ id: "spark",  checkoutHref: "https://buy.stripe.com/xxx_spark"  },
{ id: "pulse",  checkoutHref: "https://buy.stripe.com/xxx_pulse"  },
{ id: "engine", checkoutHref: "https://buy.stripe.com/xxx_engine" },
```

For a full Checkout Session flow, the click handler is wired in
`components/sections/pricing.tsx` — search `handleTierClick`. Replace the
`console.log` with a `fetch("/api/checkout", ...)` and add an API route.

### Contact form — Resend / Formspree
`components/sections/contact.tsx`, search `TODO (Contact form)`. Currently
logs to console. Recommended:

- **Resend** — add `RESEND_API_KEY`, build `/api/contact` that calls
  `resend.emails.send`.
- **Formspree** — change the `onSubmit` `console.log` to a `fetch` against
  your form endpoint.

### Lab waitlist — Google Sheet / Formspree
`components/sections/lab.tsx`, search `TODO (Lab waitlist)`. Quickest path:
Formspree form pointed at a Google Sheet. The email is already validated
client-side.

### Calendar booking
`components/sections/contact.tsx`, search `embed Cal.com`. Drop a
Cal.com / SavvyCal `<iframe>` (or their embed script) where the placeholder
copy lives.

### Social URLs
`lib/content.ts` → `brand.social`. Replace the three placeholder URLs.

---

## Accessibility

- Semantic landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`)
- `aria-labelledby` on every section
- Focus-visible ring (purple, deliberate)
- Keyboard: Escape closes the mobile menu; tab order is DOM order
- `prefers-reduced-motion` collapses all entrance animations
- Form validation announces errors via `aria-invalid` + `aria-describedby`

---

## Performance notes

- Fonts loaded via `next/font` (zero layout shift, self-hosted at build)
- No external image hosts — placeholders are CSS / inline SVG
- Tree-shaken `lucide-react` icons
- No client JS on `Footer` link grid until interaction
- `noise` overlay is a tiny inlined SVG data-URI

Lighthouse target: 95+ across the board. Real numbers depend on hosting —
deploy to Vercel for accurate metrics.

---

## Project structure

```
app/
  layout.tsx        Root layout, fonts, metadata
  page.tsx          Single-page composition
  globals.css       Tokens + utilities
  not-found.tsx     404
components/
  ui/
    reveal.tsx          Scroll-triggered reveal + stagger
    magnetic-button.tsx Magnetic-cursor CTAs
  sections/
    nav.tsx       Sticky nav + mobile overlay
    hero.tsx      Choreographed entrance
    industries.tsx
    pillars.tsx
    pricing.tsx
    process.tsx   Scroll-driven progress rail
    lab.tsx       Sub-brand + waitlist
    why.tsx
    contact.tsx   Form w/ validation + success state
    footer.tsx
lib/
  content.ts      All marketing copy + prices
  utils.ts        cn() class merger
public/
  favicon.svg
  robots.txt
```

---

## License

© Evolvejem. All rights reserved.
