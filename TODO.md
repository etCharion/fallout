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

**Technicky mají přednost dvě věci, které v minulém seznamu nejsou** — obě ověřené
v prohlížeči, ne odvozené z kódu:

1. **P0 — dvě změny v jednom kliknutí se navzájem přebijí** (viz B0). Kvůli tomu
   nejde zapsat radiace ani zaškrtnout zranění zóny. Obojí je přitom v seznamu
   odškrtnuté jako HOTOVO — hotová je logika, rozbité je uložení.
2. **P1 — když selže anonymní přihlášení, aplikace visí na „NAČÍTÁNÍ…“ napořád**
   (viz B1). Poctivý indikátor OFFLINE se v takové situaci nestihne vykreslit.

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
  | Poškození nablízko | SÍLA ≤ 6 → 0 · 7–8 → +1 CD · 9–10 → +2 CD · 11+ → +3 CD |
  | Nosnost | 150 + (10 × SÍLA) |
  | Body štěstí | max = ŠTĚSTÍ, doplňují se na začátku sezení |
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

**Co je naopak správně (needitovat bez důvodu):** interpretace Combat Dice — 1→1 dmg, 2→2 dmg, 3–4→0, 5–6→1 dmg + efekt. Tabulka zásahových zón 1‑2 / 3‑8 / 9‑11 / 12‑14 / 15‑17 / 18‑20. Kritický zásah od 5 poškození po odečtení odolnosti. Postihy za přetížení.

---

## B. Bugy a tření

- [ ] **P0 — Dvě změny v jednom kliknutí se navzájem přebijí.** `commitChar` (`app.js:2399`)
  si vezme `localChar` z uzávěru renderu a zavolá `setLocalChar(hodnota)` — ne funkční
  formu `setLocalChar(prev => …)`. Dvě volání `updateField` za sebou proto obě počítají
  ze **stejného** starého stavu a druhé přepíše první. V aplikaci jsou přesně dvě taková
  místa a obě jsou vidět:
  - `setRads` (`app.js:3340`): zadání radů, které srazí HP pod maximum, uloží **jen**
    sražené HP a radiaci zahodí. Ověřeno: max 10 HP, zadáno RAD 5 → pole RAD ukazuje 0,
    HP spadlo na 5. Zopakováním se HP ratchetuje níž a níž a nikde není vidět proč.
  - `BodyPartCard.setInjured` a `setCount` (`app.js:1373`–`1381`): zaškrtnutí ZRANĚNO
    nastaví počet zranění na 1, ale `injured` zůstane `false` — zóna se nezčervená
    a zaškrtávátko se samo odškrtne. Ověřeno.
  - Vedlejší škoda: `recordStep` proběhne dvakrát, takže v zásobníku Zpět skončí krok
    do stavu, který na obrazovce nikdy nebyl.
  - Oprava: buď `commitChar` přes `setLocalChar((prev) => …)` (a krok Zpět počítat
    z `prev`), nebo obě pole měnit jedním commitem — jako to už dělá `toggleSkillTag`.
- [ ] **P1 — Selhané přihlášení = věčné „NAČÍTÁNÍ…".** `setLoading(false)` je jen
  v callbacku kolekčního `onSnapshot` (`app.js:2246`), který je za `if (!user) return`.
  Když `signInAnonymously` hodí chybu (výpadek sítě, doména mimo whitelist, Firebase dole),
  `user` zůstane `null`, efekt se nespustí a aplikace visí na hlášce „NAČÍTÁNÍ…" navždy —
  bez chybové hlášky, bez tlačítka „zkusit znovu". Ověřeno v prohlížeči. Indikátor
  „◌ OFFLINE" je až ve status baru listu, takže se v téhle situaci nikdy nevykreslí.
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
- [ ] **P2 — Číselná pole jsou textová a bez validace.** Ověřeno: SPECIAL spolkne `99`, `-5` i `abc`; dovednost spolkne `42`; tagnout jde všech **17** dovedností (pravidla dávají 3); aktuální HP jde na `999` při maximu 10 — pruh se ořízne, ale číslo v poli ne, takže arch i tisk lžou. Meze podle pravidel: SPECIAL 4–10, dovednost 0–6, 3 tagy, HP ≤ efektivní maximum.
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
- [ ] **P3 — Průvodce tvorbou postavy** (rozdělení SPECIAL, 3 tagy, INT×2 bodů dovedností, hlídání limitů) a průvodce postupem na úroveň. *(Navazuje na validaci v B — bez mezí se průvodce dělat nedá.)*
- [ ] **P3 — Sdílený log hodů a iniciativní pořadí družiny** (kdo je na řadě).
- [x] **HOTOVO — Karty místo tabulky zbraní na mobilu.**

---

## Navržené pořadí prací

1. ~~Balíček „hraní"~~ — **hotovo** (hod z listu, nosnost, radiace, zranění, munice).
2. ~~Balíček „nešahej mi na data"~~ — **hotovo** (historie do podkolekce, neukládat beze změny, kroky Zpět, viditelný stav ukládání).
3. ~~Balíček „odvozený útok"~~ — **hotovo** (CČ a TAG zbraň z pravidel, klik na zbraň skládá test, CD podle poškození, tisk, mobilní karty, log hodů).
4. **Balíček „ať to drží": B0 + B1.** Malá oprava, velký dopad — bez ní se radiace ani zranění nedají zapsat a offline aplikace mlčky visí. Tohle je jediná položka, která opravuje už „hotové" funkce.
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
- [Skills — The Fallout Wiki](https://fallout.wiki/wiki/Fallout:_The_Roleplaying_Game_Skills)
- [Tag Skill — The Fallout Wiki](https://fallout.wiki/wiki/Tag_Skill_(Fallout:_The_Roleplaying_Game))
