// Reguli de validare comune: le folosește și formularul din browser, și funcția de pe server.
// Telefonul se verifică cu libphonenumber-js (metadate complete), în funcție de țara aleasă.
import { parsePhoneNumberFromString, getCountryCallingCode } from 'libphonenumber-js/max';

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  message: { max: 2000 },
};

// Verifică doar forma adresei: ceva@domeniu.tld. Nu dovedește că adresa există.
const EMAIL_RE = /^[^\s@"<>(),;:\\[\]]+@[^\s@"<>(),;:\\[\]]+\.[^\s@"<>(),;:\\[\].]{2,}$/;

const regionName = (() => {
  try {
    const dn = new Intl.DisplayNames(['ro'], { type: 'region' });
    return (code) => dn.of(code) || code;
  } catch {
    return (code) => code;
  }
})();

export function countryLabel(code) {
  return `${regionName(code)} (+${getCountryCallingCode(code)})`;
}

export function validateName(value) {
  const v = String(value ?? '').trim();
  if (!v) return 'Scrie-ne cum te numești.';
  if (v.length < LIMITS.name.min) return 'Numele e prea scurt. Scrie cel puțin 2 litere.';
  if (v.length > LIMITS.name.max) return `Numele poate avea cel mult ${LIMITS.name.max} de caractere.`;
  if (/[<>{}]/.test(v)) return 'Numele nu poate conține caracterele < > { }.';
  return '';
}

export function validateEmail(value) {
  const v = String(value ?? '').trim();
  if (!v) return 'Avem nevoie de adresa de e-mail ca să-ți trimitem confirmarea.';
  if (v.length > LIMITS.email.max) return 'Adresa e prea lungă.';
  if (!v.includes('@')) return 'Adresa trebuie să conțină „@”, de exemplu nume@exemplu.ro.';
  if (!EMAIL_RE.test(v) || v.includes('..')) {
    return 'Formatul adresei nu e corect. Verifică ce e după „@”, de exemplu nume@exemplu.ro.';
  }
  return '';
}

/**
 * @param {string} raw    numărul așa cum l-a scris omul
 * @param {string} country codul ISO al țării alese (ex. „RO”)
 * @returns {{ error: string, e164?: string }}
 */
export function validatePhone(raw, country) {
  const v = String(raw ?? '').trim();
  if (!v) return { error: 'Lasă-ne un număr de telefon, ca să te putem suna pentru programare.' };
  if (!country) return { error: 'Alege țara din listă.' };
  if (/[^\d\s()+\-./]/.test(v)) return { error: 'Numărul poate conține doar cifre, spații și semnul +.' };

  const normalized = v.replace(/^00/, '+');
  const phone = parsePhoneNumberFromString(normalized, country);
  const selected = countryLabel(country);

  if (normalized.startsWith('+') && phone) {
    const typedCode = phone.countryCallingCode;
    const selectedCode = getCountryCallingCode(country);
    if (typedCode !== selectedCode) {
      return {
        error: `Numărul începe cu prefixul +${typedCode}, dar țara aleasă este ${selected}. Schimbă țara sau prefixul.`,
      };
    }
  }

  if (!phone || !phone.isValid()) {
    const example = country === 'RO' ? ' Exemplu pentru România: 0722 123 456.' : '';
    return { error: `Numărul nu este valid pentru ${selected}. Verifică cifrele.${example}` };
  }

  // Prefixele comune (ex. +1 pentru SUA și Canada) trebuie să corespundă țării alese.
  if (phone.country && phone.country !== country) {
    return {
      error: `Numărul pare să fie din ${countryLabel(phone.country)}, nu din ${selected}. Alege țara corectă.`,
    };
  }

  return { error: '', e164: phone.number };
}

export function validateMessage(value) {
  const v = String(value ?? '').trim();
  // câmpul e opțional: gol e în regulă, verificăm doar lungimea maximă
  if (v.length > LIMITS.message.max) return `Mesajul poate avea cel mult ${LIMITS.message.max} de caractere.`;
  return '';
}

/** Validează toată cererea. Întoarce { errors, clean }. */
export function validateRequest(data) {
  const errors = {};
  const nameErr = validateName(data.name);
  if (nameErr) errors.name = nameErr;
  const emailErr = validateEmail(data.email);
  if (emailErr) errors.email = emailErr;
  const phone = validatePhone(data.phone, data.country);
  if (phone.error) errors.phone = phone.error;
  const msgErr = validateMessage(data.message);
  if (msgErr) errors.message = msgErr;

  const clean = {
    name: String(data.name ?? '').trim().replace(/\s+/g, ' '),
    email: String(data.email ?? '').trim(),
    phone: phone.e164 || '',
    country: data.country,
    message: String(data.message ?? '').trim(),
  };
  return { errors, clean };
}
