# TODO — Fallout 2d20 character sheet

Backlog vzniklý z revize aplikace proti pravidlům Fallout: The Roleplaying Game (2d20)
a proti běžným character sheetům. Odkazy na soubory ukazují na stav v době revize —
po refaktorech je potřeba čísla řádků ověřit.

Legenda priorit: **P0** = kazí data · **P1** = poznáš při každé session · **P2** = vadí, ale dá se obejít · **P3** = kosmetika / hygiena repa

---

## Stav k 3. 8. 2026 — druhý audit

Aplikace se spustila v prohlížeči (React i Firebase nahrazené lokálními náhradami,
protože CDN sem nedosáhne) a proklikala. Co z toho vyšlo:

**Funkčně je karta hotová.** Balíčky 1–3 z minulého pořadí prací opravdu sedí:
CČ útoku se počítá z pravidel (ověřeno: HBI 5 + LEHKÉ ZBRANĚ 0 → CČ 5), TAG zbraň se
přeznačí hned po tagnutí dovednosti, nosnost, radiace, zásahové zóny, munice, tisk
i log hodů fungují. Texty pravidel v nápovědách (kritický zásah od 5 poškození,
efekty zranění po zónách, postihy za přetížení) souhlasí s příručkou.

**Technicky přibyly dvě věci, které v minulém seznamu nebyly** — obě ověřené
v prohlížeči, ne odvozené z kódu, a obě už **opravené** (viz B0 a B1):

1. **P0 — dvě změny v jednom kliknutí se navzájem přebíjely.** Kvůli tomu nešla
   zapsat radiace ani zaškrtnout zranění zóny. Obojí bylo přitom odškrtnuté jako
   HOTOVO — hotová byla logika, rozbité uložení.
2. **P1 — když selhalo anonymní přihlášení, aplikace visela na „NAČÍTÁNÍ…“ napořád.**

Zbytek otevřených bodů z minula platí beze změny: sdílená veřejná databáze,
chybějící validace čísel, poloviční PWA, `server.log` v repu.

---

## A. Rozpory s pravidly

- [x] **HOTOVO — Hod 2d20 počítá úspěchy.** V režimu HRA i NÁHLED jde klepnout na jeden atribut a jednu dovednost (žlutě se označí); roller pak hlásí úspěchy proti CČ = atribut + dovednost místo dřívějšího nesmyslného „Součtu".
- [x] **HOTOVO — Crit range podle tag dovednosti.** Kostka ≤ hodnota tagnuté dovednosti = kritický úspěch za 2 úspěchy; přirozená 1 kritická vždy; 20 = komplikace. Rozsah se ukazuje v liště nad kostkami.
- [ ] ~~**Chybí Action Points.**~~ **VYŘAZENO** — AP jsou skupinová mechanika, aplikace je karta jedné postavy. Nedělá se.
- [ ] ~~**Odvozené statistiky se nepočítají.**~~ **VĚDOMĚ RUČNÍ** — vzorce sice jednoznačné jsou, ale perky je mění a modelovat to je zatím moc složité. Necháváme ruční pole. Vzorce pro referenci (opraveno podle příručky při druhém auditu):
  | Statistika | Vzorec |
  |---|---|
  | Max HP (1. úroveň) | ODO + ŠTĚ |
  | Max HP za úroveň | **+1 za každou úroveň** (dřív tu stálo „+ODO", to je špatně) |
  | Iniciativa | VNÍ + HBI (−1 při přetížení) |
  | Obrana | HBI 1–8 → 1; HBI 9+ → 2 |
  | Poškození nablízko | SÍLA ≤ 6 → 0 · 7–8 → +1 CD · 9–10 → +2 CD · 11+ → +3 CD ¹ |
  | Nosnost | 150 + (10 × SÍLA) |
  | Body štěstí | max = ŠTĚSTÍ, doplňují se na začátku sezení |

  ¹ Tuhle tabulku dávají shodně Core Rulebook i Beta 5.0. Fanouškovská wiki
  (Obsidian Portal) uvádí odchylné „8–9 → +1, 10 → +2" — kdyby to někdy někdo
  programoval, ať to vezme z příručky, ne z wiki.
- [x] **HOTOVO — Nosnost se sčítá.** Zbraně + vybavení (váha × množství) proti nosnosti 150 + 10 × SÍLA, v hlavičce panelu VYBAVENÍ. Při překročení červené „PŘETÍŽENO" a nápověda s postihy. Váhy typu „< 0,5" se parsují správně. *(Ověřeno: SIL 7 → 0 / 220.)*
- [x] **HOTOVO — Radiace u HP.** Pole ☢ RAD nahradilo popisek Stabilní/Kritický. Rady ukrajují z maxima, odečtená část pruhu se šrafuje. **⚠ Ale zápis je rozbitý, viz B0.**
- [x] **HOTOVO — Zranění jako počet.** Čtvrtý sloupec u lokace je počet zranění (červeně), zaškrtávátko ANO/NE zůstalo. U názvu zóny je „?" s popisem efektu zranění a s pravidlem o 5+ poškození. **⚠ Ale zaškrtávátko nedrží, viz B0.**
- [x] **ČÁSTEČNĚ — Munice.** Typ munice je výběr z 20 typů podle příručky, vedle je počitadlo propojené s municí v inventáři (odečítá se na obou místech). Párování jde přes výslovný typ u položky, jinak podle názvu („10. mm náboje" najde „10 mm"). V administraci se u typu „Munice" vybírá typ munice a nápověda nabízí doplnění chybějících typů. **Zbývá:** utracení extra munice za +1 CD poškození (pravidlo: 1 kus munice = +1 CD, nejvýš do hodnoty Rychlosti palby zbraně).
- [x] **HOTOVO — Dovednost zbraně je z pevného seznamu** (CHL, BEZ, LEHK, VRH, TĚŽ, ENG) v tabulce útoků i v administraci, a je napojená na seznam dovedností — klik na zkratku vybere dvojici pro hod. Starší ručně psané hodnoty zůstávají zachované.
- [x] **HOTOVO — CČ u zbraně se počítá.** Cílové číslo útoku = hodnota dovednosti zbraně + atribut, který k ní podle pravidel patří (LEHK → HBI, TĚŽ → ODO, ENG → VNI, CHL a BEZ → SIL, VRH → HBI). Needituje se, přepočítá se samo a stejné číslo jde i na tištěný arch. *(Ověřeno v prohlížeči.)*
- [x] **HOTOVO — Přiřazená zbraň = TAG zbraň.** Zaškrtávátko PŘIŘ. se needituje a zrcadlí, jestli je dovednost zbraně tagnutá. Přepnutí tagu u dovednosti přeznačí všechny její zbraně naráz. *(Ověřeno v prohlížeči, drží i po kroku Zpět.)*
- [x] **HOTOVO — Atribut u dovednosti není závazný.** Závorka s doporučením zůstala a klik na dovednost doporučený atribut předvyplní, ale jde označit libovolná dvojice.
- [x] **VYŘEŠENO — Čtvrtý sloupec u lokací** už není „BZ / body zdraví", ale počet zranění (`ZR`). Staré hodnoty `bz` zůstaly v databázi, ale nikde se nepoužívají.
- [ ] **P1 — Obtížnost testu chybí.** Roller spočítá úspěchy, ale nikde se nezadá, kolik jich test potřebuje (0–5), takže aplikace nikdy neřekne „uspěl / neuspěl". Je to poslední kousek, co dělí hod od hotového testu dovednosti.
- [ ] **P3 — CČ u zbraně je zamčené na výchozí atribut.** Pravidla říkají, že se na dvojici
  atribut + dovednost *domluvíš podle toho, co k akci sedí* — výchozí atribut dovednosti je
  jen běžný případ, ne povinnost. Obecný roller to respektuje (jde složit libovolná dvojice),
  ale řádek zbraně dvojici natvrdo určí a CČ se needituje. U 99 % útoků je to správně a
  pohodlné; chybí jen možnost pro ten zbytek (třeba VNÍ + CHLADNÉ ZBRANĚ na přesný bodec).
  Řešení může být drobné: klik na CČ nabídne jiný atribut, výchozí zůstane předvyplněný.

**Co je naopak správně (needitovat bez důvodu) — ověřeno proti příručce při druhém auditu:**

| Pravidlo | Jak to má být | Jak to má aplikace |
|---|---|---|
| CČ testu | zvolený atribut + hodnota dovednosti | ✓ |
| Kritický úspěch | přirozená 1 vždy; u **tagnuté** dovednosti každá kostka ≤ hodnota dovednosti; krit = 2 úspěchy | ✓ (`Math.max(1, hodnota)`) |
| Komplikace | základní rozsah 20 (vypravěč ho může rozšířit) | ✓ pro základní rozsah |
| Combat Dice | 1 → 1 dmg · 2 → 2 dmg · 2× prázdná → 0 · 2× efekt → **1 dmg + efekt** | ✓ |
| Zásahové zóny | 1‑2 hlava · 3‑8 trup · 9‑11 levá ruka · 12‑14 pravá ruka · 15‑17 levá noha · 18‑20 pravá noha | ✓ |
| Kritický zásah / zranění | 5+ poškození z jednoho zásahu po odečtení odolnosti | ✓ (v nápovědě) |
| Dvojice dovednost → atribut | všech 17 dovedností sedí na oficiální tabulku (ATLETIKA/BEZ ZBRANĚ/CHLADNÉ → SIL, ENERGETICKÉ/OTEVÍRÁNÍ/PILOTOVÁNÍ/VÝBUŠNINY → VNI, PŘEŽITÍ/TĚŽKÉ → ODO, OBCHOD/ŘEČNICTVÍ → CHA, LÉČENÍ/OPRAVY/VĚDA → INT, LEHKÉ/PLÍŽENÍ/VRHÁNÍ → HBI) | ✓ |
| Útok zbraní | používá primární atribut dovednosti (příklad z příručky: TĚŽKÉ 4 + ODO 8 → CČ 12) | ✓ |
| Nosnost a postihy | 150 + 10 × SÍLA; při překročení +1 obtížnost na testy SIL a HBI, iniciativa −1, žádný Sprint | ✓ |
| Obrana / Iniciativa | HBI ≤ 8 → 1, ≥ 9 → 2; VNÍ + HBI | ✓ (ručně, ale vzorec v tabulce sedí) |

---

## B. Bugy a tření

- [x] **HOTOVO (P0) — Dvě změny v jednom kliknutí se navzájem přebíjely.** `commitChar`
  si bral `localChar` z uzávěru renderu, takže dvě volání `updateField` za sebou obě
  počítala ze **stejného** starého stavu a druhé přepsalo první. Projevovalo se to na
  dvou místech: zadání radů zahodilo radiaci a nechalo jen sražené HP (a opakováním
  se HP ratchetovalo níž), a zaškrtnutí ZRANĚNO nastavilo počet 1, ale zóna zůstala
  „v pořádku". Opraveno dvěma vrstvami:
  - `commitChar` bere základ z `charRef`, který se srovnává při každém renderu a hned
    po commitu se posune. Tím je ošetřená celá třída — i budoucí místa, kde by někdo
    napsal dvě změny za sebou.
  - `setRads` a `BodyPartCard` mění obě pole **jedním** commitem, takže Zpět vrací
    jeden krok na jedno kliknutí, ne dva. (Přes `setLocalChar((prev) => …)` se to
    nedělá schválně — do updateru by se muselo volat `recordStep`, což je vedlejší
    efekt na místě, kde ho React nechce.)
- [x] **HOTOVO (P1) — Selhané přihlášení = věčné „NAČÍTÁNÍ…".** `setLoading(false)` bylo
  jen v callbacku kolekčního `onSnapshot`, který je za `if (!user) return`. Když
  `signInAnonymously` selhalo, `user` zůstal `null` a aplikace visela na hlášce navždy.
  Teď má nápis tři cesty ven: úspěch, chybu (`catch` i chybový callback
  `onAuthStateChanged`) a pojistku na čas (`CONNECT_TIMEOUT`, 10 s) pro případ, že se
  přihlášení nikdy neozve. Místo kolečka se ukáže obrazovka „NEPODAŘILO SE PŘIPOJIT"
  s tlačítkem ZKUSIT ZNOVU, která rozliší výpadek sítě od nedostupné databáze.
- [x] **HOTOVO — Historie je v podkolekci.** Verze bydlí v `fallout_characters/{id}/history/{v000123}`, v dokumentu postavy zůstalo jen `historySeq`, `historyCount` a `historyHash`. Načítají se líně (až při otevření modalu VERZE). Držíme posledních 30, starší se ořezávají. Postavy se starým polem `history` se migrují samy při prvním uložení.
- [x] **HOTOVO — Neukládá se, když se nic nezměnilo.** Před každým zápisem se porovnává otisk stavu (`fingerprint`); přepínání režimů beze změny nezapisuje vůbec a nezakládá verzi.
- [ ] **P1 — V režimu HRA nejde dělat to, co se při hře děje.** Ověřeno proklikáním:
  v HŘE jsou zamčené **zátky, XP, úroveň** a přidání ukořistěného předmětu (tlačítka
  „+ PŘIDAT" a „Ze šablony" se zobrazují jen v ÚPRAVÁCH). Odemčené správně jsou HP,
  radiace, body štěstí, poznámky, odolnosti a zranění zón, množství v inventáři a munice.
- [x] **HOTOVO — Tichá ztráta dat.** Selhání zápisu už není tiché: v liště i ve status baru je stav ukládání (`UKLÁDÁM… / ULOŽENO 18:42 / CHYBA ULOŽENÍ`) a rozdělaný stav se zálohuje do `localStorage` s nabídkou obnovy. Indikátor připojení sleduje `navigator.onLine`.
- [x] **HOTOVO — Poznámky a AUTOSAVE.** Poznámky jdou psát i v režimu HRA a popisek panelu ukazuje skutečný stav ukládání místo neplatného slibu.
- [x] **HOTOVO — Undo/Redo.** Jede po jednotlivých změnách, nepřepíná režim a vrácení rovnou pobere autosave. Zásobník 100 kroků žije v `localStorage`. *(Ověřeno: Zpět vrátí i přeznačení TAG zbraně.)*
- [ ] **P2 — Sdílená veřejná databáze + anonymní přihlášení.** Cesta `public/data/...`: kdokoliv s odkazem vidí, edituje a **maže** cizí postavy. Chybí vlastnictví a koš (soft delete). Navíc: kolekční `onSnapshot` přepíše otevřený list cizí změnou, kdykoli není `dirty` a není zapnutý režim ÚPRAVY — dva lidé nad jednou postavou se přetahují a u seznamů (zbraně, inventář) vyhrává celé pole poslední zápis.
- [ ] **P2 — Číselná pole jsou textová a bez validace.** Ověřeno: SPECIAL spolkne `99`, `-5` i `abc`; dovednost spolkne `42`; tagnout jde všech **17** dovedností (pravidla dávají 3); aktuální HP jde na `999` při maximu 10 — pruh se ořízne, ale číslo v poli ne, takže arch i tisk lžou.
  Meze podle pravidel (ověřeno):
  - SPECIAL při tvorbě: všechny začínají na **4**, rozděluje se **12 bodů**, strop **10**.
  - Dovednosti: rozsah **0–6**. Při tvorbě navíc tagnuté začínají na 2 a nesmí přesáhnout 4, netagnuté nesmí přesáhnout 3.
  - **3 tagy**, bodů na dovednosti při tvorbě **INT × 2**.
  - HP ≤ efektivní maximum (maximum mínus rady).

  **Pozor na tvrdé zámky:** perky, mutace a silová zbroj umí SPECIAL vytáhnout nad 10 a
  dovednost nad běžný strop, takže „4–10" platí pro *tvorbu postavy*, ne pro celou hru.
  Rozumnější než zakazovat je varovat — červený rámeček a nápověda „mimo meze pravidel",
  ale hodnotu nechat zapsat. Tvrdě odmítat dává smysl leda u nesmyslů (`abc`, záporná HP).
- [ ] **P2 — Přepnutí postavy během neuloženého zápisu si plete otisky.** `handleSelectChar`
  (`app.js:2920`) spustí `handleSave`/`flushSave` bez `await` a hned přepne `selectedCharId`.
  Když zápis doběhne, nastaví `savedHashRef` a `setDraft(null)` už pro **novou** postavu —
  ta se pak buď uloží zbytečně, nebo si nechá schovanou nabídku obnovy zálohy.
- [ ] **P2 — PWA je jen napůl.** `manifest.json:7-8` má pořád barvy ze starého papírového motivu (`#fdfaf5` / `#d97706`) → bílo-oranžový splash proti tmavému Pip-Boyu. `apple-touch-icon` je SVG (`index.html:19` i dynamická náhrada v `app.js`), což iOS na plochu nevezme. Není service worker — React, Firebase i fonty jdou z CDN, takže bez internetu aplikace vůbec nenaběhne (a viz B1: skončí na věčném „NAČÍTÁNÍ…").
- [ ] **P2 — Tisk přeteče.** Slib „A4 · 2 strany" platí jen pro krátký seznam; arch má `min-height:297mm`, takže delší inventář zaláme uprostřed tabulky. *(Vědomě neřešíme.)* Escapování dat do archu je v pořádku — ověřeno, `<img onerror=…>` ve jméně postavy se do HTML nepropíše.
- [x] **HOTOVO — Pole JEDOVÉ OZ je jen jednou**, pod zásahovými zónami k ostatním odolnostem.
- [x] **HOTOVO — Mazání šablony se ptá** stejně jako mazání postavy.
- [x] **ČÁSTEČNĚ — Log hodů přežije refresh** — drží se v `localStorage` (60 posledních, klíč `fallout_rolllog`). **Zbývá:** sdílení se zbytkem stolu.
- [x] **HOTOVO — Na mobilu je z tabulky zbraní karta na zbraň** (do 760 px), s popiskem u každé hodnoty.
- [ ] **P3 — `server.log` je commitnutý v repu** a repo nemá `.gitignore`, takže se to bude opakovat.
- [ ] **P3 — `app.js` má 5 765 řádků / 198 kB.** Bez build kroku to je vědomá cena, ale
  `TRANSLATIONS` (520 řádků), modaly a administrace by šly do vlastních ES modulů bez
  jakéhokoli nástroje — `index.html` už moduly načítá.

---

## C. Nové funkce (podle přínosu)

- [x] **HOTOVO — Hod přímo z listu** (bez dokupování kostek za AP — AP se nedělají).
- [ ] **ČÁSTEČNĚ — Hod poškození z řádku zbraně.** Klik na zbraň v HŘE složí test na zásah a přepnutí na CD z ní vezme počet kostek podle poškození; stepper zůstává. **Zbývá:** bonus ze SÍLY u zbraní nablízko (≤6 → 0, 7–8 → +1 CD, 9–10 → +2, 11+ → +3), automatické vyhodnocení efektů a volba „utratit munici za +1 CD".
- [ ] **P1 — Body štěstí.** Pole už na kartě je a v HŘE se edituje, ale je to jen číslo. Chybí max = ŠTĚSTÍ, tlačítka −/+, doplnění na začátku sezení a hlavně použití v rolleru: přehodit 1 k20 nebo až 3 CD za bod, případně použít ŠTĚSTÍ místo výchozího atributu testu.
- [x] **HOTOVO — Nosnost a varování o přetížení.**
- [x] **HOTOVO — Rady a efektivní max HP.** *(Pozor na B0.)* Zbývá případně tlačítko na RadAway.
- [x] **HOTOVO — Zranění jako počitadlo na lokaci** včetně textu efektu a pravidla o 5+ poškození. *(Pozor na B0.)*
- [ ] **P2 — Rychlé akce v režimu HRA:** HP −/+, zátky −/+, „přidat kořist" jedním klikem. (Munice už −/+ má, množství v inventáři taky.)
- [ ] **ČÁSTEČNĚ — Přednačtené šablony z příručky** místo prázdné administrace. Perky jsou hotové: katalog 94 perků (`perks.js`, všech 94 má popis i podmínky) se v Administraci doplní jedním tlačítkem. Munice už doplnit jde. **Zbývá:** zbraně a chemie.
- [x] **HOTOVO — Filtrování perků podle podmínek** v Administraci i ve výběru perku.
- [x] **HOTOVO — Filtrování v administraci** podle názvu a podle typu vybavení či dovednosti zbraně.
- [ ] **P3 — Export/import postavy do JSON** + offline režim (service worker, lokální kopie).
- [ ] **P3 — Průvodce tvorbou postavy** a průvodce postupem na úroveň. Čísla pro průvodce jsou ověřená: SPECIAL start 4 + 12 bodů k rozdělení, strop 10 · 3 tagy, tagnuté dovednosti startují na 2 · INT × 2 bodů dovedností · při tvorbě strop 4 u tagnutých a 3 u ostatních · max HP = ODO + ŠTĚ, dál +1 za úroveň. *(Navazuje na validaci v B — bez mezí se průvodce dělat nedá.)*
- [ ] **P3 — Sdílený log hodů a iniciativní pořadí družiny** (kdo je na řadě).
- [x] **HOTOVO — Karty místo tabulky zbraní na mobilu.**

---

## Navržené pořadí prací

1. ~~Balíček „hraní"~~ — **hotovo** (hod z listu, nosnost, radiace, zranění, munice).
2. ~~Balíček „nešahej mi na data"~~ — **hotovo** (historie do podkolekce, neukládat beze změny, kroky Zpět, viditelný stav ukládání).
3. ~~Balíček „odvozený útok"~~ — **hotovo** (CČ a TAG zbraň z pravidel, klik na zbraň skládá test, CD podle poškození, tisk, mobilní karty, log hodů).
4. ~~Balíček „ať to drží"~~ — **hotovo** (přebíjející se změny, chybová obrazovka místo věčného načítání).
5. **Balíček „režim HRA":** odemknout zátky/XP/loot + rychlé akce (P1 v B, P2 v C).
6. **Balíček „boj":** body štěstí s přehazováním, bonus ze SÍLY, munice za +1 CD, obtížnost testu.
7. **Balíček „meze":** validace čísel podle pravidel — a teprve pak průvodce tvorbou postavy.
8. Zbytek podle chuti (PWA, `.gitignore`, rozdělení `app.js`).

---

## Zdroje k pravidlům

- [Derived Statistics — Roll20 Compendium](https://roll20.net/compendium/fallout/Derived%20Statistics)
- [Skill Tests — Roll20 Compendium](https://roll20.net/compendium/fallout/Skill%20Tests)
- [Damage and Injury — Roll20 Compendium](https://roll20.net/compendium/fallout/Damage%20and%20Injury)
- [Fallout 2d20 Quickstart — Core Rules](https://www.fantasygrounds.com/library/falloutrpg/fallout-2d20-quickstart/chapter-one-core-rules/)
- [Fallout 2d20 Quickstart — Combat](https://www.fantasygrounds.com/library/falloutrpg/fallout-2d20-quickstart/chapter-two-combat)
- [Luck — Roll20 Compendium](https://roll20.net/compendium/fallout/Luck)
- [Equipment (munice a Rychlost palby) — Roll20 Compendium](https://roll20.net/compendium/fallout/Equipment)
- [Skills — Roll20 Compendium](https://roll20.net/compendium/fallout/Skills)
- [Skills — The Fallout Wiki](https://fallout.wiki/wiki/Fallout:_The_Roleplaying_Game_Skills)
- [Skills — Fallout Fandom (tabulka dovednost → atribut)](https://fallout.fandom.com/wiki/Fallout:_The_Roleplaying_Game_skills)
- [Tag Skill — The Fallout Wiki](https://fallout.wiki/wiki/Tag_Skill_(Fallout:_The_Roleplaying_Game))
- [Hit Locations — Fallout RPG Nexus](https://app.demiplane.com/nexus/falloutrpg/rules/hit-locations)
- [Character Creation — 2D20 Fallout (Obsidian Portal)](https://fallout2d20.obsidianportal.com/wikis/character-creation) — pozor, u poškození nablízko se rozchází s příručkou
- [Hit Points — The Fallout Wiki](https://fallout.wiki/wiki/Hit_Points)
