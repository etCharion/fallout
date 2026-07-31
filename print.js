// print.js — A4 tiskové archy (karta postavy / prázdný formulář).
// Design převzat 1:1 z Claude Design handoffu „Fallout Pipboy redesign".
// Tiskne se přes skrytý iframe, takže styly aplikace zůstávají nedotčené.

const T = {
  cs: {
    docChar: "Pip-Boy — Karta postavy",
    docBlank: "Pip-Boy — Prázdný formulář",
    subtitle: "RPG Hra // Karta postavy",
    survivor: "Záznam přeživšího",
    name: "Jméno postavy",
    origin: "Původ",
    level: "Úroveň",
    xp: "Získané ZK",
    xpNext: "ZK na další úr",
    hp: "Zdraví (HP)",
    status: "Stav",
    skills: "Dovednosti",
    trained: "vycvičená",
    hitLoc: "Zásahové zóny",
    weapons: "Zbraně",
    inventory: "Vybavení",
    perks: "Perky a rysy",
    notesHist: "Poznámky a historie",
    dObrana: "Obrana",
    dInit: "Iniciativa",
    dMelee: "Pošk. nablízko",
    dLuck: "Body štěstí",
    dPoison: "Jedové OZ",
    caps: "Zátky",
    rads: "Radiace",
    carry: "Nosnost",
    carryOver: "Přetíženo",
    zone: "Zóna",
    roll: "Hod",
    equipped: "nasazeno",
    rank: "St.",
    fillHint: "Vyplň hodnoty",
    perkHint: "název · účinek",
    stable: "Stabilní",
    critical: "Kritický",
    wName: "Název",
    wSkill: "Dovednost",
    wTn: "CČ",
    wDmg: "Pošk.",
    wEff: "Účinky",
    wAmmo: "Munice",
    wWt: "Váha",
    iItem: "Předmět",
    iType: "Typ",
    iQty: "Ks",
    photo: "FOTO /<br>INICIÁLY",
    gearTitle: "VYBAVENÍ · ZÁZNAMY",
    blankTag: "PRÁZDNÝ FORMULÁŘ",
    locLegend:
      "FYZ · fyzická / EN · energetická / RAD · radiační — odolnost (OZ) / ZR · počet zranění",
  },
  en: {
    docChar: "Pip-Boy — Character sheet",
    docBlank: "Pip-Boy — Blank form",
    subtitle: "RPG Game // Character sheet",
    survivor: "Survivor record",
    name: "Character name",
    origin: "Origin",
    level: "Level",
    xp: "Earned XP",
    xpNext: "Next lv XP",
    hp: "Health (HP)",
    status: "Status",
    skills: "Skills",
    trained: "trained",
    hitLoc: "Hit locations",
    weapons: "Weapons",
    inventory: "Equipment",
    perks: "Perks & traits",
    notesHist: "Notes & history",
    dObrana: "Defense",
    dInit: "Initiative",
    dMelee: "Melee dmg",
    dLuck: "Luck points",
    dPoison: "Poison DR",
    caps: "Caps",
    rads: "Radiation",
    carry: "Carry",
    carryOver: "Over-encumbered",
    zone: "Zone",
    roll: "Roll",
    equipped: "equipped",
    rank: "Rk.",
    fillHint: "Fill in values",
    perkHint: "name · effect",
    stable: "Stable",
    critical: "Critical",
    wName: "Name",
    wSkill: "Skill",
    wTn: "TN",
    wDmg: "Dmg",
    wEff: "Effects",
    wAmmo: "Ammo",
    wWt: "Wt",
    iItem: "Item",
    iType: "Type",
    iQty: "Qty",
    photo: "PHOTO /<br>INITIALS",
    gearTitle: "EQUIPMENT · RECORDS",
    blankTag: "BLANK FORM",
    locLegend:
      "FYZ · physical / EN · energy / RAD · radiation — resistance (DR) / ZR · injury count",
  },
};

const SPECIAL_DEFS = [
  { field: "strength", cs: ["SIL", "Síla"], en: ["STR", "Strength"] },
  { field: "perception", cs: ["VNI", "Vnímání"], en: ["PER", "Perception"] },
  { field: "endurance", cs: ["ODO", "Odolnost"], en: ["END", "Endurance"] },
  { field: "charisma", cs: ["CHA", "Charisma"], en: ["CHA", "Charisma"] },
  { field: "intelligence", cs: ["INT", "Inteligence"], en: ["INT", "Intelligence"] },
  { field: "agility", cs: ["HBI", "Hbitost"], en: ["AGI", "Agility"] },
  { field: "luck", cs: ["STE", "Štěstí"], en: ["LCK", "Luck"] },
];

const SKILL_DEFS = [
  { key: "athletics", cs: ["Atletika", "SIL"], en: ["Athletics", "STR"] },
  { key: "unarmed", cs: ["Boj beze zbraně", "SIL"], en: ["Unarmed", "STR"] },
  { key: "energyWeapons", cs: ["Energetické zbraně", "VNI"], en: ["Energy Weapons", "PER"] },
  { key: "meleeWeapons", cs: ["Chladné zbraně", "SIL"], en: ["Melee Weapons", "STR"] },
  { key: "medicine", cs: ["Léčení", "INT"], en: ["Medicine", "INT"] },
  { key: "smallGuns", cs: ["Lehké zbraně", "HBI"], en: ["Small Guns", "AGI"] },
  { key: "barter", cs: ["Obchodování", "CHA"], en: ["Barter", "CHA"] },
  { key: "repair", cs: ["Opravování", "INT"], en: ["Repair", "INT"] },
  { key: "lockpick", cs: ["Otevírání zámků", "VNI"], en: ["Lockpick", "PER"] },
  { key: "pilot", cs: ["Pilotování", "VNI"], en: ["Pilot", "PER"] },
  { key: "sneak", cs: ["Plížení", "HBI"], en: ["Sneak", "AGI"] },
  { key: "survival", cs: ["Přežití", "ODO"], en: ["Survival", "END"] },
  { key: "speech", cs: ["Řečnictví", "CHA"], en: ["Speech", "CHA"] },
  { key: "bigGuns", cs: ["Těžké zbraně", "ODO"], en: ["Big Guns", "END"] },
  { key: "science", cs: ["Věda", "INT"], en: ["Science", "INT"] },
  { key: "throwing", cs: ["Vrhání", "HBI"], en: ["Throwing", "AGI"] },
  { key: "explosives", cs: ["Výbušniny", "VNI"], en: ["Explosives", "PER"] },
];

const LOC_DEFS = [
  { field: "resHead", roll: "1-2", cs: "Hlava", en: "Head" },
  { field: "resTorso", roll: "3-8", cs: "Trup", en: "Torso" },
  { field: "resLArm", roll: "9-11", cs: "Levá ruka", en: "Left arm" },
  { field: "resRArm", roll: "12-14", cs: "Pravá ruka", en: "Right arm" },
  { field: "resLLeg", roll: "15-17", cs: "Levá noha", en: "Left leg" },
  { field: "resRLeg", roll: "18-20", cs: "Pravá noha", en: "Right leg" },
];

function esc(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Váhy v příručce jsou psané „< 0,5" i „3,5".
function pWeight(v) {
  const m = String(v ?? "")
    .replace(",", ".")
    .match(/\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
}

function fWeight(n, lang) {
  const r = Math.round(n * 10) / 10;
  const s = Number.isInteger(r) ? String(r) : r.toFixed(1);
  return lang === "en" ? s : s.replace(".", ",");
}

function initials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function localizedSkills(lang) {
  const L = lang === "en" ? "en" : "cs";
  return SKILL_DEFS.map((s) => ({ key: s.key, name: s[L][0], attr: s[L][1] }))
    .sort((a, b) => a.name.localeCompare(b.name, L));
}

// ---------- sdílené kusy archu ----------

const brackets = `
<div>
  <div style="position:absolute;top:6mm;left:6mm;width:9mm;height:9mm;border-left:1.5px solid var(--line2);border-top:1.5px solid var(--line2);"></div>
  <div style="position:absolute;top:6mm;right:6mm;width:9mm;height:9mm;border-right:1.5px solid var(--line2);border-top:1.5px solid var(--line2);"></div>
  <div style="position:absolute;bottom:6mm;left:6mm;width:9mm;height:9mm;border-left:1.5px solid var(--line2);border-bottom:1.5px solid var(--line2);"></div>
  <div style="position:absolute;bottom:6mm;right:6mm;width:9mm;height:9mm;border-right:1.5px solid var(--line2);border-bottom:1.5px solid var(--line2);"></div>
</div>`;

function masthead(t) {
  return `
<div style="display:flex;align-items:flex-end;gap:12px;border-bottom:2px solid var(--ink);padding-bottom:6px;">
  <span style="width:9px;height:9px;border-radius:50%;background:var(--ink);display:inline-block;margin-bottom:5px;"></span>
  <span style="font-family:'VT323',monospace;font-size:30px;letter-spacing:.14em;color:var(--ink);line-height:.9;">PIP-BOY 2000 MK VI</span>
  <span style="font-size:9px;letter-spacing:.22em;color:var(--dim);text-transform:uppercase;margin-bottom:3px;">RobCo Industries</span>
  <span style="margin-left:auto;font-size:9px;letter-spacing:.22em;color:var(--dim);text-transform:uppercase;margin-bottom:3px;">${t.subtitle}</span>
</div>`;
}

function panelHead(title, note, pad) {
  return `
<div style="display:flex;align-items:center;gap:8px;padding:${pad || "4px 10px"};border-bottom:1px solid var(--line2);background:var(--head);">
  <span style="color:var(--ink2);">▸</span>
  <span style="font-family:'VT323',monospace;font-size:16px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink);">${title}</span>
  ${note ? `<span style="margin-left:auto;font-size:8px;letter-spacing:.08em;color:var(--dim);text-transform:uppercase;">${note}</span>` : ""}
</div>`;
}

function footer(tag, page) {
  return `
<div style="margin-top:auto;display:flex;align-items:center;gap:8px;padding-top:6px;border-top:1px solid var(--line);font-size:8px;letter-spacing:.14em;color:var(--dim);text-transform:uppercase;">
  <span>RobCo Industries · Pip-Boy 2000 Mk VI</span>
  <span style="margin-left:auto;">${tag}</span>
  <span>· ${page}</span>
</div>`;
}

const SHEET_OPEN =
  '<div class="pb-sheet" style="position:relative;width:210mm;min-height:297mm;background:var(--paper);color:var(--ink);padding:13mm 12mm;display:flex;flex-direction:column;gap:9px;">';

function locHeaderRow(t) {
  return `
<span style="padding:3px 6px;background:var(--head);color:var(--dim);letter-spacing:.06em;text-transform:uppercase;border-bottom:1px solid var(--line2);">${t.zone}</span>
<span style="padding:3px 4px;background:var(--head);color:var(--dim);text-align:center;border-bottom:1px solid var(--line2);">${t.roll}</span>
<span style="padding:3px 2px;background:var(--head);color:var(--dim);text-align:center;border-bottom:1px solid var(--line2);">FYZ</span>
<span style="padding:3px 2px;background:var(--head);color:var(--dim);text-align:center;border-bottom:1px solid var(--line2);">EN</span>
<span style="padding:3px 2px;background:var(--head);color:var(--dim);text-align:center;border-bottom:1px solid var(--line2);">RAD</span>
<span style="padding:3px 2px;background:var(--head);color:var(--dim);text-align:center;border-bottom:1px solid var(--line2);">ZR</span>`;
}

function weaponHeaderRow(t) {
  return `
<span style="padding:3px 4px;background:var(--head);color:var(--dim);text-align:center;border-bottom:1px solid var(--line2);"> </span>
<span style="padding:3px 6px;background:var(--head);color:var(--dim);text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid var(--line2);">${t.wName}</span>
<span style="padding:3px 6px;background:var(--head);color:var(--dim);text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid var(--line2);">${t.wSkill}</span>
<span style="padding:3px 2px;background:var(--head);color:var(--dim);text-align:center;border-bottom:1px solid var(--line2);">${t.wTn}</span>
<span style="padding:3px 2px;background:var(--head);color:var(--dim);text-align:center;border-bottom:1px solid var(--line2);">${t.wDmg}</span>
<span style="padding:3px 6px;background:var(--head);color:var(--dim);text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid var(--line2);">${t.wEff}</span>
<span style="padding:3px 6px;background:var(--head);color:var(--dim);text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid var(--line2);">${t.wAmmo}</span>
<span style="padding:3px 2px;background:var(--head);color:var(--dim);text-align:center;border-bottom:1px solid var(--line2);">${t.wWt}</span>`;
}

function invHeaderRow(t) {
  return `
<span style="padding:3px 6px;background:var(--head);color:var(--dim);text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid var(--line2);">${t.iItem}</span>
<span style="padding:3px 6px;background:var(--head);color:var(--dim);text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid var(--line2);">${t.iType}</span>
<span style="padding:3px 2px;background:var(--head);color:var(--dim);text-align:center;border-bottom:1px solid var(--line2);">${t.wWt}</span>
<span style="padding:3px 2px;background:var(--head);color:var(--dim);text-align:center;border-bottom:1px solid var(--line2);">${t.iQty}</span>`;
}

function docWrap(title, body) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=VT323&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  html,body{margin:0;padding:0;background:#fff;}
  *{box-sizing:border-box;}
  @page{ size:A4; margin:0; }
  .pb-sheet{page-break-after:always;break-after:page;}
  .pb-sheet:last-child{page-break-after:auto;break-after:auto;}
</style>
</head>
<body>
<div style="background:#fff;display:flex;flex-direction:column;align-items:center;font-family:'IBM Plex Mono',monospace;--ink:#161616;--ink2:#3d3d3d;--dim:#767676;--line:#c8c8c8;--line2:#8f8f8f;--hair:#e4e4e4;--fill:#f5f5f5;--head:#eaeaea;--paper:#ffffff;">
${body}
</div>
</body>
</html>`;
}

// ---------- vyplněná karta postavy ----------

export function buildCharacterSheetHTML(c, lang, typeLabel, ammoTypeLabel) {
  const t = T[lang === "en" ? "en" : "cs"];
  const label = typeLabel || ((key) => key || "");
  const ammoLabel = ammoTypeLabel || ((key) => key || "");

  // Radiace ukrajuje z maxima HP — na archu se šrafuje odečtená část pruhu.
  const hpMax = Math.max(0, parseInt(c.hpMax, 10) || 0);
  const rads = Math.max(0, parseInt(c.rads, 10) || 0);
  const hpEffMax = Math.max(0, hpMax - rads);
  const hpCur = Math.min(Math.max(0, parseInt(c.hpCurrent, 10) || 0), hpEffMax);
  const segCount = Math.min(hpMax, 20);
  const radFrom = Math.min(hpEffMax, segCount);
  const hpSegs = Array.from({ length: segCount }, (_, i) => {
    const fill =
      i >= radFrom
        ? "repeating-linear-gradient(-45deg,var(--line2) 0,var(--line2) 1.5px,transparent 1.5px,transparent 3.5px)"
        : i < hpCur
          ? "var(--ink2)"
          : "transparent";
    return `<span style="flex:1;height:9px;border:1px solid var(--line2);background:${fill};"></span>`;
  }).join("");
  const hpStatus =
    rads > 0
      ? `${t.rads} ${rads} → ${hpEffMax}`
      : (hpEffMax ? hpCur / hpEffMax : 0) < 0.34
        ? t.critical
        : t.stable;

  const carryLoad =
    (c.weapons || []).reduce((s2, w) => s2 + pWeight(w.weight), 0) +
    (c.inventory || []).reduce(
      (s2, it) =>
        s2 + pWeight(it.weight) * Math.max(0, parseInt(it.quantity, 10) || 0),
      0,
    );
  const carryMax = 150 + 10 * Math.max(0, parseInt(c.strength, 10) || 0);
  const carryNote = `${t.carry} ${fWeight(carryLoad, lang)} / ${carryMax}${
    carryLoad > carryMax ? " · " + t.carryOver : ""
  }`;

  const photo = c.imageUrl
    ? `<img src="${esc(c.imageUrl)}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1);">`
    : `<span style="position:relative;font-family:'VT323',monospace;font-size:52px;line-height:.8;color:var(--ink);">${esc(initials(c.name))}</span>
       <span style="position:relative;font-size:8px;letter-spacing:.12em;color:var(--dim);text-transform:uppercase;margin-top:5px;text-align:center;">${esc(c.origin)}</span>`;

  const special = SPECIAL_DEFS.map((sp) => {
    const [code, name] = lang === "en" ? sp.en : sp.cs;
    return `
<div style="border:1px solid var(--line);border-radius:5px;background:var(--fill);padding:6px 2px 5px;display:flex;flex-direction:column;align-items:center;gap:1px;">
  <span style="font-family:'VT323',monospace;font-size:30px;line-height:.8;color:var(--ink);">${esc(c[sp.field])}</span>
  <span style="font-family:'VT323',monospace;font-size:15px;letter-spacing:.06em;color:var(--ink2);">${code}</span>
  <span style="font-size:7.5px;letter-spacing:.02em;color:var(--dim);text-transform:uppercase;text-align:center;">${name}</span>
</div>`;
  }).join("");

  const derived = [
    { label: t.dObrana, val: c.defense },
    { label: t.dInit, val: c.initiative },
    { label: t.dMelee, val: c.meleeDamage },
    { label: t.dLuck, val: c.luckPoints },
    { label: t.dPoison, val: c.poisonRes },
    { label: t.caps, val: c.caps },
  ]
    .map(
      (d) => `
<div style="border:1px solid var(--line2);border-radius:5px;background:var(--paper);padding:5px 4px;display:flex;flex-direction:column;align-items:center;gap:1px;">
  <span style="font-family:'VT323',monospace;font-size:24px;line-height:.85;color:var(--ink);">${esc(d.val)}</span>
  <span style="font-size:7.5px;letter-spacing:.06em;color:var(--dim);text-transform:uppercase;text-align:center;">${d.label}</span>
</div>`,
    )
    .join("");

  const skills = localizedSkills(lang)
    .map((sk) => {
      const tagged = !!(c.skills || {})[sk.key];
      const val = (c.skills || {})[sk.key + "Val"] ?? "0";
      return `
<div style="display:flex;align-items:center;gap:6px;padding:3px 8px;border-bottom:1px dashed var(--line);border-right:1px dashed var(--line);">
  <span style="font-size:11px;color:var(--ink);width:11px;text-align:center;">${tagged ? "■" : "□"}</span>
  <span style="flex:1;font-size:10.5px;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(sk.name)}</span>
  <span style="font-size:8px;color:var(--dim);letter-spacing:.04em;">${sk.attr}</span>
  <span style="font-family:'VT323',monospace;font-size:16px;color:var(--ink);min-width:16px;text-align:center;border:1px solid var(--line);border-radius:3px;line-height:1;padding:0 2px;">${esc(val)}</span>
</div>`;
    })
    .join("");

  const locs = LOC_DEFS.map((ld) => {
    const o = c[ld.field] || {};
    const rowBg = o.injured ? "var(--hair)" : "transparent";
    const mark = o.injured ? "✖" : "";
    const name = lang === "en" ? ld.en : ld.cs;
    const cell = (v) =>
      `<span style="padding:4px 2px;color:var(--ink);text-align:center;border-bottom:1px solid var(--line);background:${rowBg};font-family:'VT323',monospace;font-size:14px;">${esc(v)}</span>`;
    return `
<div style="display:contents;">
  <span style="padding:4px 6px;color:var(--ink);border-bottom:1px solid var(--line);background:${rowBg};display:flex;align-items:center;gap:4px;"><span style="font-size:9px;color:var(--ink2);">${mark}</span>${name}</span>
  <span style="padding:4px;color:var(--ink2);text-align:center;border-bottom:1px solid var(--line);background:${rowBg};font-family:'VT323',monospace;font-size:13px;">${ld.roll}</span>
  ${cell(o.phys)}${cell(o.en)}${cell(o.rad)}${cell(o.inj)}
</div>`;
  }).join("");

  const weapons = (c.weapons || [])
    .map(
      (w) => `
<div style="display:contents;">
  <span style="padding:4px 2px;text-align:center;color:var(--ink2);border-bottom:1px solid var(--line);">${w.assigned ? "●" : "○"}</span>
  <span style="padding:4px 6px;color:var(--ink);border-bottom:1px solid var(--line);">${esc(w.name)}</span>
  <span style="padding:4px 6px;color:var(--ink2);border-bottom:1px solid var(--line);">${esc(w.skill)}</span>
  <span style="padding:4px 2px;text-align:center;color:var(--ink);border-bottom:1px solid var(--line);font-family:'VT323',monospace;font-size:14px;">${esc(w.targetNum)}</span>
  <span style="padding:4px 2px;text-align:center;color:var(--ink);border-bottom:1px solid var(--line);font-family:'VT323',monospace;font-size:14px;">${esc(w.damage)}</span>
  <span style="padding:4px 6px;color:var(--ink2);border-bottom:1px solid var(--line);">${esc(w.effects)}</span>
  <span style="padding:4px 6px;color:var(--ink2);border-bottom:1px solid var(--line);">${esc(ammoLabel(w.ammo))}</span>
  <span style="padding:4px 2px;text-align:center;color:var(--ink2);border-bottom:1px solid var(--line);">${esc(w.weight)}</span>
</div>`,
    )
    .join("");
  const wEmpty = Array.from(
    { length: Math.max(0, 4 - (c.weapons || []).length) },
    () => `
<div style="display:contents;">
  <span style="padding:8px 2px;border-bottom:1px solid var(--line);"> </span>
  <span style="padding:8px 6px;border-bottom:1px solid var(--line);"> </span>
  <span style="padding:8px 6px;border-bottom:1px solid var(--line);"> </span>
  <span style="padding:8px 2px;border-bottom:1px solid var(--line);"> </span>
  <span style="padding:8px 2px;border-bottom:1px solid var(--line);"> </span>
  <span style="padding:8px 6px;border-bottom:1px solid var(--line);"> </span>
  <span style="padding:8px 6px;border-bottom:1px solid var(--line);"> </span>
  <span style="padding:8px 2px;border-bottom:1px solid var(--line);"> </span>
</div>`,
  ).join("");

  const inventory = (c.inventory || [])
    .map(
      (it) => `
<div style="display:contents;">
  <span style="padding:4px 6px;color:var(--ink);border-bottom:1px solid var(--line);">${esc(it.name)}</span>
  <span style="padding:4px 6px;color:var(--ink2);border-bottom:1px solid var(--line);">${esc(label(it.type || "other"))}</span>
  <span style="padding:4px 2px;text-align:center;color:var(--ink2);border-bottom:1px solid var(--line);">${esc(it.weight)}</span>
  <span style="padding:4px 2px;text-align:center;color:var(--ink);border-bottom:1px solid var(--line);font-family:'VT323',monospace;font-size:14px;">${esc(it.quantity)}</span>
</div>`,
    )
    .join("");
  const iEmpty = Array.from(
    { length: Math.max(0, 7 - (c.inventory || []).length) },
    () => `
<div style="display:contents;">
  <span style="padding:8px 6px;border-bottom:1px solid var(--line);"> </span>
  <span style="padding:8px 6px;border-bottom:1px solid var(--line);"> </span>
  <span style="padding:8px 2px;border-bottom:1px solid var(--line);"> </span>
  <span style="padding:8px 2px;border-bottom:1px solid var(--line);"> </span>
</div>`,
  ).join("");

  const perks = (c.perks || [])
    .map(
      (p) => `
<div style="display:flex;gap:7px;align-items:flex-start;border-left:2px solid var(--ink2);padding-left:8px;">
  <span style="flex-shrink:0;font-family:'VT323',monospace;font-size:15px;color:var(--ink);border:1px solid var(--line2);border-radius:3px;padding:0 4px;line-height:1.3;">${esc(p.rank)}</span>
  <div style="display:flex;flex-direction:column;gap:1px;">
    <span style="font-size:10.5px;color:var(--ink);font-weight:600;">${esc(p.name)}</span>
    <span style="font-size:9px;color:var(--ink2);line-height:1.3;">${esc(p.effect)}</span>
  </div>
</div>`,
    )
    .join("");

  const name = esc(c.name);

  const page1 = `
${SHEET_OPEN}
${brackets}
${masthead(t)}

<div style="display:grid;grid-template-columns:32mm 1fr;gap:11px;align-items:stretch;">
  <div style="border:1px solid var(--line2);border-radius:6px;background:var(--fill);position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px;">
    <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,var(--hair) 0,var(--hair) 1px,transparent 1px,transparent 4px);opacity:.7;"></div>
    ${photo}
  </div>
  <div style="border:1px solid var(--line2);border-radius:6px;overflow:hidden;display:flex;flex-direction:column;">
    ${panelHead(t.survivor)}
    <div style="padding:8px 10px;display:grid;grid-template-columns:1.7fr 1fr;gap:7px 12px;align-content:center;flex:1;">
      <div style="grid-column:1 / -1;display:flex;flex-direction:column;gap:1px;">
        <span style="font-size:8px;letter-spacing:.18em;color:var(--dim);text-transform:uppercase;">${t.name}</span>
        <span style="font-family:'VT323',monospace;font-size:28px;letter-spacing:.04em;color:var(--ink);line-height:1;border-bottom:1px solid var(--line);padding-bottom:2px;">${name}</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:1px;">
        <span style="font-size:8px;letter-spacing:.18em;color:var(--dim);text-transform:uppercase;">${t.origin}</span>
        <span style="font-size:14px;color:var(--ink);border-bottom:1px solid var(--line);padding-bottom:2px;">${esc(c.origin)}&nbsp;</span>
      </div>
      <div style="display:grid;grid-template-columns:auto auto auto;gap:12px;align-items:end;">
        <div style="display:flex;flex-direction:column;gap:1px;"><span style="font-size:8px;letter-spacing:.14em;color:var(--dim);text-transform:uppercase;">${t.level}</span><span style="font-family:'VT323',monospace;font-size:22px;color:var(--ink);line-height:1;">${esc(c.level)}</span></div>
        <div style="display:flex;flex-direction:column;gap:1px;"><span style="font-size:8px;letter-spacing:.14em;color:var(--dim);text-transform:uppercase;">${t.xp}</span><span style="font-family:'VT323',monospace;font-size:22px;color:var(--ink);line-height:1;">${esc(c.xp)}</span></div>
        <div style="display:flex;flex-direction:column;gap:1px;"><span style="font-size:8px;letter-spacing:.14em;color:var(--dim);text-transform:uppercase;">${t.xpNext}</span><span style="font-family:'VT323',monospace;font-size:22px;color:var(--dim);line-height:1;">${esc(c.xpNext)}</span></div>
      </div>
      <div style="grid-column:1 / -1;display:flex;align-items:center;gap:9px;border-top:1px dashed var(--line);padding-top:5px;">
        <span style="font-size:8px;letter-spacing:.16em;color:var(--dim);text-transform:uppercase;">${t.hp}</span>
        <span style="font-family:'VT323',monospace;font-size:24px;color:var(--ink);line-height:1;white-space:nowrap;">${hpCur} / ${hpMax}</span>
        <div style="flex:1;display:flex;gap:2px;align-items:center;">${hpSegs}</div>
        <span style="font-size:9px;letter-spacing:.14em;color:var(--ink2);text-transform:uppercase;">${hpStatus}</span>
      </div>
    </div>
  </div>
</div>

<div style="border:1px solid var(--line2);border-radius:6px;overflow:hidden;">
  ${panelHead("S.P.E.C.I.A.L", t.dLuck + " · " + esc(c.luckPoints))}
  <div style="padding:8px 9px;display:grid;grid-template-columns:repeat(7,1fr);gap:7px;">${special}</div>
</div>

<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:7px;">${derived}</div>

<div style="display:grid;grid-template-columns:1.15fr .85fr;gap:9px;align-items:start;">
  <div style="border:1px solid var(--line2);border-radius:6px;overflow:hidden;">
    ${panelHead(t.skills, "■ = " + t.trained)}
    <div style="display:grid;grid-template-columns:1fr 1fr;">${skills}</div>
  </div>
  <div style="border:1px solid var(--line2);border-radius:6px;overflow:hidden;">
    ${panelHead(t.hitLoc)}
    <div style="display:grid;grid-template-columns:1.5fr .9fr .5fr .5fr .5fr .5fr;font-size:9px;">
      ${locHeaderRow(t)}
      ${locs}
    </div>
    <div style="padding:4px 8px;font-size:8px;color:var(--dim);letter-spacing:.04em;">${t.locLegend}</div>
  </div>
</div>

<div style="border:1px solid var(--line2);border-radius:6px;overflow:hidden;">
  ${panelHead(t.weapons, "● = " + t.equipped)}
  <div style="display:grid;grid-template-columns:.4fr 1.6fr 1.2fr .5fr .55fr 1.3fr .9fr .5fr;font-size:9px;">
    ${weaponHeaderRow(t)}
    ${weapons}
    ${wEmpty}
  </div>
</div>

${footer(name, "1 / 2")}
</div>`;

  const page2 = `
${SHEET_OPEN}
${brackets}

<div style="display:flex;align-items:flex-end;gap:12px;border-bottom:2px solid var(--ink);padding-bottom:6px;">
  <span style="font-family:'VT323',monospace;font-size:22px;letter-spacing:.14em;color:var(--ink);line-height:.9;">${name}</span>
  <span style="font-size:9px;letter-spacing:.18em;color:var(--dim);text-transform:uppercase;margin-bottom:3px;">${t.level} ${esc(c.level)} · ${esc(c.origin)}</span>
  <span style="margin-left:auto;font-family:'VT323',monospace;font-size:18px;letter-spacing:.1em;color:var(--dim);margin-bottom:1px;">${t.gearTitle}</span>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;align-items:start;">
  <div style="border:1px solid var(--line2);border-radius:6px;overflow:hidden;">
    ${panelHead(t.inventory, carryNote)}
    <div style="display:grid;grid-template-columns:2fr 1fr .6fr .5fr;font-size:9px;">
      ${invHeaderRow(t)}
      ${inventory}
      ${iEmpty}
    </div>
  </div>
  <div style="border:1px solid var(--line2);border-radius:6px;overflow:hidden;">
    ${panelHead(t.perks)}
    <div style="padding:7px 9px;display:flex;flex-direction:column;gap:6px;">${perks}</div>
  </div>
</div>

<div style="display:flex;border:1px solid var(--line2);border-radius:6px;overflow:hidden;flex:1;flex-direction:column;">
  ${panelHead(t.notesHist, "", "4px 10px")}
  <div style="padding:9px 11px;font-size:10.5px;line-height:1.55;color:var(--ink);white-space:pre-wrap;flex:1;background:repeating-linear-gradient(0deg,transparent 0,transparent 22px,var(--hair) 22px,var(--hair) 23px);">${esc(c.notes)}</div>
</div>

${footer(name, "2 / 2")}
</div>`;

  return docWrap(t.docChar, page1 + page2);
}

// ---------- prázdný formulář ----------

export function buildBlankSheetHTML(lang) {
  const t = T[lang === "en" ? "en" : "cs"];

  const special = SPECIAL_DEFS.map((sp) => {
    const [code, name] = lang === "en" ? sp.en : sp.cs;
    return `
<div style="border:1px solid var(--line);border-radius:5px;background:var(--fill);padding:6px 3px 6px;display:flex;flex-direction:column;align-items:center;gap:4px;">
  <div style="width:34px;height:30px;border:1px solid var(--line2);border-radius:4px;background:var(--paper);"></div>
  <span style="font-family:'VT323',monospace;font-size:15px;letter-spacing:.06em;color:var(--ink2);">${code}</span>
  <span style="font-size:7.5px;letter-spacing:.02em;color:var(--dim);text-transform:uppercase;text-align:center;">${name}</span>
</div>`;
  }).join("");

  const derived = [t.dObrana, t.dInit, t.dMelee, t.dLuck, t.dPoison, t.caps]
    .map(
      (d) => `
<div style="border:1px solid var(--line2);border-radius:5px;background:var(--paper);padding:5px 4px 6px;display:flex;flex-direction:column;align-items:center;gap:4px;">
  <div style="width:30px;height:24px;border:1px solid var(--line);border-radius:3px;background:var(--fill);"></div>
  <span style="font-size:7.5px;letter-spacing:.06em;color:var(--dim);text-transform:uppercase;text-align:center;">${d}</span>
</div>`,
    )
    .join("");

  const skills = localizedSkills(lang)
    .map(
      (sk) => `
<div style="display:flex;align-items:center;gap:6px;padding:3px 8px;border-bottom:1px dashed var(--line);border-right:1px dashed var(--line);">
  <span style="width:11px;height:11px;border:1px solid var(--line2);border-radius:2px;flex-shrink:0;"></span>
  <span style="flex:1;font-size:10.5px;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(sk.name)}</span>
  <span style="font-size:8px;color:var(--dim);letter-spacing:.04em;">${sk.attr}</span>
  <span style="width:18px;height:16px;border:1px solid var(--line);border-radius:3px;flex-shrink:0;"></span>
</div>`,
    )
    .join("");

  const locs = LOC_DEFS.map(
    (ld) => `
<div style="display:contents;">
  <span style="padding:6px 6px;color:var(--ink);border-bottom:1px solid var(--line);">${lang === "en" ? ld.en : ld.cs}</span>
  <span style="padding:6px 4px;color:var(--ink2);text-align:center;border-bottom:1px solid var(--line);font-family:'VT323',monospace;font-size:13px;">${ld.roll}</span>
  <span style="border-bottom:1px solid var(--line);border-left:1px solid var(--hair);"></span>
  <span style="border-bottom:1px solid var(--line);border-left:1px solid var(--hair);"></span>
  <span style="border-bottom:1px solid var(--line);border-left:1px solid var(--hair);"></span>
  <span style="border-bottom:1px solid var(--line);border-left:1px solid var(--hair);"></span>
</div>`,
  ).join("");

  const weaponRows = Array.from(
    { length: 7 },
    () => `
<div style="display:contents;">
  <span style="min-height:26px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:center;"><span style="width:11px;height:11px;border:1px solid var(--line2);border-radius:2px;"></span></span>
  ${'<span style="border-bottom:1px solid var(--line);border-left:1px solid var(--hair);"></span>'.repeat(7)}
</div>`,
  ).join("");

  const invRows = Array.from(
    { length: 16 },
    () => `
<div style="display:contents;">
  <span style="min-height:24px;border-bottom:1px solid var(--line);"></span>
  ${'<span style="border-bottom:1px solid var(--line);border-left:1px solid var(--hair);"></span>'.repeat(3)}
</div>`,
  ).join("");

  const perkRows = Array.from(
    { length: 9 },
    () => `
<div style="flex:1;display:flex;gap:8px;align-items:stretch;padding:5px 9px;border-bottom:1px solid var(--line);">
  <span style="flex-shrink:0;width:24px;border:1px solid var(--line);border-radius:3px;background:var(--fill);display:flex;align-items:flex-start;justify-content:center;padding-top:2px;font-size:7px;color:var(--dim);letter-spacing:.04em;">${t.rank}</span>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:1px 0;">
    <div style="height:12px;border-bottom:1px solid var(--hair);"></div>
    <div style="height:12px;border-bottom:1px solid var(--hair);"></div>
  </div>
</div>`,
  ).join("");

  const inputBox =
    '<div style="height:24px;border:1px solid var(--line);border-radius:3px;background:var(--paper);"></div>';

  const page1 = `
${SHEET_OPEN}
${brackets}
${masthead(t)}

<div style="display:grid;grid-template-columns:32mm 1fr;gap:11px;align-items:stretch;">
  <div style="border:1px solid var(--line2);border-radius:6px;background:var(--fill);position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px;">
    <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,var(--hair) 0,var(--hair) 1px,transparent 1px,transparent 4px);opacity:.7;"></div>
    <span style="position:relative;font-family:'VT323',monospace;font-size:15px;letter-spacing:.1em;color:var(--dim);text-transform:uppercase;text-align:center;line-height:1.3;">${t.photo}</span>
  </div>
  <div style="border:1px solid var(--line2);border-radius:6px;overflow:hidden;display:flex;flex-direction:column;">
    ${panelHead(t.survivor)}
    <div style="padding:9px 10px;display:grid;grid-template-columns:1.7fr 1fr;gap:9px 12px;align-content:center;flex:1;">
      <div style="grid-column:1 / -1;display:flex;flex-direction:column;gap:3px;">
        <span style="font-size:8px;letter-spacing:.18em;color:var(--dim);text-transform:uppercase;">${t.name}</span>
        <div style="height:22px;border-bottom:1px solid var(--line2);"></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:3px;">
        <span style="font-size:8px;letter-spacing:.18em;color:var(--dim);text-transform:uppercase;">${t.origin}</span>
        <div style="height:20px;border-bottom:1px solid var(--line2);"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;align-items:end;">
        <div style="display:flex;flex-direction:column;gap:3px;"><span style="font-size:8px;letter-spacing:.1em;color:var(--dim);text-transform:uppercase;">${t.level}</span>${inputBox}</div>
        <div style="display:flex;flex-direction:column;gap:3px;"><span style="font-size:8px;letter-spacing:.1em;color:var(--dim);text-transform:uppercase;">${t.xp}</span>${inputBox}</div>
        <div style="display:flex;flex-direction:column;gap:3px;"><span style="font-size:8px;letter-spacing:.1em;color:var(--dim);text-transform:uppercase;">${t.xpNext}</span>${inputBox}</div>
      </div>
      <div style="grid-column:1 / -1;display:flex;align-items:center;gap:9px;border-top:1px dashed var(--line);padding-top:7px;">
        <span style="font-size:8px;letter-spacing:.16em;color:var(--dim);text-transform:uppercase;">${t.hp}</span>
        <div style="width:34px;height:26px;border:1px solid var(--line2);border-radius:3px;background:var(--paper);"></div>
        <span style="font-family:'VT323',monospace;font-size:22px;color:var(--dim);">/</span>
        <div style="width:34px;height:26px;border:1px solid var(--line2);border-radius:3px;background:var(--paper);"></div>
        <span style="font-size:8px;letter-spacing:.16em;color:var(--dim);text-transform:uppercase;margin-left:6px;">${t.status}</span>
        <div style="flex:1;height:20px;border-bottom:1px solid var(--line);"></div>
      </div>
    </div>
  </div>
</div>

<div style="border:1px solid var(--line2);border-radius:6px;overflow:hidden;">
  ${panelHead("S.P.E.C.I.A.L", t.fillHint)}
  <div style="padding:9px;display:grid;grid-template-columns:repeat(7,1fr);gap:7px;">${special}</div>
</div>

<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:7px;">${derived}</div>

<div style="display:grid;grid-template-columns:1.15fr .85fr;gap:9px;align-items:start;">
  <div style="border:1px solid var(--line2);border-radius:6px;overflow:hidden;">
    ${panelHead(t.skills, "☐ = " + t.trained)}
    <div style="display:grid;grid-template-columns:1fr 1fr;">${skills}</div>
  </div>
  <div style="border:1px solid var(--line2);border-radius:6px;overflow:hidden;">
    ${panelHead(t.hitLoc)}
    <div style="display:grid;grid-template-columns:1.5fr .9fr .5fr .5fr .5fr .5fr;font-size:9px;">
      ${locHeaderRow(t)}
      ${locs}
    </div>
    <div style="padding:4px 8px;font-size:8px;color:var(--dim);letter-spacing:.04em;">${t.locLegend}</div>
  </div>
</div>

<div style="border:1px solid var(--line2);border-radius:6px;overflow:hidden;flex:1;display:flex;flex-direction:column;">
  ${panelHead(t.weapons, "☐ = " + t.equipped)}
  <div style="display:grid;grid-template-columns:.4fr 1.6fr 1.2fr .5fr .55fr 1.3fr .9fr .5fr;font-size:9px;flex:1;grid-auto-rows:1fr;">
    ${weaponHeaderRow(t)}
    ${weaponRows}
  </div>
</div>

${footer(t.blankTag, "1 / 2")}
</div>`;

  const page2 = `
${SHEET_OPEN}
${brackets}

<div style="display:flex;align-items:flex-end;gap:12px;border-bottom:2px solid var(--ink);padding-bottom:6px;">
  <span style="font-family:'VT323',monospace;font-size:22px;letter-spacing:.14em;color:var(--ink);line-height:.9;">${t.name}</span>
  <div style="flex:1;height:18px;border-bottom:1px solid var(--line2);max-width:70mm;"></div>
  <span style="margin-left:auto;font-family:'VT323',monospace;font-size:18px;letter-spacing:.1em;color:var(--dim);margin-bottom:1px;">${t.gearTitle}</span>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;align-items:stretch;flex:1;">
  <div style="border:1px solid var(--line2);border-radius:6px;overflow:hidden;display:flex;flex-direction:column;">
    ${panelHead(t.inventory, "", "5px 10px")}
    <div style="display:grid;grid-template-columns:2fr 1fr .6fr .5fr;font-size:9px;flex:1;grid-auto-rows:1fr;">
      ${invHeaderRow(t)}
      ${invRows}
    </div>
  </div>
  <div style="border:1px solid var(--line2);border-radius:6px;overflow:hidden;display:flex;flex-direction:column;">
    ${panelHead(t.perks, t.perkHint, "5px 10px")}
    <div style="flex:1;display:flex;flex-direction:column;">${perkRows}</div>
  </div>
</div>

<div style="border:1px solid var(--line2);border-radius:6px;overflow:hidden;flex-shrink:0;">
  ${panelHead(t.notesHist)}
  <div style="height:22mm;background:repeating-linear-gradient(0deg,transparent 0,transparent 10px,var(--hair) 10px,var(--hair) 11px);"></div>
</div>

${footer(t.blankTag, "2 / 2")}
</div>`;

  return docWrap(t.docBlank, page1 + page2);
}

// ---------- tisk přes skrytý iframe ----------

let printFrame = null;

export function printSheet(html) {
  if (printFrame) {
    printFrame.remove();
    printFrame = null;
  }
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
  iframe.onload = () => {
    const win = iframe.contentWindow;
    const doc = iframe.contentDocument;
    if (!win || !doc) return;
    const doPrint = () => {
      try {
        win.focus();
        win.print();
      } catch (e) {}
    };
    win.onafterprint = () => {
      if (printFrame === iframe) printFrame = null;
      iframe.remove();
    };
    const fontsReady =
      doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve();
    Promise.race([
      fontsReady,
      new Promise((res) => setTimeout(res, 2000)),
    ]).then(() => setTimeout(doPrint, 60));
  };
  printFrame = iframe;
  document.body.appendChild(iframe);
  iframe.srcdoc = html;
}
