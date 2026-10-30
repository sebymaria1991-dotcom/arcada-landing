import { animate, inView, scroll, stagger } from 'motion';
import { initForm } from './form.js';
import { initConsent, getConsent, offerSeen, markOfferSeen } from './consent.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const EASE = [0.2, 0.7, 0.1, 1];

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

  // indicatorul se mută sub linkul peste care ești sau sub secțiunea curentă
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
  // în afara secțiunilor din meniu nu marcăm nimic
  const clear = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) => l.removeAttribute('aria-current'));
        current = null;
        moveBubble(null);
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['#inceput', '#problema', '#contact'].forEach((id) => { const el = document.querySelector(id); if (el) clear.observe(el); });
}

/* Animații cu Motion: toate se opresc dacă omul a cerut mișcare redusă ---- */
function initMotion() {
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reduceMotion.matches) {
    reveals.forEach((el) => el.classList.add('is-in'));
    return;
  }

  // deschiderea: rândurile titlului urcă din spatele unei măști, restul apare în cascadă
  animate('[data-hero-line]', { y: ['105%', '0%'] }, { duration: 0.9, delay: stagger(0.12), ease: EASE });
  animate('[data-hero]', { opacity: [0, 1], y: [16, 0] }, { duration: 0.7, delay: stagger(0.09, { startDelay: 0.25 }), ease: EASE });
  animate('.hl', { backgroundSize: ['0% 100%', '100% 100%'] }, { duration: 0.8, delay: 0.75, ease: EASE });

  // bara de progres de sus urmărește derularea
  scroll(animate('[data-progress]', { scaleX: [0, 1] }, { ease: 'linear' }));

  // titlurile apar cuvânt cu cuvânt
  document.querySelectorAll('[data-words]').forEach((title) => {
    const words = title.textContent.trim().split(/\s+/);
    title.setAttribute('aria-label', title.textContent.trim());
    title.innerHTML = words.map((w) => `<span class="w" aria-hidden="true"><span>${w}</span></span>`).join(' ');
    const inner = title.querySelectorAll('.w > span');
    animate(inner, { y: '110%' }, { duration: 0 });
    inView(title, () => {
      animate(inner, { y: '0%' }, { duration: 0.7, delay: stagger(0.035), ease: EASE });
    }, { amount: 0.4 });
  });

  // elementele apar la derulare, în cascadă față de frații lor
  inView('[data-reveal]', (el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal'));
    const delay = Math.max(0, siblings.indexOf(el)) * 0.08;
    el.classList.add('is-in');
    animate(el, { opacity: [0, 1], y: [24, 0] }, { duration: 0.7, delay, ease: EASE });
  }, { amount: 0.12, margin: '0px 0px -6% 0px' });

  // imaginile se mișcă ușor mai lent decât pagina
  document.querySelectorAll('[data-parallax]').forEach((img) => {
    scroll(animate(img, { y: ['-5%', '5%'], scale: [1.12, 1.12] }, { ease: 'linear' }), { target: img.parentElement, offset: ['start end', 'end start'] });
  });

  // în „Cum lucrăm”, linia coboară la derulare și aprinde pe rând fiecare etapă
  const timeline = document.querySelector('[data-timeline]');
  if (timeline) {
    const steps = [...timeline.querySelectorAll('.timeline__step')];
    const last = steps.length - 1;
    timeline.classList.add('is-live');
    scroll((progress) => {
      const reached = progress * last;
      steps.forEach((step, i) => {
        step.style.setProperty('--fill', Math.min(1, Math.max(0, reached - i)));
        step.classList.toggle('is-lit', reached >= i - 0.02);
      });
    }, { target: timeline, offset: ['start 70%', 'end 65%'] });
  }
}

/* Schița interactivă: punctele, graficul și straturile din desen sunt legate */
function initPlan() {
  const root = document.querySelector('[data-plan]');
  if (!root) return;
  const pins = [...root.querySelectorAll('[data-pin]')];
  const items = [...root.querySelectorAll('[data-item]')];
  const nodes = [...root.querySelectorAll('[data-item-btn]')];
  const layers = [...root.querySelectorAll('[data-layer]')];
  const dial = root.querySelector('[data-dial]');
  const title = root.querySelector('[data-dial-title]');
  let current = -1;

  const select = (i, { scroll: move = false } = {}) => {
    if (i === current) return;
    current = i;
    items.forEach((item, n) => item.classList.toggle('is-open', n === i));
    nodes.forEach((node, n) => node.setAttribute('aria-expanded', String(n === i)));
    pins.forEach((pin, n) => pin.setAttribute('aria-pressed', String(n === i)));
    layers.forEach((g) => g.classList.toggle('is-on', Number(g.dataset.layer) === i));
    nodes.forEach((node, n) => node.classList.toggle('is-done', n < i));
    title.textContent = nodes[i].dataset.title;
    if (!reduceMotion.matches) {
      animate(title, { opacity: [0, 1], scale: [0.94, 1] }, { duration: 0.35, ease: EASE });
      animate(items[i].querySelectorAll('.flow li'), { opacity: [0, 1], x: [-10, 0] }, { duration: 0.35, delay: stagger(0.06), ease: EASE });
    }
    if (move && window.matchMedia('(max-width: 959px)').matches) {
      dial.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'nearest' });
    }
  };
  pins.forEach((pin, i) => pin.addEventListener('click', () => select(i, { scroll: true })));
  nodes.forEach((node, i) => node.addEventListener('click', () => select(i)));
  select(0);
  // treptele cresc pe rând când graficul intră în ecran
  if (!reduceMotion.matches) {
    inView(dial, () => { animate(nodes, { scaleY: [0, 1] }, { duration: 0.6, delay: stagger(0.08), ease: EASE }); });
  }
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

/* Butonul „Formular”: duce la formular și pune cursorul în primul câmp ---- */
function goToForm(e) {
  const name = document.querySelector('#f-name');
  if (!name || name.closest('[hidden]')) return;
  // facem noi derularea: ancora obișnuită ar lua focusul din câmp
  e.preventDefault();
  document.querySelector('#formular').scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  name.focus({ preventScroll: true });
}

/* Pop-up cu oferta: la intrare, după cookie-uri; apoi rămâne ca etichetă în meniu */
function initOffer() {
  const dialog = document.querySelector('[data-offer]');
  const pill = document.querySelector('[data-offer-pill]');
  if (!dialog || !pill) return;
  const ENTRY_DELAY_MS = 700;

  const open = () => {
    if (dialog.open) return;
    dialog.showModal();
    if (!reduceMotion.matches) animate(dialog, { opacity: [0, 1], y: [28, 0], scale: [0.97, 1] }, { duration: 0.5, ease: EASE });
  };
  const showPill = () => {
    if (!pill.hidden) return;
    pill.hidden = false;
    if (!reduceMotion.matches) animate(pill, { opacity: [0, 1], scale: [0.8, 1] }, { duration: 0.4, ease: EASE });
  };
  const close = () => { if (dialog.open) dialog.close(); };

  const onEntry = () => {
    if (offerSeen()) { showPill(); return; }
    // cine a intrat direct la contact sau completează formularul nu e întrerupt
    const contact = document.querySelector('#contact')?.getBoundingClientRect();
    if (document.activeElement?.closest('[data-form]') || (contact && contact.top < window.innerHeight && contact.bottom > 0)) { showPill(); return; }
    markOfferSeen();
    open();
  };

  dialog.addEventListener('close', showPill);
  dialog.querySelectorAll('[data-offer-close]').forEach((b) => b.addEventListener('click', close));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  pill.addEventListener('click', open);
  dialog.querySelector('[data-offer-cta]').addEventListener('click', (e) => {
    close();
    const message = document.querySelector('#f-message');
    if (message && !message.value) message.value = 'Aș vrea analiza gratuită a anunțului: ';
    goToForm(e);
  });

  const start = () => setTimeout(onEntry, ENTRY_DELAY_MS);
  if (getConsent()) start();
  else window.addEventListener('arcada:consent', start, { once: true });
}

initConsent();
initNav();
initMotion();
initPlan();
initVideo();
initWhatsAppPulse();
initWaHide();
initForm(document.querySelector('[data-form]'));
initOffer();
document.querySelectorAll('[data-go-form]').forEach((a) => a.addEventListener('click', goToForm));
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
