// ─────────────────────────────────────────────────────────────────────────────
// Evolvejem — content registry
// All marketing copy and pricing lives here so the owner can edit one file.
// ─────────────────────────────────────────────────────────────────────────────

import {
  Coffee,
  Wrench,
  Scissors,
  Car,
  ShoppingBag,
  Dumbbell,
  Home,
  Package,
} from "lucide-react";

export const brand = {
  name: "77 Studio Co",
  shortName: "77",
  tagline: "Marketing, Evolved.",
  email: "77marketing.co@gmail.com",
  phone: "0478251089",
  phoneDisplay: "+61 478 251 089",
  location: "Melbourne, Australia",
  social: {
    instagram: "https://instagram.com/77studioco",
    instagramHandle: "@77studioco",
    tiktok: "https://tiktok.com/@77studioco",
    linkedin: "https://linkedin.com/company/77studioco",
  },
};

export const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Pricing", href: "#pricing" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export const industries = [
  { label: "Cafés & Restaurants", icon: Coffee },
  { label: "Tradies", icon: Wrench, sub: "Sparkies, plumbers, builders" },
  { label: "Barbers & Salons", icon: Scissors },
  { label: "Car Detailers", icon: Car },
  { label: "E-commerce Brands", icon: ShoppingBag },
  { label: "Personal Trainers", icon: Dumbbell },
  { label: "Real Estate Agents", icon: Home },
  { label: "Anyone with a product or service", icon: Package },
];

export const pillars: {
  n: string;
  title: string;
  body: string;
  video?: string; // optional looped MP4 — when set, replaces the numeral placeholder
  image?: string; // optional still image — used when no video
}[] = [
  {
    n: "01",
    title: "Short-form video",
    body: "Hooks that stop the scroll. Edits that drive the click. We brief, generate, edit, and caption every reel — built for the algorithm, designed for your customer.",
    video: "/pillars/pillar-03.mp4",
  },
  {
    n: "02",
    title: "Static and photo content",
    body: "Daily presence without the daily grind. Branded posts, story sequences, seasonal drops — done weekly, delivered to your Drive.",
    image: "/77-graffiti.jpg",
  },
  {
    n: "03",
    title: "Commercials and product breakdowns",
    body: "Cinematic ads. AI-fast. Human-quality. The kind of work agencies bill $5,000 for, delivered in days, not weeks.",
    video: "/pillars/pillar-01.mp4",
  },
  {
    n: "04",
    title: "Strategy and monthly reviews",
    body: "We don't disappear after delivery. Every month: a strategy call. Where we won. Where we pivot. What's next.",
    image: "/pillars/strategy.png",
  },
];

export type Tier = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  symbol: string;
  popular?: boolean;
  features: string[];
  bestFor: string;
  // TODO: replace with Stripe payment link or checkout session URL
  checkoutHref: string;
};

export const tiers: Tier[] = [
  {
    id: "spark",
    name: "Spark",
    price: "397",
    cadence: "/month",
    symbol: "⚡",
    features: [
      "4 reels per month",
      "8 photo posts",
      "1 week of stories",
      "Captions included",
    ],
    bestFor: "Solo operators — tradies, barbers, one-location cafés",
    checkoutHref: "#contact", // TODO: connect Stripe payment link for Spark
  },
  {
    id: "pulse",
    name: "Pulse",
    price: "697",
    cadence: "/month",
    symbol: "💓",
    popular: true,
    features: [
      "10 reels per month",
      "15 photo posts",
      "Daily stories",
      "1 product breakdown video",
      "Monthly strategy call",
    ],
    bestFor: "Growing restaurants, service businesses, ambitious solo operators",
    checkoutHref: "#contact", // TODO: connect Stripe payment link for Pulse
  },
  {
    id: "engine",
    name: "Engine",
    price: "1,297",
    cadence: "/month",
    symbol: "🔥",
    features: [
      "20 reels per month",
      "Unlimited photos",
      "Daily stories",
      "2 commercial-style videos",
      "Bi-weekly strategy calls",
    ],
    bestFor: "Multi-location businesses, e-commerce brands, premium positioning",
    checkoutHref: "#contact", // TODO: connect Stripe payment link for Engine
  },
];

export const oneOffs = [
  { service: "Static post", price: "$87" },
  { service: "Video", price: "$137" },
  { service: "Website build", price: "$497 (one-time)" },
  { service: "Add-ons (Meta ads, UGC, 3D, bilingual)", price: "Custom quote" },
];

export const process = [
  {
    step: "01",
    title: "Discovery call",
    body: "15 minutes. We learn your business, your audience, your goals. No pitch deck — just questions.",
  },
  {
    step: "02",
    title: "Pick your bundle",
    body: "Spark, Pulse, Engine, or Custom. Pay the first month upfront. Lock your start date.",
  },
  {
    step: "03",
    title: "We build",
    body: "Content delivered weekly to your Google Drive. Approve, post, win.",
  },
  {
    step: "04",
    title: "Monthly review",
    body: "Strategy call to align next month. Christmas push? New product launch? Seasonal angle? We map it.",
  },
];

export type WorkSample = {
  n: string;
  // Either image or video — video takes priority when both set
  image?: string;
  video?: string;
  title: string;
  client: string;
  discipline: string;
  note: string;
};

// Featured — readable case-study slides shown one at a time in the cinematic
// stage. The user dwells on each, reads it, then advances.
export const workSamplesFeatured: WorkSample[] = [
  {
    n: "01",
    image: "/case/01.png",
    title: "Print-ready marketing assets",
    client: "Vitamin Focus",
    discipline: "Static · campaign system",
    note: "One brand. Three formats — Instagram square, story reel, website banner — designed in a single sweep. Cohesive, on-brand, ready to ship.",
  },
  {
    n: "02",
    image: "/case/02.png",
    title: "Mockup testing for packaging variants",
    client: "Vitamin Focus",
    discipline: "Mockup · pre-print",
    note: "Three packaging directions rendered with photoreal AI before any expensive print proof. Pick the winner with confidence, not a wishlist.",
  },
  {
    n: "03",
    image: "/case/03.png",
    title: "Editing & repurposing existing materials",
    client: "Vitamin Focus",
    discipline: "Editorial · repurpose",
    note: "One can. New format. The customer journey extended into the next moment without booking another shoot day.",
  },
  {
    n: "04",
    image: "/case/04.png",
    title: "System rollout",
    client: "Vitamin Focus",
    discipline: "Editorial · campaign",
    note: "The full brand system in motion — the campaign extended from a single concept into every touchpoint.",
  },
];

// Gallery — visual-heavy: videos and images that don't need to be read.
// Lives in the hover-expand horizontal strip beneath the featured stage.
export const workSamplesGallery: WorkSample[] = [
  {
    n: "05",
    video: "/work/work-recent.mp4",
    title: "Studio reel",
    client: "77 Studio Co",
    discipline: "Motion · reel",
    note: "Fresh studio cut. Multi-format, on-brand.",
  },
  {
    n: "06",
    video: "/work/work-hf.mp4",
    title: "AI cinematic",
    client: "Studio brief",
    discipline: "Motion · generated",
    note: "Brief to delivery in under 24 hours.",
  },
  {
    n: "07",
    video: "/work/work-hf2.mp4",
    title: "AI cinematic — set 02",
    client: "Studio brief",
    discipline: "Motion · generated",
    note: "Concept variant. Same brief, different angle.",
  },
  {
    n: "08",
    video: "/work/work-hf3.mp4",
    title: "AI cinematic — set 03",
    client: "Studio brief",
    discipline: "Motion · generated",
    note: "Third variant. Picked, polished, shipped.",
  },
  {
    n: "08b",
    video: "/work/work-hf4.mp4",
    title: "AI cinematic — set 04",
    client: "Studio brief",
    discipline: "Motion · generated",
    note: "Vertical hero cut. Compressed for the web, sharp on every screen.",
  },
  {
    n: "09",
    video: "/pillars/pillar-01.mp4",
    title: "Beverage motion",
    client: "Kinza",
    discipline: "Short-form video",
    note: "Scroll-stop hook in 1.2 seconds.",
  },
  {
    n: "10",
    image: "/pillars/mixedgrill.png",
    title: "The Mixed Grill",
    client: "Lokum Turkish Grill",
    discipline: "Menu · key art",
    note: "Hero menu shot built for paid + organic.",
  },
  {
    n: "11",
    image: "/work/work-4.png",
    title: "Hero composition",
    client: "Studio",
    discipline: "Static · key art",
    note: "Print-ready key art.",
  },
];

// Legacy single list — used by anything that imports `workSamples`.
export const workSamples: WorkSample[] = [
  ...workSamplesFeatured,
  ...workSamplesGallery,
];

export const clients = [
  { name: "Turka", logo: "/clients/turka.png" },
  { name: "Kinza", logo: "/clients/kinza.png" },
  { name: "Lokum Turkish Grill", logo: "/clients/lokum.png" },
  { name: "Sedko", logo: "/clients/sedko.png" },
  { name: "Euro Car Details", logo: "/clients/eurocar.png" },
  { name: "EC Dress Hire", logo: "/clients/ecdresshire.png" },
  { name: "Freshout", logo: "/clients/freshout.png" },
];

export const why = [
  {
    title: "AI-leveraged. Human-led.",
    body: "We use the same AI tools as the biggest agencies in the world. Without the bloat. Without the bullshit. Without the $10k retainer.",
  },
  {
    title: "Built for the new era.",
    body: "The traditional agency model is dying. The future is a small team, world-class tools, and obsessive attention to one thing: making content that performs.",
  },
  {
    title: "No lock-ins. No surprises.",
    body: "Month-to-month. Transparent pricing. You own everything we make. If it's not working, you leave. Most don't.",
  },
];

export type WhyTab = {
  id: string;
  label: string;
  headline: string;
  us: { value: string; detail: string };
  them: { value: string; detail: string };
};

export const whyTabs: WhyTab[] = [
  {
    id: "cost",
    label: "Cost",
    headline: "We charge for output, not headcount.",
    us: {
      value: "From $397/mo",
      detail:
        "Flat monthly bundles. No setup fees. No mystery line items. You always know what you're paying.",
    },
    them: {
      value: "$5–10k retainer",
      detail:
        "Account managers, strategists, creatives, producers — and a markup on every freelancer they don't tell you about.",
    },
  },
  {
    id: "speed",
    label: "Speed",
    headline: "Days, not quarters.",
    us: {
      value: "Brief to delivery in 48–72h",
      detail:
        "One operator. AI-accelerated production. No four-person meeting to approve a thumbnail.",
    },
    them: {
      value: "3–6 weeks",
      detail:
        "Brief, kickoff, mood-board approval, revision rounds, status meetings, more revisions. The campaign is over before it ships.",
    },
  },
  {
    id: "ownership",
    label: "Ownership",
    headline: "You own everything. Period.",
    us: {
      value: "Full rights, raw files",
      detail:
        "Every reel, every still, every project file — yours to keep, edit, re-cut, license. Forever.",
    },
    them: {
      value: "Usage rights only",
      detail:
        "Pay extra to use it on a new platform. Pay again to keep using it after the campaign ends. Pay forever.",
    },
  },
  {
    id: "lockin",
    label: "Lock-ins",
    headline: "Month-to-month. Cancel anytime.",
    us: {
      value: "Zero contracts",
      detail:
        "30-day notice. No early-termination fee. If it's not working, you leave. Most don't.",
    },
    them: {
      value: "12-month minimum",
      detail:
        "Annual contract, quarterly invoicing, auto-renew clauses. Want out early? Read the fine print.",
    },
  },
  {
    id: "scale",
    label: "Scale",
    headline: "Pillars unlock as you grow.",
    us: {
      value: "Start small. Scale in weeks.",
      detail:
        "Spark → Pulse → Engine → Custom. Add ads, UGC, 3D, bilingual whenever you're ready.",
    },
    them: {
      value: "Re-scope. Re-quote. Re-sign.",
      detail:
        "New deliverable? New SOW. New SOW means new approvals, new contracts, new lead time.",
    },
  },
];
