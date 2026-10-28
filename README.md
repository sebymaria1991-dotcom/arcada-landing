# Arcada: landing page pentru consultanță imobiliară

Proiect demonstrativ, educațional. **Arcada este un brand inventat.** Pagina nu reprezintă o firmă reală.

- Link public: **https://arcada-landing.vercel.app**
- Cod sursă: **https://github.com/sebymaria1991-dotcom/arcada-landing**

## Conceptul

**Arcada** este un consultant imobiliar care lucrează **doar pentru cumpărător**, în Cluj-Napoca și împrejurimi. Arcada nu vinde apartamente. Îl ajută pe cel care cumpără: îi verifică actele și starea reală a locuinței, compară prețul cu zona, negociază pentru el și îl însoțește la notar. E plătit cu un tarif fix de cumpărător, nu cu un procent de la vânzător.

**Publicul:** oameni între 28 și 40 de ani care își cumpără primul apartament în Cluj, adesea cu credit ipotecar. Nu cunosc procedurile (carte funciară, cadastru, antecontract) și se tem să nu greșească la cea mai mare cheltuială din viața lor.

**Acțiunea principală:** _Programează discuția gratuită_. Prima discuție (30 de minute) e gratuită și se cere prin formular sau pe WhatsApp. Același buton apare în meniu, în prima secțiune, în blocul de ofertă, după pași, în formular și în subsol.

### Identitatea vizuală: „Fișa tehnică”

Pagina arată ca dosarul unui inspector: hârtie de plan, cerneală, cote și numerotare. Am evitat intenționat tiparele de „pagină generată”: gradienți mov, sticlă (glassmorphism), neon pe fundal negru, carduri rotunjite identice, fontul Inter, teracota și cremul.

| Element | Alegere |
|---|---|
| Culori | hârtie rece `#EDEDE7`, cerneală `#141619`, galben de ruletă `#F2C230`; roșu doar pentru erori, verde doar pentru WhatsApp și validare |
| Fonturi | **Bricolage Grotesque** (titluri condensate cu axa de lățime, plus text) și **IBM Plex Mono** (etichete, cote, butoane), ambele găzduite local |
| Motive | banda de sus desenată ca o ruletă cu gradații; cote de plan („h 2,60 m”, „11,20 m”); secțiuni numerotate ca fișe (00–06); un plan de apartament interactiv |
| Butoane | dreptunghiulare, cu umbră plină decalată, ca o ștampilă, și o fâșie de lumină la hover |
| Imagini | fotografii cu saturație redusă, cu chenar de cerneală, ca să se lege de paletă |

## Structura și formula de marketing

**Formula principală este PAS (Problemă, Amplificare, Soluție).** Local folosesc și **FAB** (Caracteristici, Avantaje, Beneficii) în tabelul de beneficii, **Hook–Story–Offer** pentru scenariul ilustrativ și blocul de ofertă, și **Proof** (din 4Ps) pentru raportul-model. Denumirile formulelor nu apar pe site.

| Etapa | Unde e în pagină |
|---|---|
| **P (Problema)** | Deschiderea: „Agentul din anunț lucrează pentru vânzător. Noi lucrăm pentru tine.” Spune din prima ce oferim, cui și de ce merită să citești mai departe. |
| **A (Amplificarea)** | Secțiunea 01, „Ce nu scrie în anunț”: patru riscuri concrete, fără cifre inventate (sarcini în CF, metri pătrați fără acte, defecte ascunse, antecontract dezechilibrat), apoi un **scenariu tipic** (Andrei, un 2 camere în Mărăști), marcat clar ca exemplu inventat. |
| **S (Soluția)** | Secțiunea 02, „Ce verificăm”: planul interactiv cu cele 5 puncte de verificare, un **raport-model** (marcat „Exemplu · date inventate”, cu sursele publice: ANCPI, cadastru), tabelul **FAB** „Ce facem / Ce înseamnă / Ce câștigi” și blocul de ofertă **„Verificarea Arcada, înainte de avans”** (tot ce primești, tarif fix, oprire după raport). Apoi 03 (tipuri de clădiri), 04 „Cum lucrăm” (4 pași și 3 reguli), 05 Întrebări (obiecțiile: preț, de ce nu agentul din anunț — inclusiv comisionul de 2–3% + TVA cerut des cumpărătorului —, notar, credit) și 06 formularul, cu „Ce se întâmplă după ce trimiți”. |

Toate elementele cerute sunt pe pagină: banda care rulează (cu buton de oprire), meniul, deschiderea cu video, imaginile, beneficiile, „Cum funcționează”, întrebările frecvente, formularul, subsolul cu date de contact și butonul WhatsApp.

## Materiale folosite din folderul pus la dispoziție

Din `Materiale ajutatoare AI/Materiale AI de folosit/Assets-Library/`:

| Material | Cale | Cum l-am folosit |
|---|---|---|
| Bricolage Grotesque | `fonts/bricolage-grotesque/` | fontul principal, cu axele de greutate și lățime |
| IBM Plex Mono | `fonts/ibm-plex-mono/` (400, 500) | etichete, cote, butoane, banda de sus |
| Font Awesome Free 7.3.0 | `fontawesome/.../svgs/` | 23 de iconuri, extrase într-un singur fișier `public/icons.svg` (9 KB, în loc de 900 KB de font) |
| Shine Sweep Effect | `animations/cod3power/shine-sweep-effect/` | fâșia de lumină care trece peste butoane la hover, recolorată pentru brand |
| CSS Animated Bubble Indicator | `animations/cod3power/css-animated-bubble-Indicator/` | indicatorul galben din meniu, rescris în JS ca să urmărească secțiunea curentă și linkul de sub mouse |
| HTML Form Validation (Native) | `animations/whatsapp/html-form-validation-native/` | modelul cu câmpuri „atinse” (`is-valid` / `is-invalid` / `flash`): erorile apar după ce părăsești câmpul, nu de la prima literă |
| Lottie: `pulse.json` + `lottie.min.js` | `animations/lottie/` | pulsul din spatele butonului WhatsApp, încărcat abia după ce pagina e liberă și dezactivat la mișcare redusă |

Ca idei, fără cod copiat: motivul cu cote și plan vine din șabloanele HorizonX (`Horizonx/2026-10-octombrie/rootline-hero`, land intelligence), iar ghidurile din `Cursuri/code3power-materiale/06_Design_Taste` au dat scara tipografică (5 mărimi, raport 1,333), regulile de spațiere a literelor și animațiile cu măsură.

### Materiale externe, cu drept de utilizare

- **Fotografii și clip:** [Pexels](https://www.pexels.com/license/), licență gratuită, inclusiv comercială, fără atribuire obligatorie. ID-uri: clip `7347597`; fotografii `13736784`, `36782639`, `33094438`, `8123134`, `9826456`, `8297489`, `7578992`.
- **Steaguri:** [flag-icons](https://github.com/lipis/flag-icons), licență MIT (`public/flags/LICENSE-flag-icons.txt`).
- **Validarea telefonului:** [libphonenumber-js](https://gitlab.com/catamphetamine/libphonenumber-js), MIT, cu metadatele complete (`/max`).
- **Trimiterea e-mailurilor:** [Nodemailer](https://nodemailer.com), MIT-0. Ideea de a trimite gratuit prin Gmail vine din linkul `Cursuri/email-gratis`.

## Cum funcționează formularul

```
Browser (src/form.js)                     Server (api/contact.js, funcție Vercel)
─────────────────────                     ──────────────────────────────────────
validare la părăsirea câmpului       ┐
detectarea țării după +prefix        │  POST /api/contact (JSON)
buton blocat + „Se trimite…”         ├──────────────────────────────►  capcană pentru roboți (câmp ascuns)
                                     │                                  timp minim de completare (3 s)
                                     │                                  limită: 5 cereri / 10 min / IP
                                     │                                  aceeași validare (lib/validate.js)
                                     │                                  Nodemailer → 1) notificare către echipă
                                     │                                               2) confirmare către vizitator
succes DOAR la răspuns 200 { ok }    ◄──────────────────────────────┘  200 / 422 (erori pe câmpuri) / 429 / 502
eroare → mesaj + „Încearcă din nou”, datele rămân în câmpuri
```

- **E-mail:** se verifică doar formatul. Pagina și e-mailul spun clar că asta nu dovedește că adresa e a persoanei respective. E-mailul de confirmare spune „am primit solicitarea”, nu „adresa e verificată”.
- **Telefon:** selector cu nume în română, steag și prefix, plus căutare după nume sau prefix și navigare cu tastatura. Un număr scris cu `+` sau `00` schimbă singur țara (`+39` → Italia). Pentru prefixele comune mai multor țări (`+1`, `+44`, `+7`), țara se deduce din restul cifrelor. Dacă alegi țara de mână, alegerea ta nu mai e suprascrisă, iar un prefix care nu se potrivește e explicat lângă câmp. Validarea se face cu `libphonenumber-js/max` pe țara aleasă, atât în browser, cât și pe server.
- **Confidențialitate:** colectăm doar nume, e-mail, telefon și mesaj. Lângă buton e explicat la ce folosesc. Nu există abonare la marketing.
- **Secrete:** datele SMTP stau doar în variabile de mediu pe server. Telefonul și e-mailul de contact vin tot din variabile, la build, așa că nu apar în repository.

## Pornire locală

Ai nevoie de Node.js 20 sau mai nou.

```bash
npm install
cp .env.example .env.local      # completezi valorile (vezi mai jos)
npm run dev                     # http://localhost:5173, cu /api/contact funcțional
```

În dezvoltare, `vite.config.js` rulează aceeași funcție `api/contact.js` ca pe Vercel, deci formularul trimite e-mailuri reale și local.

### Configurarea e-mailului (Gmail, gratuit)

1. Contul Google: **Securitate → Verificare în doi pași** (trebuie activată).
2. **Securitate → Parole pentru aplicații**: creezi o parolă nouă („Arcada”) și copiezi cele 16 caractere.
3. Completezi variabilele (în `.env.local` local și în Vercel → Settings → Environment Variables):

| Variabilă | Ce pui |
|---|---|
| `WHATSAPP_NUMBER` | numărul în format internațional, de exemplu `+40712345678` |
| `CONTACT_EMAIL` | adresa afișată în subsol |
| `SMTP_HOST` / `SMTP_PORT` | `smtp.gmail.com` / `465` |
| `SMTP_USER` | adresa Gmail care trimite |
| `SMTP_PASS` | parola de aplicație de 16 caractere (**nu** parola contului) |
| `MAIL_FROM` | `Arcada <adresa-gmail>` (la Gmail, aceeași adresă ca `SMTP_USER`) |
| `LEAD_INBOX` | unde ajung solicitările noi |
| `SITE_URL` | linkul public, apare în e-mailul de confirmare |

Limita Gmail e de circa 500 de mesaje pe zi, suficient pentru un formular de contact. Pentru teste fără Gmail merge și un cont [Ethereal](https://ethereal.email) (SMTP de test).

## Publicare (Vercel, plan gratuit Hobby)

Vercel găzduiește gratuit pagina statică (HTTPS automat) și funcția `api/contact.js`, care trimite e-mailurile.

1. Urci codul pe GitHub (fișierele `.env*` sunt excluse prin `.gitignore`).
2. Pe vercel.com: **Add New → Project → Import** din repository. Vercel detectează Vite singur (`npm run build`, folderul `dist`).
3. Adaugi variabilele de mai sus la **Environment Variables**, apoi **Deploy**.

Varianta din terminal: `npx vercel login`, apoi `npx vercel --prod`.

## Testare

```bash
npm run dev           # într-un terminal
npm test              # în altul: 19 teste automate în Chrome (playwright-core)
TEST_EMAIL=adresa@ta.ro npm test          # trimite și un e-mail real la adresa ta
BASE_URL=https://site-ul-public npm test  # rulează testele pe site-ul publicat
```

| Situația din temă | Ce verifică testul |
|---|---|
| Formular gol | 4 erori lângă câmpuri, `aria-invalid`, focus pe primul câmp, nicio cerere trimisă |
| E-mail greșit | mesaj explicit („ce e după @”), datele rămân |
| Telefon invalid | „Numărul nu este valid pentru România (+40)” |
| Prefix internațional | `+39` → Italia, `+44 7400…` → Regatul Unit, `+44 7911…` → Guernsey, `0049` → Germania |
| Schimbare manuală | căutare „moldo” + Enter → Moldova (+373); prefix +44 cu România aleasă → conflictul e explicat |
| Trimitere corectă | răspuns 200 de la server, e-mailurile trimise prin SMTP, mesaj de succes cu adresa |
| Eroare și reîncercare | rețea căzută → mesaj, datele rămân, „Încearcă din nou” reușește; 502 de la server → mesajul serverului |
| Trimitere repetată | 3 încercări în timpul trimiterii → 1 singură cerere, buton blocat, „Se trimite…” |
| Server | validare proprie (422), țara numărului, prea rapid (400), capcana pentru roboți, limită (429 la a 6-a cerere), GET refuzat (405) |
| Mobil și calculator | 360, 390, 768 și 1440 px: fără derulare orizontală, meniul mobil se deschide și se închide |
| Tastatură | link de salt, bandă, meniu, plan (Enter), întrebări (Enter), lista de țări (săgeți, Escape, focusul revine) |
| Video, WhatsApp, linkuri | copertă, controale, fără pornire automată, fără sonor, rulează; `wa.me` cu numărul; toate ancorele și fișierele există; nicio imagine fără `alt`; niciun text provizoriu |
| Mișcare | banda se oprește și pornește din buton; la mișcare redusă stă pe loc, se poate derula și nu mai există animații de apariție |

Ultima rulare, pe site-ul publicat (22.10.2026), cu e-mail real trimis prin Gmail: **19/19 teste trecute**. Local (Vite + SMTP de test Ethereal): tot 19/19.

## Limitări cunoscute

- **Limita de trimiteri** e ținută în memoria funcției serverless, deci se resetează când Vercel pornește o instanță nouă. Pentru un formular de contact e o protecție de bază. Pentru trafic mare ar trebui o bază de date (de exemplu Upstash Redis, gratuit).
- **Gmail** poate pune primul e-mail în Spam sau Promoții, fiindcă vine de la o adresă `@gmail.com`, nu de pe un domeniu propriu. Mesajul de succes de pe site îi spune omului să verifice și acolo.
- **Adresa de e-mail nu este verificată** (fără link de confirmare). Primești doar confirmarea că solicitarea a ajuns.
- **Planul Hobby Vercel** e pentru proiecte personale și necomerciale, potrivit pentru o demonstrație educațională.

## Structura proiectului

```
index.html            pagina (texte, structură, SVG-ul planului)
src/styles.css        identitatea vizuală (tokeni, layout, stări)
src/main.js           banda, meniul, apariții, planul, video, pulsul WhatsApp
src/form.js           selectorul de țară și logica formularului
lib/validate.js       reguli de validare comune pentru browser și server
lib/emails.js         șabloanele de e-mail (confirmare + notificare)
api/contact.js        funcția serverless care trimite e-mailurile
public/               fonturi, imagini WebP, video, iconuri, steaguri, Lottie
tests/run-tests.mjs   testele end-to-end
```

Construit cu Claude Code.
