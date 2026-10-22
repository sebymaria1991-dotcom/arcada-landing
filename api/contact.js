// Funcție serverless (Vercel): primește formularul, îl verifică din nou și trimite cele două e-mailuri.
// Datele de autentificare SMTP vin doar din variabile de mediu, niciodată din codul trimis browserului.
import nodemailer from 'nodemailer';
import { validateRequest } from '../lib/validate.js';
import { confirmationEmail, leadEmail } from '../lib/emails.js';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MIN_FILL_MS = 3000;
const hits = new Map(); // IP → [timestamp-uri]; protecție de bază, ține cât trăiește instanța

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

let transporter;
function getTransport() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT || 465);
  transporter = nodemailer.createTransport({
    host: SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 20_000) throw new Error('too-large');
  }
  return JSON.parse(raw || '{}');
}

const send = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { ok: false, message: 'Metodă nepermisă.' });
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    return send(res, 400, { ok: false, message: 'Cererea nu a putut fi citită. Reîncarcă pagina și încearcă din nou.' });
  }

  // Câmp-capcană invizibil pentru oameni: dacă e completat, e aproape sigur un robot.
  // Răspundem „ok” ca robotul să nu afle că a fost oprit, dar nu trimitem nimic.
  if (body.company) return send(res, 200, { ok: true });

  const started = Number(body.startedAt);
  if (!Number.isFinite(started) || Date.now() - started < MIN_FILL_MS) {
    return send(res, 400, {
      ok: false,
      message: 'Formularul a fost trimis prea repede. Așteaptă câteva secunde și încearcă din nou.',
    });
  }

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'necunoscut').split(',')[0].trim();
  if (rateLimited(ip)) {
    return send(res, 429, {
      ok: false,
      message: 'Am primit mai multe solicitări de la tine în ultimele minute. Încearcă din nou peste 10 minute sau scrie-ne pe WhatsApp.',
    });
  }

  const { errors, clean } = validateRequest(body);
  if (Object.keys(errors).length) {
    return send(res, 422, { ok: false, errors, message: 'Unele câmpuri trebuie corectate.' });
  }

  const transport = getTransport();
  if (!transport) {
    console.error('[contact] SMTP_USER / SMTP_PASS lipsesc din variabilele de mediu.');
    return send(res, 503, {
      ok: false,
      message: 'Serviciul de e-mail nu este disponibil acum. Solicitarea nu a fost trimisă; încearcă din nou mai târziu.',
    });
  }

  const from = process.env.MAIL_FROM || `Arcada <${process.env.SMTP_USER}>`;
  const inbox = process.env.LEAD_INBOX || process.env.SMTP_USER;
  const siteUrl = process.env.SITE_URL || '';
  const meta = { at: new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' }) };

  try {
    const lead = leadEmail({ ...clean, meta });
    await transport.sendMail({ from, to: inbox, replyTo: clean.email, ...lead });

    const conf = confirmationEmail({ ...clean, siteUrl });
    await transport.sendMail({ from, to: clean.email, replyTo: inbox, ...conf });
  } catch (err) {
    console.error('[contact] trimiterea a eșuat:', err?.code || '', err?.message || err);
    return send(res, 502, {
      ok: false,
      message: 'Nu am reușit să trimitem e-mailul de confirmare. Datele tale au rămas în formular; încearcă din nou.',
    });
  }

  return send(res, 200, { ok: true });
}
