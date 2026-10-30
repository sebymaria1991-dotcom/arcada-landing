import { readFileSync } from 'node:fs';
import { defineConfig, loadEnv } from 'vite';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';

// În dezvoltare, /api/contact rulează aceeași funcție ca pe Vercel, ca formularul să poată fi testat local.
function localApi() {
  return {
    name: 'arcada-local-api',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res) => {
        const { default: handler } = await server.ssrLoadModule('/api/contact.js');
        await handler(req, res);
      });
    },
  };
}

// Datele structurate pentru Google: întrebările se citesc din pagină, ca să nu existe două versiuni ale lor.
function jsonLd(html, { email, phone }) {
  const curat = (s) => s.replace(/<span class="sr-only">.*?<\/span>/g, '').replace(/<\/p><p>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const intrebari = [...html.matchAll(/<span class="qa__q">(.*?)<\/span>.*?<div class="qa__body">(.*?)<\/div>/gs)].map(([, q, a]) => ({
    '@type': 'Question',
    name: curat(q),
    acceptedAnswer: { '@type': 'Answer', text: curat(a) },
  }));
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RealEstateAgent',
        name: 'Arcada',
        url: 'https://arcada-landing.vercel.app/',
        description: 'Consultanță imobiliară pentru cumpărători, în toată România. Proiect demonstrativ, realizat în scop educațional.',
        image: 'https://arcada-landing.vercel.app/img/cluj-acoperisuri-1600.webp',
        email,
        telephone: phone,
        areaServed: { '@type': 'Country', name: 'România' },
        openingHours: 'Mo-Fr 09:00-18:00',
      },
      { '@type': 'FAQPage', mainEntity: intrebari },
    ],
  });
}

// Datele de contact (telefon, WhatsApp, e-mail) nu stau în repository: vin din variabile de mediu
// și sunt scrise în pagină la build. Fără ele, build-ul se oprește, ca să nu publicăm linkuri goale.
// Comisionul (COMMISSION_PERCENT, de exemplu 2,5) e opțional: fără el, pagina nu afișează nicio cifră.
function contactDetails(env) {
  return {
    name: 'arcada-contact-details',
    transformIndexHtml(html) {
      const raw = env.VITE_WHATSAPP_NUMBER || env.WHATSAPP_NUMBER;
      const email = env.VITE_CONTACT_EMAIL || env.CONTACT_EMAIL;
      if (!raw || !email) {
        throw new Error('Lipsesc WHATSAPP_NUMBER și/sau CONTACT_EMAIL. Vezi .env.example.');
      }
      const phone = parsePhoneNumberFromString(raw.startsWith('+') ? raw : `+${raw}`);
      if (!phone || !phone.isValid()) throw new Error(`WHATSAPP_NUMBER nu e un număr valid: ${raw}`);
      const text = encodeURIComponent('Bună! Aș vrea să vorbesc cu un consultant Arcada.');
      const comision = (env.COMMISSION_PERCENT || '').trim();
      const notaComision = comision ? `Comisionul Arcada este de ${comision}% din prețul de achiziție.` : 'Comisionul Arcada este un procent din prețul de achiziție.';
      const plan = html.includes('<!--plan-izometric-->') ? readFileSync(new URL('./src/plan-izometric.html', import.meta.url), 'utf8') : '';
      const map = {
        __WHATSAPP_URL__: `https://wa.me/${phone.number.slice(1)}?text=${text}`,
        __PHONE_E164__: phone.number,
        __PHONE_DISPLAY__: phone.formatInternational(),
        __CONTACT_EMAIL__: email,
        __COMMISSION_BIG__: comision ? `${comision}%` : '%',
        __COMMISSION_NOTE__: notaComision,
        __JSONLD__: html.includes('__JSONLD__') ? jsonLd(html.replaceAll('__COMMISSION_NOTE__', notaComision), { email, phone: phone.number }) : '',
      };
      return html.replace('<!--plan-izometric-->', plan).replace(/__[A-Z0-9_]+__/g, (m) => map[m] ?? m);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM', 'LEAD_INBOX', 'SITE_URL']) {
    if (env[key] && !process.env[key]) process.env[key] = env[key];
  }
  return {
    plugins: [localApi(), contactDetails(env)],
    build: {
      target: 'es2020', assetsInlineLimit: 0,
      rollupOptions: { input: { main: 'index.html', confidentialitate: 'confidentialitate.html', cookies: 'cookies.html', termeni: 'termeni.html' } },
    },
  };
});
