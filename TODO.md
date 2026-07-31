# TODO — Fallout 2d20 character sheet

Backlog vzniklý z revize aplikace proti pravidlům Fallout: The Roleplaying Game (2d20)
a proti běžným character sheetům. Odkazy na soubory ukazují na stav v době revize —
po refaktorech je potřeba čísla řádků ověřit.

Legenda priorit: **P1** = poznáš při každé session · **P2** = vadí, ale dá se obejít · **P3** = kosmetika / hygiena repa

---

## A. Rozpory s pravidly

- [ ] **P1 — Hod 2d20 nepočítá úspěchy.** Roller ukazuje „Součet" (`app.js:1630`, `app.js:1778`), což v tomhle systému nic neznamená. Správně: každá kostka ≤ **CČ = atribut + dovednost** = 1 úspěch, ≤ hodnota tag dovednosti = kritický úspěch (2 úspěchy), 20 = komplikace.
- [ ] **P1 — Crit range se neřídí tag dovedností.** Aplikace počítá krit jen na přirozenou 1 (`app.js:1631`). Zaškrtávátko „vycvičená" je tedy na listu, ale mechanicky nedělá nic.
- [ ] **P1 — Chybí Action Points.** Skupinová zásoba max 6 AP, přebytečné úspěchy je generují, extra k20 se kupují za 1/2/3 AP (max tři navíc). Roller nabízí 1–5 d20 bez vazby na AP (`app.js:1689`); minimum má být 2, ne 1.
- [ ] **P1 — Odvozené statistiky se nepočítají**, jsou to ruční textová pole (`app.js:2260`–`2313`). Vzorce:
  | Statistika | Vzorec |
  |---|---|
  | Max HP (1. úroveň) | ODO + ŠTĚ (dál +ODO, když to postup dává) |
  | Iniciativa | VNÍ + HBI |
  | Obrana | HBI 1–8 → 1; HBI 9+ → 2 |
  | Poškození nablízko | bonusové CD podle SÍLY |
  | Nosnost | 150 + (10 × SÍLA) |
  | Body štěstí | max = ŠTĚSTÍ |
- [ ] **P1 — Nosnost chybí úplně.** Váha se eviduje u každé zbraně i předmětu (včetně množství), ale nikde se nesčítá a nemá se s čím porovnat. Přetížení = +1 obtížnost na testy SÍLY a HBITOSTI, nelze Sprint, −1 iniciativa.
- [ ] **P2 — Radiace nikde není.** Rady snižují **maximální** HP, přirozeně se neléčí (jen RadAway a spol.). U lokací je RAD odolnost, ale chybí počitadlo radů i efektivní max HP.
- [ ] **P2 — Zranění je jen ano/ne** (`app.js:551`–`591`). Pravidlo: 5+ poškození v jednom zásahu po odečtení DR = kritický zásah = zranění lokace s efektem (hlava = ztráta akce, trup = krvácení 2 CD/kolo ignorující DR, ruka = pustíš předmět a nefunguje, noha = padneš a Move se stává hlavní akcí). Chybí počet zranění i text efektu.
- [ ] **P2 — Munice se nedá odečítat.** Pole `ammo` je jen text s typem. Chybí i pravidlo „utrať extra munici za +1 CD poškození".
- [ ] **P2 — Pevné atributy u dovedností** (`app.js:79`–`95`, např. „Řečnictví [CHA]"). Dvojici atribut+dovednost vybírá Vypravěč podle situace. Závorka jako *výchozí* je OK, ale u hodu musí jít atribut přepnout.
- [ ] **P3 — Čtvrtý sloupec u lokací „BZ / body zdraví"** (`app.js:104`, `print.js:213`). Zásahové zóny v 2d20 vlastní HP nemají; podle typů poškození tam patří spíš **Jed**. Rozhodnout: homebrew, nebo špatný popisek?

**Co je naopak správně (needitovat bez důvodu):** interpretace Combat Dice (`app.js:1634`) — 1→1 dmg, 2→2 dmg, 3–4→0, 5–6→1 dmg + efekt. Tabulka zásahových zón 1‑2 / 3‑8 / 9‑11 / 12‑14 / 15‑17 / 18‑20.

---

## B. Bugy a tření

- [ ] **P1 — Historie roste uvnitř dokumentu postavy.** `handleSave` (`app.js:1410`) drží 50 celých snapshotů ve stejném Firestore dokumentu. Každé uložení posílá celou historii znovu; `onSnapshot` při každé změně stahuje historie všech postav. Limit dokumentu je 1 MiB → ukládání se časem začne tiše sypat. Historie patří do podkolekce.
- [ ] **P1 — Každé přepnutí režimu ukládá.** `switchMode` (`app.js:1462`) volá `handleSave` i bez jakékoli změny → historie se plní identickými snapshoty. Zhoršuje bod výše.
- [ ] **P1 — V režimu HRA nejde dělat to, co se při hře děje.** Zamčené jsou zátky (`app.js:2294`), XP, poznámky (`app.js:3009`), přidání ukořistěného předmětu a přepnutí „přiřazené" zbraně (`app.js:2629`). Obchodování, zápisky a lootování tedy vyžadují přepnutí do ÚPRAV — což zase zapíše do historie.
- [ ] **P1 — Tichá ztráta dat.** Selhání autosave v režimu HRA (`app.js:1227`) i `flushPlaySave` (`app.js:1453`) hlásí chybu jen do konzole. Uživatel přitom vidí natvrdo napsané „◉ ONLINE" (`app.js:3018`) — indikátor nikdy nesleduje skutečné připojení.
- [ ] **P2 — Panel POZNÁMKY slibuje „AUTOSAVE"** (`app.js:2999`), ale textarea je mimo režim úprav zamčená a autosave se na poznámky nevztahuje.
- [ ] **P2 — Undo/Redo tiše přepne do ÚPRAV** (`app.js:1527`, `app.js:1545`) a vrácený stav se neuloží, dokud neuložíš ručně — a to uložení pak zahodí redo.
- [ ] **P2 — Sdílená veřejná databáze + anonymní přihlášení.** Cesta `public/data/...`: kdokoliv s odkazem vidí, edituje a **maže** cizí postavy. Chybí vlastnictví a koš (soft delete).
- [ ] **P2 — Číselná pole jsou textová a bez validace.** SPECIAL, dovednosti i HP spolknou cokoli. Chybí meze podle pravidel (SPECIAL 4–10, dovednost 0–6, 3 tagy).
- [ ] **P2 — PWA je jen napůl.** `manifest.json:7-8` má barvy ze starého papírového motivu (`#fdfaf5` / `#d97706`) → bílo-oranžový splash proti tmavému Pip-Boyu. `apple-touch-icon` je SVG (`index.html:19`), což iOS na plochu nevezme. Není service worker — React, Firebase i fonty jdou z CDN, takže bez internetu aplikace vůbec nenaběhne.
- [ ] **P2 — Tisk přeteče.** Slib „A4 · 2 strany" platí jen pro krátký seznam; arch má `min-height:297mm` (`print.js:204`), takže delší inventář zaláme uprostřed tabulky. V tištěné tabulce zbraní navíc chybí Rychlost, Dostřel a Atributy (`print.js:217`).
- [ ] **P3 — Pole JEDOVÉ OZ je na obrazovce dvakrát**, obě kopie editovatelné (`app.js:2288` a `app.js:2400`).
- [ ] **P3 — Mazání šablony je bez potvrzení** (`app.js:3245`), zatímco u postavy potvrzení je.
- [ ] **P3 — Log hodů se nikde neukládá** — po refreshi je pryč a nesdílí se se zbytkem stolu.
- [ ] **P3 — Na mobilu má tabulka zbraní `min-width: 1050px`** (`styles.css:1309`) → vodorovné scrollování.
- [ ] **P3 — `server.log` je commitnutý v repu.**

---

## C. Nové funkce (podle přínosu)

- [ ] **P1 — Hod přímo z listu.** Klik na dovednost → 2d20 proti CČ = atribut + dovednost, spočítá úspěchy, kritické (≤ tag rank) a komplikace, nabídne dokoupení kostek. Největší přidaná hodnota — udělá z listu nástroj, kvůli kterému člověk odloží papír.
- [ ] **P1 — Hod poškození z řádku zbraně.** CD ze zbraně + bonus ze SÍLY, vyhodnocení efektů, volba „utratit munici za +1 CD".
- [ ] **P1 — Automatické odvozené statistiky** z SPECIAL s možností ručního přepsání, včetně nosnosti a varování o přetížení.
- [ ] **P1 — Body štěstí** s maximem = ŠTĚSTÍ, tlačítka −/+ a v rolleru „přehodit tuhle kostku za bod štěstí" (1 k20 nebo až 3 CD).
- [ ] **P2 — Sdílená zásoba AP pro družinu** (max 6) v reálném čase. Databáze už je společná a `onSnapshot` běží, takže je to skoro zadarmo.
- [ ] **P2 — Rady a efektivní max HP**, tlačítka na léčení / RadAway.
- [ ] **P2 — Zranění jako počitadlo na lokaci** + automatická hláška „5+ poškození po DR = kritický zásah" s textem efektu dané zóny.
- [ ] **P2 — Rychlé akce v režimu HRA:** HP −/+, zátky −/+, „přidat kořist" jedním klikem.
- [ ] **P2 — Přednačtené šablony z příručky** (zbraně, chemie, perky) místo prázdné administrace.
- [ ] **P3 — Export/import postavy do JSON** + offline režim (service worker, lokální kopie).
- [ ] **P3 — Průvodce tvorbou postavy** (rozdělení SPECIAL, 3 tagy, INT×2 bodů dovedností, hlídání limitů) a průvodce postupem na úroveň.
- [ ] **P3 — Sdílený log hodů a iniciativní pořadí družiny** (kdo je na řadě).
- [ ] **P3 — Karty místo tabulky zbraní na mobilu.**

---

## Navržené pořadí prací

1. **Balíček „hraní":** C1 (hod z listu) + C3 (odvozené statistiky) + C4 (body štěstí) — drží spolu, sdílí stejný výpočetní základ.
2. **Balíček „nešahej mi na data":** B1 (historie do podkolekce) + B2 (neukládat beze změny) + B4 (viditelné chyby ukládání).
3. **Balíček „režim HRA":** B3 (odemknout zátky/XP/poznámky/loot) + C8 (rychlé akce).
4. Zbytek podle chuti.

---

## Zdroje k pravidlům

- [Derived Statistics — Roll20 Compendium](https://roll20.net/compendium/fallout/Derived%20Statistics)
- [Skill Tests — Roll20 Compendium](https://roll20.net/compendium/fallout/Skill%20Tests)
- [Damage and Injury — Roll20 Compendium](https://roll20.net/compendium/fallout/Damage%20and%20Injury)
- [Fallout 2d20 Quickstart — Core Rules](https://www.fantasygrounds.com/library/falloutrpg/fallout-2d20-quickstart/chapter-one-core-rules/)
- [Action Points — Fallout Wiki](https://fallout.fandom.com/wiki/Action_Points_(Fallout:_The_Roleplaying_Game))
- [Skills — The Fallout Wiki](https://fallout.wiki/wiki/Fallout:_The_Roleplaying_Game_Skills)
- [Tag Skill — The Fallout Wiki](https://fallout.wiki/wiki/Tag_Skill_(Fallout:_The_Roleplaying_Game))
