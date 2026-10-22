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

// Datele de contact (telefon, WhatsApp, e-mail) nu stau în repository: vin din variabile de mediu
// și sunt scrise în pagină la build. Fără ele, build-ul se oprește, ca să nu publicăm linkuri goale.
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
      const text = encodeURIComponent('Bună! Aș vrea să programez o consultație cu Arcada.');
      const map = {
        __WHATSAPP_URL__: `https://wa.me/${phone.number.slice(1)}?text=${text}`,
        __PHONE_E164__: phone.number,
        __PHONE_DISPLAY__: phone.formatInternational(),
        __CONTACT_EMAIL__: email,
      };
      return html.replace(/__[A-Z0-9_]+__/g, (m) => map[m] ?? m);
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
    build: { target: 'es2020', assetsInlineLimit: 0 },
  };
});
