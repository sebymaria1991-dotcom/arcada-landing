// Consimțământ pentru cookie-uri și stocare locală, cu trei opțiuni distincte:
//   Acceptă           → alegerea se păstrează 6 luni, iar site-ul ține minte și preferințele (de exemplu pop-up-ul închis)
//   Strictul necesar  → se păstrează doar alegerea, 6 luni
//   Refuză            → nu rămâne nimic pe dispozitiv; alegerea ține cât sesiunea și întrebăm din nou la vizita următoare
const KEY = 'arcada-consent';
const SESSION_KEY = 'arcada-consent-sesiune';
const OFFER_KEY = 'arcada-oferta-vazuta';
const SIX_MONTHS = 183 * 24 * 60 * 60 * 1000;

let memory = null; // dacă browserul blochează stocarea, alegerea rămâne valabilă până la închiderea paginii

const read = (store, key) => { try { return store.getItem(key); } catch { return null; } };
const write = (store, key, value) => { try { store.setItem(key, value); } catch { /* stocare indisponibilă */ } };
const remove = (store, key) => { try { store.removeItem(key); } catch { /* stocare indisponibilă */ } };

export function getConsent() {
  if (memory) return memory;
  if (read(sessionStorage, SESSION_KEY) === 'refuz') return 'refuz';
  try {
    const saved = JSON.parse(read(localStorage, KEY));
    if (saved && Date.now() - saved.at < SIX_MONTHS) return saved.choice;
  } catch { /* valoare coruptă: întrebăm din nou */ }
  return null;
}

function save(choice) {
  memory = choice;
  remove(sessionStorage, SESSION_KEY);
  if (choice === 'refuz') {
    remove(localStorage, KEY);
    write(sessionStorage, SESSION_KEY, 'refuz');
  } else {
    write(localStorage, KEY, JSON.stringify({ choice, at: Date.now() }));
  }
  if (choice !== 'toate') remove(localStorage, OFFER_KEY);
  window.dispatchEvent(new CustomEvent('arcada:consent', { detail: choice }));
}

// Pop-up-ul apare o singură dată: pe sesiune, sau definitiv doar dacă omul a acceptat preferințele.
export const offerSeen = () => read(localStorage, OFFER_KEY) === '1' || read(sessionStorage, OFFER_KEY) === '1';
export function markOfferSeen() {
  write(getConsent() === 'toate' ? localStorage : sessionStorage, OFFER_KEY, '1');
}

function buildBanner() {
  const box = document.createElement('section');
  box.className = 'cookies';
  box.setAttribute('aria-label', 'Alege cum folosim cookie-urile');
  box.dataset.cookies = '';
  box.hidden = true;
  box.innerHTML = `
    <div class="cookies__text">
      <h2><svg class="ico" aria-hidden="true"><use href="/icons.svg#i-cookie-bite"></use></svg> Datele tale, alegerea ta</h2>
      <p>Folosim doar stocare esențială și, dacă ești de acord, reținem preferințele tale pe acest dispozitiv. Nu folosim cookie-uri de reclamă sau de urmărire.
      Detalii în <a href="/cookies.html">politica de cookies</a> și <a href="/confidentialitate.html">politica de confidențialitate</a>.</p>
    </div>
    <div class="cookies__actions">
      <button class="btn btn--ink" type="button" data-consent="toate">Acceptă</button>
      <button class="btn btn--ink" type="button" data-consent="necesar">Acceptă strictul necesar</button>
      <button class="btn btn--ink" type="button" data-consent="refuz">Refuză</button>
    </div>`;
  document.body.appendChild(box);
  return box;
}

export function initConsent() {
  const banner = buildBanner();
  banner.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-consent]');
    if (!btn) return;
    save(btn.dataset.consent);
    banner.hidden = true;
  });
  document.querySelectorAll('[data-cookie-settings]').forEach((btn) => {
    btn.addEventListener('click', () => {
      banner.hidden = false;
      banner.querySelector('[data-consent]').focus();
    });
  });
  if (!getConsent()) banner.hidden = false;
}
