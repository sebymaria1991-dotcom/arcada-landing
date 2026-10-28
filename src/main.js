import { initForm } from './form.js';

document.documentElement.classList.add('js');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* Bara de sus: banda care rulează și poate fi oprită --------------------- */
function initTicker() {
  const tape = document.querySelector('.tape');
  const track = tape?.querySelector('[data-ticker]');
  const toggle = tape?.querySelector('[data-ticker-toggle]');
  if (!track || !toggle) return;

  // dublăm conținutul ca bucla să fie continuă; copia e ascunsă cititoarelor de ecran
  [...track.children].forEach((li) => {
    const copy = li.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    track.appendChild(copy);
  });

  const label = toggle.querySelector('[data-ticker-label]');
  const icon = toggle.querySelector('use');
  let paused = false;
  try { paused = localStorage.getItem('arcada-tape') === 'paused'; } catch { /* stocare indisponibilă */ }

  const render = () => {
    tape.toggleAttribute('data-paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    label.textContent = paused ? 'Pornește banda' : 'Oprește banda';
    icon.setAttribute('href', `/icons.svg#i-${paused ? 'play' : 'pause'}`);
  };
  toggle.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('arcada-tape', paused ? 'paused' : 'running'); } catch { /* ignorăm */ }
    render();
  });
  render();
}

/* Meniu: hamburger pe mobil, indicator pe desktop, secțiunea curentă ------ */
function initNav() {
  const nav = document.querySelector('[data-nav]');
  const menu = document.querySelector('[data-menu]');
  const burger = document.querySelector('[data-burger]');
  const burgerLabel = burger?.querySelector('[data-burger-label]');
  const list = document.querySelector('[data-bubble-nav]');
  const bubble = list?.querySelector('.menu__bubble');
  const links = [...(list?.querySelectorAll('a') || [])];

  const setOpen = (open) => {
    menu.toggleAttribute('data-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burgerLabel.textContent = open ? 'Închide meniul' : 'Deschide meniul';
    if (open) {
      nav.style.setProperty('--nav-top', `${Math.max(0, nav.getBoundingClientRect().top)}px`);
      menu.querySelector('a')?.focus();
    }
  };
  burger?.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger?.getAttribute('aria-expanded') === 'true') { setOpen(false); burger.focus(); }
  });
  window.matchMedia('(min-width: 1040px)').addEventListener('change', () => setOpen(false));

  // indicatorul galben se mută sub linkul peste care ești sau sub secțiunea curentă
  let current = null;
  const moveBubble = (a) => {
    if (!bubble) return;
    if (!a) { bubble.style.setProperty('--bo', '0'); return; }
    const lr = list.getBoundingClientRect();
    const r = a.getBoundingClientRect();
    bubble.style.setProperty('--bx', `${r.left - lr.left}px`);
    bubble.style.setProperty('--bw', `${r.width}px`);
    bubble.style.setProperty('--bo', '1');
  };
  links.forEach((a) => {
    a.addEventListener('mouseenter', () => moveBubble(a));
    a.addEventListener('focus', () => moveBubble(a));
  });
  list?.addEventListener('mouseleave', () => moveBubble(current));
  list?.addEventListener('focusout', () => moveBubble(current));
  window.addEventListener('resize', () => moveBubble(current));

  const sections = links.map((a) => document.querySelector(a.hash)).filter(Boolean);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const a = links.find((l) => l.hash === `#${entry.target.id}`);
      links.forEach((l) => l.removeAttribute('aria-current'));
      if (a) a.setAttribute('aria-current', 'true');
      current = a || null;
      moveBubble(current);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => io.observe(s));
  // în afara secțiunilor din meniu (deschidere, contact) nu marcăm nimic
  const clear = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) => l.removeAttribute('aria-current'));
        current = null;
        moveBubble(null);
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['#inceput', '#contact'].forEach((id) => { const el = document.querySelector(id); if (el) clear.observe(el); });
}

/* Apariții la derulare --------------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  items.forEach((el) => io.observe(el));
}

/* Planul interactiv: punctele de pe desen și lista sunt legate ------------ */
function initPlan() {
  const root = document.querySelector('[data-plan]');
  if (!root) return;
  const pins = [...root.querySelectorAll('[data-pin]')];
  const items = [...root.querySelectorAll('[data-item]')];

  const select = (i, { scroll = false } = {}) => {
    items.forEach((item, n) => {
      const open = n === i;
      item.classList.toggle('is-open', open);
      item.querySelector('[data-item-btn]').setAttribute('aria-expanded', String(open));
    });
    pins.forEach((pin, n) => pin.setAttribute('aria-pressed', String(n === i)));
    if (scroll && window.matchMedia('(max-width: 959px)').matches) {
      items[i].scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'nearest' });
    }
  };
  pins.forEach((pin, i) => pin.addEventListener('click', () => select(i, { scroll: true })));
  items.forEach((item, i) => item.querySelector('[data-item-btn]').addEventListener('click', () => select(i)));
  select(0);
}

/* WhatsApp: pulsul Lottie din Assets-Library, încărcat doar când pagina e liberă */
function initWhatsAppPulse() {
  const host = document.querySelector('[data-wa-pulse]');
  if (!host || reduceMotion.matches) return;
  const load = () => {
    const s = document.createElement('script');
    s.src = '/vendor/lottie.min.js';
    s.async = true;
    s.onload = () => {
      window.lottie?.loadAnimation({
        container: host, renderer: 'svg', loop: true, autoplay: true, path: '/vendor/pulse.json',
      });
    };
    document.head.appendChild(s);
  };
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 2500));
  window.addEventListener('load', () => idle(load, { timeout: 4000 }));
}

/* Butonul WhatsApp se ascunde cât timp formularul e pe ecran, ca să nu acopere câmpurile */
function initWaHide() {
  const wa = document.querySelector('[data-wa]');
  const card = document.querySelector('.form-card');
  if (!wa || !card) return;
  const io = new IntersectionObserver(([entry]) => { wa.toggleAttribute('data-hidden', entry.isIntersecting); }, { threshold: 0.15 });
  io.observe(card);
}

function initVideo() {
  // clipul pornește doar la cerere și fără sonor; îl oprim dacă iese din ecran
  const video = document.querySelector('.video');
  if (!video) return;
  video.muted = true;
  const io = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting && !video.paused) video.pause(); });
  io.observe(video);
}

initTicker();
initNav();
initReveal();
initPlan();
initVideo();
initWhatsAppPulse();
initWaHide();
initForm(document.querySelector('[data-form]'));
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
