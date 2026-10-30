import { initConsent } from './consent.js';

initConsent();
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
