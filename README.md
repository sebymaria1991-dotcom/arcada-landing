# Arcada: landing page pentru consultanță imobiliară

Proiect demonstrativ, educațional. **Arcada este un brand inventat.** Pagina nu reprezintă o firmă reală.

- Link public: **https://arcada-landing.vercel.app**
- Cod sursă: **https://github.com/sebymaria1991-dotcom/arcada-landing**

## Conceptul

**Arcada** este un consultant imobiliar care lucrează **doar pentru cumpărător**, cu agenți pe teren în toată țara. Arcada nu vinde locuințe. Îl ajută pe cel care cumpără: îi verifică actele și starea reală a locuinței, compară prețul cu zona, negociază pentru el și îl însoțește la notar. E plătit de cumpărător, printr-un comision procentual, nu de vânzător.

**Publicul:** oameni între 28 și 40 de ani care își cumpără prima locuință, adesea cu credit ipotecar. Nu cunosc procedurile (carte funciară, cadastru, antecontract) și se tem să nu greșească la cea mai mare cheltuială din viața lor.

**Acțiunea principală:** _Vorbește cu un consultant_. Prima discuție (30 de minute) e gratuită și se cere prin formular sau pe WhatsApp.

### Identitatea vizuală

| Element | Alegere |
|---|---|
| Culori | hârtie `#F2F0E9`, cerneală-petrol `#13292C`, ocru stins `#D9C48A`, verde-petrol `#2E6E68`; verde WhatsApp doar pentru contact; roșu doar pentru erori |
| Fonturi | **Bricolage Grotesque** (titluri și text) și **IBM Plex Mono** (etichete), găzduite local |
| Motive | arcada din siglă; o schiță izometrică interactivă, cu pereți transparenți și straturi care se aprind |
| Butoane | plate, cu colțuri ușor rotunjite, fără umbre 3D, cu o fâșie de lumină la hover |
| Animații | Motion: titluri cuvânt cu cuvânt, apariții în cascadă, parallax, bara de progres, linia etapelor. Toate se opresc la mișcare redusă |

## Structura și formula de marketing

**Formula principală este PAS (Problemă, Amplificare, Soluție).** Local folosesc și **FAB** în „Ce primești” și **Hook–Story–Offer** în „Scenariu tipic” și în oferta din pop-up. Denumirile formulelor nu apar pe site.

| Etapa | Unde e în pagină |
|---|---|
| **P (Problema)** | Deschiderea: „Știi ce cumperi înainte să semnezi.” |
| **A (Amplificarea)** | „Ce nu scrie în anunț”: patru riscuri concrete și „Scenariu tipic” (ce vezi tu, ce descoperim noi, ce obții). |
| **S (Soluția)** | „Ce verificăm” (schița și cele cinci verificări), „Ce primești”, tipurile de locuințe, „Cum lucrăm” (4 etape și 3 reguli), „Comision”, „Despre noi”, „Întrebări” și contactul, cu „Ce se întâmplă după ce ne scrii”. |

**Comisionul:** pagina vorbește despre un procent, fără cifră. Când există procentul real, pune `COMMISSION_PERCENT` în `.env.local` și în Vercel: valoarea apare singură în secțiunea „Comision”.

**Date personale:** paginile `confidentialitate.html`, `cookies.html` și `termeni.html` sunt generate de `scripts/pagini-legale.mjs`. Mesajul din formular e opțional. Sistemul de consimțământ (`src/consent.js`) are trei opțiuni distincte: **Acceptă** (alegerea și preferințele se păstrează 6 luni), **Acceptă strictul necesar** (doar alegerea, 6 luni) și **Refuză** (nu rămâne nimic după închiderea browserului). Site-ul nu pune cookie-uri HTTP și nu are scripturi de urmărire.

**Oferta din pop-up:** analiza gratuită a anunțului. Apare la intrare, după alegerea privind cookie-urile, o singură dată pe sesiune. Când e închis, rămâne ca etichetă în meniu, de unde se poate redeschide. Nu apare peste formular.

**SEO:** `canonical`, Open Graph și JSON-LD (`RealEstateAgent` + `FAQPage`). Întrebările din JSON-LD se citesc automat din pagină, la build.

## Materiale folosite din folderul pus la dispoziție

Din `Materiale ajutatoare AI/Materiale AI de folosit/Assets-Library/`:

| Material | Cale | Cum l-am folosit |
|---|---|---|
| Bricolage Grotesque | `fonts/bricolage-grotesque/` | fontul principal, cu axele de greutate și lățime |
| IBM Plex Mono | `fonts/ibm-plex-mono/` (400, 500) | etichete, cote, butoane, banda de sus |
| Font Awesome Free 7.3.0 | `fontawesome/.../svgs/` | 54 de iconuri, extrase într-un singur fișier `public/icons.svg` (în loc de 900 KB de font) |
| Shine Sweep Effect | `animations/cod3power/shine-sweep-effect/` | fâșia de lumină care trece peste butoane la hover, recolorată pentru brand |
| CSS Animated Bubble Indicator | `animations/cod3power/css-animated-bubble-Indicator/` | indicatorul galben din meniu, rescris în JS ca să urmărească secțiunea curentă și linkul de sub mouse |
| HTML Form Validation (Native) | `animations/whatsapp/html-form-validation-native/` | modelul cu câmpuri „atinse” (`is-valid` / `is-invalid` / `flash`): erorile apar după ce părăsești câmpul, nu de la prima literă |
| Lottie: `pulse.json` + `lottie.min.js` | `animations/lottie/` | pulsul din spatele butonului WhatsApp, încărcat abia după ce pagina e liberă și dezactivat la mișcare redusă |
| Motion | [motion.dev](https://motion.dev), MIT | animațiile de text și de derulare |

Ca idei, fără cod copiat: motivul cu cote și plan vine din șabloanele HorizonX (`Horizonx/2026-10-octombrie/rootline-hero`, land intelligence), iar ghidurile din `Cursuri/code3power-materiale/06_Design_Taste` au dat scara tipografică (5 mărimi, raport 1,333), regulile de spațiere a literelor și animațiile cu măsură.

### Materiale externe, cu drept de utilizare

- **Fotografii și clip:** [Pexels](https://www.pexels.com/license/), licență gratuită, inclusiv comercială, fără atribuire obligatorie. ID-uri: clip `7348062`; fotografii `7944926`, `7865621`, `13736784`, `36782639`, `33094438`, `8123134`, `9826456`, `8297489`, `7578992`, `7642000`.
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
npm test              # în altul: testele automate în Chrome (playwright-core)
TEST_EMAIL=adresa@ta.ro npm test          # trimite și un e-mail real la adresa ta
BASE_URL=https://site-ul-public npm test  # rulează testele pe site-ul publicat
```

| Situația din temă | Ce verifică testul |
|---|---|
| Formular gol | 3 erori lângă câmpurile obligatorii (mesajul e opțional), `aria-invalid`, focus pe primul câmp, nicio cerere trimisă |
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
| Mișcare | la mișcare redusă nu există animații de apariție, iar conținutul e vizibil |
| Primul ecran | 1920×1080, 1440×900, 1366×768, 1280×720, 390×844: tot conținutul se vede fără derulare |
| Conținut | fără numerotări decorative și fără textele eliminate; secțiunile noi există; JSON-LD are toate întrebările |
| Contact | WhatsApp e cerc verde; „Formular” duce la formular și pune cursorul în primul câmp |
| Cookie-uri | trei opțiuni distincte, alegerea respectată, „Setări cookies” o poate schimba, niciun cookie nedeclarat |
| Pop-up | apare la intrare după alegerea privind cookie-urile, o singură dată; se închide cu X sau Escape; eticheta din meniu îl redeschide; duce la formular |
| Pagini legale | se deschid din subsol, fără texte provizorii |

Ultima rulare locală (30.10.2026, după refacerea paginii): vezi jurnalul din 30.10.2026. Ultima rulare pe site-ul publicat, cu e-mail real prin Gmail, e din 28.10.2026, pe versiunea anterioară.

## Limitări cunoscute

- **Limita de trimiteri** e ținută în memoria funcției serverless, deci se resetează când Vercel pornește o instanță nouă. Pentru un formular de contact e o protecție de bază. Pentru trafic mare ar trebui o bază de date (de exemplu Upstash Redis, gratuit).
- **Gmail** poate pune primul e-mail în Spam sau Promoții, fiindcă vine de la o adresă `@gmail.com`, nu de pe un domeniu propriu. Mesajul de succes de pe site îi spune omului să verifice și acolo.
- **Adresa de e-mail nu este verificată** (fără link de confirmare). Primești doar confirmarea că solicitarea a ajuns.
- **Bara de sus care rulează**, cerută în tema inițială, a fost scoasă la cererea autorului. La predare, acest punct din cerință nu mai e acoperit.
- **Planul Hobby Vercel** e pentru proiecte personale și necomerciale, potrivit pentru o demonstrație educațională.

## Structura proiectului

```
index.html            pagina (texte, structură, SVG-ul planului)
src/styles.css        identitatea vizuală (tokeni, layout, stări)
src/main.js           meniul, animațiile Motion, schița, video, pulsul WhatsApp, pop-up-ul
src/consent.js        cookie-uri: cele trei opțiuni și memorarea alegerii
src/plan-izometric.html  schița generată de scripts/plan-izometric.mjs
scripts/              generatoarele pentru schiță, paginile legale și iconuri
src/form.js           selectorul de țară și logica formularului
lib/validate.js       reguli de validare comune pentru browser și server
lib/emails.js         șabloanele de e-mail (confirmare + notificare)
api/contact.js        funcția serverless care trimite e-mailurile
public/               fonturi, imagini WebP, video, iconuri, steaguri, Lottie
tests/run-tests.mjs   testele end-to-end
```

Construit cu Claude Code.
