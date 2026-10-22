// Teste end-to-end pentru situațiile cerute în temă (secțiunea 7).
// Rulare: pornește `npm run dev`, apoi `npm test` (sau BASE_URL=https://... npm test pentru site-ul publicat).
// Folosește Chrome-ul instalat pe calculator, prin playwright-core.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const REAL_SEND = process.env.REAL_SEND !== '0'; // 0 = nu trimite e-mailuri reale
const TEST_EMAIL = process.env.TEST_EMAIL || 'test.arcada@example.com';
const OUT = new URL('./output/', import.meta.url);
mkdirSync(OUT, { recursive: true });

const results = [];
const ip = () => `10.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;

async function test(name, fn, { viewport = { width: 1280, height: 860 }, reducedMotion, ownIp = false } = {}) {
  const ctx = await browser.newContext({ viewport, reducedMotion, extraHTTPHeaders: ownIp ? {} : { 'x-forwarded-for': ip() } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  try {
    await fn(page, ctx);
    if (errors.length) throw new Error(`Erori JS în pagină: ${errors.join(' | ')}`);
    results.push({ name, ok: true });
    console.log(`  ✓ ${name}`);
  } catch (err) {
    results.push({ name, ok: false, err: err.message });
    console.log(`  ✗ ${name}\n      ${err.message.split('\n')[0]}`);
    await page.screenshot({ path: fileURLToPath(new URL(`fail-${results.length}.png`, OUT)) }).catch(() => {});
  } finally {
    await ctx.close();
  }
}

const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
const errText = (page, field) => page.locator(`[data-field="${field}"] .field__msg`).textContent();
async function open(page) {
  await page.goto(BASE, { waitUntil: 'networkidle' });
}
async function fill(page, { name = 'Ana Pop', email = TEST_EMAIL, phone = '0722 123 456', message = 'Test automat: caut un apartament cu 2 camere în Gheorgheni.' } = {}) {
  await page.fill('#f-name', name);
  await page.fill('#f-email', email);
  await page.fill('#f-phone', phone);
  await page.fill('#f-message', message);
}
const waitFill = (page) => page.waitForTimeout(3200); // serverul respinge formularele trimise în sub 3 s

const browser = await chromium.launch({ channel: 'chrome', headless: true });
console.log(`\nTestez ${BASE}\n`);

/* 1. Formular gol */
await test('Trimiterea formularului gol: 4 erori lângă câmpuri, nicio cerere trimisă', async (page) => {
  await open(page);
  let calls = 0;
  page.on('request', (r) => { if (r.url().includes('/api/contact')) calls++; });
  await page.click('[data-submit]');
  for (const f of ['name', 'email', 'phone', 'message']) {
    const t = await errText(page, f);
    assert(t && t.length > 10, `Lipsește mesajul de eroare pentru ${f}`);
    assert((await page.getAttribute(`[data-field="${f}"] ${f === 'message' ? 'textarea' : 'input:not([type=hidden])'}`, 'aria-invalid')) === 'true', `${f} nu are aria-invalid`);
  }
  assert(await page.evaluate(() => document.activeElement.id === 'f-name'), 'Focusul nu a mers pe primul câmp greșit');
  assert(calls === 0, 'S-a trimis o cerere deși formularul era gol');
});

/* 2. E-mail greșit */
await test('E-mail cu format greșit: mesaj clar lângă câmp; datele rămân', async (page) => {
  await open(page);
  await fill(page, { email: 'ana@exemplu' });
  await page.click('[data-submit]');
  const t = await errText(page, 'email');
  assert(/Formatul adresei nu e corect/.test(t), `Mesaj neașteptat: ${t}`);
  assert((await page.inputValue('#f-name')) === 'Ana Pop', 'Numele a fost șters');
  await page.fill('#f-email', 'ana.pop');
  await page.locator('#f-email').blur();
  assert(/„@”/.test(await errText(page, 'email')), 'Nu explică lipsa „@”');
});

/* 3. Telefon invalid */
await test('Număr de telefon invalid pentru țara aleasă (România)', async (page) => {
  await open(page);
  await fill(page, { phone: '0722 12' });
  await page.click('[data-submit]');
  const t = await errText(page, 'phone');
  assert(/nu este valid pentru România/.test(t), `Mesaj neașteptat: ${t}`);
});

/* 4. Prefix internațional → țara detectată */
await test('Prefix internațional: +39 detectează Italia, +44 Regatul Unit, 0049 Germania', async (page) => {
  await open(page);
  for (const [num, code, label] of [['+39 312 345 6789', 'IT', 'Italia'], ['+44 7400 123456', 'GB', 'Regatul Unit'], ['+44 7911 123456', 'GG', 'Guernsey'], ['0049 1512 3456789', 'DE', 'Germania']]) {
    await page.fill('#f-phone', '');
    await page.locator('#f-phone').pressSequentially(num, { delay: 10 });
    assert((await page.inputValue('[data-country-value]')) === code, `${num}: țara nu e ${code}`);
    assert((await page.textContent('[data-phone-hint]')).includes(label), `${num}: indiciul nu numește ${label}`);
  }
  await page.locator('#f-phone').blur();
  assert(!(await errText(page, 'phone')), 'Numărul german valid e marcat ca greșit');
});

/* 5. Schimbarea manuală a țării */
await test('Schimbare manuală a țării din listă (căutare + tastatură) și conflict de prefix', async (page) => {
  await open(page);
  await page.click('[data-country-btn]');
  assert(await page.isVisible('[data-country-pop]'), 'Lista de țări nu s-a deschis');
  assert((await page.locator('.country__opt img.flag').count()) > 200, 'Lista nu are steaguri pentru țări');
  await page.keyboard.type('moldo');
  await page.keyboard.press('Enter');
  assert((await page.inputValue('[data-country-value]')) === 'MD', 'Nu s-a ales Moldova');
  assert((await page.textContent('[data-country-code]')) === '+373', 'Prefixul afișat nu e +373');
  await page.fill('#f-phone', '069 123 456');
  await page.locator('#f-phone').blur();
  assert(!(await errText(page, 'phone')), `Număr moldovenesc valid respins: ${await errText(page, 'phone')}`);
  // prefix britanic, apoi omul alege România de mână → explicăm conflictul, nu schimbăm țara peste el
  await page.fill('#f-phone', '');
  await page.locator('#f-phone').pressSequentially('+44 7911 123456', { delay: 5 });
  await page.click('[data-country-btn]');
  await page.keyboard.type('Rom');
  await page.keyboard.press('Enter');
  assert((await page.inputValue('[data-country-value]')) === 'RO', 'Alegerea manuală a fost suprascrisă');
  assert(/prefixul \+44/.test(await errText(page, 'phone')), `Conflictul nu e explicat: ${await errText(page, 'phone')}`);
});

/* 6. Eroare de trimitere + reîncercare */
await test('Eroare de rețea: mesaj explicit, datele rămân, reîncercarea reușește', async (page) => {
  await open(page);
  let first = true;
  await page.route('**/api/contact', (route) => {
    if (first) { first = false; return route.abort('internetdisconnected'); }
    return REAL_SEND ? route.continue() : route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await fill(page, { message: 'Test automat: eroare de rețea, apoi reîncercare.' });
  await waitFill(page);
  await page.click('[data-submit]');
  await page.waitForSelector('[data-form-alert]:not([hidden])');
  assert(/conecta la server/.test(await page.textContent('[data-form-alert-text]')), 'Mesajul de eroare nu explică problema');
  assert(await page.isHidden('[data-success]'), 'Succesul a apărut deși trimiterea a eșuat');
  assert((await page.inputValue('#f-email')) === TEST_EMAIL, 'Datele s-au pierdut după eroare');
  await page.click('[data-retry]');
  await page.waitForSelector('[data-success]:not([hidden])', { timeout: 25000 });
});

/* 7. Eroare de server */
await test('Eroare de server (502): mesajul serverului apare, formularul rămâne', async (page) => {
  await open(page);
  await page.route('**/api/contact', (r) => r.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ ok: false, message: 'Nu am reușit să trimitem e-mailul de confirmare.' }) }));
  await fill(page);
  await waitFill(page);
  await page.click('[data-submit]');
  await page.waitForSelector('[data-form-alert]:not([hidden])');
  assert(/Nu am reușit/.test(await page.textContent('[data-form-alert-text]')), 'Mesajul serverului lipsește');
  assert(await page.isVisible('[data-form]'), 'Formularul a dispărut');
});

/* 8. Trimitere repetată */
await test('Trimitere repetată: o singură cerere, buton blocat și stare de încărcare', async (page) => {
  await open(page);
  let calls = 0;
  await page.route('**/api/contact', async (route) => {
    calls++;
    await new Promise((r) => setTimeout(r, 1500));
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await fill(page);
  await waitFill(page);
  await page.click('[data-submit]');
  await page.waitForTimeout(100);
  assert((await page.getAttribute('[data-submit]', 'aria-busy')) === 'true', 'Lipsește starea de încărcare');
  assert(/Se trimite/.test(await page.textContent('[data-submit-label]')), 'Textul de încărcare lipsește');
  await page.click('[data-submit]', { force: true }).catch(() => {});
  await page.locator('[data-form]').evaluate((f) => { f.requestSubmit(); f.requestSubmit(); });
  await page.waitForSelector('[data-success]:not([hidden])');
  assert(calls === 1, `S-au trimis ${calls} cereri în loc de 1`);
});

/* 9. Trimitere reală, cap-coadă */
if (REAL_SEND) {
  await test(`Trimitere corectă: serverul trimite e-mailurile (${TEST_EMAIL}) și apare succesul`, async (page) => {
    await open(page);
    await fill(page, { name: 'Test Arcada', message: `Test automat cap-coadă, ${new Date().toISOString()}.` });
    await waitFill(page);
    const [res] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/contact'), { timeout: 30000 }),
      page.click('[data-submit]'),
    ]);
    assert(res.status() === 200, `Serverul a răspuns ${res.status()}: ${await res.text()}`);
    await page.waitForSelector('[data-success]:not([hidden])');
    assert((await page.textContent('[data-success-email]')) === TEST_EMAIL, 'Succesul nu arată adresa');
    assert(await page.evaluate(() => document.activeElement.matches('[data-success]')), 'Focusul nu a mers pe mesajul de succes');
  });
}

/* 10. Validare pe server, antispam, limită */
await test('Server: validează singur datele, oprește roboții și trimiterile excesive', async (page) => {
  await open(page);
  const post = (body, xff) => page.evaluate(async ([b, x]) => {
    const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': x }, body: JSON.stringify(b) });
    return { status: r.status, body: await r.json() };
  }, [body, xff]);
  const old = Date.now() - 10000;
  const bad = await post({ name: 'A', email: 'x@y', phone: '123', country: 'RO', message: 'scurt', startedAt: old }, ip());
  assert(bad.status === 422 && Object.keys(bad.body.errors).length === 4, `Validarea pe server: ${JSON.stringify(bad)}`);
  const conflict = await post({ name: 'Ana', email: 'a@b.ro', phone: '+447911123456', country: 'RO', message: 'Mesaj destul de lung.', startedAt: old }, ip());
  assert(conflict.status === 422 && /\+44/.test(conflict.body.errors.phone), 'Serverul nu verifică țara numărului');
  const fast = await post({ name: 'Ana', startedAt: Date.now() }, ip());
  assert(fast.status === 400, `Trimiterea instantanee nu e oprită (${fast.status})`);
  const bot = await post({ company: 'SpamCo', name: 'x', startedAt: old }, ip());
  assert(bot.status === 200 && bot.body.ok, 'Capcana pentru roboți nu răspunde neutru');
  const same = ip();
  const statuses = [];
  for (let i = 0; i < 7; i++) statuses.push((await post({ name: 'A', startedAt: old }, same)).status);
  assert(statuses.slice(0, 5).every((s) => s === 422) && statuses[5] === 429, `Limita nu funcționează: ${statuses}`);
  const get = await page.evaluate(async () => (await fetch('/api/contact')).status);
  assert(get === 405, 'GET pe /api/contact ar trebui refuzat');
}, { ownIp: true });

/* 11. Mobil, tabletă, desktop */
for (const vp of [{ width: 360, height: 780 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
  await test(`Afișare ${vp.width}×${vp.height}: fără derulare orizontală, meniu funcțional`, async (page) => {
    await open(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert(overflow <= 0, `Pagina depășește lățimea cu ${overflow}px`);
    if (vp.width < 1040) {
      await page.click('[data-burger]');
      assert(await page.isVisible('.menu__list a[href="#intrebari"]'), 'Meniul mobil nu se deschide');
      await page.click('.menu__list a[href="#intrebari"]');
      await page.waitForTimeout(900);
      assert((await page.getAttribute('[data-burger]', 'aria-expanded')) === 'false', 'Meniul nu se închide după alegere');
    } else {
      assert(await page.isVisible('.menu__list a[href="#cum-lucram"]'), 'Meniul desktop nu e vizibil');
    }
    await page.screenshot({ path: fileURLToPath(new URL(`layout-${vp.width}.png`, OUT)), fullPage: false });
  }, { viewport: vp });
}

/* 12. Tastatură */
await test('Navigare cu tastatura: link de salt, bandă, meniu, plan, formular', async (page) => {
  await open(page);
  const order = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    order.push(await page.evaluate(() => {
      const el = document.activeElement;
      return (el.id || el.dataset.pin || el.getAttribute('href') || el.className || el.tagName).toString().slice(0, 40);
    }));
  }
  assert(order[0] === '#continut', `Primul Tab nu ajunge la „Sari la conținut”: ${order[0]}`);
  assert(order.some((o) => o.includes('tape__toggle')), 'Butonul benzii nu e accesibil din tastatură');
  assert(order.includes('#intrebari'), 'Meniul nu e accesibil din tastatură');
  // pe plan: Enter pe un punct deschide descrierea
  await page.focus('[data-pin="2"]');
  await page.keyboard.press('Enter');
  assert(await page.locator('#punct-2').evaluate((el) => el.classList.contains('is-open')), 'Punctul 3 nu se deschide cu Enter');
  // întrebări frecvente: <summary> cu Enter
  await page.focus('.qa:nth-child(2) summary');
  await page.keyboard.press('Enter');
  assert(await page.locator('.qa:nth-child(2)').evaluate((d) => d.open), 'Întrebarea nu se deschide cu Enter');
  // lista de țări cu săgeți și Escape
  await page.focus('[data-country-btn]');
  await page.keyboard.press('ArrowDown');
  assert(await page.isVisible('[data-country-pop]'), 'Lista de țări nu se deschide cu săgeata');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Escape');
  assert(await page.isHidden('[data-country-pop]'), 'Escape nu închide lista');
  assert(await page.evaluate(() => document.activeElement.matches('[data-country-btn]')), 'Focusul nu revine pe buton');
});

/* 13. Video, WhatsApp, linkuri, bandă */
await test('Video: copertă, controale, fără pornire automată și fără sonor', async (page) => {
  await open(page);
  const v = await page.$eval('.video', (v) => ({ poster: v.poster, controls: v.controls, autoplay: v.autoplay, muted: v.muted, paused: v.paused, preload: v.preload }));
  assert(v.poster.endsWith('vizionare-coperta.webp') && v.controls && !v.autoplay && v.muted && v.paused, JSON.stringify(v));
  const poster = await page.evaluate(async (u) => (await fetch(u)).status, v.poster);
  assert(poster === 200, 'Coperta nu se încarcă');
  await page.$eval('.video', (v) => v.play());
  await page.waitForTimeout(1200);
  assert(await page.$eval('.video', (v) => v.currentTime > 0.3 && v.readyState >= 2), 'Clipul nu rulează');
});

await test('WhatsApp și toate linkurile: wa.me cu numărul configurat, ancore valide, fișiere existente', async (page) => {
  await open(page);
  const wa = await page.getAttribute('[data-wa]', 'href');
  assert(/^https:\/\/wa\.me\/\d{8,15}\?text=/.test(wa), `Link WhatsApp greșit: ${wa}`);
  const hashes = await page.$$eval('a[href^="#"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
  const missing = await page.evaluate((hs) => hs.filter((h) => !document.querySelector(h)), hashes);
  assert(!missing.length, `Ancore fără țintă: ${missing}`);
  const tel = await page.getAttribute('a[href^="tel:"]', 'href');
  const mail = await page.getAttribute('a[href^="mailto:"]', 'href');
  assert(/^tel:\+\d{8,15}$/.test(tel) && /^mailto:[^@\s]+@[^@\s]+$/.test(mail), `Contact: ${tel} ${mail}`);
  const left = await page.evaluate(() => document.body.innerHTML.match(/__[A-Z_]+__/g));
  assert(!left, `Au rămas texte provizorii: ${left}`);
  const urls = await page.evaluate(() => [
    ...[...document.querySelectorAll('img')].map((i) => i.currentSrc || i.src),
    ...[...document.querySelectorAll('source[srcset]')].flatMap((s) => s.srcset.split(',').map((p) => p.trim().split(' ')[0])),
    ...[...document.querySelectorAll('video source')].map((s) => s.src),
    '/icons.svg', '/favicon.svg', '/vendor/lottie.min.js', '/vendor/pulse.json',
  ]);
  for (const u of new Set(urls)) {
    const s = await page.evaluate(async (x) => (await fetch(x, { method: 'HEAD' })).status, u);
    assert(s === 200, `Fișier lipsă (${s}): ${u}`);
  }
  const noAlt = await page.$$eval('img', (is) => is.filter((i) => !i.hasAttribute('alt')).length);
  assert(noAlt === 0, `${noAlt} imagini fără atribut alt`);
});

await test('Banda de sus: rulează, se oprește și pornește din buton', async (page) => {
  await open(page);
  const state = () => page.$eval('.tape__track', (t) => getComputedStyle(t).animationPlayState);
  await page.mouse.move(10, 600);
  assert((await state()) === 'running', 'Banda nu rulează');
  await page.click('[data-ticker-toggle]');
  await page.mouse.move(10, 600);
  assert((await state()) === 'paused' && (await page.getAttribute('[data-ticker-toggle]', 'aria-pressed')) === 'true', 'Banda nu se oprește');
  await page.click('[data-ticker-toggle]');
  await page.mouse.move(10, 600);
  assert((await state()) === 'running', 'Banda nu repornește');
});

await test('Mișcare redusă: banda stă pe loc și poate fi derulată, fără animații de apariție', async (page) => {
  await open(page);
  const anim = await page.$eval('.tape__track', (t) => getComputedStyle(t).animationName);
  assert(anim === 'none', `Banda încă se mișcă: ${anim}`);
  const op = await page.$eval('.risk', (r) => getComputedStyle(r).opacity);
  assert(op === '1', 'Elementele rămân ascunse când mișcarea e redusă');
}, { reducedMotion: 'reduce' });

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} teste trecute.`);
if (failed.length) process.exitCode = 1;
