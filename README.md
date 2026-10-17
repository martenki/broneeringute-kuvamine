# Maison — broneeringute kuvamine

Eestikeelne ilusalongi broneeringute ülevaade. Broneeringud laetakse Fetch API abil JSON-andmeallikast, kuvatakse tabelis ning logitakse brauseri konsooli.

## Käivitamine

Ava projekt serveri kaudu, mitte `file://` aadressilt, sest brauser piirab kohaliku faili puhul `fetch()` päringuid.

Näiteks Visual Studio Code'is paigalda **Live Server** laiendus ja vali `index.html` failil **Open with Live Server**.

## Funktsioonid

- Teenuste kaupa värvitud tabeliread: juuksur, massaaž, spa ja kosmeetika.
- Kliendi või teenuse otsing ning teenusefilter.
- Broneeringute koguarv ja teenuste kokkuvõte.
- Filtreeritud tulemuste CSV-eksport.
- Kohanduv kujundus ja selgesõnaline laadimisvea teavitus.

## GitHub Pagesi avaldamine

1. Loo GitHubis uus repositoorium ning laadi üles `index.html`, `styles.css`, `app.js` ja `README.md`.
2. Ava repositooriumis **Settings → Pages**.
3. Vali **Deploy from a branch**, haruks `main` ja kaustaks `/ (root)`, seejärel salvesta.
4. Kui GitHub Pages on avaldamise lõpetanud, esita kuvatud `https://<kasutajanimi>.github.io/<repositoorium>/` aadress.

Projekt kasutab välist JSON-aadressi, mistõttu eeldab töötamine, et andmeallikas on kättesaadav ning lubab GitHub Pagesi päritolust päringuid (CORS).
