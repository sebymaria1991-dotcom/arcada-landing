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
  links.forEach((a, i) => {
    a.style.setProperty('--i', i);
    a.innerHTML = `<span class="roll"><span>${a.textContent}</span><span aria-hidden="true">${a.textContent}</span></span>`;
  });

  const setOpen = (open) => {
    menu.toggleAttribute('data-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burgerLabel.textContent = open ? 'Închide meniul' : 'Deschide meniul';
    if (open) {
      nav.style.setProperty('--nav-top', `${Math.max(0, nav.getBoundingClientRect().top)}px`);
      menu.querySelector('a')?.focus();
    }
  };
  // meniul dispare când cobori și revine când urci
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (Math.abs(y - lastY) < 6) return;
    const open = burger?.getAttribute('aria-expanded') === 'true';
    nav.classList.toggle('is-hidden', y > lastY && y > nav.offsetHeight * 2 && !open && !nav.contains(document.activeElement));
    lastY = y;
  }, { passive: true });
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));

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

  // meniul coboară la intrare, iar linkurile apar pe rând
  if (window.matchMedia('(min-width: 1040px)').matches) {
    animate('.menu__list li:not(.menu__bubble), .menu__cta', { opacity: [0, 1], y: [-10, 0] }, { duration: 0.6, delay: stagger(0.06, { startDelay: 0.35 }), ease: EASE });
  }

  // bara de progres de sus urmărește derularea
  scroll(animate('[data-progress]', { scaleX: [0, 1] }, { ease: 'linear' }));

  // titlurile apar cuvânt cu cuvânt
  document.querySelectorAll('[data-words]').forEach((title) => {
    const words = title.textContent.trim().split(/\s+/);
    title.setAttribute('aria-label', title.textContent.trim());
    const marked = (title.dataset.hl || '').split(/\s+/).filter(Boolean);
    const start = words.join(' ').indexOf(marked.join(' '));
    const from = marked.length && start >= 0 ? words.join(' ').slice(0, start).split(' ').length - 1 : -1;
    title.innerHTML = words.map((w, i) => {
      const mark = from >= 0 && i >= from && i < from + marked.length;
      return `<span class="w${mark ? ' is-mark' : ''}" aria-hidden="true"><span>${w}</span></span>`;
    }).join(' ');
    const inner = title.querySelectorAll('.w > span');
    animate(inner, { y: '110%' }, { duration: 0 });
    inView(title, () => {
      animate(inner, { y: '0%' }, { duration: 0.7, delay: stagger(0.035), ease: EASE });
      const marks = title.querySelectorAll('.is-mark > span');
      if (marks.length) animate(marks, { backgroundSize: ['0% .13em', '100% .13em'] }, { duration: 0.55, delay: stagger(0.12, { startDelay: 0.55 }), ease: EASE });
    }, { amount: 0.4 });
  });

  // etichetele se „decodează”, literă cu literă, ca pe o fișă tehnică
  const LITERE = 'ABCDEFGHIKLMNOPRSTUVZ%#/';
  document.querySelectorAll('.tag').forEach((tag) => {
    const text = tag.textContent;
    tag.setAttribute('aria-label', text);
    inView(tag, () => {
      tag.style.width = `${tag.getBoundingClientRect().width}px`;
      tag.style.whiteSpace = 'nowrap';
      animate(0, text.length, {
        duration: Math.min(0.9, 0.3 + text.length * 0.03),
        ease: 'linear',
        onUpdate: (n) => {
          const done = Math.floor(n);
          tag.textContent = text.slice(0, done) + [...text.slice(done)].map((ch) => (ch === ' ' ? ' ' : LITERE[Math.floor(Math.random() * LITERE.length)])).join('');
        },
        onComplete: () => { tag.textContent = text; tag.style.width = ''; tag.style.whiteSpace = ''; },
      });
    }, { amount: 0.6 });
  });

  // textele lungi se aprind cuvânt cu cuvânt, odată cu derularea
  document.querySelectorAll('.about .section-head__lead, .problem .section-head__lead').forEach((p) => {
    if (p.children.length) return;
    p.innerHTML = p.textContent.trim().split(/\s+/).map((w) => `<span>${w}</span>`).join(' ');
    const words = [...p.children];
    scroll((progress) => {
      const reached = progress * (words.length + 6);
      // cât timp textul e sub ecran rămâne complet vizibil; se estompează abia când intră
      words.forEach((w, i) => { w.style.opacity = progress === 0 ? '' : Math.min(1, Math.max(0.3, (reached - i) / 6)); });
    }, { target: p, offset: ['start 100%', 'end 62%'] });
  });

  // pozele se dezvăluie de la stânga la dreapta; observăm cadrul, nu poza ascunsă
  document.querySelectorAll('[data-wipe]').forEach((fig) => {
    const img = fig.querySelector('img');
    img.style.clipPath = 'inset(0 100% 0 0)';
    inView(fig, () => {
      animate(img, { clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'] }, { duration: 1.1, ease: EASE });
    }, { amount: 0.25 });
  });

  // arcada comisionului urcă, iar procentul numără până la valoarea lui
  const fee = document.querySelector('.fee__value');
  if (fee) {
    const parts = fee.textContent.trim().match(/^(\d+)(.*)$/);
    fee.style.visibility = 'hidden';
    inView(fee, () => {
      fee.style.visibility = '';
      animate(fee, { y: ['100%', '0%'] }, { duration: 0.9, ease: EASE });
      if (parts) {
        animate(0, Number(parts[1]), { duration: 1.1, delay: 0.25, ease: 'easeOut', onUpdate: (n) => { fee.textContent = `${Math.round(n)}${parts[2]}`; } });
      }
    }, { amount: 0 });
  }

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

/* Banda cu tipuri de locuințe: se repetă fără cusătură și poate fi oprită */
function initMarquee() {
  const box = document.querySelector('[data-marquee]');
  const toggle = document.querySelector('[data-marquee-toggle]');
  if (!box || !toggle || reduceMotion.matches) return;
  const track = box.querySelector('.city__strip');
  const cards = [...track.children];
  for (let round = 0; round < 3; round += 1) {
    cards.forEach((card) => {
      const copy = card.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.inert = true;
      copy.querySelectorAll('img').forEach((img) => { img.alt = ''; });
      track.append(copy);
    });
  }
  // pozele din bandă se încarcă din timp, ca să nu apară goluri când intră pe ecran
  inView(box, () => { track.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; }); }, { margin: '400px 0px' });
  track.classList.add('is-running');
  toggle.hidden = false;
  const label = toggle.querySelector('.sr-only');
  const icon = toggle.querySelector('use');
  toggle.addEventListener('click', () => {
    const paused = box.classList.toggle('is-paused');
    toggle.setAttribute('aria-pressed', String(paused));
    label.textContent = paused ? 'Pornește imaginile' : 'Pune imaginile pe pauză';
    icon.setAttribute('href', `/icons.svg#i-${paused ? 'play' : 'pause'}`);
  });
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
    if (reduceMotion.matches) return;
    // panoul sare ușor, arcada se desenează, iar conținutul apare pe rând
    animate(dialog, { opacity: [0, 1], y: [48, 0], scale: [0.92, 1] }, { type: 'spring', stiffness: 240, damping: 22 });
    animate(dialog.querySelectorAll('.offer__arch path'), { strokeDashoffset: [1, 0] }, { duration: 1.3, delay: stagger(0.2), ease: EASE });
    animate(dialog.querySelectorAll('.offer__top > :not(svg), .offer__lead, .offer__list li, .offer__cta, .offer__later'), { opacity: [0, 1], y: [16, 0] }, { duration: 0.5, delay: stagger(0.07, { startDelay: 0.15 }), ease: EASE });
    // bifele se pun una câte una
    animate(dialog.querySelectorAll('.offer__list .ico'), { scale: [0, 1.3, 1] }, { duration: 0.45, delay: stagger(0.14, { startDelay: 0.6 }), ease: EASE });
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
initMarquee();
initPlan();
initVideo();
initWhatsAppPulse();
initWaHide();
initForm(document.querySelector('[data-form]'));
initOffer();
document.querySelectorAll('[data-go-form]').forEach((a) => a.addEventListener('click', goToForm));
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
