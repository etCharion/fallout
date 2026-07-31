# CLAUDE.md

## Co to je

Digitální karta postavy pro stolní RPG **Fallout: The Roleplaying Game (2d20, Modiphius)**.
Frontend-only aplikace bez build kroku — otevírá se přímo `index.html`, hostuje se na GitHub Pages.

- `index.html` — shell, načítá `app.js` jako ES modul
- `app.js` — celá aplikace: React (bez JSX, přes `React.createElement` aliasovaný na `h`), Firebase auth + Firestore, dvojjazyčné texty v `TRANSLATIONS`, roller kostek
- `print.js` — generování A4 archů (karta postavy / prázdný formulář), tiskne se přes skrytý iframe
- `styles.css` — Pip-Boy CRT vzhled, čtyři barevné motivy přes třídy na `<html>`
- `manifest.json`, `favicon.svg` — PWA metadata

React, ReactDOM i Firebase se tahají z CDN (esm.sh, gstatic). Není `package.json`,
není build, nejsou testy ani linter — změny se ověřují spuštěním statického serveru
nad kořenem repa a proklikáním v prohlížeči.

## Konvence

- UI texty se **nepíšou natvrdo** — patří do `TRANSLATIONS` v `app.js` (klíče `cs` i `en`)
  a do `T` v `print.js`.
- Uživatelský jazyk projektu je **čeština** (commit messages, komentáře, PR popisy).
- Režimy listu: `edit` (ÚPRAVY, ruční uložení) / `play` (HRA, debounced autosave) /
  `locked` (NÁHLED). Nové pole vždy rozhodni, ve kterém režimu je editovatelné —
  a pokud v `play`, musí jít přes `updatePlayField`, ne `updateField`.
- Data jsou ve sdílené veřejné Firestore kolekci `artifacts/falloutpostava/public/data/…`,
  přihlášení je anonymní. Nepřidávej sem nic osobního.
- API klíč ve `firebaseConfig` je záměrně veřejný, viz `SECURITY.md`.

## Backlog

Otevřené úkoly, bugy a návrhy funkcí jsou v **[`TODO.md`](TODO.md)** — vznikly z revize
aplikace proti pravidlům 2d20. Než začneš na něčem z toho dělat, projdi si tam
priority a navržené pořadí prací; položky se dají brát po balíčcích.
