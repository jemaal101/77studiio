// Builds a tracker state for the tests.
//
// With KL_LIVE=<dir> -- a read_db snapshot, <dir>/jobs/*.json and
// <dir>/products/*.json -- it uses the real rows, so a test runs against what
// the shared store actually holds. That snapshot is never committed: it has
// customers' names and addresses in it. Without it, a small synthetic set
// with the same ids the tests need.
const fs = require('fs'), path = require('path');
const STARTERS = ['Window tint — full car', 'Window tint — front two', 'Windscreen strip', 'Ceramic coating',
  'Full detail', 'Interior detail', 'Cut & polish', 'Paint correction', 'Full wrap', 'Partial wrap', 'Chrome delete',
  'Paint protection film', 'Parts installation', 'Parts supply only'];
function readDir(d) {
  if (!fs.existsSync(d)) return null;
  return fs.readdirSync(d).filter(f => f.endsWith('.json')).map(f => {
    const j = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'));
    return Object.assign({ id: j.id || f.replace(/\.json$/, '') }, j.data || j);
  });
}
function synthetic() {
  const w = (id, customer, car, notes, extra) => Object.assign({ id, customer, car, date: '2026-08-02', status: 'Wanted', serviceIds: [], parts: [], deposit: 0, notes }, extra || {});
  const paid = (id, customer, car, notes, price, materials, date) => ({ id, customer, car, date, paidOn: date, status: 'Paid', price, materials, serviceIds: [], parts: [], deposit: 0, notes });
  return {
    jobs: [
      paid('jb_kl01', 'Customer One', '2019 Audi A4', 'Front Audi badge (273mm)', 40, 6, '2026-08-26'),
      paid('jb_kl09', 'Customer Two', '2017 Audi RS3', 'Front and rear Audi badges', 55, 19.88, '2026-09-08'),
      w('jb_kw01', 'Wanter A', 'Mercedes C300', 'GT grille'),
      w('jb_kw02', '', '2017 VW Golf GTI MK7.5', 'Real carbon bonnet', { price: 1500, materials: 833 }),
      w('jb_kw03', 'Wanter C', '2016 Audi S3 convertible', 'Honeycomb grille'),
      w('jb_kw04', 'Wanter D', '2016 Mercedes E200 W213', 'Ducktail spoiler'),
      w('jb_kw05', 'Wanter E', '2021 BMW 220i', 'Blacked-out grille'),
      w('jb_kw07', 'Wanter F', '2017 Audi A1', 'Honeycomb grille', { price: 300 }),
      w('jb_kw09', 'Wanter G', 'Audi A5', 'Front and rear Audi badges (273 + 192)'),
      w('jb_kw10', 'Kitted Lab (us)', '', 'Kitted Lab stickers')
    ],
    products: [
      { id: 'pr_kb01', name: 'Audi badges, gloss black', category: 'Badges & emblems', qty: 10, uses: 1, cost: 6.05, price: 30, reorder: 4 },
      { id: 'pr_kt01', name: 'Window tint roll', category: 'Tint film', qty: 3, uses: 5, cost: 61.33, reorder: 5 },
      { id: 'pr_ks01', name: 'Steering wheel — Audi S3 8V', category: 'Steering wheel', qty: 1, uses: 1, cost: 576, reorder: '' },
      { id: 'pr_kg01', name: 'Grille — Audi A5 B9 Coupe', category: 'Grille', qty: 0, uses: 1, cost: 149, price: 149, reorder: '' },
      { id: 'pr_ka01', name: 'Air fresheners, branded', category: 'Merch & giveaways', qty: 250, uses: 1, cost: 1.21, price: 0, reorder: 25, gift: true }
    ]
  };
}
function build() {
  const live = process.env.KL_LIVE;
  const jobs = live && readDir(path.join(live, 'jobs')), products = live && readDir(path.join(live, 'products'));
  const base = jobs && products ? { jobs, products } : synthetic();
  return {
    v: 8, stamp: Date.now(),
    meta: { business: 'Kitted Lab', currency: '$', theme: 'system', invNext: 10,
      biz: { legal: 'Kitted Lab', email: 'test@example.com', addr: '1 Test Street', terms: 14, gst: true, gstRate: 10, prefix: 'INV-', numWidth: 4, footer: 'Thanks' } },
    services: STARTERS.map((n, i) => ({ id: 'sv' + i, name: n, price: 0, cost: 0, mode: /wrap|chrome/i.test(n) ? 'soon' : /install|supply/i.test(n) ? 'varies' : 'fixed' })),
    jobs: base.jobs, products: base.products, invoices: [], orders: [], expenses: [], suppliers: [],
    _live: !!(jobs && products)
  };
}
/** Order 2 on top of a state: the supplier, the 19 stock lines at zero, the
    order on the way, and the four pre-orders moved to Booked with their cost. */
function applyOrder2(state, fx) {
  state.suppliers.push(fx.supplier);
  fx.products.forEach(p => state.products.push(Object.assign({}, p)));
  state.orders.push(fx.order);
  Object.keys(fx.jobs).forEach(id => { const j = state.jobs.find(x => x.id === id); if (j) Object.assign(j, fx.jobs[id]); });
  return state;
}
module.exports = { build, applyOrder2 };
