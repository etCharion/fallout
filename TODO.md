# TODO — Fallout 2d20 character sheet

Backlog vzniklý z revize aplikace proti pravidlům Fallout: The Roleplaying Game (2d20)
a proti běžným character sheetům. Odkazy na soubory ukazují na stav v době revize —
po refaktorech je potřeba čísla řádků ověřit.

Legenda priorit: **P1** = poznáš při každé session · **P2** = vadí, ale dá se obejít · **P3** = kosmetika / hygiena repa

---

## A. Rozpory s pravidly

- [x] **HOTOVO — Hod 2d20 počítá úspěchy.** V režimu HRA i NÁHLED jde klepnout na jeden atribut a jednu dovednost (žlutě se označí); roller pak hlásí úspěchy proti CČ = atribut + dovednost místo dřívějšího nesmyslného „Součtu".
- [x] **HOTOVO — Crit range podle tag dovednosti.** Kostka ≤ hodnota tagnuté dovednosti = kritický úspěch za 2 úspěchy; přirozená 1 kritická vždy; 20 = komplikace. Rozsah se ukazuje v liště nad kostkami.
- [ ] ~~**Chybí Action Points.**~~ **VYŘAZENO** — AP jsou skupinová mechanika, aplikace je karta jedné postavy. Nedělá se.
- [ ] ~~**Odvozené statistiky se nepočítají.**~~ **VĚDOMĚ RUČNÍ** — vzorce sice jednoznačné jsou, ale perky je mění a modelovat to je zatím moc složité. Necháváme ruční pole. Vzorce pro referenci:
  | Statistika | Vzorec |
  |---|---|
  | Max HP (1. úroveň) | ODO + ŠTĚ (dál +ODO, když to postup dává) |
  | Iniciativa | VNÍ + HBI |
  | Obrana | HBI 1–8 → 1; HBI 9+ → 2 |
  | Poškození nablízko | bonusové CD podle SÍLY |
  | Nosnost | 150 + (10 × SÍLA) |
  | Body štěstí | max = ŠTĚSTÍ |
- [x] **HOTOVO — Nosnost se sčítá.** Zbraně + vybavení (váha × množství) proti nosnosti 150 + 10 × SÍLA, v hlavičce panelu VYBAVENÍ. Při překročení červené „PŘETÍŽENO" a nápověda s postihy. Váhy typu „< 0,5" se parsují správně.
- [x] **HOTOVO — Radiace u HP.** Pole ☢ RAD nahradilo popisek Stabilní/Kritický. Rady ukrajují z maxima (13 → 10), odečtená část pruhu se šrafuje, a když efektivní maximum klesne pod aktuální HP, srazí se i ta.
- [x] **HOTOVO — Zranění jako počet.** Čtvrtý sloupec u lokace je počet zranění (červeně), zaškrtávátko ANO/NE zůstalo a s počtem se drží v souladu. U názvu zóny je „?" s popisem efektu zranění a s pravidlem o 5+ poškození.
- [x] **ČÁSTEČNĚ — Munice.** Typ munice je výběr z 20 typů podle příručky, vedle je počitadlo propojené s municí v inventáři (odečítá se na obou místech). Párování jde přes výslovný typ u položky, jinak podle názvu („10. mm náboje" najde „10 mm"). V administraci se u typu „Munice" vybírá typ munice a nápověda nabízí doplnění chybějících typů. **Zbývá:** utracení extra munice za +1 CD poškození.
- [x] **HOTOVO — Dovednost zbraně je z pevného seznamu** (CHL, BEZ, LEHK, VRH, TĚŽ, ENG) v tabulce útoků i v administraci, a je napojená na seznam dovedností — klik na zkratku vybere dvojici pro hod. Starší ručně psané hodnoty zůstávají zachované.
- [x] **HOTOVO — CČ u zbraně se počítá.** Cílové číslo útoku = hodnota dovednosti zbraně + atribut, který k ní podle pravidel patří (LEHK → HBI, TĚŽ → ODO, ENG → VNI, CHL a BEZ → SIL, VRH → HBI). Needituje se, přepočítá se samo po postupu a stejné číslo jde i na tištěný arch. Ručně psané pole zůstává jen u zbraní s vlastní, neznámou dovedností.
- [x] **HOTOVO — Přiřazená zbraň = TAG zbraň.** Zaškrtávátko PŘIŘ. se needituje (ani v ÚPRAVÁCH) a zrcadlí, jestli je dovednost zbraně tagnutá. Přepnutí tagu u dovednosti přeznačí všechny její zbraně naráz.
- [x] **HOTOVO — Atribut u dovednosti není závazný.** Závorka s doporučením zůstala a klik na dovednost doporučený atribut předvyplní, ale jde označit libovolná dvojice.
- [x] **VYŘEŠENO — Čtvrtý sloupec u lokací** už není „BZ / body zdraví", ale počet zranění (`ZR`). Staré hodnoty `bz` zůstaly v databázi, ale nikde se nepoužívají.

**Co je naopak správně (needitovat bez důvodu):** interpretace Combat Dice (`app.js:1634`) — 1→1 dmg, 2→2 dmg, 3–4→0, 5–6→1 dmg + efekt. Tabulka zásahových zón 1‑2 / 3‑8 / 9‑11 / 12‑14 / 15‑17 / 18‑20.

---

## B. Bugy a tření

- [x] **HOTOVO — Historie je v podkolekci.** Verze bydlí v `fallout_characters/{id}/history/{v000123}`, v dokumentu postavy zůstalo jen `historySeq`, `historyCount` a `historyHash`. Načítají se líně (až při otevření modalu VERZE), takže kolekční `onSnapshot` už netahá historie všech postav. Držíme posledních 30, starší se ořezávají. Postavy se starým polem `history` se migrují samy při prvním uložení.
- [x] **HOTOVO — Neukládá se, když se nic nezměnilo.** Před každým zápisem se porovnává otisk stavu (`fingerprint`); přepínání režimů beze změny nezapisuje vůbec a nezakládá verzi.
- [ ] **P1 — V režimu HRA nejde dělat to, co se při hře děje.** Zamčené jsou zátky, XP a přidání ukořistěného předmětu. *(Poznámky už odemčené jsou, viz níže. „Přiřazená" zbraň z tohohle seznamu vypadla — je to TAG zbraň odvozená z tagnuté dovednosti, takže do HRY nepatří, viz sekce A.)*
- [x] **HOTOVO — Tichá ztráta dat.** Selhání zápisu už není tiché: v liště i ve status baru je stav ukládání (`UKLÁDÁM… / ULOŽENO 18:42 / CHYBA ULOŽENÍ`) a rozdělaný stav se zálohuje do `localStorage` s nabídkou obnovy. Indikátor připojení sleduje `navigator.onLine` a události `online`/`offline` — při výpadku ukazuje červené „◌ OFFLINE".
- [x] **HOTOVO — Poznámky a AUTOSAVE.** Poznámky jdou psát i v režimu HRA (přes `updatePlayField`) a popisek panelu ukazuje skutečný stav ukládání místo neplatného slibu.
- [x] **HOTOVO — Undo/Redo.** Jede po jednotlivých změnách (ne po uložených verzích), nepřepíná režim a vrácení rovnou pobere autosave. Zásobník 100 kroků žije v `localStorage`, takže přežije refresh i zavření okna.
- [ ] **P2 — Sdílená veřejná databáze + anonymní přihlášení.** Cesta `public/data/...`: kdokoliv s odkazem vidí, edituje a **maže** cizí postavy. Chybí vlastnictví a koš (soft delete).
- [ ] **P2 — Číselná pole jsou textová a bez validace.** SPECIAL, dovednosti i HP spolknou cokoli. Chybí meze podle pravidel (SPECIAL 4–10, dovednost 0–6, 3 tagy).
- [ ] **P2 — PWA je jen napůl.** `manifest.json:7-8` má barvy ze starého papírového motivu (`#fdfaf5` / `#d97706`) → bílo-oranžový splash proti tmavému Pip-Boyu. `apple-touch-icon` je SVG (`index.html:19`), což iOS na plochu nevezme. Není service worker — React, Firebase i fonty jdou z CDN, takže bez internetu aplikace vůbec nenaběhne.
- [ ] **P2 — Tisk přeteče.** Slib „A4 · 2 strany" platí jen pro krátký seznam; arch má `min-height:297mm`, takže delší inventář zaláme uprostřed tabulky. *(Vědomě neřešíme.)* Tabulka zbraní už má všech jedenáct sloupců včetně Rychlosti, Dostřelu a Atributů a bere dopočítané CČ i TAG zbraň z aplikace.
- [x] **HOTOVO — Pole JEDOVÉ OZ je jen jednou**, pod zásahovými zónami k ostatním odolnostem. Z odvozených statistik zmizelo.
- [x] **HOTOVO — Mazání šablony se ptá** stejně jako mazání postavy.
- [x] **ČÁSTEČNĚ — Log hodů přežije refresh** — drží se v `localStorage` (60 posledních, klíč `fallout_rolllog`). **Zbývá:** sdílení se zbytkem stolu.
- [x] **HOTOVO — Na mobilu je z tabulky zbraní karta na zbraň** (do 760 px), s popiskem u každé hodnoty. Vodorovné scrollování je pryč.
- [ ] **P3 — `server.log` je commitnutý v repu.**

---

## C. Nové funkce (podle přínosu)

- [x] **HOTOVO — Hod přímo z listu** (bez dokupování kostek za AP — AP se nedělají).
- [ ] **ČÁSTEČNĚ — Hod poškození z řádku zbraně.** Klik na zbraň v HŘE složí test na zásah (atribut + dovednost podle pravidel) a přepnutí na CD z ní vezme počet kostek podle poškození; stepper zůstává, takže si hráč počet upraví. **Zbývá:** bonus ze SÍLY u zbraní nablízko, automatické vyhodnocení efektů a volba „utratit munici za +1 CD".
- [ ] **P1 — Body štěstí** s maximem = ŠTĚSTÍ, tlačítka −/+ a v rolleru „přehodit tuhle kostku za bod štěstí" (1 k20 nebo až 3 CD).
- [x] **HOTOVO — Nosnost a varování o přetížení.** (Automatický výpočet ostatních odvozených statistik se vědomě nedělá, viz sekce A.)
- [x] **HOTOVO — Rady a efektivní max HP.** Zbývá případně tlačítko na RadAway.
- [x] **HOTOVO — Zranění jako počitadlo na lokaci** včetně textu efektu a pravidla o 5+ poškození.
- [ ] **P2 — Rychlé akce v režimu HRA:** HP −/+, zátky −/+, „přidat kořist" jedním klikem. (Munice už −/+ má.)
- [ ] **ČÁSTEČNĚ — Přednačtené šablony z příručky** místo prázdné administrace. Perky jsou hotové: katalog 94 perků (`perks.js`) se v Administraci doplní jedním tlačítkem, včetně podmínek. Munice už doplnit jde. **Zbývá:** zbraně a chemie.
- [x] **HOTOVO — Filtrování perků podle podmínek.** V Administraci i ve výběru perku jde filtrovat podle vlastnictví, požadovaného atributu a jeho hodnoty, minimální úrovně, zákazu pro roboty a podle toho, jestli na perk otevřená postava vůbec dosáhne. U řádku se ukazují podmínky, kolikátý stupeň už postava má a co jí chybí.
- [x] **HOTOVO — Filtrování v administraci** podle názvu a podle typu vybavení či dovednosti zbraně.
- [ ] **P3 — Export/import postavy do JSON** + offline režim (service worker, lokální kopie).
- [ ] **P3 — Průvodce tvorbou postavy** (rozdělení SPECIAL, 3 tagy, INT×2 bodů dovedností, hlídání limitů) a průvodce postupem na úroveň.
- [ ] **P3 — Sdílený log hodů a iniciativní pořadí družiny** (kdo je na řadě).
- [x] **HOTOVO — Karty místo tabulky zbraní na mobilu.**

---

## Navržené pořadí prací

1. ~~Balíček „hraní"~~ — **hotovo** (hod z listu, nosnost, radiace, zranění, munice).
2. ~~Balíček „nešahej mi na data"~~ — **hotovo** (historie do podkolekce, neukládat beze změny, kroky Zpět, viditelný stav ukládání, poctivý indikátor připojení).
3. ~~Balíček „odvozený útok"~~ — **hotovo** (CČ a TAG zbraň z pravidel, klik na zbraň skládá test, CD podle poškození, tisk se sloupci navíc, mobilní karty, log hodů v `localStorage`).
4. **Balíček „režim HRA":** B3 (odemknout zátky/XP/loot) + rychlé akce.
5. **Balíček „boj":** bonus ze SÍLY a munice za +1 CD u poškození + body štěstí s přehazováním.
6. Zbytek podle chuti.

---

## Zdroje k pravidlům

- [Derived Statistics — Roll20 Compendium](https://roll20.net/compendium/fallout/Derived%20Statistics)
- [Skill Tests — Roll20 Compendium](https://roll20.net/compendium/fallout/Skill%20Tests)
- [Damage and Injury — Roll20 Compendium](https://roll20.net/compendium/fallout/Damage%20and%20Injury)
- [Fallout 2d20 Quickstart — Core Rules](https://www.fantasygrounds.com/library/falloutrpg/fallout-2d20-quickstart/chapter-one-core-rules/)
- [Action Points — Fallout Wiki](https://fallout.fandom.com/wiki/Action_Points_(Fallout:_The_Roleplaying_Game))
- [Skills — The Fallout Wiki](https://fallout.wiki/wiki/Fallout:_The_Roleplaying_Game_Skills)
- [Tag Skill — The Fallout Wiki](https://fallout.wiki/wiki/Tag_Skill_(Fallout:_The_Roleplaying_Game))
