// Adaugă în public/icons.svg iconurile noi din Font Awesome Free (Assets-Library). Se rulează o singură dată pe listă.
import { readFileSync, writeFileSync } from 'node:fs';
const FA = 'D:/Materiale ajutatoare AI/Materiale AI de folosit/Assets-Library/fontawesome/fontawesome-free-7.3.0-web/svgs/solid';
const NOI = ['house', 'house-chimney', 'house-crack', 'house-circle-check', 'bolt', 'plug', 'file-contract', 'file-signature', 'stamp', 'users', 'user-check', 'user-shield', 'map-location-dot', 'percent', 'gift', 'cookie-bite', 'comment-dots', 'clipboard-check', 'clipboard-list', 'eye', 'hand-holding-dollar', 'building', 'building-circle-check', 'landmark', 'shield-halved', 'lock', 'paper-plane', 'calendar-check', 'ban', 'door-open', 'pen-to-square'];
const fisier = new URL('../public/icons.svg', import.meta.url);
let svg = readFileSync(fisier, 'utf8');
for (const nume of NOI) {
  if (svg.includes(`id="i-${nume}"`)) continue;
  const sursa = readFileSync(`${FA}/${nume}.svg`, 'utf8');
  const viewBox = sursa.match(/viewBox="([^"]+)"/)[1];
  const cale = sursa.match(/<path[^>]*\sd="([^"]+)"/)[1];
  svg = svg.replace('</svg>', `<symbol id="i-${nume}" viewBox="${viewBox}"><path d="${cale}"/></symbol>\n</svg>`);
}
writeFileSync(fisier, svg);
