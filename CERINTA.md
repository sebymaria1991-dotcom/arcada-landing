# Temă practică: creează și publică un landing page folosind Claude Code

Alege o companie, un produs sau un serviciu și construiește un landing page care să atragă potențiali clienți și să îi convingă să completeze un formular.

Poți alege o firmă reală, găsită pe Google, sau poți inventa propriul brand. Dacă alegi o companie reală, prezintă proiectul ca demonstrație educațională, fără să sugerezi că este site-ul oficial.

## 1. Concept și design

- Definește publicul căruia i se adresează pagina și acțiunea principală pe care vrei să o facă vizitatorul: solicitarea unei oferte, programări, demonstrații sau informații.
- Folosește elemente de design și materiale de animație din folderul pe care ți l-am pus la dispoziție. Integrează-le astfel încât să se potrivească brandului.
- Creează o identitate vizuală coerentă: culori, fonturi, butoane, imagini și spațiere.
- Evită aspectul generic de șablon. Personalizează structura, textele și detaliile vizuale pentru tema aleasă.
- Pagina trebuie să arate bine și să funcționeze pe telefon, tabletă și calculator.

## 2. Structura paginii

Include cel puțin:

- O bară în partea de sus, cu informații care rulează: beneficii, anunțuri sau oferte relevante. Mișcarea trebuie să poată fi oprită.
- Un meniu simplu, cu legături către secțiunile paginii.
- O secțiune de deschidere cu titlu clar, o scurtă prezentare, un buton principal și un clip video. Videoclipul trebuie să aibă imagine de copertă și controale și să nu pornească automat cu sunet.
- Câteva imagini relevante.
- O secțiune care prezintă beneficiile produsului sau serviciului.
- O secțiune „Cum funcționează”.
- O secțiune cu întrebări frecvente.
- Un formular pentru solicitări.
- Un subsol cu informații de contact.
- Un buton WhatsApp care deschide conversația cu numărul configurat.

Nu inventa testimoniale, certificări sau rezultate ale unei companii reale. Folosește materiale proprii, furnizate sau pentru care ai drept de utilizare.

## 3. Texte de marketing

Scrie textele pentru publicul ales, folosind una dintre formulele de mai jos ca structură principală. Poți folosi celelalte formule în secțiuni punctuale, dacă se potrivesc.

Denumirile formulelor nu trebuie afișate pe site.

### Hook–Story–Offer

Atrage atenția cu un titlu relevant, prezintă o poveste sau un context în care clientul se regăsește și încheie cu oferta și pasul următor.

### AIDA — Atenție, Interes, Dorință, Acțiune

Captează atenția, dezvoltă interesul, arată de ce merită oferta și invită vizitatorul să acționeze.

### PAS — Problemă, Amplificare, Soluție

Prezintă problema clientului, explică efectele ei concrete fără exagerări și arată cum îl ajută produsul sau serviciul.

### 4Ps — Promise, Picture, Proof, Push

Formulează o promisiune realistă, descrie rezultatul dorit, oferă dovezi verificabile și invită la următorul pas.

### FAB — Features, Advantages, Benefits

Explică ce caracteristici are oferta, ce avantaje oferă și ce beneficii concrete aduce clientului.

### Cerințe pentru texte

- Din prima secțiune trebuie să se înțeleagă ce oferi, cui te adresezi și de ce merită să continue vizitatorul.
- Pune accent pe beneficiile pentru client și folosește un limbaj specific domeniului ales.
- Evită formulările vagi, repetițiile și promisiunile exagerate.
- Scrie butoane cu acțiuni clare: „Solicită o ofertă”, „Programează o demonstrație” sau „Cere detalii”.
- Păstrează aceeași acțiune principală în secțiunile relevante ale paginii.
- Răspunde la principalele întrebări și obiecții ale potențialului client.
- Lângă formular, explică ce se întâmplă după completare.
- Nu inventa recenzii, cifre, garanții, reduceri sau urgențe artificiale.

## 4. Formularul

Formularul trebuie să conțină:

- Nume.
- Adresă de e-mail.
- Număr de telefon.
- Mesaj sau detalii despre solicitare.

### Validarea adresei de e-mail

- Verifică formatul adresei.
- Afișează lângă câmp un mesaj clar dacă formatul este greșit.
- Nu considera verificarea formatului o dovadă că adresa există sau aparține persoanei respective.

### Validarea numărului de telefon

- Include un selector de țară, cu numele țării, steag și prefix internațional.
- Când utilizatorul introduce un număr cu prefix internațional, identifică automat țara când aceasta poate fi determinată.
- Permite selectarea și corectarea manuală a țării.
- Verifică numărul în funcție de țara selectată, folosind o bibliotecă dedicată.
- Afișează lângă câmp un mesaj explicit dacă numărul este invalid.

### Comportamentul formularului

- Marchează câmpurile obligatorii.
- Afișează erorile lângă câmpurile corespunzătoare și explică ce trebuie corectat.
- Păstrează datele completate atunci când apare o eroare.
- Afișează o stare de încărcare în timpul trimiterii.
- Împiedică trimiterea repetată cât timp cererea este procesată.
- Afișează un mesaj de succes numai după ce trimiterea a reușit.
- Dacă trimiterea eșuează, explică situația și permite reîncercarea.
- Verifică datele și pe server.

Un formular de contact nu are nevoie de parolă. Dacă alegi să incluzi și crearea unui cont, adaugă un buton cu pictograma unui ochi pentru afișarea și ascunderea parolei.

## 5. Confirmarea prin e-mail

După trimiterea cu succes a formularului, vizitatorul trebuie să primească un e-mail de confirmare a primirii solicitării.

- Integrarea trebuie să funcționeze efectiv. Un mesaj afișat pe pagină nu înlocuiește e-mailul.
- E-mailul trebuie să identifice brandul și să explice ce urmează după primirea solicitării.
- Nu promite un termen de răspuns pe care nu îl poți susține.
- Dacă implementezi și verificarea deținerii adresei, folosește un link de confirmare și diferențiază clar „solicitare primită” de „adresă verificată”.
- Păstrează cheile și parolele serviciului de e-mail pe server, în variabile de mediu. Acestea nu trebuie să apară în codul trimis browserului sau în repository.

## 6. Calitatea experienței

- Folosește animații cu măsură și respectă preferința utilizatorului pentru reducerea mișcării.
- Asigură etichete vizibile pentru câmpuri, contrast bun și navigare cu tastatura.
- Adaugă texte alternative relevante pentru imaginile informative.
- Optimizează imaginile și videoclipul pentru încărcare rapidă.
- Adaugă protecție de bază împotriva spamului și a trimiterilor excesive.
- Explică pe scurt pentru ce sunt colectate datele și colectează doar informațiile necesare.
- Dacă oferi abonare la marketing, aceasta trebuie să fie opțională și separată de solicitarea de contact.
- Verifică toate linkurile, butoanele, meniul și integrarea WhatsApp.
- Nu lăsa texte provizorii, imagini lipsă sau funcționalități simulate în versiunea predată.

## 7. Testare

Înainte de predare, verifică cel puțin următoarele situații:

- Trimiterea formularului gol.
- Introducerea unui e-mail cu format greșit.
- Introducerea unui număr de telefon invalid.
- Introducerea unui număr cu prefix internațional și detectarea țării.
- Schimbarea manuală a țării.
- Trimiterea corectă a formularului și primirea e-mailului.
- O eroare de trimitere și posibilitatea de reîncercare.
- Încercarea de trimitere repetată.
- Afișarea și utilizarea paginii pe mobil și calculator.
- Navigarea cu tastatura.
- Funcționarea videoclipului, butonului WhatsApp și a tuturor legăturilor.

Folosește date de test și o adresă de e-mail pe care o controlezi.

## 8. Publicare și predare

Publică proiectul pe o platformă cu găzduire gratuită. Verifică dacă soluția aleasă permite și funcționalitatea necesară formularului și trimiterii e-mailurilor, în limitele planurilor gratuite.

La final, trimite:

- Linkul public funcțional, accesibil prin HTTPS.
- Linkul către codul sursă, fără chei, parole sau date personale.
- O scurtă explicație a conceptului și a publicului ales.
- Lista materialelor de design și animație folosite din folderul pus la dispoziție.
- Formula principală de marketing aleasă și locurile unde se regăsește fiecare etapă în pagină.
- Instrucțiuni pentru pornirea proiectului și configurarea serviciului de e-mail, fără date secrete.
- Rezultatele testelor și eventualele limitări cunoscute.

**Criteriul principal de evaluare:** pagina trebuie să aibă o identitate vizuală proprie, texte convingătoare și funcționalitate completă, de la prima vizită până la primirea e-mailului de confirmare.

Trebuie să poți explica ce ai construit cu ajutorul Claude Code, cum funcționează și cum ai verificat rezultatul.
