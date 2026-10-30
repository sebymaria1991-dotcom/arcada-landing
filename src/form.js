import { AsYouType, getCountries, getCountryCallingCode } from 'libphonenumber-js/max';
import { validateName, validateEmail, validatePhone, validateMessage, countryLabel } from '../lib/validate.js';

const FREQUENT = ['RO', 'MD', 'IT', 'ES', 'DE', 'GB', 'FR', 'AT', 'BE', 'NL', 'IE', 'US'];
const FLAG_ALIAS = { AC: 'sh-ac', TA: 'sh-ta' };
// țara principală pentru prefixele folosite de mai multe țări, până se poate deduce din număr
const MAIN_FOR_DIAL = { 1: 'US', 7: 'RU', 39: 'IT', 44: 'GB', 47: 'NO', 61: 'AU', 212: 'MA', 262: 'RE', 290: 'SH', 358: 'FI', 590: 'GP', 599: 'CW' };
const TIMEOUT_MS = 20000;

const names = (() => {
  try {
    const dn = new Intl.DisplayNames(['ro'], { type: 'region' });
    return (c) => dn.of(c) || c;
  } catch {
    return (c) => c;
  }
})();
const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const COUNTRIES = getCountries()
  .map((code) => ({ code, name: names(code), dial: getCountryCallingCode(code) }))
  .sort((a, b) => a.name.localeCompare(b.name, 'ro'));
const BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));
// steaguri SVG din flag-icons (MIT), încărcate leneș: lista descarcă doar ce se vede
const flagSrc = (code) => `/flags/${FLAG_ALIAS[code] || code.toLowerCase()}.svg`;

/* Selector de țară (buton + listă căutabilă, accesibil din tastatură) ----- */
function createCountryPicker(root, { onChange }) {
  const btn = root.querySelector('[data-country-btn]');
  const pop = root.querySelector('[data-country-pop]');
  const search = root.querySelector('[data-country-search]');
  const list = root.querySelector('[data-country-list]');
  const flag = root.querySelector('[data-country-flag]');
  const codeEl = root.querySelector('[data-country-code]');
  const nameEl = root.querySelector('[data-country-name]');
  const hidden = root.closest('form').querySelector('[data-country-value]');

  let selected = hidden.value || 'RO';
  let options = [];
  let active = -1;

  const render = (query = '') => {
    const q = fold(query.trim()).replace(/^\+/, '');
    list.innerHTML = '';
    options = [];
    const addOpt = (c, prefix) => {
      const li = document.createElement('li');
      li.className = 'country__opt';
      li.id = `opt-${prefix}-${c.code}`;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(c.code === selected));
      li.dataset.code = c.code;
      li.innerHTML = `<img class="flag" src="${flagSrc(c.code)}" alt="" width="20" height="15" loading="lazy" decoding="async"><span>${c.name}</span><span class="country__opt-code">+${c.dial}</span>`;
      list.appendChild(li);
      options.push(li);
    };
    const header = (text) => {
      const li = document.createElement('li');
      li.className = 'country__group';
      li.setAttribute('role', 'presentation');
      li.setAttribute('aria-hidden', 'true');
      li.textContent = text;
      list.appendChild(li);
    };

    if (!q) {
      header('Frecvente');
      FREQUENT.forEach((code) => addOpt(BY_CODE.get(code), 'f'));
      header('Toate țările');
      COUNTRIES.forEach((c) => addOpt(c, 'a'));
    } else {
      const hits = COUNTRIES.filter(
        (c) => fold(c.name).includes(q) || c.dial.startsWith(q) || c.code.toLowerCase() === q
      );
      hits.forEach((c) => addOpt(c, 'a'));
      if (!hits.length) {
        const li = document.createElement('li');
        li.className = 'country__empty';
        li.setAttribute('role', 'presentation');
        li.textContent = 'Nicio țară găsită. Încearcă alt nume sau prefix.';
        list.appendChild(li);
      }
    }
    const idx = options.findIndex((o) => o.dataset.code === selected);
    setActive(q ? 0 : idx);
  };

  const setActive = (i) => {
    options.forEach((o) => o.classList.remove('is-active'));
    active = Math.max(-1, Math.min(i, options.length - 1));
    const opt = options[active];
    if (opt) {
      opt.classList.add('is-active');
      search.setAttribute('aria-activedescendant', opt.id);
      opt.scrollIntoView({ block: 'nearest' });
    } else {
      search.removeAttribute('aria-activedescendant');
    }
  };

  const open = () => {
    pop.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    search.value = '';
    render();
    search.focus();
    document.addEventListener('pointerdown', outside, true);
  };
  const close = ({ focus = true } = {}) => {
    if (pop.hidden) return;
    pop.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', outside, true);
    if (focus) btn.focus();
  };
  const outside = (e) => { if (!root.contains(e.target)) close({ focus: false }); };

  const set = (code, { source = 'manual' } = {}) => {
    const c = BY_CODE.get(code);
    if (!c) return;
    selected = code;
    hidden.value = code;
    flag.src = flagSrc(code);
    codeEl.textContent = `+${c.dial}`;
    nameEl.textContent = c.name;
    btn.setAttribute('title', `${c.name} (+${c.dial})`);
    onChange?.(code, source);
  };

  btn.addEventListener('click', () => (pop.hidden ? open() : close()));
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(); }
  });
  search.addEventListener('input', () => render(search.value));
  search.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(options.length - 1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = options[active];
      if (opt) { set(opt.dataset.code); close({ focus: false }); }
    } else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') { close({ focus: false }); }
  });
  list.addEventListener('click', (e) => {
    const opt = e.target.closest('[role="option"]');
    if (!opt) return;
    set(opt.dataset.code);
    close({ focus: false });
  });
  list.addEventListener('pointermove', (e) => {
    const opt = e.target.closest('[role="option"]');
    if (opt) setActive(options.indexOf(opt));
  });

  set(selected, { source: 'init' });
  return { get: () => selected, set };
}

/* Formularul ------------------------------------------------------------- */
export function initForm(form) {
  if (!form) return;
  const card = form.closest('.form-card');
  const success = card.querySelector('[data-success]');
  const submitBtn = form.querySelector('[data-submit]');
  const submitLabel = form.querySelector('[data-submit-label]');
  const alertBox = form.querySelector('[data-form-alert]');
  const alertText = form.querySelector('[data-form-alert-text]');
  const retryBtn = form.querySelector('[data-retry]');
  const phoneInput = form.querySelector('#f-phone');
  const phoneHint = form.querySelector('[data-phone-hint]');
  const defaultHint = phoneHint.textContent;

  let startedAt = Date.now();
  let busy = false;
  const touched = new Set();
  // când omul alege țara de mână, nu o mai schimbăm automat cât timp prefixul scris rămâne același
  let manualLock = null;

  const picker = createCountryPicker(form.querySelector('[data-country]'), {
    onChange(code, source) {
      if (source === 'manual') {
        manualLock = currentCallingCode();
        setHint(defaultHint);
        if (touched.has('phone') || phoneInput.value.trim()) { touched.add('phone'); check('phone'); }
        phoneInput.focus();
      }
    },
  });

  const fields = {
    name: () => validateName(form.elements.name.value),
    email: () => validateEmail(form.elements.email.value),
    phone: () => validatePhone(phoneInput.value, picker.get()).error,
    message: () => validateMessage(form.elements.message.value),
  };

  function paint(name, error) {
    const row = form.querySelector(`[data-field="${name}"]`);
    const msg = row.querySelector('.field__msg');
    const control = row.querySelector('input:not([type=hidden]), textarea');
    const show = touched.has(name);
    const wasValid = row.classList.contains('is-valid');
    row.classList.toggle('is-invalid', show && !!error);
    row.classList.toggle('is-valid', show && !error);
    control.setAttribute('aria-invalid', String(show && !!error));
    msg.textContent = show ? error : '';
    if (show && !error && !wasValid) {
      row.classList.remove('flash');
      void row.offsetWidth;
      row.classList.add('flash');
    }
  }
  const check = (name) => { const err = fields[name](); paint(name, err); return err; };

  // validare „la părăsirea câmpului”, apoi pe măsură ce scrii
  for (const name of Object.keys(fields)) {
    const control = name === 'phone' ? phoneInput : form.elements[name];
    control.addEventListener('blur', () => {
      if (control.value.trim()) touched.add(name);
      if (touched.has(name)) check(name);
    });
    control.addEventListener('input', () => { if (touched.has(name)) check(name); });
  }

  /* Detectarea țării după prefixul internațional ------------------------- */
  function currentCallingCode() {
    const v = phoneInput.value.trim().replace(/^00/, '+');
    if (!v.startsWith('+')) return null;
    const ayt = new AsYouType();
    ayt.input(v);
    return ayt.getCallingCode() || null;
  }
  function setHint(text, detected = false) {
    phoneHint.textContent = text;
    phoneHint.classList.toggle('is-detected', detected);
    phoneHint.classList.toggle('is-shown', text !== defaultHint);
  }

  phoneInput.addEventListener('input', () => {
    const v = phoneInput.value.trim().replace(/^00/, '+');
    if (!v.startsWith('+')) { manualLock = null; setHint(defaultHint); return; }
    const ayt = new AsYouType();
    ayt.input(v);
    const dial = ayt.getCallingCode();
    if (!dial) return;
    if (manualLock && manualLock === dial) return;
    manualLock = null;

    let detected = ayt.getCountry();
    const candidates = COUNTRIES.filter((c) => c.dial === dial);
    if (!detected && candidates.length === 1) detected = candidates[0].code;

    if (detected) {
      if (detected !== picker.get()) picker.set(detected, { source: 'auto' });
      setHint(`Țară detectată după prefix: ${countryLabel(detected)}. Dacă nu e corect, alege altă țară din listă.`, true);
    } else if (candidates.length > 1) {
      if (!candidates.some((c) => c.code === picker.get())) picker.set(MAIN_FOR_DIAL[dial] || candidates[0].code, { source: 'auto' });
      const few = candidates.slice(0, 3).map((c) => c.name).join(', ');
      setHint(`Prefixul +${dial} e folosit de mai multe țări (${few}${candidates.length > 3 ? ' și altele' : ''}). Scrie tot numărul sau alege țara din listă.`);
    }
    if (touched.has('phone')) check('phone');
  });

  /* Trimitere ------------------------------------------------------------ */
  const setBusy = (on) => {
    busy = on;
    submitBtn.disabled = on;
    retryBtn.disabled = on;
    submitBtn.setAttribute('aria-busy', String(on));
    submitLabel.textContent = on ? 'Se trimite…' : 'Trimite solicitarea';
  };
  const showAlert = (text) => {
    alertText.textContent = text;
    alertBox.hidden = false;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy) return; // nu trimitem de două ori cât timp prima cerere e în lucru

    alertBox.hidden = true;
    Object.keys(fields).forEach((n) => touched.add(n));
    const errors = Object.keys(fields).filter((n) => check(n));
    if (errors.length) {
      const first = errors[0] === 'phone' ? phoneInput : form.elements[errors[0]];
      first.focus();
      return;
    }

    setBusy(true);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.elements.name.value,
          email: form.elements.email.value,
          phone: phoneInput.value,
          country: picker.get(),
          message: form.elements.message.value,
          company: form.elements.company.value,
          fillMs: Date.now() - startedAt,
        }),
        signal: ctrl.signal,
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        showSuccess(form.elements.email.value.trim());
        return;
      }
      if (res.status === 422 && data.errors) {
        Object.entries(data.errors).forEach(([name, msg]) => { if (fields[name]) { touched.add(name); paint(name, msg); } });
        const first = Object.keys(data.errors)[0];
        (first === 'phone' ? phoneInput : form.elements[first])?.focus();
        showAlert('Serverul a găsit câmpuri de corectat. Le-am marcat mai sus.');
        return;
      }
      showAlert(data.message || 'Solicitarea nu a fost trimisă din cauza unei erori pe server. Datele au rămas în formular; încearcă din nou.');
    } catch (err) {
      showAlert(
        err.name === 'AbortError'
          ? 'Serverul a răspuns prea încet și solicitarea nu a fost confirmată. Datele au rămas în formular; încearcă din nou.'
          : 'Nu ne-am putut conecta la server. Verifică conexiunea la internet și încearcă din nou. Datele au rămas în formular.'
      );
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  });

  function showSuccess(email) {
    success.querySelector('[data-success-email]').textContent = email;
    form.hidden = true;
    success.hidden = false;
    success.focus();
  }

  success.querySelector('[data-new-request]').addEventListener('click', () => {
    form.reset();
    picker.set('RO', { source: 'init' });
    touched.clear();
    Object.keys(fields).forEach((n) => paint(n, ''));
    setHint(defaultHint);
    manualLock = null;
    startedAt = Date.now();
    success.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });
}
