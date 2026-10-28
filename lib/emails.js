// Șabloanele celor două e-mailuri: confirmarea pentru vizitator și notificarea pentru echipă.
import { countryLabel } from './validate.js';

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const nl2br = (s) => esc(s).replace(/\r?\n/g, '<br>');

const INK = '#141619';
const PAPER = '#EDEDE7';
const CARD = '#F7F7F3';
const TAPE = '#F2C230';
const MUTED = '#4A4E55';
const MONO = "'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace";
const SANS = "'Bricolage Grotesque', 'Segoe UI', Helvetica, Arial, sans-serif";

function tapeRow() {
  // Banda galbenă cu gradații, aceeași ca bara de sus a site-ului.
  const ticks = Array.from({ length: 40 }, (_, i) =>
    `<td style="width:2.5%;height:${i % 5 === 0 ? 12 : 6}px;border-left:1px solid ${INK};padding:0;font-size:0;line-height:0;vertical-align:top;">&nbsp;</td>`
  ).join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${TAPE};border-collapse:collapse;"><tr>${ticks}</tr></table>`;
}

export function confirmationEmail({ name, message, siteUrl }) {
  const first = name.split(' ')[0];
  const subject = 'Am primit solicitarea ta · Arcada';

  const text = [
    `Bună, ${first},`,
    '',
    'Îți confirmăm că am primit solicitarea trimisă prin formularul de pe site-ul Arcada.',
    '',
    'Ce urmează:',
    '1. Un consultant Arcada citește ce ne-ai scris.',
    '2. Te sunăm la numărul lăsat în formular ca să stabilim împreună prima discuție (30 de minute, online sau la apartament).',
    '3. Discuția nu te obligă la nimic. Abia după ea primești, dacă vrei, o ofertă scrisă cu tariful.',
    '',
    'Nu trebuie să faci nimic între timp. Dacă ai deja un anunț sau un extras de carte funciară, păstrează-le la îndemână.',
    '',
    ...(message ? ['Mesajul tău:', message, ''] : []),
    'Acest e-mail confirmă doar că am primit solicitarea. Dacă nu tu ai completat formularul, ignoră mesajul.',
    '',
    'Arcada · consultanță imobiliară pentru cumpărători · Cluj-Napoca',
    siteUrl ? siteUrl : '',
    'Proiect demonstrativ realizat în scop educațional.',
  ].join('\n');

  const html = `<!doctype html>
<html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${PAPER};">
<div style="display:none;max-height:0;overflow:hidden;">Am primit solicitarea. Te sunăm ca să stabilim prima discuție.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};">
<tr><td align="center" style="padding:32px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${CARD};border:1px solid ${INK};">
    <tr><td>${tapeRow()}</td></tr>
    <tr><td style="padding:28px 32px 8px;font-family:${MONO};font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:${MUTED};">
      Arcada &nbsp;/&nbsp; Fișa 00 &nbsp;/&nbsp; Solicitare primită
    </td></tr>
    <tr><td style="padding:4px 32px 0;font-family:${SANS};font-size:30px;line-height:1.1;font-weight:700;color:${INK};letter-spacing:-.02em;">
      Am primit solicitarea ta, ${esc(first)}.
    </td></tr>
    <tr><td style="padding:16px 32px 8px;font-family:${SANS};font-size:16px;line-height:1.6;color:${INK};">
      Îți confirmăm că mesajul trimis prin formularul de pe site a ajuns la noi. Iată ce urmează.
    </td></tr>
    <tr><td style="padding:8px 32px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${INK};">
        ${[
          ['01', 'Un consultant Arcada citește ce ne-ai scris.'],
          ['02', 'Te sunăm la numărul lăsat în formular ca să stabilim prima discuție: 30 de minute, online sau la apartament.'],
          ['03', 'Discuția nu te obligă la nimic. Abia după ea primești, dacă vrei, o ofertă scrisă cu tariful.'],
        ]
          .map(
            ([n, t]) => `<tr>
          <td width="48" valign="top" style="padding:14px 0;border-bottom:1px solid #14161933;font-family:${MONO};font-size:13px;color:${INK};">${n}</td>
          <td valign="top" style="padding:14px 0;border-bottom:1px solid #14161933;font-family:${SANS};font-size:16px;line-height:1.5;color:${INK};">${t}</td>
        </tr>`
          )
          .join('')}
      </table>
    </td></tr>
    <tr><td style="padding:16px 32px 4px;font-family:${SANS};font-size:15px;line-height:1.6;color:${MUTED};">
      Nu trebuie să faci nimic între timp. Dacă ai deja un anunț sau un extras de carte funciară, păstrează-le la îndemână.
    </td></tr>
    ${message ? `<tr><td style="padding:20px 32px 8px;font-family:${MONO};font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:${MUTED};">Mesajul tău</td></tr>
    <tr><td style="padding:0 32px 24px;">
      <div style="border-left:3px solid ${TAPE};padding:10px 14px;background:${PAPER};font-family:${SANS};font-size:15px;line-height:1.55;color:${INK};">${nl2br(message)}</div>
    </td></tr>` : ''}
    <tr><td style="padding:0 32px 28px;font-family:${SANS};font-size:13px;line-height:1.5;color:${MUTED};">
      Acest e-mail confirmă doar că am primit solicitarea. Dacă nu tu ai completat formularul, ignoră mesajul.
    </td></tr>
    <tr><td style="background:${INK};padding:18px 32px;font-family:${MONO};font-size:12px;line-height:1.6;color:${PAPER};">
      ARCADA · consultanță imobiliară pentru cumpărători · Cluj-Napoca<br>
      ${siteUrl ? `<a href="${esc(siteUrl)}" style="color:${TAPE};">${esc(siteUrl.replace(/^https?:\/\//, ''))}</a><br>` : ''}
      <span style="color:#B9BBB4;">Proiect demonstrativ realizat în scop educațional.</span>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;

  return { subject, text, html };
}

export function leadEmail({ name, email, phone, country, message: raw, meta }) {
  const message = raw || '(fără mesaj; detaliile se discută la telefon)';
  const subject = `Solicitare nouă: ${name}`;
  const rows = [
    ['Nume', name],
    ['E-mail', email],
    ['Telefon', `${phone} · ${countryLabel(country)}`],
    ['Trimis', meta.at],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nMesaj:\n${message}\n`;
  const html = `<div style="font-family:${SANS};font-size:15px;color:${INK};max-width:560px;">
  <p style="font-family:${MONO};font-size:12px;letter-spacing:.1em;text-transform:uppercase;">Arcada · solicitare nouă din site</p>
  <table cellpadding="6" style="border-collapse:collapse;">${rows
    .map(([k, v]) => `<tr><td style="color:${MUTED};">${k}</td><td><strong>${esc(v)}</strong></td></tr>`)
    .join('')}</table>
  <p style="border-left:3px solid ${TAPE};padding:8px 12px;background:${PAPER};">${nl2br(message)}</p>
  <p style="color:${MUTED};font-size:13px;">Adresa de e-mail are un format valid, dar nu a fost verificată. Răspunde la acest mesaj ca să-i scrii direct.</p>
</div>`;
  return { subject, text, html };
}
