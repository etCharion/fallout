// perks.js — katalog perků z příručky Fallout 2d20.
//
// Sloupce předlohy: český název, anglický název (do závorky), limit stupňů,
// požadavky (atributy, minimální úroveň, výjimky) a zkrácený popis účinku.
// Delší „přesný popis" se schválně nepřenáší — na kartě je místo na jednu
// řádku a k pravidlům je příručka.
//
// Katalog se z Administrace jednorázově nasype do Firestore jako šablony
// perků; požadavky se ukládají spolu s nimi, aby se podle nich dalo
// filtrovat i po ruční úpravě šablony.

// Pořadí odpovídá S.P.E.C.I.A.L.; klíče míří do polí postavy v app.js.
export const PERK_REQ_ATTRS = [
  "strength",
  "perception",
  "endurance",
  "charisma",
  "intelligence",
  "agility",
  "luck",
];

export const PERK_CATALOG = [
  {
    key: "adamantiovyskelet",
    cs: "Adamantiový skelet",
    en: "Adamantium Skeleton",
    ranks: 3,
    level: 1,
    levelStep: 3,
    req: { endurance: 7 },
    effect: {
      cs: "Práh krit. zásahu +1 BZ/stupeň. Min. úroveň +3/stupeň.",
      en: "Crit hit threshold +1 HP per rank. Min. level +3/rank.",
    },
  },
  {
    key: "akcnichlapecdivka",
    cs: "Akční chlapec/dívka",
    en: "Action Boy/Action Girl",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: {},
    effect: {
      cs: "Dodatečná velká akce za AB bez zvýšení obtížnosti ověření.",
      en: "Extra major action for AP without raising the difficulty of your tests.",
    },
  },
  {
    key: "barbar",
    cs: "Barbar",
    en: "Barbarian",
    ranks: 1,
    level: 4,
    levelStep: 0,
    req: { strength: 7 },
    noRobot: true,
    effect: {
      cs: "Bez energozbroje fyz. OZ: SIL 7–8 +1; SIL 9–10 +2; SIL 11+ +3.",
      en: "Without power armor, physical DR: STR 7-8 +1; STR 9-10 +2; STR 11+ +3.",
    },
  },
  {
    key: "bavic",
    cs: "Bavič",
    en: "Smooth Talker",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { charisma: 6 },
    effect: {
      cs: "Vzájemné ověření Obchodování/Řečnictví: opakuj 1k20.",
      en: "Barter/Speech opposed test: re-roll 1d20.",
    },
  },
  {
    key: "blitz",
    cs: "Blitz",
    en: "Blitz",
    ranks: 2,
    level: 1,
    levelStep: 3,
    req: { agility: 9 },
    effect: {
      cs: "S1: Přesun na dosah + Útok na blízko ve stejném tahu → opakuj 1k20. S2: navíc +1 EF na d6 zranění. Min. úroveň +3/stupeň.",
      en: "R1: Move into reach + melee attack in the same turn -> re-roll 1d20. R2: also +1 CD damage. Min. level +3/rank.",
    },
  },
  {
    key: "brokovychirurg",
    cs: "Brokový chirurg",
    en: "Shotgun Surgeon",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { strength: 5, agility: 7 },
    effect: {
      cs: "Brokovnice: Průbojný 1, nebo existující Průbojný X +1.",
      en: "Shotguns: gain Piercing 1, or existing Piercing X +1.",
    },
  },
  {
    key: "cernavdovazabijakzen",
    cs: "Černá vdova / Zabiják žen",
    en: "Black Widow/Lady Killer",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { charisma: 6 },
    effect: {
      cs: "Proti zvolenému pohlaví: test CHA → opakuj 1k20; Útoky +1 EF na d6 zranění.",
      en: "Against the chosen gender: CHA test -> re-roll 1d20; attacks +1 CD damage.",
    },
  },
  {
    key: "darebak",
    cs: "Darebák",
    en: "Scoundrel",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { charisma: 7 },
    effect: {
      cs: "CHA + Řečnictví při přesvědčivém lhaní: ignoruj 1. komplikaci.",
      en: "CHA + Speech when lying convincingly: ignore the first complication.",
    },
  },
  {
    key: "demolicniexpert",
    cs: "Demoliční expert",
    en: "Demolition Expert",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { perception: 6, luck: 6 },
    effect: {
      cs: "Plošné zbraně: Zákeřný; odemkne recepty výbušnin vyžadující perk.",
      en: "Area weapons: gain Vicious; unlocks explosive recipes that require the perk.",
    },
  },
  {
    key: "desivydojem",
    cs: "Děsivý dojem",
    en: "Terrifying Presence",
    ranks: 2,
    level: 3,
    levelStep: 5,
    req: { strength: 6, charisma: 8 },
    effect: {
      cs: "S1: Řečnictví při hrozbě/zastrašování → opakuj 1k20. S2: velká akce, cíl krátká/střední; SIL + Řečnictví, obt. 2 → příští tah se musí vzdálit. Min. úroveň +5/stupeň.",
      en: "R1: Speech when threatening/intimidating -> re-roll 1d20. R2: major action, target at close/medium; STR + Speech, diff. 2 -> the target must move away next turn. Min. level +5/rank.",
    },
  },
  {
    key: "duch",
    cs: "Duch",
    en: "Ghost",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { perception: 5, agility: 6 },
    effect: {
      cs: "HBI + Plížení ve stínu/tmě: 1. dodatečný k20 zdarma; limit 5k20.",
      en: "AGI + Sneak in shadow/darkness: first extra d20 free; limit 5d20.",
    },
  },
  {
    key: "entomolog",
    cs: "Entomolog",
    en: "Entomologist",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { intelligence: 7 },
    effect: {
      cs: "Proti hmyzu: Průbojný 1, nebo existující Průbojný X +1.",
      en: "Against insects: gain Piercing 1, or existing Piercing X +1.",
    },
  },
  {
    key: "expertpresroboty",
    cs: "Expert přes roboty",
    en: "Robotics Expert",
    ranks: 3,
    level: 2,
    levelStep: 4,
    req: { intelligence: 8 },
    effect: {
      cs: "S1/S2/S3: robotí modifikace stejného stupně. S2: opravy robotů obt. −1. S3: dle PH přeprogramování chování/funkcí. Min. úroveň +4/stupeň.",
      en: "R1/R2/R3: robot mods up to that rank. R2: robot repairs diff. -1. R3: reprogram behavior/functions at the GM's discretion. Min. level +4/rank.",
    },
  },
  {
    key: "farmanafarmaka",
    cs: "Farma na farmaka",
    en: "Pharma Farma",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { luck: 6 },
    effect: {
      cs: "Loot léků/chemikálií: +1 náhodný předmět bez AB.",
      en: "Looting meds/chems: +1 random item without spending AP.",
    },
  },
  {
    key: "gunfu",
    cs: "Gun-fu",
    en: "Gun Fu",
    ranks: 3,
    level: 1,
    levelStep: 5,
    req: { agility: 10 },
    effect: {
      cs: "Po úspěšném Útoku na dálku: zaplať X AB + X munice → zasáhni X dalších cílů v krátké vzdál. od původního za stejné zranění (X = stupeň). Min. úroveň +5/stupeň.",
      en: "After a successful ranged attack: spend X AP + X ammo -> hit X more targets at close range from the original for the same damage (X = rank). Min. level +5/rank.",
    },
  },
  {
    key: "hacker",
    cs: "Hacker",
    en: "Hacker",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { intelligence: 8 },
    effect: {
      cs: "Hackování: obtížnost −1 (min. 0).",
      en: "Hacking: difficulty -1 (min. 0).",
    },
  },
  {
    key: "chapavost",
    cs: "Chápavost",
    en: "Comprehension",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { intelligence: 6 },
    effect: {
      cs: "Po využití bonusu časopisu hoď 1 EF na d6; účinek → použij bonus ještě 1×.",
      en: "After using a magazine bonus roll 1 CD; on an effect -> use the bonus once more.",
    },
  },
  {
    key: "intenzivnitrenink",
    cs: "Intenzivní trénink",
    en: "Intense Training",
    ranks: 10,
    level: 2,
    levelStep: 2,
    req: {},
    effect: {
      cs: "+1 libovolná vlastnost (max. 10). Min. úroveň +2/stupeň.",
      en: "+1 to any SPECIAL attribute (max. 10). Min. level +2/rank.",
    },
  },
  {
    key: "jadernyfyzik",
    cs: "Jaderný fyzik",
    en: "Nuclear Physicist",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { intelligence: 9 },
    effect: {
      cs: "Radiační/Radioaktivní zbraň: každý účinek +1 rad. zranění. Fúzní jádro: +3 energetické náboje.",
      en: "Radiation/Radioactive weapons: each effect +1 rad injury. Fusion core: +3 energy ammo.",
    },
  },
  {
    key: "kapsar",
    cs: "Kapsář",
    en: "Pickpocket",
    ranks: 3,
    level: 1,
    levelStep: 3,
    req: { perception: 8, agility: 8 },
    effect: {
      cs: "S1: HBI + Plížení při kapsářství/nastrčení → ignoruj 1. komplikaci. S2: opakuj 1k20. S3: obtížnost −1. Min. úroveň +3/stupeň.",
      en: "R1: AGI + Sneak when pickpocketing/planting -> ignore the first complication. R2: re-roll 1d20. R3: difficulty -1. Min. level +3/rank.",
    },
  },
  {
    key: "kasar",
    cs: "Kasař",
    en: "Infiltrator",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { perception: 8 },
    effect: {
      cs: "Otevírání zámků dveří/schránky: opakuj 1k20.",
      en: "Picking locks on doors/containers: re-roll 1d20.",
    },
  },
  {
    key: "komando",
    cs: "Komando",
    en: "Commando",
    ranks: 2,
    level: 2,
    levelStep: 3,
    req: { agility: 8 },
    effect: {
      cs: "Útok na dálku, RoF 3+ (ne těžká): +1 EF na d6 zranění/stupeň. Min. úroveň +3/stupeň.",
      en: "Ranged attack, RoF 3+ (not heavy): +1 CD damage per rank. Min. level +3/rank.",
    },
  },
  {
    key: "kovar",
    cs: "Kovář",
    en: "Blacksmith",
    ranks: 3,
    level: 2,
    levelStep: 4,
    req: { strength: 6 },
    effect: {
      cs: "Chladné zbraně: odemkne modifikace do stupně perku. Min. úroveň +4/stupeň.",
      en: "Melee weapons: unlocks mods up to the perk's rank. Min. level +4/rank.",
    },
  },
  {
    key: "krvavymasakr",
    cs: "Krvavý masakr",
    en: "Bloody Mess",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { luck: 6 },
    effect: {
      cs: "Po krit. zásahu hoď 1 EF na d6; účinek → +1 náhodný úraz.",
      en: "After a crit hit roll 1 CD; on an effect -> +1 random injury.",
    },
  },
  {
    key: "lecitel",
    cs: "Léčitel",
    en: "Healer",
    ranks: 3,
    level: 1,
    levelStep: 5,
    req: { intelligence: 7 },
    effect: {
      cs: "První pomoc: +1 obnovený BZ/stupeň. Min. úroveň +5/stupeň.",
      en: "First aid: +1 HP restored per rank. Min. level +5/rank.",
    },
  },
  {
    key: "lehkykrok",
    cs: "Lehký krok",
    en: "Light Step",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: {},
    effect: {
      cs: "Test s HBI: 1 AB → ignoruj 1 komplikaci. HBI + Atletika proti nášlapným/mechanickým pastem: opakuj 1k20.",
      en: "Test using AGI: 1 AP -> ignore one complication. AGI + Athletics against tripwires/mechanical traps: re-roll 1d20.",
    },
  },
  {
    key: "lekarnik",
    cs: "Lékárník",
    en: "Chemist",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { intelligence: 7 },
    effect: {
      cs: "Vyrobené chemikálie: 2× trvání; odemkne recepty vyžadující perk.",
      en: "Crafted chems: double duration; unlocks recipes that require the perk.",
    },
  },
  {
    key: "lepsikritickezasahy",
    cs: "Lepší kritické zásahy",
    en: "Better Criticals",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { luck: 9 },
    effect: {
      cs: "Po udělení ≥1 zranění: 1 Bod štěstí → automatický krit. zásah + úraz.",
      en: "After dealing 1+ injury: 1 Luck point -> automatic crit hit + injury.",
    },
  },
  {
    key: "lovec",
    cs: "Lovec",
    en: "Hunter",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { endurance: 6 },
    effect: {
      cs: "Proti zmutovanému savci/ještěru/hmyzu: Útok získá Zákeřný.",
      en: "Against mutated mammals/reptiles/insects: your attack gains Vicious.",
    },
  },
  {
    key: "medik",
    cs: "Medik",
    en: "Medic",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { intelligence: 8 },
    effect: {
      cs: "První pomoc při zotavení z úrazu: opakuj 1k20.",
      en: "First aid to recover from an injury: re-roll 1d20.",
    },
  },
  {
    key: "mistrlaseru",
    cs: "Mistr laseru",
    en: "Laser Commander",
    ranks: 2,
    level: 2,
    levelStep: 4,
    req: { perception: 8 },
    effect: {
      cs: "Energetická zbraň na dálku: +1 EF na d6 zranění/stupeň. Min. úroveň +4/stupeň.",
      en: "Ranged energy weapons: +1 CD damage per rank. Min. level +4/rank.",
    },
  },
  {
    key: "mlaticka",
    cs: "Mlátička",
    en: "Basher",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { strength: 6 },
    effect: {
      cs: "Úder střelnou zbraní na blízko: Zákeřný.",
      en: "Bashing with a ranged weapon in melee: gains Vicious.",
    },
  },
  {
    key: "mrstnost",
    cs: "Mrštnost",
    en: "Dodger",
    ranks: 2,
    level: 4,
    levelStep: 6,
    req: { agility: 6 },
    effect: {
      cs: "S1: velká akce Obrana → obtížnost −1. S2: další +1 Ochrana stojí 1 AB. Min. úroveň +6/stupeň.",
      en: "R1: Defend major action -> difficulty -1. R2: another +1 Defense costs 1 AP. Min. level +6/rank.",
    },
  },
  {
    key: "navelikostizalezi",
    cs: "Na velikosti záleží",
    en: "Size Matters",
    ranks: 3,
    level: 0,
    levelStep: 4,
    req: { endurance: 7, agility: 6 },
    effect: {
      cs: "Těžká zbraň na dálku: +1 EF na d6 zranění/stupeň. Min. úroveň +4/stupeň.",
      en: "Ranged heavy weapons: +1 CD damage per rank. Min. level +4/rank.",
    },
  },
  {
    key: "navaladrenalinu",
    cs: "Nával adrenalinu",
    en: "Adrenaline Rush",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { strength: 7 },
    effect: {
      cs: "Při BZ < max.: pro Útoky na blízko a testy se SIL počítej SIL 10.",
      en: "While HP is below max.: count STR as 10 for melee attacks and STR tests.",
    },
  },
  {
    key: "ninja",
    cs: "Ninja",
    en: "Ninja",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { agility: 8 },
    effect: {
      cs: "Nenápadný Útok chladnou/beze zbraně: +2 EF na d6 zranění; nefunguje v energozbroji.",
      en: "Sneak attack with a melee/unarmed weapon: +2 CD damage; does not work in power armor.",
    },
  },
  {
    key: "nocniptak",
    cs: "Noční pták",
    en: "Night Person",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { perception: 7 },
    effect: {
      cs: "Postih obtížnosti za tmu −1.",
      en: "Darkness difficulty penalty -1.",
    },
  },
  {
    key: "obezretnost",
    cs: "Obezřetnost",
    en: "Cautious Nature",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { perception: 7 },
    excludes: ["odvazlivec"],
    effect: {
      cs: "Když kupuješ dodatečné k20 za AB: opakuj 1k20. Nelze s Odvážlivcem.",
      en: "When buying extra d20s with AP: re-roll 1d20. Cannot be combined with Daring Nature.",
    },
  },
  {
    key: "odolnostvuciradiaci",
    cs: "Odolnost vůči radiaci",
    en: "Rad Resistance",
    ranks: 2,
    level: 1,
    levelStep: 4,
    req: { endurance: 8 },
    effect: {
      cs: "Radiační OZ všech míst zásahu +1/stupeň. Min. úroveň +4/stupeň.",
      en: "Radiation DR of every hit location +1 per rank. Min. level +4/rank.",
    },
  },
  {
    key: "odrazenistrel",
    cs: "Odrážení střel",
    en: "Ricochet",
    ranks: 1,
    level: 5,
    levelStep: 0,
    req: { luck: 10 },
    effect: {
      cs: "Nepřítelův Útok na dálku s komplikací: 1 Bod štěstí → střela zasáhne útočníka; hoď jeho zranění.",
      en: "Enemy ranged attack with a complication: 1 Luck point -> the shot hits the attacker; roll its damage.",
    },
  },
  {
    key: "odstrelovac",
    cs: "Odstřelovač",
    en: "Sniper",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { perception: 8, agility: 6 },
    effect: {
      cs: "Míření + obouruční Přesná zbraň: zvol místo zásahu bez zvýšení obtížnosti.",
      en: "Aim + two-handed Accurate weapon: choose the hit location without raising the difficulty.",
    },
  },
  {
    key: "odvazlivec",
    cs: "Odvážlivec",
    en: "Daring Nature",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { luck: 7 },
    excludes: ["obezretnost"],
    effect: {
      cs: "Když kupuješ dodatečné k20 za AB pro PH: opakuj 1k20. Nelze s Obezřetností.",
      en: "When buying extra d20s with AP for the GM: re-roll 1d20. Cannot be combined with Cautious Nature.",
    },
  },
  {
    key: "olovenyzaludek",
    cs: "Olověný žaludek",
    en: "Lead Belly",
    ranks: 2,
    level: 1,
    levelStep: 4,
    req: { endurance: 6 },
    effect: {
      cs: "S1: rad. zranění z jídla/nápojů → opakuj EF na d6. S2: imunita vůči tomuto rad. zranění. Min. úroveň +4/stupeň.",
      en: "R1: rad injury from food/drink -> re-roll the CD. R2: immune to that rad injury. Min. level +4/rank.",
    },
  },
  {
    key: "panpanisnu",
    cs: "Pan/paní snů",
    en: "Mister Sandman",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { agility: 9 },
    effect: {
      cs: "Nenápadný Útok Tichou/tlumenou zbraní: +2 EF na d6 zranění; nefunguje v energozbroji.",
      en: "Sneak attack with a Silent/suppressed weapon: +2 CD damage; does not work in power armor.",
    },
  },
  {
    key: "paralyzujicidlan",
    cs: "Paralyzující dlaň",
    en: "Paralyzing Palm",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { strength: 8 },
    effect: {
      cs: "Útok beze zbraně na konkrétní místo zásahu: Omračující.",
      en: "Unarmed attack against a called hit location: gains Stun.",
    },
  },
  {
    key: "parmenparmenka",
    cs: "Pařmen/Pařmenka",
    en: "Party Boy/Party Girl",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { endurance: 6, charisma: 7 },
    effect: {
      cs: "Imunita vůči závislosti na alkoholu; každý alkohol +2 BZ.",
      en: "Immune to alcohol addiction; every drink also restores +2 HP.",
    },
  },
  {
    key: "pevnaruka",
    cs: "Pevná ruka",
    en: "Steady Aim",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { strength: 8, agility: 7 },
    effect: {
      cs: "Po Míření: buď 1. Útok opakuj 2k20, nebo všechny Útoky v tahu opakuj 1k20.",
      en: "After Aiming: either re-roll 2d20 on the first attack, or re-roll 1d20 on every attack that turn.",
    },
  },
  {
    key: "pistolnik",
    cs: "Pistolník",
    en: "Gunslinger",
    ranks: 2,
    level: 2,
    levelStep: 4,
    req: { agility: 7 },
    effect: {
      cs: "Jednoruční zbraň na dálku, RoF ≤2: +1 EF na d6 zranění/stupeň; opakuj hod na místo zásahu. Min. úroveň +4/stupeň.",
      en: "One-handed ranged weapon, RoF 2 or less: +1 CD damage per rank; re-roll the hit location. Min. level +4/rank.",
    },
  },
  {
    key: "platner",
    cs: "Platnéř",
    en: "Armorer",
    ranks: 4,
    level: 0,
    levelStep: 4,
    req: { strength: 5, intelligence: 6 },
    effect: {
      cs: "Zbroje: odemkne modifikace do stupně perku. Min. úroveň +4/stupeň.",
      en: "Armor: unlocks mods up to the perk's rank. Min. level +4/rank.",
    },
  },
  {
    key: "podomniprodavac",
    cs: "Podomní prodavač",
    en: "Junktown Vendor",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { charisma: 8 },
    effect: {
      cs: "CHA + Obchodování při nákupu/prodeji: obtížnost −1 (min. 0).",
      en: "CHA + Barter when buying/selling: difficulty -1 (min. 0).",
    },
  },
  {
    key: "pohyblivycil",
    cs: "Pohyblivý cíl",
    en: "Moving Target",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { agility: 6 },
    effect: {
      cs: "Po Sprintu +1 Ochrana do začátku příštího tahu.",
      en: "After a Sprint +1 Defense until the start of your next turn.",
    },
  },
  {
    key: "polykachadu",
    cs: "Polykač hadů",
    en: "Snakeater",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { endurance: 7 },
    effect: {
      cs: "Jedové OZ +2.",
      en: "Poison DR +2.",
    },
  },
  {
    key: "posukdozbrani",
    cs: "Pošuk do zbraní",
    en: "Gun Nut",
    ranks: 4,
    level: 2,
    levelStep: 4,
    req: { intelligence: 6 },
    effect: {
      cs: "Lehké/těžké zbraně: odemkne modifikace do stupně perku. Min. úroveň +4/stupeň.",
      en: "Small/big guns: unlocks mods up to the perk's rank. Min. level +4/rank.",
    },
  },
  {
    key: "pronikavyuder",
    cs: "Pronikavý úder",
    en: "Piercing Strike",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { strength: 7 },
    effect: {
      cs: "Beze zbraně + sečné chladné: Průbojný 1, nebo existující Průbojný X +1.",
      en: "Unarmed + bladed melee: gain Piercing 1, or existing Piercing X +1.",
    },
  },
  {
    key: "provizorniopravy",
    cs: "Provizorní opravy",
    en: "Jury Rigging",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: {},
    effect: {
      cs: "Oprav bez součástek; dočasně. Předmět se rozbije při příští komplikaci; rozsah komplikací při použití +1 (19–20).",
      en: "Repair without spare parts; temporary only. The item breaks on the next complication; its complication range while in use +1 (19-20).",
    },
  },
  {
    key: "pruvodce",
    cs: "Průvodce",
    en: "Pathfinder",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { perception: 6, endurance: 6 },
    effect: {
      cs: "Dlouhá cesta Pustinou: VNI + Přežití (obt. PH) → čas cesty ÷2.",
      en: "Long journey through the Wasteland: PER + Survival (difficulty set by the GM) -> travel time halved.",
    },
  },
  {
    key: "prvniliga",
    cs: "První liga",
    en: "Big Leagues",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { strength: 8 },
    effect: {
      cs: "Obouruční chladná zbraň: Zákeřný.",
      en: "Two-handed melee weapon: gains Vicious.",
    },
  },
  {
    key: "pritelzvirat",
    cs: "Přítel zvířat",
    en: "Animal Friend",
    ranks: 2,
    level: 1,
    levelStep: 5,
    req: { charisma: 6 },
    effect: {
      cs: "S1: napadne tě savec/ještěr/hmyz → 1 EF na d6; bez účinku nezaútočí na tebe. S2: velká akce, CHA + Přežití, obt. 2 → tvor tě brání (i mocný/legendární). Min. úroveň +5/stupeň.",
      en: "R1: a mammal/reptile/insect attacks you -> 1 CD; with no effect it will not attack you. R2: major action, CHA + Survival, diff. 2 -> the creature defends you (even a mighty/legendary one). Min. level +5/rank.",
    },
  },
  {
    key: "prizivnik",
    cs: "Příživník",
    en: "Scrounger",
    ranks: 3,
    level: 1,
    levelStep: 5,
    req: { luck: 6 },
    effect: {
      cs: "Loot munice: S1 +3 EF na d6, S2 +6 EF na d6, S3 +10 EF na d6 stejného typu; při více typech nejnižší vzácnost (shoda: PH). Min. úroveň +5/stupeň.",
      en: "Looting ammo: R1 +3 CD, R2 +6 CD, R3 +10 CD of the same type; with several types use the lowest rarity (ties: GM). Min. level +5/rank.",
    },
  },
  {
    key: "pyromaniak",
    cs: "Pyromaniak",
    en: "Pyromaniac",
    ranks: 3,
    level: 2,
    levelStep: 4,
    req: { endurance: 6 },
    effect: {
      cs: "Ohnivé zbraně: +1 EF na d6 zranění/stupeň. Min. úroveň +4/stupeň.",
      en: "Fire weapons: +1 CD damage per rank. Min. level +4/rank.",
    },
  },
  {
    key: "refraktor",
    cs: "Refraktor",
    en: "Refractor",
    ranks: 2,
    level: 1,
    levelStep: 4,
    req: { perception: 6, luck: 7 },
    effect: {
      cs: "Energetické OZ všech míst zásahu +1/stupeň. Min. úroveň +4/stupeň.",
      en: "Energy DR of every hit location +1 per rank. Min. level +4/rank.",
    },
  },
  {
    key: "roztaveni",
    cs: "Roztavení",
    en: "Meltdown",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { perception: 10 },
    effect: {
      cs: "Zabití energetickou zbraní → exploze. Hoď floor(Poškození/2) EF na d6; za každý účinek zasáhni 1 bytost v krátké vzdál. (od nejbližší) energetickým zraněním = součet EF na d6.",
      en: "A kill with an energy weapon -> explosion. Roll floor(damage/2) CD; for each effect hit 1 creature at close range (nearest first) for energy damage equal to the CD total.",
    },
  },
  {
    key: "rychleruce",
    cs: "Rychlé ruce",
    en: "Quick Hands",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { agility: 8 },
    effect: {
      cs: "Útok na dálku: 2 AB → RoF +2 pro tento Útok.",
      en: "Ranged attack: 2 AP -> RoF +2 for that attack.",
    },
  },
  {
    key: "rychletaseni",
    cs: "Rychlé tasení",
    en: "Quick Draw",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { agility: 6 },
    effect: {
      cs: "1× za tah Vytáhni zbraň/věc zdarma (bez malé akce).",
      en: "Once per turn Draw a weapon/item for free (no minor action).",
    },
  },
  {
    key: "rychlejsiuzdravovani",
    cs: "Rychlejší uzdravování",
    en: "Faster Healing",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { endurance: 6 },
    noRobot: true,
    effect: {
      cs: "ODO + Přežití na zotavení z úrazu: 1. dodatečný k20 zdarma; limit 5k20.",
      en: "END + Survival to recover from an injury: first extra d20 free; limit 5d20.",
    },
  },
  {
    key: "rychlymetabolismus",
    cs: "Rychlý metabolismus",
    en: "Fast Metabolism",
    ranks: 3,
    level: 1,
    levelStep: 3,
    req: { endurance: 6 },
    noRobot: true,
    effect: {
      cs: "Léčení BZ mimo odpočinek: +1 BZ/stupeň. Min. úroveň +3/stupeň.",
      en: "Healing HP outside of rest: +1 HP per rank. Min. level +3/rank.",
    },
  },
  {
    key: "radenismrtky",
    cs: "Řádění smrtky",
    en: "Grim Reaper's Sprint",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { luck: 8 },
    effect: {
      cs: "Útok zabije ≥1 nepřítele: 1 EF na d6; účinek → skupina +2 AB.",
      en: "An attack kills 1+ enemy: roll 1 CD; on an effect -> the party gains +2 AP.",
    },
  },
  {
    key: "sberaczatek",
    cs: "Sběrač zátek",
    en: "Cap Collector",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { charisma: 5 },
    effect: {
      cs: "Nákup/prodej: cenu zboží změň o 10 % ve svůj prospěch.",
      en: "Buying/selling: shift the price of goods by 10 % in your favor.",
    },
  },
  {
    key: "slunickovyclovek",
    cs: "Sluníčkový člověk",
    en: "Solar Powered",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { endurance: 7 },
    effect: {
      cs: "Přímé slunce: vyléč 1 rad. zranění/hodinu.",
      en: "Direct sunlight: heal 1 rad injury per hour.",
    },
  },
  {
    key: "smazka",
    cs: "Smažka",
    en: "Chem Resistant",
    ranks: 2,
    level: 1,
    levelStep: 4,
    req: { endurance: 7 },
    effect: {
      cs: "S1: test závislosti na chemikáliích −1 EF na d6 (min. 0). S2: imunita vůči závislosti. Min. úroveň +4/stupeň.",
      en: "R1: chem addiction test -1 CD (min. 0). R2: immune to addiction. Min. level +4/rank.",
    },
  },
  {
    key: "soustredenapalba",
    cs: "Soustředěná palba",
    en: "Concentrated Fire",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { perception: 8, agility: 6 },
    effect: {
      cs: "Útok na dálku s municí na +zranění: opakuj až 3 EF na d6 zranění.",
      en: "Ranged attack with ammo that adds damage: re-roll up to 3 CD of damage.",
    },
  },
  {
    key: "stehovak",
    cs: "Stěhovák",
    en: "Strong Back",
    ranks: 3,
    level: 1,
    levelStep: 2,
    req: { strength: 5 },
    effect: {
      cs: "Max. zátěž +12,5 kg/stupeň. Min. úroveň +2/stupeň.",
      en: "Max. carry weight +12.5 kg per rank. Min. level +2/rank.",
    },
  },
  {
    key: "strelec",
    cs: "Střelec",
    en: "Rifleman",
    ranks: 2,
    level: 2,
    levelStep: 4,
    req: { agility: 7 },
    effect: {
      cs: "Obouruční zbraň na dálku, RoF ≤2, ne těžká: +1 EF na d6 zranění/stupeň. S2 navíc Průbojný 1 / Průbojný X +1. Min. úroveň +4/stupeň.",
      en: "Two-handed ranged weapon, RoF 2 or less, not heavy: +1 CD damage per rank. R2 also Piercing 1 / Piercing X +1. Min. level +4/rank.",
    },
  },
  {
    key: "sikovnost",
    cs: "Šikovnost",
    en: "Finesse",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { agility: 9 },
    effect: {
      cs: "1× za boj opakuj všechny EF na d6 jednoho hodu na zranění zdarma.",
      en: "Once per combat re-roll all CD of one damage roll for free.",
    },
  },
  {
    key: "srotak",
    cs: "Šroťák",
    en: "Scrapper",
    ranks: 2,
    level: 3,
    levelStep: 5,
    req: {},
    effect: {
      cs: "S1: recyklace dává i neobvyklé materiály/komponenty. S2: i vzácné. Min. úroveň +5/stupeň.",
      en: "R1: scrapping also yields uncommon materials/components. R2: rare ones too. Min. level +5/rank.",
    },
  },
  {
    key: "tajemnycizinec",
    cs: "Tajemný cizinec",
    en: "Mysterious Stranger",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { luck: 7 },
    effect: {
      cs: "Začátek boje: utratíš 1 Bod štěstí; PH může vyvolat Cizince k 1 Útoku na dálku proti tvému útočníkovi/cíli; pokud nepřijde, bod se vrátí. Cizinec: HBI 10, Lehké zbraně 6 + talent, hází 3k20, .44 Magnum 8 EF na d6, Průbojný 1, Zákeřný.",
      en: "Start of combat: spend 1 Luck point; the GM may summon the Stranger for 1 ranged attack against your attacker/target; if he does not show up, the point is refunded. Stranger: AGI 10, Small Guns 6 + tag, rolls 3d20, .44 Magnum 8 CD, Piercing 1, Vicious.",
    },
  },
  {
    key: "talent",
    cs: "Talent!",
    en: "Tag!",
    ranks: 1,
    level: 5,
    levelStep: 0,
    req: {},
    effect: {
      cs: "Přidej talent k 1 dovednosti: +2 (max. 6); její k20 ≤ hodnota dovednosti = krit. úspěch.",
      en: "Add a tag to 1 skill: +2 (max. 6); a d20 <= that skill value counts as a crit success.",
    },
  },
  {
    key: "tuhykorinek",
    cs: "Tuhý kořínek",
    en: "Lifegiver",
    ranks: 5,
    level: 5,
    levelStep: 5,
    req: {},
    effect: {
      cs: "Max. BZ +ODO/stupeň. Min. úroveň +5/stupeň.",
      en: "Max. HP +END per rank. Min. level +5/rank.",
    },
  },
  {
    key: "tvrdak",
    cs: "Tvrďák",
    en: "Toughness",
    ranks: 2,
    level: 1,
    levelStep: 4,
    req: { endurance: 6, luck: 6 },
    effect: {
      cs: "Fyzické OZ všech míst zásahu +1/stupeň. Min. úroveň +4/stupeň.",
      en: "Physical DR of every hit location +1 per rank. Min. level +4/rank.",
    },
  },
  {
    key: "veda",
    cs: "Věda!",
    en: "Science!",
    ranks: 3,
    level: 2,
    levelStep: 4,
    req: { intelligence: 6 },
    effect: {
      cs: "Energetické zbraně + některé pokročilé zbroje: odemkne modifikace do stupně perku. Min. úroveň +4/stupeň.",
      en: "Energy weapons + some advanced armor: unlocks mods up to the perk's rank. Min. level +4/rank.",
    },
  },
  {
    key: "vlacekbolesti",
    cs: "Vláček bolesti",
    en: "Pain Train",
    ranks: 2,
    level: 1,
    levelStep: 5,
    req: { strength: 9, endurance: 7 },
    effect: {
      cs: "Jen energozbroj/supermutant: velká pohybová akce Zteč na cíl ve střední (1 zóna); v tahu nelze Přesun/Sprint. SIL + Atletika, obt. 2 → zranění jako beze zbraně + Ležící. S2: +1 EF na d6, Omračující. Velké/odolné cíle dle PH nemusí spadnout. Min. úroveň +5/stupeň.",
      en: "Power armor/super mutant only: major movement action Charge at a target at medium range (1 zone); no Move/Sprint that turn. STR + Athletics, diff. 2 -> unarmed damage + Prone. R2: +1 CD, Stun. Large/sturdy targets may not fall, at the GM's discretion. Min. level +5/rank.",
    },
  },
  {
    key: "vodnichlapecdivka",
    cs: "Vodní chlapec/dívka",
    en: "Aquaboy/Aquagirl",
    ranks: 2,
    level: 1,
    levelStep: 3,
    req: { endurance: 5 },
    effect: {
      cs: "S1: plavání v rad. vodě bez rad. zranění; zadržení dechu 2×. S2: pod vodou obtížnost odhalení +2. Min. úroveň +3/stupeň.",
      en: "R1: swim in irradiated water with no rad injury; hold your breath twice as long. R2: underwater the difficulty to detect you +2. Min. level +3/rank.",
    },
  },
  {
    key: "vrhac",
    cs: "Vrhač",
    en: "Heave Ho!",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { strength: 8 },
    effect: {
      cs: "Vrhací zbraň: 1 AB → dosah +1 zóna (krátká→střední→dlouhá).",
      en: "Thrown weapon: 1 AP -> range +1 zone (close->medium->long).",
    },
  },
  {
    key: "vsimavost",
    cs: "Všímavost",
    en: "Awareness",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { perception: 7 },
    effect: {
      cs: "Míření na cíl v krátké: příští Útok proti němu Průbojný 1 / Průbojný X +1.",
      en: "Aiming at a target at close range: your next attack against it gains Piercing 1 / Piercing X +1.",
    },
  },
  {
    key: "vytribenycuch",
    cs: "Vytříbený čuch",
    en: "Can Do!",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { luck: 5 },
    effect: {
      cs: "Loot jídla: +1 náhodná potravina bez AB.",
      en: "Looting food: +1 random ration without spending AP.",
    },
  },
  {
    key: "zabijak",
    cs: "Zabiják",
    en: "Slayer",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { strength: 8 },
    effect: {
      cs: "Po zranění beze zbraně/chladnou: 1 Bod štěstí → krit. zásah + úraz v místě zásahu.",
      en: "After damaging with unarmed/melee: 1 Luck point -> crit hit + injury to that hit location.",
    },
  },
  {
    key: "zarnypriklad",
    cs: "Zářný příklad",
    en: "Inspirational",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { charisma: 8 },
    effect: {
      cs: "Max. skupinové AB +1.",
      en: "Max. party AP +1.",
    },
  },
  {
    key: "zasahdoprostred",
    cs: "Zásah doprostřed",
    en: "Center of Mass",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { agility: 7 },
    effect: {
      cs: "Útok na dálku: zvol trup bez zvýšení obtížnosti; opakuj 1k20.",
      en: "Ranged attack: choose the torso without raising the difficulty; re-roll 1d20.",
    },
  },
  {
    key: "zkusenyzkusena",
    cs: "Zkušený/zkušená",
    en: "Skilled",
    ranks: 10,
    level: 3,
    levelStep: 3,
    req: {},
    effect: {
      cs: "Buď 2 dovednosti +1, nebo 1 dovednost +2; max. 6. Min. úroveň +3/stupeň.",
      en: "Either 2 skills +1, or 1 skill +2; max. 6. Min. level +3/rank.",
    },
  },
  {
    key: "zlatokop",
    cs: "Zlatokop",
    en: "Fortune Finder",
    ranks: 3,
    level: 2,
    levelStep: 4,
    req: { luck: 5 },
    effect: {
      cs: "Loot zátek: S1 +3 EF na d6, S2 +6 EF na d6, S3 +10 EF na d6. Min. úroveň +4/stupeň.",
      en: "Looting caps: R1 +3 CD, R2 +6 CD, R3 +10 CD. Min. level +4/rank.",
    },
  },
  {
    key: "zlodejskymistr",
    cs: "Zlodějský mistr",
    en: "Master Thief",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { perception: 8, agility: 9 },
    effect: {
      cs: "Při odemykání/kapsářství: obtížnost soupeřova odhalení +1.",
      en: "When lockpicking/pickpocketing: the difficulty for others to spot you +1.",
    },
  },
  {
    key: "zurivost",
    cs: "Zuřivost",
    en: "Nerd Rage!",
    ranks: 3,
    level: 2,
    levelStep: 5,
    req: { intelligence: 8 },
    effect: {
      cs: "Při BZ < ¼ max.: fyz. i energ. OZ +stupeň; všechny Útoky +stupeň EF na d6 zranění. Min. úroveň +5/stupeň.",
      en: "While HP is below 1/4 max.: physical and energy DR +rank; every attack +rank CD damage. Min. level +5/rank.",
    },
  },
  {
    key: "zeleznapest",
    cs: "Železná pěst",
    en: "Iron Fist",
    ranks: 2,
    level: 1,
    levelStep: 5,
    req: { strength: 6 },
    effect: {
      cs: "S1: Útoky beze zbraně +1 EF na d6 zranění. S2: navíc Zákeřný. Min. úroveň +5/stupeň.",
      en: "R1: unarmed attacks +1 CD damage. R2: also Vicious. Min. level +5/rank.",
    },
  },
  {
    key: "zeryk",
    cs: "Žeryk",
    en: "Dogmeat",
    ranks: 1,
    level: 0,
    levelStep: 0,
    req: { charisma: 5 },
    effect: {
      cs: "Získáš psa jako spřátelenou NPC pod svým velením; sám si shání potravu/vodu. Po smrti lze před dalším dobrodružstvím získat nového, nebo na konci dobrodružství perk vyměnit.",
      en: "You gain a dog as a friendly NPC under your command; it forages its own food/water. If it dies you may get a new one before the next adventure, or swap the perk out at the end of an adventure.",
    },
  },
];

// Název pro databázi i pro kartu: český a v závorce anglický, jak je v tabulce.
export function perkFullName(p) {
  return p?.en ? `${p.cs} (${p.en})` : p?.cs || "";
}

// Porovnávání názvů: bez diakritiky, bez interpunkce a bez mezer, aby
// „Vodní chlapec/dívka" sedlo i na „Vodni chlapec divka".
const slug = (v) =>
  String(v ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "");

const BY_KEY = new Map(PERK_CATALOG.map((p) => [p.key, p]));
const BY_SLUG = new Map();
for (const p of PERK_CATALOG) {
  BY_SLUG.set(slug(perkFullName(p)), p);
  if (!BY_SLUG.has(slug(p.cs))) BY_SLUG.set(slug(p.cs), p);
  if (p.en && !BY_SLUG.has(slug(p.en))) BY_SLUG.set(slug(p.en), p);
}

export function perkByKey(key) {
  return BY_KEY.get(key) || null;
}

// Řádek šablony ani perku na kartě nemusí mít `perkKey` — starší data i ruční
// zápisy ho nemají, tak ho zkus dohledat podle názvu (celého, samotné české
// části i toho, co je v závorce).
export function resolvePerk(row) {
  if (!row) return null;
  if (row.perkKey && BY_KEY.has(row.perkKey)) return BY_KEY.get(row.perkKey);
  const name = row.name || "";
  if (!name) return null;
  const inParens = (name.match(/\(([^)]*)\)/) || [])[1] || "";
  return (
    BY_SLUG.get(slug(name)) ||
    BY_SLUG.get(slug(name.replace(/\([^)]*\)/g, ""))) ||
    BY_SLUG.get(slug(inParens)) ||
    null
  );
}

// Stabilní identita perku napříč kartou a šablonami — podle ní se pozná,
// co už postava vlastní. Mimo katalog padá zpátky na název.
export function perkIdOf(row) {
  const p = resolvePerk(row);
  if (p) return p.key;
  return slug(row?.name || "");
}

// Požadavky řádku: co je uložené v dokumentu má přednost, katalog doplní
// zbytek (a pokryje starší šablony uložené ještě bez požadavků).
export function perkRules(row) {
  const p = resolvePerk(row);
  const attrs = {};
  const src = row?.reqAttrs && typeof row.reqAttrs === "object" ? row.reqAttrs : p?.req;
  for (const key of PERK_REQ_ATTRS) {
    const n = parseInt(src?.[key], 10);
    if (n > 0) attrs[key] = n;
  }
  const num = (v, fallback) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : fallback;
  };
  return {
    attrs,
    ranks: Math.max(1, num(row?.ranks, p?.ranks ?? 1)),
    level: Math.max(0, num(row?.reqLevel, p?.level ?? 0)),
    levelStep: Math.max(0, num(row?.levelStep, p?.levelStep ?? 0)),
    noRobot: row?.noRobot === undefined ? !!p?.noRobot : !!row.noRobot,
    excludes: Array.isArray(row?.excludes) ? row.excludes : p?.excludes || [],
  };
}

// Dokument šablony do Firestore. `rank` je stupeň, se kterým perk přistane
// na kartě, zbytek jsou podmínky pro filtrování.
export function perkTemplateDoc(p, lang) {
  return {
    name: perkFullName(p),
    rank: "1",
    effect: lang === "en" ? p.effect.en : p.effect.cs,
    perkKey: p.key,
    ranks: p.ranks,
    reqLevel: p.level,
    levelStep: p.levelStep,
    reqAttrs: { ...p.req },
    noRobot: !!p.noRobot,
    excludes: [...(p.excludes || [])],
  };
}
