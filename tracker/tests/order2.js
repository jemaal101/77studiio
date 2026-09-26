// Order 2: a real China order logged as an order on the way, not as stock
// that is already on the shelf. Proves the low-stock rule counts what is on
// the way, that "It arrived" lands everything on the shelf in one tap, and
// that a pre-order moved to Booked carries the cost of its part.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const { build, applyOrder2 } = require('./fixture');
const SRC = 'file://' + (process.env.KL_PAGE || path.resolve(__dirname, '../kitted-lab-tracker.html'));
const FX = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures/order2.json'), 'utf8'));
let pass = 0, fail = 0;
async function t(n, fn) { try { await fn(); console.log('  PASS  ' + n); pass++; } catch (e) { console.log('  FAIL  ' + n + ' -> ' + String(e.message || e).split('\n')[0]); fail++; } }
const hasI = (h, s) => { if (!h.toLowerCase().includes(s.toLowerCase())) throw new Error('missing ' + JSON.stringify(s) + ' in ' + h.slice(0, 240)); };
const noI = (h, s) => { if (h.toLowerCase().includes(s.toLowerCase())) throw new Error('should not have ' + JSON.stringify(s)); };
const eq = (a, b, m) => { if (String(a) !== String(b)) throw new Error((m || '') + ' got ' + a + ' want ' + b); };
const near = (a, b, m) => { if (Math.abs(Number(String(a).replace(/[^0-9.\-]/g, '')) - b) > 0.011) throw new Error((m || '') + ' got ' + a + ' want ' + b); };

(async () => {
  const S = applyOrder2(build(), FX);
  // a control: something at zero with NOTHING on the way must still warn
  S.products.push({ id: 'pr_ctrl', name: 'Control item, nothing coming', category: 'Other', qty: 0, uses: 1, cost: 5, price: 0, reorder: 2 });
  console.log((S._live ? 'live snapshot' : 'synthetic fixture') + ': ' + S.jobs.length + ' jobs, ' + S.products.length + ' products, ' + S.orders.length + ' order');
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route('**fonts.g**', r => r.abort());
  await pg.addInitScript(st => { localStorage.setItem('kittedlab.tracker.v2', JSON.stringify(st)); localStorage.setItem('kittedlab.seen-help', '1'); }, S);
  await pg.goto(SRC, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(900);
  const go = async k => { await pg.evaluate(x => [...document.querySelectorAll('[data-tab=' + x + ']')].filter(e => e.offsetParent)[0].click(), k); await pg.waitForTimeout(450); };
  const st = () => pg.evaluate(() => JSON.parse(localStorage.getItem('kittedlab.tracker.v2')));
  const main = () => pg.textContent('main');

  console.log('--- the day the order is placed, Home is calm ---');
  await t('nineteen new lines at zero are NOT nineteen alarms', async () => {
    const todo = await pg.$$eval('.todo', els => els.map(e => e.textContent));
    const low = todo.filter(x => /running low|none left/i.test(x));
    eq(low.length, 1, 'low rows (only the control)');
    hasI(low[0], 'Control item');
  });
  await t('the control item with nothing coming still warns', async () => {
    hasI(await main(), 'Control item, nothing coming');
  });
  await t('four pre-orders are now booked in, four still waiting', async () => {
    // the label, the number and the money are three elements with no space between them
    const cells = await pg.$$eval('.stage', els => els.map(e => ({ l: e.querySelector('.l').textContent, n: e.querySelector('.n').textContent.trim(), v: e.querySelector('.v').textContent })));
    const booked = cells.find(c => /booked in/i.test(c.l)), want = cells.find(c => /waiting on a part/i.test(c.l));
    eq(booked.n, 4, 'booked'); hasI(booked.v, '$300');   // only one of the four has a price yet
    eq(want.n, 4, 'still waiting');
  });
  await t('a booked pre-order with no fitting date is not shown as overdue', async () => {
    const rows = await pg.$$eval('.todo', els => els.map(e => ({ cls: e.className, txt: e.textContent })));
    const booked = rows.filter(r => /is booked in/i.test(r.txt));
    eq(booked.length, 4, 'booked rows');
    booked.forEach(r => { if (/\bbad\b/.test(r.cls)) throw new Error('shown red: ' + r.txt); hasI(r.txt, 'No date'); });
  });

  console.log('--- Stock says what is coming ---');
  await go('stock');
  await t('every new line shows how many are on the way', async () => {
    const coming = await pg.$$eval('td[data-l="Coming"] .chip', els => els.map(e => e.textContent.trim()));
    eq(coming.filter(x => x === '+10').length, 12, '+10 lines');
    eq(coming.filter(x => x === '+5').length, 5, '+5 lines');
    eq(coming.filter(x => x === '+1').length, 2, '+1 lines');
  });
  await t('nothing on the way is called low; only the control is', async () => {
    await pg.click('[data-act="stock-filter"][data-v="low"]'); await pg.waitForTimeout(400);
    const names = await pg.$$eval('tbody .rowtitle', els => els.map(e => e.textContent));
    eq(names.length, 1, 'low rows'); hasI(names[0], 'Control');
    await pg.click('[data-act="stock-filter"][data-v="all"]'); await pg.waitForTimeout(300);
  });

  console.log('--- the order itself ---');
  await go('orders');
  await t('Order 2 is on the way, from the supplier, with its landed total', async () => {
    const card = await pg.locator('article.job').first().innerText();
    hasI(card, 'Order 2'); hasI(card, 'On the way'); hasI(card, 'Express courier'); hasI(card, '$974');
    noI(card, 'late');
    if (!/in 1 day\b|Due today|in \d+ days/.test(card)) throw new Error('due wording: ' + card.slice(0, 200));
  });
  await t('"It arrived" puts all 147 units on the shelf in one tap', async () => {
    await pg.click('article.job [data-act="receive"]'); await pg.waitForTimeout(350);
    hasI(await pg.locator('.drawer').innerText(), '147 units');
    await pg.click('[data-act="confirm-yes"]'); await pg.waitForTimeout(600);
    const s = await st();
    const q = id => s.products.find(p => p.id === id).qty;
    eq(q('pr_o2_a273'), 10, 'Audi 273'); eq(q('pr_o2_b05'), 10, 'a BMW line'); eq(q('pr_o2_m3'), 5, 'a Mercedes line'); eq(q('pr_o2_lip'), 1, 'front lip');
    eq(s.orders[0].status, 'Arrived'); eq(s.orders[0].applied, true);
  });
  await t('and marking it again cannot add them twice', async () => {
    const before = (await st()).products.find(p => p.id === 'pr_o2_a273').qty;
    await go('orders');
    const btn = await pg.$('article.job [data-act="receive"]');
    if (btn) throw new Error('It arrived is still offered on an arrived order');
    eq((await st()).products.find(p => p.id === 'pr_o2_a273').qty, before, 'unchanged');
  });
  await t('Stock now shows them on the shelf, nothing coming, and the money in it', async () => {
    await go('stock');
    const coming = await pg.$$eval('td[data-l="Coming"] .chip', els => els.length);
    eq(coming, 0, 'coming chips');
    const h = await main();
    hasI(h, '25 items');                         // 5 + 19 + the control
    near(h.match(/\$([\d,]+)\s+of your money/)[1].replace(/,/g, ''), 2097, 'money on the shelf');   // 1,122.99 + 974.46 to the dollar
  });
  await t('a booked pre-order carries the cost of its part', async () => {
    const s = await st();
    near(s.jobs.find(j => j.id === 'jb_kw03').materials, 150.51, 'grille');
    near(s.jobs.find(j => j.id === 'jb_kw04').materials, 91.08, 'spoiler');
    eq(s.jobs.find(j => j.id === 'jb_kw07').price, 300, 'the quoted one keeps its price');
  });
  await t('no page errors', async () => { if (errs.length) throw new Error(errs.join(' | ')); });
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  await b.close(); process.exit(fail ? 1 : 0);
})();
