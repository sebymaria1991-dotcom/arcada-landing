// Generează cele trei pagini legale cu același antet și subsol. Rulare: node scripts/pagini-legale.mjs
import { writeFileSync } from 'node:fs';

const ACTUALIZAT = '30 octombrie 2026';
const FILA_NOUA = '<span class="sr-only"> (se deschide într-o filă nouă)</span>';
const NOTA = `<p class="legal__note"><strong>Proiect demonstrativ.</strong> Arcada este un brand creat pentru o temă de curs, așa că site-ul nu are încă date de firmă (denumire, CUI, sediu). Înainte de o lansare comercială, ele trebuie completate aici. Formularul funcționează însă cu adevărat, iar textele de mai jos descriu ce se întâmplă în realitate cu datele tale.</p>`;

const pagina = (fisier, titlu, descriere, eticheta, corp) => writeFileSync(new URL(`../${fisier}`, import.meta.url), `<!doctype html>
<html lang="ro">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${titlu} · Arcada</title>
  <meta name="description" content="${descriere}">
  <meta name="theme-color" content="#F2F0E9">
  <link rel="canonical" href="https://arcada-landing.vercel.app/${fisier}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/src/styles.css">
</head>
<body>
  <a class="skip" href="#continut">Sari la conținut</a>

  <header class="nav">
    <div class="nav__inner wrap">
      <a class="brand" href="/" aria-label="Arcada, înapoi la pagina principală">
        <svg class="brand__mark" viewBox="0 0 40 40" aria-hidden="true">
          <path d="M4 36V18a16 16 0 0 1 32 0v18" fill="none" stroke="currentColor" stroke-width="3.2"/>
          <path d="M12 36V19a8 8 0 0 1 16 0v17" fill="none" stroke="currentColor" stroke-width="3.2"/>
          <rect x="17" y="3" width="6" height="6" fill="var(--ochre)" stroke="currentColor" stroke-width="1.6"/>
        </svg>
        <span class="brand__word">Arcada</span>
      </a>
    </div>
  </header>

  <main id="continut" class="legal">
    <div class="wrap legal__inner">
      <p class="tag">${eticheta}</p>
      <h1>${titlu}</h1>
${corp}
      <p class="legal__meta">Ultima actualizare: ${ACTUALIZAT}</p>
      <div class="legal__actions">
        <a class="btn btn--ink" href="/">Înapoi la pagina principală</a>
      </div>
    </div>
  </main>

  <footer class="legal__foot">
    <div class="wrap legal__links">
      <a href="/confidentialitate.html">Politica de confidențialitate</a>
      <a href="/cookies.html">Politica de cookies</a>
      <a href="/termeni.html">Termeni și condiții</a>
      <button class="footer__link" type="button" data-cookie-settings>Setări cookies</button>
    </div>
  </footer>
  <script type="module" src="/src/legal.js"></script>
</body>
</html>
`);

pagina('confidentialitate.html', 'Politica de confidențialitate', 'Ce date personale colectează Arcada, de ce, cum le folosim, cât timp le păstrăm și ce drepturi ai.', 'Date personale', `
      ${NOTA}
      <p>Această politică explică pe înțeles ce date personale colectăm prin site, de ce avem nevoie de ele și cum le folosim, conform Regulamentului (UE) 2016/679 (GDPR).</p>

      <h2>Cine răspunde de datele tale</h2>
      <p>Datele trimise prin formular ajung la autorul proiectului, la adresa <a href="mailto:__CONTACT_EMAIL__">__CONTACT_EMAIL__</a>. Tot acolo ne poți scrie pentru orice întrebare despre datele tale.</p>

      <h2>Ce date colectăm și de ce</h2>
      <ul>
        <li><strong>Numele</strong>, ca să știm cum să ne adresăm ție.</li>
        <li><strong>Adresa de e-mail</strong>, ca să-ți trimitem confirmarea solicitării.</li>
        <li><strong>Numărul de telefon</strong>, ca să te sunăm și să stabilim prima discuție.</li>
        <li><strong>Mesajul</strong>, dacă alegi să scrii unul. Câmpul e opțional.</li>
      </ul>
      <p>Colectăm doar ce ne trebuie ca să-ți răspundem. Nu creăm conturi, nu facem profiluri și nu luăm decizii automate despre tine.</p>

      <h2>Cum le folosim și pe ce temei</h2>
      <p>Folosim datele doar ca să răspundem solicitării tale și să pregătim o eventuală colaborare. Temeiul legal este art. 6 alin. (1) lit. (b) din GDPR: pașii făcuți la cererea ta, înainte de încheierea unui contract. Nu le folosim pentru reclame și nu le vindem.</p>

      <h2>Cine ne ajută tehnic</h2>
      <ul>
        <li><strong>Vercel</strong> găzduiește site-ul și funcția care primește formularul.</li>
        <li><strong>Google (Gmail)</strong> transmite e-mailul de confirmare și pe cel de notificare.</li>
      </ul>
      <p>Acești furnizori pot prelucra date și în afara Spațiului Economic European, cu garanțiile prevăzute de GDPR în contractele lor. Dacă ne scrii pe WhatsApp, conversația se desfășoară în aplicația WhatsApp, conform politicii proprii a acesteia.</p>
      <p>Pentru protecția împotriva trimiterilor automate, serverul ține în memorie, cel mult 10 minute, adresa IP de la care vine solicitarea. Nu o salvăm în altă parte.</p>

      <h2>Cât timp păstrăm datele</h2>
      <p>Cât e nevoie ca să-ți răspundem, dar cel mult 6 luni de la trimitere. Dacă ne ceri să le ștergem mai devreme, o facem.</p>

      <h2>Cookie-uri</h2>
      <p>Nu folosim cookie-uri de reclamă sau de urmărire. Toate detaliile și posibilitatea de a-ți schimba alegerea sunt în <a href="/cookies.html">politica de cookies</a>.</p>

      <h2>Drepturile tale</h2>
      <ul>
        <li>să afli ce date avem despre tine și să primești o copie;</li>
        <li>să le corectezi sau să ceri ștergerea lor;</li>
        <li>să restricționezi folosirea lor sau să te opui;</li>
        <li>să le primești într-un format ușor de transferat.</li>
      </ul>
      <p>Pentru oricare dintre ele, scrie-ne la adresa de mai sus. Poți depune și o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (<a href="https://www.dataprotection.ro/" target="_blank" rel="noopener">ANSPDCP${FILA_NOUA}</a>).</p>
`);

pagina('cookies.html', 'Politica de cookies', 'Ce stochează site-ul Arcada pe dispozitivul tău, cele trei opțiuni pe care le ai și cum îți schimbi alegerea.', 'Cookie-uri', `
      <p>Cookie-urile și tehnologiile similare, precum stocarea locală a browserului, sunt fișiere sau valori mici păstrate pe dispozitivul tău. Potrivit Legii nr. 506/2004, tot ce nu e strict necesar se stochează doar cu acordul tău.</p>
      <p><strong>Pe scurt:</strong> nu folosim cookie-uri de reclamă sau de analiză și nu încărcăm scripturi de urmărire de la terți. Stocăm doar câteva valori tehnice, descrise mai jos.</p>

      <h2>Cele trei opțiuni</h2>
      <ul>
        <li><strong>Acceptă.</strong> Îți păstrăm alegerea 6 luni și ținem minte preferințele, de exemplu că ai închis oferta din pop-up.</li>
        <li><strong>Acceptă strictul necesar.</strong> Îți păstrăm doar alegerea, 6 luni. Preferințele sunt uitate când închizi browserul.</li>
        <li><strong>Refuză.</strong> Nu rămâne nimic pe dispozitiv după ce închizi browserul, așa că te vom întreba din nou la următoarea vizită.</li>
      </ul>
      <p>Site-ul funcționează la fel în toate cele trei cazuri, inclusiv formularul.</p>

      <h2>Ce stocăm</h2>
      <div class="legal__scroll">
        <table class="legal__table">
          <thead><tr><th scope="col">Nume</th><th scope="col">Tip</th><th scope="col">Rol</th><th scope="col">Durată</th></tr></thead>
          <tbody>
            <tr><td>arcada-consent</td><td>Stocare locală, strict necesară</td><td>Reține alegerea ta privind cookie-urile</td><td>6 luni</td></tr>
            <tr><td>arcada-consent-sesiune</td><td>Stocare de sesiune, strict necesară</td><td>Reține refuzul până închizi browserul</td><td>Sesiunea</td></tr>
            <tr><td>arcada-oferta-vazuta</td><td>Preferințe</td><td>Ține minte că ai văzut oferta. Durează mai mult doar dacă ai ales „Acceptă”</td><td>Sesiunea sau până ștergi datele browserului</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Cum îți schimbi alegerea</h2>
      <p>Apasă oricând „Setări cookies”, în partea de jos a paginii, sau butonul de mai jos. Poți șterge și singur datele din setările browserului.</p>
      <p><button class="btn btn--ink" type="button" data-cookie-settings>Setări cookies</button></p>

      <h2>Legături externe</h2>
      <p>Linkurile spre WhatsApp, ANCPI, ANPC sau Pexels duc pe site-uri ale altor organizații, care au propriile politici. Nu trimitem date către ele decât dacă le deschizi.</p>
`);

pagina('termeni.html', 'Termeni și condiții', 'Condițiile de folosire a site-ului Arcada și limitele informațiilor publicate.', 'Informații legale', `
      ${NOTA}
      <h2>Despre acest site</h2>
      <p>Site-ul prezintă serviciile de consultanță imobiliară pentru cumpărători oferite sub numele Arcada. Folosindu-l, ești de acord cu acești termeni.</p>

      <h2>Informațiile de pe site</h2>
      <p>Textele au caracter general și nu reprezintă o ofertă fermă, consultanță juridică sau o evaluare a unei locuințe anume. Serviciile, comisionul și condițiile concrete se stabilesc în scris, înainte de începerea colaborării.</p>

      <h2>Ce nu facem</h2>
      <p>Nu înlocuim notarul sau avocatul. Notarul autentifică actele, iar pentru situații juridice complicate îți recomandăm să lucrezi și cu un avocat.</p>

      <h2>Proprietate intelectuală</h2>
      <p>Textele, schițele și identitatea vizuală aparțin proiectului Arcada. Fotografiile și clipul provin de pe Pexels, iar iconurile din Font Awesome Free (CC BY 4.0). Unele ilustrații și animații sunt realizate cu ajutorul inteligenței artificiale.</p>

      <h2>Reclamații și litigii</h2>
      <p>Pentru orice nemulțumire, scrie-ne la <a href="mailto:__CONTACT_EMAIL__">__CONTACT_EMAIL__</a>. Poți apela și la <a href="https://anpc.ro/" target="_blank" rel="noopener">Autoritatea Națională pentru Protecția Consumatorilor${FILA_NOUA}</a> sau la <a href="https://reclamatiisal.anpc.ro/" target="_blank" rel="noopener">soluționarea alternativă a litigiilor${FILA_NOUA}</a>.</p>

      <h2>Modificări</h2>
      <p>Putem actualiza acești termeni. Versiunea valabilă e cea publicată pe această pagină, cu data de mai jos.</p>
`);
