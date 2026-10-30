// Generează desenul „Ce verificăm”: o secțiune izometrică prin locuință, cu straturile ascunse în pereți.
// Rezultatul (src/plan-izometric.html) e inserat în index.html la build. Rulare: node scripts/plan-izometric.mjs
import { writeFileSync } from 'node:fs';

const S = 34; // unități → pixeli
const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;
const puncte = [];
const iso = (x, y, z = 0) => {
  const p = [(x - y) * COS * S, (x + y) * SIN * S - z * S];
  puncte.push(p);
  return p;
};
const f = (n) => Math.round(n * 10) / 10;
const pts = (lista) => lista.map(([x, y, z]) => iso(x, y, z).map(f).join(',')).join(' ');
const poli = (lista, cls) => `<polygon class="${cls}" points="${pts(lista)}"/>`;
const linie = (lista, cls) => `<polyline class="${cls}" points="${pts(lista)}"/>`;

// prismă: desenăm doar fețele vizibile din unghiul nostru (sus, față-stânga, față-dreapta)
function prisma(x0, y0, x1, y1, z0, z1, cls) {
  return [
    poli([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], `${cls} f-st`),
    poli([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], `${cls} f-dr`),
    poli([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], `${cls} f-sus`),
  ].join('');
}
const podea = (x0, y0, x1, y1, cls) => poli([[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]], `iso-podea ${cls}`);
function eticheta(x, y, text) {
  const [px, py] = iso(x, y, 0);
  return `<text class="iso-et" transform="matrix(${f(COS)} ${SIN} ${f(-COS)} ${SIN} ${f(px)} ${f(py)})">${text}</text>`;
}

const H = 3;      // pereții din spate
const H2 = 1.5;   // pereții interiori, tăiați
const T = 0.22;   // grosimea peretelui
const L = 12, A = 8, B = 14; // lungime, adâncime, capătul balconului
const parti = [];

/* Podele */
parti.push(
  podea(0, 0, 7, 5, 'p-lemn'), podea(7, 0, 12, 5, 'p-lemn2'),
  podea(0, 5, 4, 8, 'p-gresie'), podea(4, 5, 7, 8, 'p-gresie2'), podea(7, 5, 12, 8, 'p-lemn'),
);

/* Pereții din spate sunt transparenți, ca să se vadă ce e în ei */
parti.push(poli([[0, 0, 0], [L, 0, 0], [L, 0, H], [0, 0, H]], 'iso-sticla'));
parti.push(poli([[0, 0, 0], [0, A, 0], [0, A, H], [0, 0, H]], 'iso-sticla iso-sticla--st'));
parti.push(linie([[0, A, H], [0, 0, H], [L, 0, H]], 'iso-contur'));
parti.push(linie([[0, 0, 0], [0, 0, H]], 'iso-contur'));

/* Instalația electrică și gazul, în peretele din stânga */
const stratInstalatii = [
  linie([[0, 1, 2.1], [0, 1, 2.6], [0, 7, 2.6], [0, 7, 1.1]], 'iso-cablu'),
  linie([[0, 2.5, 2.6], [0, 2.5, 1]], 'iso-cablu'),
  linie([[0, 4.5, 2.6], [0, 4.5, 1]], 'iso-cablu'),
  linie([[0, 6, .2], [0, 6, 1.9], [1.1, 6, 1.9]], 'iso-gaz'),
  poli([[0, .6, 1.5], [0, 1.5, 1.5], [0, 1.5, 2.3], [0, .6, 2.3]], 'iso-tablou'),
].join('');

/* Umezeala, pe peretele din spate al dormitorului */
function pata(cx, cz, rx, rz) {
  const lista = [];
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    const r = 1 + .16 * Math.sin(a * 3) + .1 * Math.cos(a * 5);
    lista.push([cx + Math.cos(a) * rx * r, 0, cz + Math.sin(a) * rz * r]);
  }
  return lista;
}
const stratUmezeala = [
  poli(pata(9.6, 1.3, 1.5, 1.1), 'iso-umed iso-umed--mare'),
  poli(pata(9.6, 1.2, .95, .68), 'iso-umed'),
  poli(pata(9.5, 1.1, .45, .32), 'iso-umed iso-umed--miez'),
].join('');

parti.push(`<g class="iso-strat" data-layer="2">${stratInstalatii}</g>`, `<g class="iso-strat" data-layer="1">${stratUmezeala}</g>`);

/* Etichete pe podea */
parti.push(eticheta(1.1, 3.6, 'LIVING'), eticheta(8.8, 3.9, 'DORMITOR'), eticheta(.5, 7.5, 'BUCĂTĂRIE'), eticheta(4.5, 7.5, 'BAIE'), eticheta(8.8, 7.2, 'HOL'));

/* Mobilă și pereți interiori, de la spate spre față */
parti.push(prisma(.2, .3, 2.1, 1.4, 0, .75, 'iso-mob'));                   // comodă
parti.push(prisma(3, 1.1, 6.3, 2.2, 0, .55, 'iso-mob2'));                  // canapea
parti.push(prisma(3, 1.1, 6.3, 1.45, .55, 1, 'iso-mob2'));                 // spătar
parti.push(prisma(3.7, 3, 5.4, 3.9, 0, .32, 'iso-mob'));                   // măsuță
parti.push(prisma(8.5, .22, 11, .95, 0, 2.15, 'iso-dulap'));               // dulapul din fața peretelui umed
parti.push(prisma(8.3, 2, 11.3, 4.4, 0, .45, 'iso-mob2'));                 // pat
parti.push(prisma(8.3, 2, 11.3, 2.5, .45, .9, 'iso-mob'));                 // tăblie
parti.push(prisma(7 - T / 2, 0, 7 + T / 2, 3.4, 0, H2, 'iso-perete'));     // living | dormitor
parti.push(prisma(0, 5 - T / 2, 2.2, 5 + T / 2, 0, H2, 'iso-perete'));     // living | bucătărie
parti.push(prisma(3, 5 - T / 2, 8.3, 5 + T / 2, 0, H2, 'iso-perete'));     // living | baie
parti.push(prisma(9.3, 5 - T / 2, L, 5 + T / 2, 0, H2, 'iso-perete'));     // dormitor | hol
parti.push(prisma(.15, 5.3, 3.3, 6.1, 0, .9, 'iso-mob'));                  // blat bucătărie
parti.push(prisma(4 - T / 2, 5, 4 + T / 2, A, 0, H2, 'iso-perete'));       // bucătărie | baie
parti.push(prisma(4.5, 5.3, 6.7, 6.5, 0, .55, 'iso-baie'));                // cadă
parti.push(prisma(7 - T / 2, 5, 7 + T / 2, 6.2, 0, H2, 'iso-perete'));     // baie | hol
parti.push(prisma(10.5, 5.3, 11.8, 6, 0, 1.7, 'iso-mob'));                 // cuier

/* Balconul închis, care nu apare în cadastru */
const stratBalcon = [
  poli([[L, 0, 0], [B, 0, 0], [B, 5, 0], [L, 5, 0]], 'iso-balcon'),
  poli([[B, 0, 0], [B, 5, 0], [B, 5, 1.9], [B, 0, 1.9]], 'iso-balcon-sticla'),
  poli([[L, 5, 0], [B, 5, 0], [B, 5, 1.9], [L, 5, 1.9]], 'iso-balcon-sticla'),
  linie([[L, 0, 1.9], [B, 0, 1.9], [B, 5, 1.9], [L, 5, 1.9]], 'iso-balcon-contur'),
].join('');
parti.push(`<g class="iso-strat" data-layer="3">${stratBalcon}</g>`);

/* Pereții din față, foarte joși, ca să nu ascundă nimic */
parti.push(prisma(0, A - T, 7, A, 0, .32, 'iso-perete'));
parti.push(prisma(7, A - T, L, A, 0, .32, 'iso-perete'));
parti.push(prisma(L - T, 0, L, 5, 0, .32, 'iso-perete'));
parti.push(prisma(L - T, 5, L, A, 0, .32, 'iso-perete'));

/* Fâșia de scanare care trece peste podea */
parti.push(`<g class="iso-scan">${poli([[-.3, 0, 0], [0, 0, 0], [0, A, 0], [-.3, A, 0]], 'iso-scan-fasie')}</g>`);

/* Actele, deasupra locuinței */
const stratActe = [
  linie([[0, 0, 0], [L, 0, 0], [L, A, 0], [0, A, 0], [0, 0, 0]], 'iso-cadastru'),
  poli([[2.6, -2.2, 4.7], [6.4, -2.2, 4.7], [6.4, .9, 4.7], [2.6, .9, 4.7]], 'iso-hartie iso-hartie--jos'),
  poli([[2.3, -2, 5], [6.1, -2, 5], [6.1, 1.1, 5], [2.3, 1.1, 5]], 'iso-hartie'),
  linie([[2.8, -1.5, 5], [5.6, -1.5, 5]], 'iso-rand'),
  linie([[2.8, -.9, 5], [5.6, -.9, 5]], 'iso-rand'),
  linie([[2.8, -.3, 5], [4.6, -.3, 5]], 'iso-rand'),
  poli([[4.5, .1, 5], [5.6, .1, 5], [5.6, .8, 5], [4.5, .8, 5]], 'iso-stampila'),
  linie([[4.3, -.5, 5], [4.3, -.5, 2.95]], 'iso-leg'),
].join('');
parti.push(`<g class="iso-strat" data-layer="0">${stratActe}</g>`);

/* Prețul, ca o etichetă deasupra livingului */
const stratPret = [
  poli([[.6, 3.1, 3.7], [2.8, 3.1, 3.7], [3.5, 3.1, 3.15], [2.8, 3.1, 2.6], [.6, 3.1, 2.6]], 'iso-pret'),
  linie([[3.5, 3.1, 3.15], [4.6, 3.1, 1]], 'iso-leg'),
].join('');
const [tx, ty] = iso(1.7, 3.1, 3.15);
parti.push(`<g class="iso-strat" data-layer="4">${stratPret}<text class="iso-pret-t" x="${f(tx)}" y="${f(ty + 9)}">€</text></g>`);

/* Punctele de pe desen */
const PINI = [
  { i: 0, loc: [4.2, -.4, 5], ico: 'file-contract', t: 'Actele și cadastrul' },
  { i: 1, loc: [9.6, 0, 2.55], ico: 'droplet', t: 'Umezeală și infiltrații' },
  { i: 2, loc: [0, 6.6, 3.05], ico: 'bolt', t: 'Instalația electrică și gazul' },
  { i: 3, loc: [13.1, 3, 2.1], ico: 'ruler-combined', t: 'Modificări neautorizate' },
  { i: 4, loc: [1.7, 3.1, 4.25], ico: 'scale-balanced', t: 'Prețul real' },
];
const coord = PINI.map((p) => iso(...p.loc));

const xs = puncte.map((p) => p[0]);
const ys = puncte.map((p) => p[1]);
const M = 26;
const vb = {
  x: Math.min(...xs) - M, y: Math.min(...ys) - M,
  w: Math.max(...xs) - Math.min(...xs) + 2 * M, h: Math.max(...ys) - Math.min(...ys) + 2 * M,
};

const butoane = PINI.map((p, n) => {
  const [x, y] = coord[n];
  return `<button class="pin" type="button" style="--x:${f(((x - vb.x) / vb.w) * 100)};--y:${f(((y - vb.y) / vb.h) * 100)}" data-pin="${p.i}" aria-controls="punct-${p.i}" aria-label="${p.t}"><svg class="ico" aria-hidden="true"><use href="/icons.svg#i-${p.ico}"></use></svg></button>`;
}).join('\n');

const html = `<svg class="iso" viewBox="${f(vb.x)} ${f(vb.y)} ${f(vb.w)} ${f(vb.h)}" aria-hidden="true" focusable="false">
<defs><pattern id="hasura" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><line x1="0" y1="0" x2="0" y2="9" class="iso-hasura"/></pattern></defs>
${parti.join('\n')}
</svg>
${butoane}
`;
writeFileSync(new URL('../src/plan-izometric.html', import.meta.url), html);
console.log('src/plan-izometric.html:', html.length, 'octeți');
