// Capturi de ecran ale paginii, pentru comparații „înainte / după”.
// Rulare: npm run capturi -- "eticheta"          (implicit: site-ul publicat)
//         BASE_URL=http://localhost:5173 npm run capturi -- "local"
// Rezultatul ajunge în ..\..\Capturi\AAAA-LL-ZZ - eticheta\, cu aceleași nume de fișiere la fiecare rulare,
// ca două foldere să poată fi puse unul lângă altul.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const BASE = (process.env.BASE_URL || 'https://arcada-landing.vercel.app').replace(/\/$/, '');
const label = process.argv.slice(2).join(' ').trim() || 'capturi';
const today = new Date().toLocaleDateString('sv-SE'); // AAAA-LL-ZZ
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../Capturi');
const out = path.join(root, `${today} - ${label}`);

const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  mobil: { width: 390, height: 844, deviceScaleFactor: 2 },
};

// Secțiunile, în ordinea din pagină. Dacă un selector lipsește (de exemplu într-o versiune mai veche), e sărit.
const SECTIONS = [
  ['02-deschidere', '.hero'],
  ['03-problema', '#problema'],
  ['04-plan-verificari', '.plan'],
  ['05-raport-model', '.report'],
  ['06-beneficii', '.spec'],
  ['07-oferta', '.offer'],
  ['08-cluj-cladiri', '.city'],
  ['09-cum-lucram', '#cum-lucram'],
  ['10-intrebari', '#intrebari'],
  ['11-formular', '#contact'],
  ['12-subsol', '.footer'],
];

// Pagina „înghețată”: fără bandă care rulează și fără apariții animate, ca două rulări să arate la fel.
const FREEZE = `
  .tape__track { animation: none !important; transform: none !important; }
  [data-reveal] { opacity: 1 !important; transform: none !important; transition: none !important; }
`;
// La capturile pe secțiuni ascundem elementele fixe, care altfel apar peste conținut.
const NO_FIXED = `.nav, .wa, .skip { visibility: hidden !important; }`;

async function prepare(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: FREEZE });
  await page.evaluate(async () => {
    // derulăm toată pagina, ca imaginile cu loading="lazy" să se încarce
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
    // așteptăm doar imaginile vizibile (cele ascunse cu CSS nu se încarcă niciodată), cel mult 8 secunde
    const visible = [...document.images].filter((img) => img.getClientRects().length && !img.complete);
    const loaded = Promise.all(visible.map((img) => new Promise((r) => { img.onload = img.onerror = r; })));
    await Promise.race([loaded, new Promise((r) => setTimeout(r, 8000))]);
    await document.fonts.ready;
  });
  await page.waitForTimeout(300);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const files = [];
for (const [name, vp] of Object.entries(VIEWPORTS)) {
  const dir = path.join(out, name);
  mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.deviceScaleFactor, reducedMotion: 'reduce' });
  const page = await ctx.newPage();

  await prepare(page, `${BASE}/`);
  const shot = async (file, opts) => { await page.screenshot({ path: path.join(dir, file), ...opts }); files.push(`${name}/${file}`); };
  await shot('00-primul-ecran.png');
  await shot('01-pagina-intreaga.jpg', { fullPage: true, type: 'jpeg', quality: 85 });

  await page.addStyleTag({ content: NO_FIXED });
  for (const [file, sel] of SECTIONS) {
    const el = await page.$(sel);
    if (!el) { console.log(`  (sărit: ${sel} nu există pe pagină)`); continue; }
    await el.screenshot({ path: path.join(dir, `${file}.png`) });
    files.push(`${name}/${file}.png`);
  }

  await prepare(page, `${BASE}/confidentialitate.html`);
  if ((await page.title()).includes('confidențialitate')) await shot('13-confidentialitate.jpg', { fullPage: true, type: 'jpeg', quality: 85 });
  await ctx.close();
}
await browser.close();

writeFileSync(path.join(out, 'DESPRE.txt'), [
  `Capturi Arcada · ${label}`,
  `Data: ${today}`,
  `Sursa: ${BASE}`,
  `Desktop: ${VIEWPORTS.desktop.width}x${VIEWPORTS.desktop.height} · Mobil: ${VIEWPORTS.mobil.width}x${VIEWPORTS.mobil.height} (rezoluție dublă)`,
  'Banda de sus și animațiile de apariție sunt oprite, ca rulările să poată fi comparate.',
  '',
  ...files,
  '',
].join('\r\n'));
console.log(`\n${files.length} capturi în ${out}`);
