# Maison — broneeringute ülevaade

Maison on eestikeelne, brauseris töötav ilusalongi broneeringute ülevaade. Rakendus laeb broneeringud JSON-andmeallikast, kuvab need kuupäeva ja kellaaja järgi järjestatud tabelis ning võimaldab kirjeid otsida, filtreerida ja CSV-failina eksportida.

## Sisukord

- [Funktsioonid](#funktsioonid)
- [Kasutamine](#kasutamine)
- [Andmeallikas ja andmevorming](#andmeallikas-ja-andmevorming)
- [Projekti failid](#projekti-failid)
- [Avaldamine GitHub Pagesis](#avaldamine-github-pagesis)
- [Piirangud ja vead](#piirangud-ja-vead)

## Funktsioonid

- Kuvab kliendi, teenuse, kuupäeva, kellaaja ja broneeringu numbri.
- Järjestab broneeringud kuupäeva ja kellaaja järgi kasvavalt.
- Otsib kliendi nime ja teenuse järgi. Otsing ei ole tõstutundlik.
- Filtreerib kirjeid teenuse järgi: juuksur, massaaž, spa või kosmeetika.
- Näitab broneeringute koguarvu ja teenuste kokkuvõtet.
- Ekspordib otsingule ja teenusefiltrile vastavad kirjed semikoolonitega eraldatud CSV-faili.
- Kuvab laadimise ajal oleku ning andmete laadimise ebaõnnestumisel veateate.

## Kasutamine

Projekt ei vaja ehitamist, paigaldamist ega eraldi sõltuvusi. Kuna rakendus laeb andmeid `fetch()`-iga, ava see kohaliku veebiserveri kaudu, mitte otse `file://` aadressilt.

### Visual Studio Code

1. Ava projekti kaust Visual Studio Code'is.
2. Paigalda soovi korral **Live Server** laiendus.
3. Ava `index.html` ja vali **Open with Live Server**.

### Python

Kui Python on paigaldatud, käivita projekti juurkaustas:

```bash
python -m http.server 8000
```

Seejärel ava brauseris [http://localhost:8000](http://localhost:8000).

Otsinguvälja saab fookusesse viia klahvikombinatsiooniga **Ctrl+K** (macOS-is **⌘+K**).

## Andmeallikas ja andmevorming

Rakendus laeb andmed aadressilt [broneeringute JSON](https://metshein.com/kordamine/json/broneeringud.json). Vastus peab sisaldama `broneeringud` massiivi:

```json
{
  "broneeringud": [
    {
      "broneeringu_id": 101,
      "klient": "Annika Saar",
      "kuupäev": "2025-03-23",
      "teenus": "Kosmeetika",
      "aeg": "9:00"
    }
  ]
}
```

Igal kirjel peavad olema järgmised väljad:

| Väli | Tüüp | Kirjeldus |
| --- | --- | --- |
| `broneeringu_id` | number või tekst | Broneeringu number, mida kuvatakse tabelis. |
| `klient` | tekst | Kliendi nimi. |
| `teenus` | tekst | Teenuse liik: `Juuksur`, `Massaaž`, `Spa` või `Kosmeetika`. |
| `kuupäev` | tekst | Kuupäev vormingus `YYYY-MM-DD`. |
| `aeg` | tekst | Kellaeg, näiteks `9:00` või `14:30`. |

Kui muudad andmeallika aadressi, muuda `DATA_URL` väärtust failis `app.js`. Andmeallikas peab lubama päringuid rakenduse päritolust (CORS).

## Projekti failid

| Fail | Otstarve |
| --- | --- |
| `index.html` | Lehe struktuur ja kasutajaliidese elemendid. |
| `styles.css` | Paigutus, värvid ja kohanduv kujundus. |
| `app.js` | Andmete laadimine, kuvamine, otsing, filtreerimine ja CSV-eksport. |
| `README.md` | Projekti dokumentatsioon. |

## Avaldamine GitHub Pagesis

1. Laadi projekti failid [GitHubi repositooriumi](https://github.com/martenki/broneeringute-kuvamine).
2. Ava repositooriumis **Settings → Pages**.
3. Vali **Deploy from a branch**, haruks `main` ja kaustaks `/ (root)`, seejärel salvesta.
4. Pärast avaldamist ava [Maison GitHub Pagesis](https://martenki.github.io/broneeringute-kuvamine/).

GitHub Pages kuvab staatilisi faile ega paku andmebaasi ega serveripoolset API-t. Rakenduse töötamiseks peab väline JSON-aadress olema kättesaadav ja lubama GitHub Pagesi päritolust päringuid.

## Piirangud ja vead

- Andmed laaditakse lehe avamisel; rakenduses pole automaatset perioodilist värskendamist.
- Otsing ja filter rakenduvad ainult kliendi nimele ja teenusele.
- CSV-eksport sisaldab hetkel nähtavaid kirjeid ning veerge klient, teenus, kuupäev ja kellaaeg.
- Võrguvea, ebaõnnestunud HTTP-vastuse või vigase JSON-struktuuri korral kuvatakse laadimise veateade. Kontrolli siis võrguühendust ja andmeallika kättesaadavust.
