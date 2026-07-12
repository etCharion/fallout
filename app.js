import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";

// Firebase (modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// --- FIREBASE SETUP ---
// NOTE: The apiKey is intentionally public as this is a frontend-only application.
// It is secured via domain restrictions and API service restrictions in the Google Cloud Console.
const firebaseConfig = {
  apiKey: "AIzaSyBJ7zMyfq1MjXTkvmeS4WCaWcixrrbqBnI",
  authDomain: "falloutpostava.firebaseapp.com",
  projectId: "falloutpostava",
  storageBucket: "falloutpostava.firebasestorage.app",
  messagingSenderId: "15494105712",
  appId: "1:15494105712:web:045dc881d4a0f96b0142b5",
};

const appId = "falloutpostava";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const h = React.createElement;

// --- THEMES (Pip-Boy CRT palettes) ---
const THEMES = ["green", "amber", "science", "radiation"];
const THEME_COLORS = {
  green: { fg: "#21ff85", bg: "#021008" },
  amber: { fg: "#ffb84d", bg: "#0e0a05" },
  science: { fg: "#7fd6ff", bg: "#050c14" },
  radiation: { fg: "#d8ff3a", bg: "#0a0c04" },
};

const TRANSLATIONS = {
  cs: {
    headerTitle: "RPG HRA",
    subtitle: "RPG Hra // Karta postavy",
    survivor: "Záznam přeživšího",
    name: "JMÉNO POSTAVY",
    origin: "PŮVOD",
    level: "ÚROVEŇ",
    xp: "ZÍSKANÉ ZK",
    xpNext: "ZK NA DALŠÍ ÚR.",
    strength: "SÍLA",
    perception: "VNÍMÁNÍ",
    endurance: "ODOLNOST",
    charisma: "CHARISMA",
    intelligence: "INTELIGENCE",
    agility: "HBITOST",
    luck: "ŠTĚSTÍ",
    luckPoints: "BODY ŠTĚSTÍ",
    skillsTitle: "DOVEDNOSTI",
    trained: "vycvičená",
    s_athletics: "Atletika [SIL]",
    s_unarmed: "Boj beze zbraně [SIL]",
    s_energyWeapons: "Energetické zbraně [VNI]",
    s_meleeWeapons: "Chladné zbraně [SIL]",
    s_medicine: "Léčení [INT]",
    s_smallGuns: "Lehké zbraně [HBI]",
    s_barter: "Obchodování [CHA]",
    s_repair: "Opravování [INT]",
    s_lockpick: "Otevírání zámků [VNI]",
    s_pilot: "Pilotování [VNI]",
    s_sneak: "Plížení [HBI]",
    s_survival: "Přežití [ODO]",
    s_speech: "Řečnictví [CHA]",
    s_bigGuns: "Těžké zbraně [ODO]",
    s_science: "Věda [INT]",
    s_throwing: "Vrhání [HBI]",
    s_explosives: "Výbušniny [VNI]",
    health: "ZDRAVÍ (HP)",
    initiative: "INICIATIVA",
    defense: "OBRANA (DEF)",
    meleeDmg: "POŠKOZENÍ NA BLÍZKO",
    hitLocs: "ZÁSAHOVÉ ZÓNY",
    dr_phys: "Fyzická",
    dr_en: "Energet.",
    dr_rad: "Radiač.",
    dr_hp: "Body zdraví",
    poisonRes: "JEDOVÉ OZ",
    loc_head: "HLAVA (1-2)",
    loc_torso: "TRUP (3-8)",
    loc_larm: "LEVÁ RUKA (9-11)",
    loc_rarm: "PRAVÁ RUKA (12-14)",
    loc_lleg: "LEVÁ NOHA (15-17)",
    loc_rleg: "PRAVÁ NOHA (18-20)",
    locOk: "V pořádku",
    locInjured: "ZRANĚNO",
    hpStable: "Stabilní",
    hpCritical: "Kritický",
    weaponsTitle: "ZBRANĚ",
    w_name: "NÁZEV",
    w_skill: "DOVED.",
    w_tn: "CČ",
    w_dmg: "POŠK.",
    w_effects: "ÚČINKY",
    w_type: "DRUH",
    w_rate: "RYCH.",
    w_range: "DOSTŘ.",
    w_qual: "ATRIBUTY",
    w_ammo: "MUNICE",
    w_weight: "VÁHA",
    w_assigned: "PŘIŘ.",
    invTitle: "VYBAVENÍ",
    caps: "ZÁTKY",
    i_item: "PŘEDMĚT",
    i_weight: "VÁHA",
    i_qty: "KS",
    i_type: "TYP",
    perksTitle: "PERKY A RYSY",
    p_name: "NÁZEV",
    p_rank: "ST.",
    p_effect: "ÚČINEK",
    newChar: "Nová Postava",
    loading: "NAČÍTÁNÍ...",
    noData: "ŽÁDNÁ DATA",
    selectChar: "-- VYBER POSTAVU --",
    chooseChar: "Vyber postavu",
    open: "Otevřít",
    current: "Aktivní",
    btnNew: "NOVÁ",
    btnSave: "ULOŽIT",
    btnDelete: "SMAZAT",
    btnAdd: "Přidat",
    fromTpl: "Ze šablony",
    use: "Použít",
    confirmDelete: "Opravdu smazat tuto postavu?",
    mEdit: "UPRAVIT",
    mPlay: "HRÁT",
    mLock: "ZAMČENO",
    badgeEdit: "● ÚPRAVY",
    badgePlay: "▶ HRA",
    badgeLock: "○ NÁHLED",
    uploadImg: "Nahrát obrázek",
    dragTip: "Chyť a přetáhni",
    btnNotes: "POZNÁMKY",
    notesTitle: "POZNÁMKY A HISTORIE",
    notesPh: "Zápisky, historie, questy…",
    btnAdmin: "ADMIN",
    adminTitle: "Administrace šablon",
    adminHint:
      "Šablony se ukládají do databáze. Uložené položky pak přidáš do postavy tlačítkem „Ze šablony“.",
    adminEmpty: "Zatím žádné šablony — přidej první.",
    adminPickHint: "Vyber položku vlevo, nebo vytvoř novou.",
    adminEditing: "Editace",
    newTpl: "Nová šablona",
    pickerEmpty: "Žádné šablony. Přidej je v Administraci.",
    pickWeapons: "Vyber zbraň",
    pickInventory: "Vyber vybavení",
    pickPerks: "Vyber perk",
    searchPh: "Hledat…",
    allTypes: "Všechny typy",
    noName: "(beze jména)",
    btnClose: "Zavřít",
    btnUndo: "Zpět",
    btnRedo: "Znovu",
    btnPrint: "TISK",
    btnStyle: "STYL",
    diceTitle: "Virtuální kostky",
    diceCombat: "Bojové (CD)",
    diceRoll: "HODIT",
    diceLog: "LOG",
    diceClear: "Vymazat",
    diceHint: "Nastav počet a hoď kostkami",
    diceSum: "Součet",
    diceDmg: "Poškození",
    diceEff: "ef.",
    diceCrit: "krit.",
    diceCompl: "kompl.",
    diceLogTitle: "Historie hodů",
    diceLogEmpty: "Zatím žádné hody.",
    online: "ONLINE",
    autosave: "AUTOSAVE",
    active: "AKTIVNÍ",
    manual: "RUČNÍ",
    storage: "ÚLOŽIŠTĚ",
    chars: "POSTAVY",
    tplName_weapons: "Název zbraně",
    tplName_inventory: "Název předmětu",
    tplName_perks: "Název perku",
    emptyList: "Zatím prázdné.",
  },
  en: {
    headerTitle: "THE ROLEPLAYING GAME",
    subtitle: "RPG Game // Character sheet",
    survivor: "Survivor record",
    name: "CHARACTER NAME",
    origin: "ORIGIN",
    level: "LEVEL",
    xp: "XP EARNED",
    xpNext: "XP TO NEXT LEVEL",
    strength: "STRENGTH",
    perception: "PERCEPTION",
    endurance: "ENDURANCE",
    charisma: "CHARISMA",
    intelligence: "INTELLIGENCE",
    agility: "AGILITY",
    luck: "LUCK",
    luckPoints: "LUCK POINTS",
    skillsTitle: "SKILLS",
    trained: "trained",
    s_athletics: "Athletics [STR]",
    s_unarmed: "Unarmed [STR]",
    s_energyWeapons: "Energy Weapons [PER]",
    s_meleeWeapons: "Melee Weapons [STR]",
    s_medicine: "Medicine [INT]",
    s_smallGuns: "Small Guns [AGI]",
    s_barter: "Barter [CHA]",
    s_repair: "Repair [INT]",
    s_lockpick: "Lockpick [PER]",
    s_pilot: "Pilot [PER]",
    s_sneak: "Sneak [AGI]",
    s_survival: "Survival [END]",
    s_speech: "Speech [CHA]",
    s_bigGuns: "Big Guns [END]",
    s_science: "Science [INT]",
    s_throwing: "Throwing [AGI]",
    s_explosives: "Explosives [PER]",
    health: "HEALTH (HP)",
    initiative: "INITIATIVE",
    defense: "DEFENSE",
    meleeDmg: "MELEE DAMAGE",
    hitLocs: "HIT LOCATIONS",
    dr_phys: "Physical",
    dr_en: "Energy",
    dr_rad: "Radiation",
    dr_hp: "Health pts",
    poisonRes: "POISON DR",
    loc_head: "HEAD (1-2)",
    loc_torso: "TORSO (3-8)",
    loc_larm: "LEFT ARM (9-11)",
    loc_rarm: "RIGHT ARM (12-14)",
    loc_lleg: "LEFT LEG (15-17)",
    loc_rleg: "RIGHT LEG (18-20)",
    locOk: "OK",
    locInjured: "INJURED",
    hpStable: "Stable",
    hpCritical: "Critical",
    weaponsTitle: "WEAPONS",
    w_name: "NAME",
    w_skill: "SKILL",
    w_tn: "TN",
    w_dmg: "DMG",
    w_effects: "EFFECTS",
    w_type: "TYPE",
    w_rate: "RATE",
    w_range: "RANGE",
    w_qual: "QUALITIES",
    w_ammo: "AMMO",
    w_weight: "WT",
    w_assigned: "EQ.",
    invTitle: "EQUIPMENT",
    caps: "CAPS",
    i_item: "ITEM",
    i_weight: "LBS.",
    i_qty: "QTY",
    i_type: "TYPE",
    perksTitle: "PERKS & TRAITS",
    p_name: "NAME",
    p_rank: "RANK",
    p_effect: "EFFECT",
    newChar: "New Character",
    loading: "LOADING...",
    noData: "NO DATA",
    selectChar: "-- SELECT CHARACTER --",
    chooseChar: "Choose character",
    open: "Open",
    current: "Active",
    btnNew: "NEW",
    btnSave: "SAVE",
    btnDelete: "DELETE",
    btnAdd: "Add",
    fromTpl: "From template",
    use: "Use",
    confirmDelete: "Are you sure you want to delete this character?",
    mEdit: "EDIT",
    mPlay: "PLAY",
    mLock: "LOCK",
    badgeEdit: "● EDITING",
    badgePlay: "▶ PLAY",
    badgeLock: "○ VIEW",
    uploadImg: "Upload Image",
    dragTip: "Drag to reorder",
    btnNotes: "NOTES",
    notesTitle: "NOTES & HISTORY",
    notesPh: "Notes, history, quests…",
    btnAdmin: "ADMIN",
    adminTitle: "Template admin",
    adminHint:
      "Templates are stored in the database. Add saved items to a character via “From template”.",
    adminEmpty: "No templates yet — add the first.",
    adminPickHint: "Pick an item on the left, or create a new one.",
    adminEditing: "Editing",
    newTpl: "New template",
    pickerEmpty: "No templates. Add them in Admin.",
    pickWeapons: "Pick a weapon",
    pickInventory: "Pick equipment",
    pickPerks: "Pick a perk",
    searchPh: "Search…",
    allTypes: "All types",
    noName: "(unnamed)",
    btnClose: "Close",
    btnUndo: "Undo",
    btnRedo: "Redo",
    btnPrint: "PRINT",
    btnStyle: "STYLE",
    diceTitle: "Virtual dice",
    diceCombat: "Combat (CD)",
    diceRoll: "ROLL",
    diceLog: "LOG",
    diceClear: "Clear",
    diceHint: "Set the count and roll the dice",
    diceSum: "Total",
    diceDmg: "Damage",
    diceEff: "eff.",
    diceCrit: "crit",
    diceCompl: "compl",
    diceLogTitle: "Roll history",
    diceLogEmpty: "No rolls yet.",
    online: "ONLINE",
    autosave: "AUTOSAVE",
    active: "ACTIVE",
    manual: "MANUAL",
    storage: "STORAGE",
    chars: "CHARS",
    tplName_weapons: "Weapon name",
    tplName_inventory: "Item name",
    tplName_perks: "Perk name",
    emptyList: "Empty so far.",
  },
};

const ITEM_TYPES = [
  { key: "food", cs: "Jídlo", en: "Food" },
  { key: "drink", cs: "Pití", en: "Drink" },
  { key: "chems", cs: "Chemikálie", en: "Chems" },
  { key: "clothing", cs: "Oblečení", en: "Clothing" },
  { key: "armor", cs: "Zbroj", en: "Armor" },
  { key: "melee", cs: "Zbraň na blízko", en: "Melee weapon" },
  { key: "light", cs: "Lehká zbraň", en: "Light weapon" },
  { key: "heavy", cs: "Těžká zbraň", en: "Heavy weapon" },
  { key: "energy", cs: "Energetická zbraň", en: "Energy weapon" },
  { key: "ammo", cs: "Munice", en: "Ammunition" },
  { key: "other", cs: "Jiné", en: "Other" },
];

function getTypeLabel(key, lang) {
  const t =
    ITEM_TYPES.find((x) => x.key === key) || ITEM_TYPES[ITEM_TYPES.length - 1];
  return lang === "en" ? t.en : t.cs;
}

const DEFAULT_CHARACTER = {
  id: "",
  name: "Nový Přeživší",
  origin: "",
  level: "1",
  xp: "0",
  xpNext: "100",
  imageUrl: "",
  strength: "5",
  perception: "5",
  endurance: "5",
  charisma: "5",
  intelligence: "5",
  agility: "5",
  luck: "5",
  luckPoints: "0",
  skills: {
    athletics: false,
    athleticsVal: "0",
    unarmed: false,
    unarmedVal: "0",
    energyWeapons: false,
    energyWeaponsVal: "0",
    meleeWeapons: false,
    meleeWeaponsVal: "0",
    medicine: false,
    medicineVal: "0",
    smallGuns: false,
    smallGunsVal: "0",
    barter: false,
    barterVal: "0",
    repair: false,
    repairVal: "0",
    lockpick: false,
    lockpickVal: "0",
    pilot: false,
    pilotVal: "0",
    sneak: false,
    sneakVal: "0",
    survival: false,
    survivalVal: "0",
    speech: false,
    speechVal: "0",
    bigGuns: false,
    bigGunsVal: "0",
    science: false,
    scienceVal: "0",
    throwing: false,
    throwingVal: "0",
    explosives: false,
    explosivesVal: "0",
  },
  hpMax: "10",
  hpCurrent: "10",
  initiative: "0",
  defense: "0",
  meleeDamage: "0",
  resHead: { phys: "0", en: "0", rad: "0", bz: "0", injured: false },
  resTorso: { phys: "0", en: "0", rad: "0", bz: "0", injured: false },
  resLArm: { phys: "0", en: "0", rad: "0", bz: "0", injured: false },
  resRArm: { phys: "0", en: "0", rad: "0", bz: "0", injured: false },
  resLLeg: { phys: "0", en: "0", rad: "0", bz: "0", injured: false },
  resRLeg: { phys: "0", en: "0", rad: "0", bz: "0", injured: false },
  poisonRes: "0",
  weapons: [],
  inventory: [],
  perks: [],
  caps: "0",
  notes: "",
  history: [],
};

function normalizeCharacter(raw) {
  const base = JSON.parse(JSON.stringify(DEFAULT_CHARACTER));
  const c = { ...base, ...raw };
  if (raw?.about && !raw?.notes) {
    c.notes = raw.about;
  }
  c.skills = { ...base.skills, ...(raw?.skills || {}) };
  c.resHead = { ...base.resHead, ...(raw?.resHead || {}) };
  c.resTorso = { ...base.resTorso, ...(raw?.resTorso || {}) };
  c.resLArm = { ...base.resLArm, ...(raw?.resLArm || {}) };
  c.resRArm = { ...base.resRArm, ...(raw?.resRArm || {}) };
  c.resLLeg = { ...base.resLLeg, ...(raw?.resLLeg || {}) };
  c.resRLeg = { ...base.resRLeg, ...(raw?.resRLeg || {}) };
  c.weapons = Array.isArray(raw?.weapons)
    ? raw.weapons.map((w) => ({ assigned: false, ...w }))
    : [];
  c.inventory = Array.isArray(raw?.inventory)
    ? raw.inventory.map((it) => ({ type: "other", quantity: "1", ...it }))
    : [];
  c.perks = Array.isArray(raw?.perks) ? raw.perks.map((p) => ({ ...p })) : [];
  c.history = Array.isArray(raw?.history) ? raw.history : [];
  return c;
}

function computeInitials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function AutoResizeTextarea({
  value,
  onChange,
  disabled,
  className,
  style,
  placeholder,
}) {
  const textareaRef = useRef(null);
  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };
  useEffect(() => {
    adjustHeight();
  }, [value]);
  return h("textarea", {
    ref: textareaRef,
    value: value,
    onChange: (e) => {
      onChange(e);
      adjustHeight();
    },
    disabled: disabled,
    rows: 1,
    placeholder: placeholder,
    className: className,
    style: style,
  });
}

function PbField({ label, value, onChange, disabled, className, inputClass }) {
  return h(
    "div",
    { className: `pb-field ${className || ""}` },
    h("span", { className: "pb-label" }, label),
    h("input", {
      type: "text",
      value: value,
      onChange: (e) => onChange(e.target.value),
      disabled: disabled,
      className: inputClass || "pb-input",
    }),
  );
}

function PanelHead({ title, note, children }) {
  return h(
    "div",
    { className: "pb-panel-head" },
    h("span", { className: "pb-head-arrow" }, "▸"),
    h("span", { className: "pb-head-title" }, title),
    note,
    children,
  );
}

function BodyPartCard({ name, data, field, update, canEdit, canPlay, t }) {
  const injured = !!data.injured;
  return h(
    "div",
    { className: `pb-loc-card ${injured ? "injured" : ""}` },
    h("span", { className: "pb-loc-name" }, name),
    h(
      "label",
      { className: "pb-loc-status" },
      h("input", {
        type: "checkbox",
        checked: injured,
        onChange: (e) => update(`${field}.injured`, e.target.checked),
        disabled: !canPlay,
      }),
      injured ? t.locInjured : t.locOk,
    ),
    h(
      "div",
      { className: "pb-loc-vals" },
      ["phys", "en", "rad", "bz"].map((k) =>
        h("input", {
          key: k,
          type: "number",
          className: `pb-num sm ${k === "bz" ? "hp" : ""}`,
          value: data[k],
          onChange: (e) => update(`${field}.${k}`, e.target.value),
          disabled: !canPlay,
          title:
            k === "phys"
              ? t.dr_phys
              : k === "en"
                ? t.dr_en
                : k === "rad"
                  ? t.dr_rad
                  : t.dr_hp,
        }),
      ),
    ),
  );
}

function ModalShell({ onClose, className, children }) {
  return h(
    "div",
    { className: "pb-modal-backdrop pb-noprint", onMouseDown: onClose },
    h(
      "div",
      {
        className: `pb-modal ${className || ""}`,
        onMouseDown: (e) => e.stopPropagation(),
      },
      children,
    ),
  );
}

function TemplatePicker({
  isOpen,
  onClose,
  onSelect,
  onOpenAdmin,
  templates,
  type,
  lang,
  t,
}) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setFilterType("all");
    }
  }, [isOpen, type]);
  if (!isOpen) return null;
  const filtered = templates
    .filter((tp) => {
      const matchesSearch = (tp.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesType =
        type !== "inventory" || filterType === "all" || tp.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) =>
      (a.name || "").localeCompare(b.name || "", lang, {
        sensitivity: "accent",
        numeric: true,
      }),
    );
  const title =
    type === "weapons"
      ? t.pickWeapons
      : type === "inventory"
        ? t.pickInventory
        : t.pickPerks;
  return h(
    ModalShell,
    { onClose, className: "mid" },
    h(
      "div",
      { className: "pb-modal-head" },
      h("span", { className: "pb-modal-title" }, "⌕ " + title),
      h(
        "button",
        {
          className: "pb-chip dim pb-push-right",
          onClick: () => {
            onClose();
            onOpenAdmin();
          },
        },
        "⚙ " + t.btnAdmin,
      ),
      h("button", { className: "pb-chip dim", onClick: onClose }, "✕"),
    ),
    h(
      "div",
      { className: "pb-modal-body" },
      h(
        "div",
        { style: { display: "flex", gap: "8px" } },
        h("input", {
          type: "text",
          placeholder: t.searchPh,
          className: "pb-input",
          style: { flex: 1 },
          value: search,
          onChange: (e) => setSearch(e.target.value),
          autoFocus: true,
        }),
        type === "inventory" &&
          h(
            "select",
            {
              className: "pb-select",
              style: { width: "auto" },
              value: filterType,
              onChange: (e) => setFilterType(e.target.value),
            },
            h("option", { value: "all" }, t.allTypes),
            ITEM_TYPES.map((it) =>
              h(
                "option",
                { key: it.key, value: it.key },
                lang === "en" ? it.en : it.cs,
              ),
            ),
          ),
      ),
      filtered.length === 0
        ? h("div", { className: "pb-modal-empty" }, t.pickerEmpty)
        : filtered.map((tpl) =>
            h(
              "button",
              {
                key: tpl.id,
                className: "pb-pick-row",
                onClick: () => {
                  onSelect(tpl);
                  onClose();
                },
              },
              h(
                "div",
                { className: "pb-pick-main" },
                h("span", { className: "pb-pick-name" }, tpl.name || t.noName),
                h(
                  "span",
                  { className: "pb-pick-sub" },
                  type === "inventory"
                    ? getTypeLabel(tpl.type, lang)
                    : type === "weapons"
                      ? tpl.skill || ""
                      : (tpl.effect || "").slice(0, 60),
                ),
              ),
              h("span", { className: "pb-pick-use" }, "+ " + t.use),
            ),
          ),
    ),
  );
}

function CharacterModal({
  isOpen,
  onClose,
  characters,
  selectedCharId,
  onSelect,
  onCreate,
  t,
}) {
  if (!isOpen) return null;
  return h(
    ModalShell,
    { onClose },
    h(
      "div",
      { className: "pb-modal-head" },
      h("span", { className: "pb-modal-title" }, "◈ " + t.chooseChar),
      h(
        "button",
        { className: "pb-chip accent pb-push-right", onClick: onCreate },
        "+ " + t.btnNew,
      ),
      h("button", { className: "pb-chip dim", onClick: onClose }, "✕"),
    ),
    h(
      "div",
      { className: "pb-modal-body" },
      characters.length === 0
        ? h("div", { className: "pb-modal-empty" }, t.noData)
        : characters.map((ch) =>
            h(
              "div",
              {
                key: ch.id,
                className: `pb-char-row ${ch.id === selectedCharId ? "active" : ""}`,
              },
              h(
                "span",
                { className: "pb-char-initials" },
                ch.imageUrl
                  ? h("img", { src: ch.imageUrl, alt: "" })
                  : computeInitials(ch.name),
              ),
              h(
                "div",
                { className: "pb-char-info" },
                h("span", { className: "pb-char-name" }, ch.name),
                h(
                  "span",
                  { className: "pb-char-sub" },
                  `${ch.origin || "—"} · ${t.level} ${ch.level}`,
                ),
              ),
              h(
                "button",
                { className: "pb-chip", onClick: () => onSelect(ch.id) },
                ch.id === selectedCharId ? t.current : t.open,
              ),
            ),
          ),
    ),
  );
}

function NotesModal({ isOpen, onClose, value, onChange, disabled, t }) {
  if (!isOpen) return null;
  return h(
    ModalShell,
    { onClose, className: "mid" },
    h(
      "div",
      { className: "pb-modal-head" },
      h("span", { className: "pb-modal-title" }, "✎ " + t.notesTitle),
      h(
        "button",
        { className: "pb-chip dim pb-push-right", onClick: onClose },
        "✕",
      ),
    ),
    h(
      "div",
      { className: "pb-modal-body" },
      h("textarea", {
        className: "pb-textarea",
        style: { minHeight: "240px" },
        value: value || "",
        placeholder: t.notesPh,
        onChange: (e) => onChange(e.target.value),
        disabled: disabled,
      }),
    ),
  );
}

function RollLogModal({ isOpen, onClose, rollLog, onClear, t }) {
  if (!isOpen) return null;
  return h(
    ModalShell,
    { onClose },
    h(
      "div",
      { className: "pb-modal-head" },
      h("span", { className: "pb-modal-title" }, "▤ " + t.diceLogTitle),
      rollLog.length > 0 &&
        h(
          "button",
          { className: "pb-chip danger pb-push-right", onClick: onClear },
          "✕ " + t.diceClear,
        ),
      h(
        "button",
        {
          className: `pb-chip dim ${rollLog.length ? "" : "pb-push-right"}`,
          onClick: onClose,
        },
        "✕",
      ),
    ),
    h(
      "div",
      { className: "pb-modal-body" },
      rollLog.length === 0
        ? h("div", { className: "pb-modal-empty" }, t.diceLogEmpty)
        : rollLog.map((r) => {
            const d20 = r.type === "d20";
            let sum;
            if (d20) {
              const bits = [t.diceSum + " " + r.summary.sum];
              if (r.summary.crit)
                bits.push(r.summary.crit + " " + t.diceCrit);
              if (r.summary.compl)
                bits.push(r.summary.compl + " " + t.diceCompl);
              sum = bits.join(" · ");
            } else {
              sum =
                t.diceDmg +
                " " +
                r.summary.dmg +
                " · " +
                r.summary.eff +
                " " +
                t.diceEff;
            }
            return h(
              "div",
              { key: r.id, className: "pb-log-row" },
              h(
                "span",
                { className: `pb-log-label ${d20 ? "" : "cd"}` },
                d20 ? r.values.length + "d20" : r.values.length + "×CD",
              ),
              h(
                "div",
                { className: "pb-log-main" },
                h("span", { className: "pb-log-sum" }, sum),
                h(
                  "span",
                  { className: "pb-log-faces" },
                  "[ " + r.values.join(", ") + " ]",
                ),
              ),
              h("span", { className: "pb-log-ts" }, r.ts),
            );
          }),
    ),
  );
}

function defaultTemplate(tab) {
  const id = crypto.randomUUID();
  if (tab === "weapons")
    return {
      id,
      name: "",
      skill: "",
      assigned: false,
      targetNum: "",
      damage: "",
      effects: "",
      type: "",
      rateOfFire: "",
      range: "",
      attributes: "",
      ammo: "",
      weight: "",
    };
  if (tab === "inventory")
    return { id, name: "", type: "other", weight: "", quantity: "1" };
  if (tab === "perks") return { id, name: "", rank: "1", effect: "" };
  return { id, name: "" };
}

function FalloutSheetApp() {
  const [user, setUser] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [selectedCharId, setSelectedCharId] = useState(null);
  const [localChar, setLocalChar] = useState(null);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(
    () => localStorage.getItem("fallout_lang") || "cs",
  );

  // mode: 'edit' | 'play' | 'locked' — persisted; 'edit' never restored
  const [mode, setMode] = useState(() => {
    const m = localStorage.getItem("fallout_mode");
    return m === "play" ? "play" : "locked";
  });
  const isEditing = mode === "edit";
  const canPlay = mode === "edit" || mode === "play";
  const [playDirty, setPlayDirty] = useState(false);

  useEffect(() => {
    localStorage.setItem("fallout_lang", lang);
  }, [lang]);

  useEffect(() => {
    if (mode !== "edit") localStorage.setItem("fallout_mode", mode);
  }, [mode]);

  const [modal, setModal] = useState(null); // 'chars' | 'notes' | 'admin' | 'log' | null
  const [templates, setTemplates] = useState({
    weapons: [],
    inventory: [],
    perks: [],
  });
  const [tplTab, setTplTab] = useState("weapons");
  const [tplDraft, setTplDraft] = useState({
    weapons: null,
    inventory: null,
    perks: null,
  });

  // theme: green/amber/science/radiation (migrates legacy paper/pipboy)
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("fallout_theme");
    return THEMES.includes(stored) ? stored : "green";
  });
  const [scanlines, setScanlines] = useState(
    () => localStorage.getItem("fallout_scanlines") !== "0",
  );

  useEffect(() => {
    localStorage.setItem("fallout_scanlines", scanlines ? "1" : "0");
  }, [scanlines]);

  useEffect(() => {
    localStorage.setItem("fallout_theme", theme);
    const colors = THEME_COLORS[theme] || THEME_COLORS.green;

    // Theme class on <html> drives the CSS variable palette
    document.documentElement.classList.remove(
      ...THEMES.map((tn) => `theme-${tn}`),
    );
    if (theme !== "green")
      document.documentElement.classList.add(`theme-${theme}`);

    // Theme color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) metaThemeColor.setAttribute("content", colors.bg);

    // Dynamic favicon generation (Pip-Boy dial in theme color)
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="none" stroke="${colors.fg}" stroke-width="4"/>
        <circle cx="50" cy="50" r="10" fill="${colors.fg}"/>
        <path d="M50 50 L50 4 A46 46 0 0 1 89.8 27 L50 50 Z" fill="${colors.fg}"/>
        <path d="M50 50 L10.2 73 A46 46 0 0 1 10.2 27 L50 50 Z" fill="${colors.fg}"/>
        <path d="M50 50 L89.8 73 A46 46 0 0 1 50 96 L50 50 Z" fill="${colors.fg}"/>
      </svg>
    `.trim();

    const encodedSvg = window.btoa(svgIcon);
    const dataUri = `data:image/svg+xml;base64,${encodedSvg}`;

    const link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/svg+xml";
    link.rel = "icon";
    link.href = dataUri;
    document.getElementsByTagName("head")[0].appendChild(link);

    const appleLink =
      document.querySelector("link[rel*='apple-touch-icon']") ||
      document.createElement("link");
    appleLink.rel = "apple-touch-icon";
    appleLink.href = dataUri;
    document.getElementsByTagName("head")[0].appendChild(appleLink);
  }, [theme]);

  const [pickerConfig, setPickerConfig] = useState({
    isOpen: false,
    type: "weapons",
  });
  const [qtyPop, setQtyPop] = useState(null);

  // dice state
  const [diceType, setDiceType] = useState("d20");
  const [diceCounts, setDiceCounts] = useState({ d20: 2, d6: 3 });
  const [rolling, setRolling] = useState(false);
  const [spinFaces, setSpinFaces] = useState(null);
  const [lastRoll, setLastRoll] = useState(null);
  const [rollLog, setRollLog] = useState([]);
  const spinRef = useRef(null);
  const settleRef = useRef(null);
  useEffect(
    () => () => {
      clearInterval(spinRef.current);
      clearTimeout(settleRef.current);
    },
    [],
  );

  const sortedCharacters = useMemo(() => {
    return [...characters].sort((a, b) =>
      a.name.localeCompare(b.name, lang, {
        sensitivity: "accent",
        numeric: true,
      }),
    );
  }, [characters, lang]);

  const sortedTemplates = useMemo(() => {
    const sortFn = (a, b) =>
      (a.name || "").localeCompare(b.name || "", lang, {
        sensitivity: "accent",
        numeric: true,
      });
    return {
      weapons: [...templates.weapons].sort(sortFn),
      inventory: [...templates.inventory].sort(sortFn),
      perks: [...templates.perks].sort(sortFn),
    };
  }, [templates, lang]);

  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef(null);
  const dragRef = useRef({ draggedId: null });

  const reorderList = (listName, draggedId, targetId) => {
    if (!localChar) return;
    if (!draggedId || !targetId || draggedId === targetId) return;
    const list = [...(localChar[listName] || [])];
    const from = list.findIndex((x) => x.id === draggedId);
    const to = list.findIndex((x) => x.id === targetId);
    if (from === -1 || to === -1) return;
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    setLocalChar({ ...localChar, [listName]: list });
  };
  const moveItem = (listName, id, dir) => {
    if (!localChar) return;
    const list = [...(localChar[listName] || [])];
    const from = list.findIndex((x) => x.id === id);
    const to = from + dir;
    if (from === -1 || to < 0 || to >= list.length) return;
    const tmp = list[from];
    list[from] = list[to];
    list[to] = tmp;
    setLocalChar({ ...localChar, [listName]: list });
  };
  const onDragStartRow = (listName, id) => (e) => {
    if (!isEditing) return;
    dragRef.current.draggedId = id;
    try {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
    } catch (_) {}
  };
  const onDragOverRow = () => (e) => {
    if (!isEditing) return;
    e.preventDefault();
    try {
      e.dataTransfer.dropEffect = "move";
    } catch (_) {}
  };
  const onDropRow = (listName, targetId) => (e) => {
    if (!isEditing) return;
    e.preventDefault();
    const draggedId = dragRef.current.draggedId;
    reorderList(listName, draggedId, targetId);
    dragRef.current.draggedId = null;
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "fallout_characters",
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const chars = snapshot.docs.map((d) =>
          normalizeCharacter({ id: d.id, ...d.data() }),
        );
        setCharacters(chars);
        setLoading(false);
      },
      (error) => {
        console.error("Characters fetch error:", error);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const mk = (name) =>
      collection(db, "artifacts", appId, "public", "data", name);
    const unsubW = onSnapshot(mk("fallout_templates_weapons"), (s) =>
      setTemplates((p) => ({
        ...p,
        weapons: s.docs.map((d) => ({ id: d.id, ...d.data() })),
      })),
    );
    const unsubI = onSnapshot(mk("fallout_templates_inventory"), (s) =>
      setTemplates((p) => ({
        ...p,
        inventory: s.docs.map((d) => ({ id: d.id, ...d.data() })),
      })),
    );
    const unsubP = onSnapshot(mk("fallout_templates_perks"), (s) =>
      setTemplates((p) => ({
        ...p,
        perks: s.docs.map((d) => ({ id: d.id, ...d.data() })),
      })),
    );
    return () => {
      unsubW();
      unsubI();
      unsubP();
    };
  }, [user]);

  // Sync local buffer from remote unless the user is editing (or has
  // unsaved play-mode tweaks in flight).
  useEffect(() => {
    if (selectedCharId) {
      const found = characters.find((c) => c.id === selectedCharId);
      if (found && mode !== "edit" && !playDirty) {
        setLocalChar(normalizeCharacter(found));
        setHistoryIndex(0);
      }
    } else {
      setLocalChar(null);
      setHistoryIndex(0);
    }
  }, [selectedCharId, characters, mode, playDirty]);

  // Play-mode autosave: debounce writes of play-time tweaks (HP, luck,
  // ammo counts, injuries) straight to the cloud — no history snapshot.
  useEffect(() => {
    if (mode !== "play" || !playDirty || !localChar || !user || !localChar.id)
      return;
    const timer = setTimeout(async () => {
      try {
        const { imageUrl, history, createdAt, ...data } = localChar;
        await setDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "fallout_characters",
            localChar.id,
          ),
          data,
          { merge: true },
        );
        setPlayDirty(false);
      } catch (e) {
        console.error("Play autosave error:", e);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [localChar, playDirty, mode, user]);

  const updateField = (path, value) => {
    if (!localChar) return;
    setLocalChar((prev) => {
      if (!prev) return null;
      const copy = { ...prev };
      if (path.includes(".")) {
        const pts = path.split(".");
        let cur = copy;
        for (let i = 0; i < pts.length - 1; i++) {
          cur[pts[i]] = { ...cur[pts[i]] };
          cur = cur[pts[i]];
        }
        cur[pts[pts.length - 1]] = value;
      } else {
        copy[path] = value;
      }
      return copy;
    });
  };
  // Play-editable fields route through this so play mode autosaves.
  const updatePlayField = (path, value) => {
    updateField(path, value);
    if (mode === "play") setPlayDirty(true);
  };
  const addItem = (listName) => {
    if (!localChar) return;
    const id = crypto.randomUUID();
    let item = {};
    if (listName === "weapons")
      item = {
        id,
        name: "",
        skill: "",
        targetNum: "",
        damage: "",
        effects: "",
        type: "",
        rateOfFire: "",
        range: "",
        attributes: "",
        ammo: "",
        weight: "",
        assigned: false,
      };
    if (listName === "inventory")
      item = { id, type: "other", name: "", quantity: "1", weight: "" };
    if (listName === "perks") item = { id, name: "", rank: "1", effect: "" };
    setLocalChar({ ...localChar, [listName]: [...localChar[listName], item] });
  };
  const removeItem = (listName, id) => {
    if (!localChar) return;
    setLocalChar({
      ...localChar,
      [listName]: localChar[listName].filter((i) => i.id !== id),
    });
  };
  const updateListItem = (listName, id, f, v) => {
    if (!localChar) return;
    const list = localChar[listName].map((i) =>
      i.id === id ? { ...i, [f]: v } : i,
    );
    setLocalChar({ ...localChar, [listName]: list });
  };
  const stepQty = (id, dir) => {
    if (!localChar) return;
    const list = localChar.inventory.map((i) =>
      i.id === id
        ? {
            ...i,
            quantity: String(Math.max(0, (parseInt(i.quantity, 10) || 0) + dir)),
          }
        : i,
    );
    setLocalChar({ ...localChar, inventory: list });
    if (mode === "play") setPlayDirty(true);
  };
  const addFromTemplate = (tpl) => {
    if (!localChar) return;
    const ln = pickerConfig.type;
    const id = crypto.randomUUID();
    if (ln === "weapons") {
      setLocalChar({
        ...localChar,
        weapons: [
          ...localChar.weapons,
          {
            id,
            name: tpl.name || "",
            skill: tpl.skill || "",
            assigned: !!tpl.assigned,
            targetNum: tpl.targetNum || "",
            damage: tpl.damage || "",
            effects: tpl.effects || "",
            type: tpl.type || "",
            rateOfFire: tpl.rateOfFire || "",
            range: tpl.range || "",
            attributes: tpl.attributes || "",
            ammo: tpl.ammo || "",
            weight: tpl.weight || "",
          },
        ],
      });
      return;
    }
    if (ln === "inventory") {
      setLocalChar({
        ...localChar,
        inventory: [
          ...localChar.inventory,
          {
            id,
            type: tpl.type || "other",
            name: tpl.name || "",
            weight: tpl.weight || "",
            quantity: tpl.quantity || "1",
          },
        ],
      });
      return;
    }
    if (ln === "perks") {
      setLocalChar({
        ...localChar,
        perks: [
          ...localChar.perks,
          {
            id,
            name: tpl.name || "",
            rank: tpl.rank || "1",
            effect: tpl.effect || "",
          },
        ],
      });
    }
  };
  const saveTemplate = async (tab, draft) => {
    if (!draft) return;
    const col =
      tab === "weapons"
        ? "fallout_templates_weapons"
        : tab === "inventory"
          ? "fallout_templates_inventory"
          : "fallout_templates_perks";
    const did = draft.id || crypto.randomUUID();
    const { id, ...data } = draft;
    try {
      await setDoc(
        doc(db, "artifacts", appId, "public", "data", col, did),
        data,
        { merge: true },
      );
      setTplDraft((p) => ({ ...p, [tab]: null }));
    } catch (e) {
      console.error(e);
    }
  };
  const deleteTemplate = async (tab, id) => {
    const col =
      tab === "weapons"
        ? "fallout_templates_weapons"
        : tab === "inventory"
          ? "fallout_templates_inventory"
          : "fallout_templates_perks";
    try {
      await deleteDoc(doc(db, "artifacts", appId, "public", "data", col, id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (nextMode = "locked") => {
    if (!user || !localChar) return;
    try {
      // Prepare snapshot - strip unnecessary/large fields
      const { imageUrl, history, createdAt, ...snapshot } = localChar;

      const newHistory = [snapshot, ...(localChar.history || [])].slice(0, 50);

      await setDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "fallout_characters",
          localChar.id,
        ),
        { ...localChar, history: newHistory },
        { merge: true },
      );

      setMode(nextMode);
      setHistoryIndex(0);
    } catch (e) {
      console.error("Save error:", e);
      alert("Chyba při ukládání: " + (e.message || "Nedostatečná oprávnění"));
    }
  };

  // Immediately persist pending play-mode tweaks (skips the debounce).
  const flushPlaySave = async () => {
    if (!user || !localChar || !localChar.id) return;
    try {
      const { imageUrl, history, createdAt, ...data } = localChar;
      await setDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "fallout_characters",
          localChar.id,
        ),
        data,
        { merge: true },
      );
      setPlayDirty(false);
    } catch (e) {
      console.error("Play save error:", e);
    }
  };

  // Leaving edit mode always saves first (no silent data loss).
  const switchMode = (m) => {
    if (m === mode) return;
    setQtyPop(null);
    if (mode === "edit" && localChar) {
      handleSave(m);
      return;
    }
    if (mode === "play" && playDirty) flushPlaySave();
    setMode(m);
  };

  const handleCreate = async () => {
    if (!user) return;
    const id = crypto.randomUUID();
    const nc = {
      ...DEFAULT_CHARACTER,
      name: lang === "en" ? "New Character" : "Nová Postava",
      id: id,
      createdAt: serverTimestamp(),
    };
    try {
      // Create initial snapshot (exclude large/circular/invalid fields)
      const { imageUrl, history, createdAt, ...snapshot } = nc;
      nc.history = [snapshot];

      await setDoc(
        doc(db, "artifacts", appId, "public", "data", "fallout_characters", id),
        nc,
      );

      setSelectedCharId(id);
      setMode("edit");
      setLocalChar(normalizeCharacter(nc));
      setHistoryIndex(0);
      setModal(null);
    } catch (e) {
      console.error("Create error:", e);
      alert("Chyba při vytváření: " + e.message);
    }
  };

  const handleSelectChar = (id) => {
    if (mode === "edit" && localChar && localChar.id !== id) {
      handleSave("locked");
    }
    if (mode === "play" && playDirty && localChar && localChar.id !== id) {
      flushPlaySave();
    }
    setSelectedCharId(id || null);
    setPlayDirty(false);
    setQtyPop(null);
    setModal(null);
  };

  const handleUndo = () => {
    const hist = localChar?.history || [];
    if (hist.length > 0 && historyIndex < hist.length - 1) {
      const nextIndex = historyIndex + 1;
      const entry = hist[nextIndex];
      const img = localChar.imageUrl;
      const fullHist = localChar.history;

      const restored = normalizeCharacter({ ...entry, id: localChar.id });
      restored.imageUrl = img;
      restored.history = fullHist;

      setHistoryIndex(nextIndex);
      setLocalChar(restored);
      setMode("edit");
    }
  };

  const handleRedo = () => {
    const hist = localChar?.history || [];
    if (hist.length > 0 && historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      const entry = hist[nextIndex];
      const img = localChar.imageUrl;
      const fullHist = localChar.history;

      const restored = normalizeCharacter({ ...entry, id: localChar.id });
      restored.imageUrl = img;
      restored.history = fullHist;

      setHistoryIndex(nextIndex);
      setLocalChar(restored);
      setMode("edit");
    }
  };

  const handleDelete = async () => {
    if (!user || !selectedCharId) return;
    if (window.confirm(t.confirmDelete)) {
      try {
        await deleteDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "fallout_characters",
            selectedCharId,
          ),
        );
        setSelectedCharId(null);
        setLocalChar(null);
        setMode("locked");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleImageUpload = (ev) => {
    const file = ev.target.files?.[0];
    if (!file || !localChar) return;
    const rd = new FileReader();
    rd.onload = (e) => {
      const img = new Image();
      img.onload = async () => {
        const cvs = document.createElement("canvas");
        const MAX = 200;
        let w = img.width,
          hh = img.height;
        if (w > hh) {
          if (w > MAX) {
            hh *= MAX / w;
            w = MAX;
          }
        } else {
          if (hh > MAX) {
            w *= MAX / hh;
            hh = MAX;
          }
        }
        cvs.width = w;
        cvs.height = hh;
        cvs.getContext("2d")?.drawImage(img, 0, 0, w, hh);
        const b64 = cvs.toDataURL("image/jpeg", 0.8);
        updateField("imageUrl", b64);
        try {
          if (localChar?.id)
            await setDoc(
              doc(
                db,
                "artifacts",
                appId,
                "public",
                "data",
                "fallout_characters",
                localChar.id,
              ),
              { imageUrl: b64 },
              { merge: true },
            );
        } catch (err) {
          console.error(err);
        }
      };
      img.src = e.target?.result;
    };
    rd.readAsDataURL(file);
  };

  // --- dice ---
  const buildRoll = (type, values) => {
    let summary;
    if (type === "d20") {
      summary = {
        sum: values.reduce((a, b) => a + b, 0),
        crit: values.filter((v) => v === 1).length,
        compl: values.filter((v) => v === 20).length,
      };
    } else {
      let dmg = 0,
        eff = 0;
      values.forEach((v) => {
        if (v === 1) dmg += 1;
        else if (v === 2) dmg += 2;
        else if (v >= 5) {
          dmg += 1;
          eff += 1;
        }
      });
      summary = { dmg, eff };
    }
    let ts = "";
    try {
      ts = new Date().toLocaleTimeString(lang === "en" ? "en-US" : "cs-CZ", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (e) {}
    return {
      id: Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      type,
      values,
      summary,
      ts,
    };
  };
  const rollDice = () => {
    if (rolling) return;
    const n = diceType === "d20" ? diceCounts.d20 : diceCounts.d6;
    const sides = diceType === "d20" ? 20 : 6;
    const rnd = () => 1 + Math.floor(Math.random() * sides);
    setRolling(true);
    setLastRoll(null);
    setSpinFaces(Array.from({ length: n }, rnd));
    clearInterval(spinRef.current);
    spinRef.current = setInterval(
      () => setSpinFaces(Array.from({ length: n }, rnd)),
      70,
    );
    clearTimeout(settleRef.current);
    settleRef.current = setTimeout(() => {
      clearInterval(spinRef.current);
      const rec = buildRoll(
        diceType,
        Array.from({ length: n }, rnd),
      );
      setRolling(false);
      setSpinFaces(null);
      setLastRoll(rec);
      setRollLog((p) => [rec, ...p].slice(0, 60));
    }, 850);
  };
  const stepDice = (dir) => {
    if (rolling) return;
    setDiceCounts((p) => {
      if (diceType === "d20")
        return { ...p, d20: Math.max(1, Math.min(5, p.d20 + dir)) };
      return { ...p, d6: Math.max(1, Math.min(12, p.d6 + dir)) };
    });
  };
  const dieFace = (type, v) => {
    if (type === "d20") {
      return {
        big: String(v),
        sub: "",
        tag: "d20",
        cls: v === 1 ? "crit" : v === 20 ? "compl" : "",
      };
    }
    if (v === 1) return { big: "1", sub: "", tag: "CD", cls: "" };
    if (v === 2) return { big: "2", sub: "", tag: "CD", cls: "" };
    if (v === 3 || v === 4) return { big: "0", sub: "", tag: "CD", cls: "zero" };
    return { big: "❋", sub: "+1", tag: "CD", cls: "compl" };
  };

  const skillsList = useMemo(
    () =>
      [
        { key: "athletics", label: t.s_athletics },
        { key: "barter", label: t.s_barter },
        { key: "bigGuns", label: t.s_bigGuns },
        { key: "energyWeapons", label: t.s_energyWeapons },
        { key: "explosives", label: t.s_explosives },
        { key: "lockpick", label: t.s_lockpick },
        { key: "medicine", label: t.s_medicine },
        { key: "meleeWeapons", label: t.s_meleeWeapons },
        { key: "pilot", label: t.s_pilot },
        { key: "repair", label: t.s_repair },
        { key: "science", label: t.s_science },
        { key: "smallGuns", label: t.s_smallGuns },
        { key: "sneak", label: t.s_sneak },
        { key: "speech", label: t.s_speech },
        { key: "survival", label: t.s_survival },
        { key: "throwing", label: t.s_throwing },
        { key: "unarmed", label: t.s_unarmed },
      ].sort((a, b) => a.label.localeCompare(b.label)),
    [t],
  );

  if (loading) return h("div", { className: "pb-loading" }, t.loading);

  // --- derived render values ---
  const hpMax = Math.max(0, parseInt(localChar?.hpMax, 10) || 0);
  const hpCur = Math.max(0, parseInt(localChar?.hpCurrent, 10) || 0);
  const segCount = Math.min(hpMax, 40);
  const hpSegs = Array.from({ length: segCount }, (_, i) => i < hpCur);
  const hpRatio = hpMax ? hpCur / hpMax : 0;
  const hpCritical = hpRatio < 0.34;

  const modeBadge =
    mode === "edit" ? t.badgeEdit : mode === "play" ? t.badgePlay : t.badgeLock;

  const dCount = diceType === "d20" ? diceCounts.d20 : diceCounts.d6;
  let diceView;
  if (rolling && spinFaces) {
    diceView = spinFaces.map((v, i) => ({
      key: i,
      ...dieFace(diceType, v),
      anim: "spin",
    }));
  } else if (lastRoll) {
    diceView = lastRoll.values.map((v, i) => ({
      key: i,
      ...dieFace(lastRoll.type, v),
      anim: "pop",
    }));
  } else {
    diceView = Array.from({ length: dCount }, (_, i) => ({
      key: i,
      big: "?",
      sub: "",
      tag: diceType === "d20" ? "d20" : "CD",
      cls: "",
      anim: "idle",
    }));
  }
  let lastLine = "",
    lastExtra = "";
  if (lastRoll) {
    const sm = lastRoll.summary;
    if (lastRoll.type === "d20") {
      lastLine = t.diceSum + " " + sm.sum;
      const bits = [];
      if (sm.crit) bits.push(sm.crit + " " + t.diceCrit);
      if (sm.compl) bits.push(sm.compl + " " + t.diceCompl);
      lastExtra = bits.length ? "· " + bits.join(" · ") : "";
    } else {
      lastLine = t.diceDmg + ": " + sm.dmg;
      lastExtra = "· " + sm.eff + " " + t.diceEff;
    }
  }

  const specialDefs = [
    { key: "strength", code: "SIL", codeEn: "STR", label: t.strength },
    { key: "perception", code: "VNI", codeEn: "PER", label: t.perception },
    { key: "endurance", code: "ODO", codeEn: "END", label: t.endurance },
    { key: "charisma", code: "CHA", codeEn: "CHA", label: t.charisma },
    { key: "intelligence", code: "INT", codeEn: "INT", label: t.intelligence },
    { key: "agility", code: "HBI", codeEn: "AGI", label: t.agility },
    { key: "luck", code: "STE", codeEn: "LCK", label: t.luck },
  ];

  const locDefs = [
    { field: "resHead", name: t.loc_head, area: { gridColumn: 2, gridRow: 1 } },
    { field: "resLArm", name: t.loc_larm, area: { gridColumn: 1, gridRow: 2 } },
    {
      field: "resTorso",
      name: t.loc_torso,
      area: { gridColumn: 2, gridRow: 2 },
    },
    { field: "resRArm", name: t.loc_rarm, area: { gridColumn: 3, gridRow: 2 } },
    { field: "resLLeg", name: t.loc_lleg, area: { gridColumn: 1, gridRow: 3 } },
    { field: "resRLeg", name: t.loc_rleg, area: { gridColumn: 3, gridRow: 3 } },
  ];

  const weaponCols = [
    t.w_name,
    t.w_skill,
    t.w_assigned,
    t.w_tn,
    t.w_dmg,
    t.w_effects,
    t.w_type,
    t.w_rate,
    t.w_range,
    t.w_qual,
    t.w_ammo,
    t.w_weight,
  ];

  const rowButtons = (listName, id) =>
    h(
      "div",
      { className: "pb-rowbtns pb-noprint" },
      isEditing &&
        h(
          React.Fragment,
          null,
          h(
            "button",
            {
              className: "pb-rowbtn",
              title: t.dragTip,
              onClick: () => moveItem(listName, id, -1),
            },
            "▲",
          ),
          h(
            "button",
            {
              className: "pb-rowbtn",
              title: t.dragTip,
              onClick: () => moveItem(listName, id, 1),
            },
            "▼",
          ),
          h(
            "button",
            {
              className: "pb-rowbtn del",
              onClick: () => removeItem(listName, id),
            },
            "✕",
          ),
        ),
    );

  return h(
    "div",
    { className: "pb-root" },
    scanlines && h("div", { className: "pb-scanlines pb-noprint" }),
    h("div", { className: "pb-vignette pb-noprint" }),
    h("div", { className: "pb-scanbeam pb-noprint" }),
    h(
      "div",
      { className: "pb-wrap" },

      // ---------- TOPBAR ----------
      h(
        "div",
        { className: "pb-topbar" },
        h(
          "div",
          { className: "pb-topbar-row" },
          h(
            "div",
            { className: "pb-topbar-brand" },
            h("span", { className: "pb-status-dot" }),
            h("span", { className: "pb-brand-title" }, "PIP-BOY 2000 MK VI"),
            h("span", { className: "pb-brand-sub" }, "RobCo Industries"),
          ),
          selectedCharId &&
            h(
              "button",
              {
                className: "pb-chip danger pb-push-right pb-noprint",
                onClick: handleDelete,
              },
              "✕ " + t.btnDelete,
            ),
        ),
        h(
          "div",
          { className: "pb-toolbar pb-noprint" },
          h(
            "button",
            {
              className: "pb-chip",
              title: "Změnit styl / Change style",
              onClick: () =>
                setTheme(
                  THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length],
                ),
            },
            "◉ " + t.btnStyle,
          ),
          h(
            "button",
            {
              className: `pb-chip ${scanlines ? "" : "dim"}`,
              title: "Scanlines",
              onClick: () => setScanlines((s) => !s),
            },
            "▤ CRT",
          ),
          h(
            "button",
            {
              className: "pb-chip",
              title: t.btnPrint,
              onClick: () => {
                try {
                  window.print();
                } catch (e) {}
              },
            },
            "⎙ " + t.btnPrint,
          ),
          h(
            "button",
            {
              className: "pb-chip",
              onClick: () => setLang(lang === "cs" ? "en" : "cs"),
            },
            "⊕ " + lang.toUpperCase(),
          ),
          h(
            "button",
            {
              className: "pb-chip inset",
              onClick: () => setModal("chars"),
            },
            (localChar ? localChar.name : t.selectChar) + " ▾",
          ),
          h(
            "button",
            { className: "pb-chip dim", onClick: () => setModal("admin") },
            "⚙ " + t.btnAdmin,
          ),
          h(
            "button",
            { className: "pb-chip accent", onClick: handleCreate },
            "+ " + t.btnNew,
          ),
          selectedCharId &&
            h(
              React.Fragment,
              null,
              h(
                "button",
                {
                  className: "pb-chip dim",
                  title: t.btnUndo,
                  disabled:
                    historyIndex >= (localChar?.history?.length || 0) - 1,
                  onClick: handleUndo,
                },
                "↶",
              ),
              h(
                "button",
                {
                  className: "pb-chip dim",
                  title: t.btnRedo,
                  disabled: historyIndex <= 0,
                  onClick: handleRedo,
                },
                "↷",
              ),
              h(
                "div",
                { className: "pb-mode-switch" },
                h(
                  "button",
                  {
                    className: `pb-mode-btn ${mode === "edit" ? "active" : ""}`,
                    onClick: () => switchMode("edit"),
                  },
                  "✎ " + t.mEdit,
                ),
                h(
                  "button",
                  {
                    className: `pb-mode-btn ${mode === "play" ? "active" : ""}`,
                    onClick: () => switchMode("play"),
                  },
                  "▶ " + t.mPlay,
                ),
                h(
                  "button",
                  {
                    className: `pb-mode-btn ${mode === "locked" ? "active" : ""}`,
                    onClick: () => switchMode("locked"),
                  },
                  "⊘ " + t.mLock,
                ),
              ),
              isEditing &&
                h(
                  "button",
                  {
                    className: "pb-chip save",
                    onClick: () => handleSave("locked"),
                  },
                  "▣ " + t.btnSave,
                ),
            ),
        ),
      ),

      // ---------- SHEET ----------
      !localChar
        ? h(
            "div",
            { className: "pb-panel" },
            h(
              "div",
              { className: "pb-empty-state" },
              h("div", null, t.noData),
              h(
                "button",
                {
                  className: "pb-chip accent pb-noprint",
                  style: { marginTop: "18px" },
                  onClick: () => setModal("chars"),
                },
                "◈ " + t.chooseChar,
              ),
            ),
          )
        : h(
            React.Fragment,
            null,

            // ---------- IDENTITY ----------
            h(
              "div",
              { className: "pb-panel" },
              h(
                PanelHead,
                { title: t.survivor },
                h("span", { className: `pb-badge ${mode === "locked" ? "dim" : ""}` }, modeBadge),
                h(
                  "button",
                  {
                    className: "pb-chip pb-push-right pb-noprint",
                    onClick: () => setModal("notes"),
                  },
                  "+ " + t.btnNotes,
                ),
              ),
              h(
                "div",
                { className: "pb-identity-grid" },
                h(
                  "div",
                  {
                    className: `pb-portrait ${isEditing ? "editable" : ""}`,
                    onClick: () => isEditing && fileInputRef.current?.click(),
                  },
                  h("div", { className: "pb-portrait-scan" }),
                  localChar.imageUrl
                    ? h("img", {
                        key: `portrait-${localChar.id}`,
                        src: localChar.imageUrl,
                        alt: "Char",
                      })
                    : h(
                        React.Fragment,
                        null,
                        h(
                          "span",
                          { className: "pb-portrait-initials" },
                          computeInitials(localChar.name),
                        ),
                        h(
                          "span",
                          { className: "pb-portrait-origin" },
                          localChar.origin,
                        ),
                      ),
                  isEditing &&
                    h(
                      "div",
                      { className: "pb-portrait-upload pb-noprint" },
                      h("span", null, "⇪"),
                      h("span", null, t.uploadImg),
                    ),
                ),
                h("input", {
                  type: "file",
                  ref: fileInputRef,
                  onChange: handleImageUpload,
                  accept: "image/*",
                  style: { display: "none" },
                }),
                h(
                  "div",
                  { className: "pb-id-fields" },
                  h(
                    "div",
                    { className: "pb-game-title" },
                    h("span", { className: "main" }, "FALLOUT"),
                    h("span", { className: "sub" }, t.subtitle),
                  ),
                  h(PbField, {
                    label: t.name,
                    value: localChar.name,
                    onChange: (v) => updateField("name", v),
                    disabled: !isEditing,
                    className: "full",
                    inputClass: "pb-input big-name",
                  }),
                  h(PbField, {
                    label: t.origin,
                    value: localChar.origin,
                    onChange: (v) => updateField("origin", v),
                    disabled: !isEditing,
                  }),
                  h(
                    "div",
                    { className: "pb-lvl-grid" },
                    h(
                      "div",
                      { className: "pb-field" },
                      h("span", { className: "pb-label" }, t.level),
                      h("input", {
                        className: "pb-num",
                        value: localChar.level,
                        onChange: (e) => updateField("level", e.target.value),
                        disabled: !isEditing,
                      }),
                    ),
                    h(
                      "div",
                      { className: "pb-field" },
                      h("span", { className: "pb-label" }, t.xp),
                      h("input", {
                        className: "pb-num",
                        value: localChar.xp,
                        onChange: (e) => updateField("xp", e.target.value),
                        disabled: !isEditing,
                      }),
                    ),
                    h(
                      "div",
                      { className: "pb-field" },
                      h(
                        "span",
                        {
                          className: "pb-label",
                          style: { whiteSpace: "nowrap" },
                        },
                        t.xpNext,
                      ),
                      h("input", {
                        className: "pb-num",
                        value: localChar.xpNext,
                        onChange: (e) => updateField("xpNext", e.target.value),
                        disabled: !isEditing,
                      }),
                    ),
                  ),
                ),
                h(
                  "div",
                  { className: "pb-hpbox" },
                  h("span", { className: "pb-label" }, t.health),
                  h(
                    "div",
                    { className: "pb-hp-row" },
                    h("input", {
                      className: "pb-num xl cur",
                      value: localChar.hpCurrent,
                      onChange: (e) =>
                        updatePlayField("hpCurrent", e.target.value),
                      disabled: !canPlay,
                    }),
                    h("span", { className: "pb-hp-sep" }, "/"),
                    h("input", {
                      className: "pb-num max",
                      value: localChar.hpMax,
                      onChange: (e) => updateField("hpMax", e.target.value),
                      disabled: !isEditing,
                    }),
                    h(
                      "span",
                      {
                        className: `pb-badge pb-push-right ${hpCritical ? "warn" : ""}`,
                      },
                      hpCritical ? t.hpCritical : t.hpStable,
                    ),
                  ),
                  h(
                    "div",
                    { className: "pb-hp-track" },
                    hpSegs.map((on, i) =>
                      h("span", {
                        key: i,
                        className: `pb-hp-seg ${on ? "on" : ""}`,
                      }),
                    ),
                  ),
                ),
              ),
            ),

            // ---------- SPECIAL ----------
            h(
              "div",
              { className: "pb-panel" },
              h(PanelHead, {
                title: "S.P.E.C.I.A.L",
                note: h(
                  "span",
                  { className: "pb-head-note" },
                  t.luckPoints,
                  " · ",
                  h("b", null, localChar.luckPoints),
                ),
              }),
              h(
                "div",
                { className: "pb-special-grid" },
                specialDefs.map((s) =>
                  h(
                    "div",
                    { key: s.key, className: "pb-special-card" },
                    h("input", {
                      className: "pb-num",
                      value: localChar[s.key],
                      onChange: (e) => updateField(s.key, e.target.value),
                      disabled: !isEditing,
                    }),
                    h(
                      "span",
                      { className: "pb-special-code" },
                      lang === "en" ? s.codeEn : s.code,
                    ),
                    h("span", { className: "pb-special-label" }, s.label),
                  ),
                ),
              ),
            ),

            // ---------- DERIVED ----------
            h(
              "div",
              { className: "pb-derived-grid" },
              [
                {
                  label: t.defense,
                  value: localChar.defense,
                  onChange: (v) => updateField("defense", v),
                  disabled: !isEditing,
                },
                {
                  label: t.initiative,
                  value: localChar.initiative,
                  onChange: (v) => updateField("initiative", v),
                  disabled: !isEditing,
                },
                {
                  label: t.meleeDmg,
                  value: localChar.meleeDamage,
                  onChange: (v) => updateField("meleeDamage", v),
                  disabled: !isEditing,
                },
                {
                  label: t.luckPoints,
                  value: localChar.luckPoints,
                  onChange: (v) => updatePlayField("luckPoints", v),
                  disabled: !canPlay,
                },
                {
                  label: t.poisonRes,
                  value: localChar.poisonRes,
                  onChange: (v) => updateField("poisonRes", v),
                  disabled: !isEditing,
                },
                {
                  label: t.caps,
                  value: localChar.caps,
                  onChange: (v) => updateField("caps", v),
                  disabled: !isEditing,
                },
              ].map((d, i) =>
                h(
                  "div",
                  { key: i, className: "pb-derived-card" },
                  h("input", {
                    className: "pb-num lg",
                    value: d.value,
                    onChange: (e) => d.onChange(e.target.value),
                    disabled: d.disabled,
                  }),
                  h("span", { className: "pb-derived-label" }, d.label),
                ),
              ),
            ),

            // ---------- SKILLS + HIT LOCATIONS ----------
            h(
              "div",
              { className: "pb-cols-2" },
              h(
                "div",
                { className: "pb-panel" },
                h(PanelHead, {
                  title: t.skillsTitle,
                  note: h(
                    "span",
                    { className: "pb-head-note" },
                    "◼ = " + t.trained,
                  ),
                }),
                h(
                  "div",
                  { className: "pb-skills-body" },
                  skillsList.map((sk) =>
                    h(
                      "div",
                      { key: sk.key, className: "pb-skill-row" },
                      h("input", {
                        type: "checkbox",
                        className: "pb-check",
                        checked: !!localChar.skills[sk.key],
                        onChange: (e) =>
                          updateField(`skills.${sk.key}`, e.target.checked),
                        disabled: !isEditing,
                      }),
                      h("span", { className: "pb-skill-name" }, sk.label),
                      h("input", {
                        className: "pb-num md",
                        value: localChar.skills[`${sk.key}Val`],
                        onChange: (e) =>
                          updateField(`skills.${sk.key}Val`, e.target.value),
                        disabled: !isEditing,
                      }),
                    ),
                  ),
                ),
              ),
              h(
                "div",
                { className: "pb-panel" },
                h(PanelHead, { title: t.hitLocs }),
                h(
                  "div",
                  { className: "pb-loc-legend" },
                  h("span", null, "FYZ · " + t.dr_phys),
                  h("span", null, "EN · " + t.dr_en),
                  h("span", null, "RAD · " + t.dr_rad),
                  h("span", null, "BZ · " + t.dr_hp),
                ),
                h(
                  "div",
                  { className: "pb-loc-grid" },
                  locDefs.map((ld) =>
                    h(
                      "div",
                      { key: ld.field, style: ld.area },
                      h(BodyPartCard, {
                        name: ld.name,
                        data: localChar[ld.field],
                        field: ld.field,
                        update: updatePlayField,
                        canEdit: isEditing,
                        canPlay: canPlay,
                        t: t,
                      }),
                    ),
                  ),
                  h(
                    "div",
                    {
                      className: "pb-loc-center",
                      style: { gridColumn: 2, gridRow: 3 },
                    },
                    "⌖",
                  ),
                ),
                h(
                  "div",
                  { className: "pb-poison-row" },
                  h("span", { className: "pb-label" }, t.poisonRes),
                  h("input", {
                    className: "pb-num sm",
                    value: localChar.poisonRes,
                    onChange: (e) => updateField("poisonRes", e.target.value),
                    disabled: !isEditing,
                  }),
                ),

                // ---------- DICE ROLLER ----------
                h(
                  "div",
                  { className: "pb-dice pb-noprint" },
                  h(
                    "div",
                    { className: "pb-dice-head" },
                    h("span", { className: "pb-head-arrow" }, "◈"),
                    h("span", { className: "pb-dice-title" }, t.diceTitle),
                    h(
                      "div",
                      { className: "pb-dice-type" },
                      h(
                        "button",
                        {
                          className: `pb-mode-btn ${diceType === "d20" ? "active" : ""}`,
                          onClick: () => {
                            if (!rolling) {
                              setDiceType("d20");
                              setLastRoll(null);
                            }
                          },
                        },
                        "d20",
                      ),
                      h(
                        "button",
                        {
                          className: `pb-mode-btn ${diceType === "d6" ? "active" : ""}`,
                          onClick: () => {
                            if (!rolling) {
                              setDiceType("d6");
                              setLastRoll(null);
                            }
                          },
                        },
                        t.diceCombat,
                      ),
                    ),
                    h(
                      "button",
                      {
                        className: "pb-chip dim pb-push-right",
                        onClick: () => setModal("log"),
                      },
                      "▤ " + t.diceLog + " · " + rollLog.length,
                    ),
                  ),
                  h(
                    "div",
                    { className: "pb-dice-controls" },
                    h(
                      "div",
                      { className: "pb-dice-count" },
                      h(
                        "button",
                        {
                          className: "pb-dice-step",
                          onClick: () => stepDice(-1),
                        },
                        "−",
                      ),
                      h(
                        "span",
                        { className: "pb-dice-count-label" },
                        diceType === "d20" ? dCount + "d20" : dCount + "×CD",
                      ),
                      h(
                        "button",
                        {
                          className: "pb-dice-step",
                          onClick: () => stepDice(1),
                        },
                        "+",
                      ),
                    ),
                    h(
                      "span",
                      { className: "pb-dice-range" },
                      diceType === "d20" ? "1–5 d20" : "1–12 CD",
                    ),
                    h(
                      "button",
                      {
                        className: `pb-roll-btn ${rolling ? "rolling" : ""}`,
                        onClick: rollDice,
                      },
                      rolling ? "· · ·" : "⚁ " + t.diceRoll,
                    ),
                  ),
                  h(
                    "div",
                    { className: "pb-dice-tray" },
                    diceView.map((d) =>
                      h(
                        "div",
                        {
                          key: d.key,
                          className: `pb-die ${d.cls} ${d.anim}`,
                        },
                        h("span", { className: "pb-die-big" }, d.big),
                        d.sub &&
                          h("span", { className: "pb-die-sub" }, d.sub),
                        h("span", { className: "pb-die-tag" }, d.tag),
                      ),
                    ),
                  ),
                  lastRoll
                    ? h(
                        "div",
                        { className: "pb-last-roll" },
                        h("span", { className: "main" }, lastLine),
                        h("span", { className: "extra" }, lastExtra),
                      )
                    : !rolling &&
                        h(
                          "span",
                          { className: "pb-dice-hint" },
                          t.diceHint,
                        ),
                ),
              ),
            ),

            // ---------- WEAPONS ----------
            h(
              "div",
              { className: "pb-panel" },
              h(
                PanelHead,
                { title: t.weaponsTitle },
                h("span", { className: "pb-push-right" }),
                isEditing &&
                  h(
                    React.Fragment,
                    null,
                    h(
                      "button",
                      {
                        className: "pb-chip dim pb-noprint",
                        onClick: () =>
                          setPickerConfig({ isOpen: true, type: "weapons" }),
                      },
                      "⌕ " + t.fromTpl,
                    ),
                    h(
                      "button",
                      {
                        className: "pb-chip pb-noprint",
                        onClick: () => addItem("weapons"),
                      },
                      "+ " + t.btnAdd,
                    ),
                  ),
              ),
              h(
                "div",
                { className: "pb-tablewrap" },
                h(
                  "div",
                  { className: "pb-wtable" },
                  h(
                    "div",
                    { className: "pb-wgrid head" },
                    weaponCols.map((c, i) =>
                      h(
                        "span",
                        {
                          key: i,
                          style:
                            i === 2 || i === 3 || i === 4 || i === 7 || i === 8 || i === 11
                              ? { textAlign: "center" }
                              : null,
                        },
                        c,
                      ),
                    ),
                    h("span", null),
                  ),
                  localChar.weapons.map((w) =>
                    h(
                      "div",
                      {
                        key: w.id,
                        className: `pb-wgrid row ${isEditing ? "draggable" : ""}`,
                        draggable: isEditing,
                        onDragStart: onDragStartRow("weapons", w.id),
                        onDragOver: onDragOverRow(),
                        onDrop: onDropRow("weapons", w.id),
                      },
                      h(AutoResizeTextarea, {
                        className: "pb-cell",
                        value: w.name,
                        disabled: !isEditing,
                        onChange: (e) =>
                          updateListItem("weapons", w.id, "name", e.target.value),
                      }),
                      h(AutoResizeTextarea, {
                        className: "pb-cell dim",
                        value: w.skill,
                        disabled: !isEditing,
                        onChange: (e) =>
                          updateListItem(
                            "weapons",
                            w.id,
                            "skill",
                            e.target.value,
                          ),
                      }),
                      h("input", {
                        type: "checkbox",
                        className: "pb-check",
                        style: { justifySelf: "center" },
                        checked: !!w.assigned,
                        onChange: (e) =>
                          updateListItem(
                            "weapons",
                            w.id,
                            "assigned",
                            e.target.checked,
                          ),
                        disabled: !isEditing,
                      }),
                      h("input", {
                        className: "pb-num sm",
                        value: w.targetNum,
                        disabled: !isEditing,
                        onChange: (e) =>
                          updateListItem(
                            "weapons",
                            w.id,
                            "targetNum",
                            e.target.value,
                          ),
                      }),
                      h("input", {
                        className: "pb-num sm",
                        value: w.damage,
                        disabled: !isEditing,
                        onChange: (e) =>
                          updateListItem(
                            "weapons",
                            w.id,
                            "damage",
                            e.target.value,
                          ),
                      }),
                      h(AutoResizeTextarea, {
                        className: "pb-cell",
                        value: w.effects,
                        disabled: !isEditing,
                        onChange: (e) =>
                          updateListItem(
                            "weapons",
                            w.id,
                            "effects",
                            e.target.value,
                          ),
                      }),
                      h("input", {
                        className: "pb-cell dim",
                        value: w.type,
                        disabled: !isEditing,
                        onChange: (e) =>
                          updateListItem("weapons", w.id, "type", e.target.value),
                      }),
                      h("input", {
                        className: "pb-cell center",
                        value: w.rateOfFire,
                        disabled: !isEditing,
                        onChange: (e) =>
                          updateListItem(
                            "weapons",
                            w.id,
                            "rateOfFire",
                            e.target.value,
                          ),
                      }),
                      h("input", {
                        className: "pb-cell center",
                        value: w.range,
                        disabled: !isEditing,
                        onChange: (e) =>
                          updateListItem(
                            "weapons",
                            w.id,
                            "range",
                            e.target.value,
                          ),
                      }),
                      h(AutoResizeTextarea, {
                        className: "pb-cell dim",
                        value: w.attributes,
                        disabled: !isEditing,
                        onChange: (e) =>
                          updateListItem(
                            "weapons",
                            w.id,
                            "attributes",
                            e.target.value,
                          ),
                      }),
                      h("input", {
                        className: "pb-cell",
                        value: w.ammo,
                        disabled: !isEditing,
                        onChange: (e) =>
                          updateListItem("weapons", w.id, "ammo", e.target.value),
                      }),
                      h("input", {
                        className: "pb-cell center",
                        value: w.weight,
                        disabled: !isEditing,
                        onChange: (e) =>
                          updateListItem(
                            "weapons",
                            w.id,
                            "weight",
                            e.target.value,
                          ),
                      }),
                      rowButtons("weapons", w.id),
                    ),
                  ),
                ),
              ),
            ),

            // ---------- INVENTORY + PERKS ----------
            h(
              "div",
              { className: "pb-cols-2" },
              h(
                "div",
                { className: "pb-panel" },
                h(
                  PanelHead,
                  { title: t.invTitle },
                  h(
                    "span",
                    { className: "pb-head-note" },
                    t.caps,
                    " · ",
                    h("b", null, localChar.caps),
                  ),
                  isEditing &&
                    h(
                      React.Fragment,
                      null,
                      h(
                        "button",
                        {
                          className: "pb-chip dim pb-noprint",
                          onClick: () =>
                            setPickerConfig({
                              isOpen: true,
                              type: "inventory",
                            }),
                        },
                        "⌕",
                      ),
                      h(
                        "button",
                        {
                          className: "pb-chip pb-noprint",
                          onClick: () => addItem("inventory"),
                        },
                        "+",
                      ),
                    ),
                ),
                h(
                  "div",
                  { className: "pb-ibody" },
                  h(
                    "div",
                    { className: "pb-igrid head" },
                    h("span", null, t.i_item),
                    h("span", null, t.i_type),
                    h("span", { style: { textAlign: "center" } }, t.i_weight),
                    h("span", { style: { textAlign: "center" } }, t.i_qty),
                    h("span", null),
                  ),
                  localChar.inventory.map((it) =>
                    h(
                      "div",
                      {
                        key: it.id,
                        className: `pb-igrid row ${isEditing ? "draggable" : ""}`,
                        draggable: isEditing,
                        onDragStart: onDragStartRow("inventory", it.id),
                        onDragOver: onDragOverRow(),
                        onDrop: onDropRow("inventory", it.id),
                      },
                      h(AutoResizeTextarea, {
                        className: "pb-cell",
                        value: it.name,
                        disabled: !isEditing,
                        onChange: (e) =>
                          updateListItem(
                            "inventory",
                            it.id,
                            "name",
                            e.target.value,
                          ),
                      }),
                      isEditing
                        ? h(
                            "select",
                            {
                              className: "pb-type-pill",
                              value: it.type || "other",
                              onChange: (e) =>
                                updateListItem(
                                  "inventory",
                                  it.id,
                                  "type",
                                  e.target.value,
                                ),
                            },
                            ITEM_TYPES.map((o) =>
                              h(
                                "option",
                                { key: o.key, value: o.key },
                                lang === "en" ? o.en : o.cs,
                              ),
                            ),
                          )
                        : h(
                            "span",
                            { className: "pb-type-pill" },
                            getTypeLabel(it.type || "other", lang),
                          ),
                      h("input", {
                        className: "pb-cell center",
                        value: it.weight,
                        disabled: !isEditing,
                        onChange: (e) =>
                          updateListItem(
                            "inventory",
                            it.id,
                            "weight",
                            e.target.value,
                          ),
                      }),
                      mode === "play"
                        ? h(
                            "div",
                            { className: "pb-qty-wrap" },
                            h(
                              "button",
                              {
                                className: "pb-qty-view",
                                onClick: () =>
                                  setQtyPop(
                                    qtyPop === it.id ? null : it.id,
                                  ),
                              },
                              it.quantity,
                            ),
                            qtyPop === it.id &&
                              h(
                                "div",
                                { className: "pb-qty-pop" },
                                h(
                                  "button",
                                  { onClick: () => stepQty(it.id, -1) },
                                  "−",
                                ),
                                h(
                                  "span",
                                  { className: "val" },
                                  it.quantity,
                                ),
                                h(
                                  "button",
                                  { onClick: () => stepQty(it.id, 1) },
                                  "+",
                                ),
                              ),
                          )
                        : h("input", {
                            className: "pb-num sm",
                            value: it.quantity,
                            disabled: !isEditing,
                            onChange: (e) =>
                              updateListItem(
                                "inventory",
                                it.id,
                                "quantity",
                                e.target.value,
                              ),
                          }),
                      rowButtons("inventory", it.id),
                    ),
                  ),
                ),
              ),
              h(
                "div",
                { className: "pb-panel" },
                h(
                  PanelHead,
                  { title: t.perksTitle },
                  h("span", { className: "pb-push-right" }),
                  isEditing &&
                    h(
                      React.Fragment,
                      null,
                      h(
                        "button",
                        {
                          className: "pb-chip dim pb-noprint",
                          onClick: () =>
                            setPickerConfig({ isOpen: true, type: "perks" }),
                        },
                        "⌕",
                      ),
                      h(
                        "button",
                        {
                          className: "pb-chip pb-noprint",
                          onClick: () => addItem("perks"),
                        },
                        "+",
                      ),
                    ),
                ),
                h(
                  "div",
                  { className: "pb-perks-body" },
                  localChar.perks.map((pk) =>
                    h(
                      "div",
                      {
                        key: pk.id,
                        className: "pb-perk-row",
                        draggable: isEditing,
                        onDragStart: onDragStartRow("perks", pk.id),
                        onDragOver: onDragOverRow(),
                        onDrop: onDropRow("perks", pk.id),
                      },
                      h("input", {
                        className: "pb-perk-rank",
                        value: pk.rank,
                        disabled: !isEditing,
                        title: t.p_rank,
                        onChange: (e) =>
                          updateListItem("perks", pk.id, "rank", e.target.value),
                      }),
                      h(
                        "div",
                        { className: "pb-perk-main" },
                        h(AutoResizeTextarea, {
                          className: "pb-cell",
                          value: pk.name,
                          disabled: !isEditing,
                          onChange: (e) =>
                            updateListItem(
                              "perks",
                              pk.id,
                              "name",
                              e.target.value,
                            ),
                        }),
                        h(AutoResizeTextarea, {
                          className: "pb-cell dim",
                          value: pk.effect,
                          disabled: !isEditing,
                          onChange: (e) =>
                            updateListItem(
                              "perks",
                              pk.id,
                              "effect",
                              e.target.value,
                            ),
                        }),
                      ),
                      rowButtons("perks", pk.id),
                    ),
                  ),
                ),
              ),
            ),

            // ---------- NOTES ----------
            h(
              "div",
              { className: "pb-panel" },
              h(PanelHead, {
                title: t.notesTitle,
                note: h("span", { className: "pb-head-note" }, t.autosave),
              }),
              h(
                "div",
                { className: "pb-notes-body" },
                h("textarea", {
                  className: "pb-textarea",
                  value: localChar.notes || "",
                  placeholder: t.notesPh,
                  onChange: (e) => updateField("notes", e.target.value),
                  disabled: !isEditing,
                }),
              ),
            ),

            // ---------- STATUS BAR ----------
            h(
              "div",
              { className: "pb-statusbar" },
              h("span", null, "◉ " + t.online),
              h("span", { className: "sep" }, "//"),
              h(
                "span",
                null,
                t.autosave + ": ",
                h("b", null, mode === "play" ? t.active : t.manual),
              ),
              h("span", { className: "sep" }, "//"),
              h("span", null, t.storage + ": CLOUD"),
              h("span", { className: "sep" }, "//"),
              h(
                "span",
                null,
                t.chars + ": ",
                h("b", null, String(characters.length)),
              ),
              h("span", { className: "sep" }, "//"),
              h(
                "span",
                { className: "pb-push-right" },
                t.caps + ": ",
                h("b", null, localChar.caps),
              ),
              h("span", { className: "sep" }, "//"),
              h("span", { className: "pb-cursor" }, "▋"),
            ),
          ),
    ),

    // ---------- MODALS ----------
    h(TemplatePicker, {
      isOpen: pickerConfig.isOpen,
      type: pickerConfig.type,
      templates: templates[pickerConfig.type] || [],
      onSelect: addFromTemplate,
      onClose: () => setPickerConfig({ ...pickerConfig, isOpen: false }),
      onOpenAdmin: () => setModal("admin"),
      lang: lang,
      t: t,
    }),
    h(CharacterModal, {
      isOpen: modal === "chars",
      onClose: () => setModal(null),
      characters: sortedCharacters,
      selectedCharId: selectedCharId,
      onSelect: handleSelectChar,
      onCreate: handleCreate,
      t: t,
    }),
    h(NotesModal, {
      isOpen: modal === "notes",
      onClose: () => setModal(null),
      value: localChar?.notes,
      onChange: (v) => updateField("notes", v),
      disabled: !isEditing,
      t: t,
    }),
    h(RollLogModal, {
      isOpen: modal === "log",
      onClose: () => setModal(null),
      rollLog: rollLog,
      onClear: () => setRollLog([]),
      t: t,
    }),

    // ---------- ADMIN MODAL ----------
    modal === "admin" &&
      h(
        ModalShell,
        { onClose: () => setModal(null), className: "wide" },
        h(
          "div",
          { className: "pb-modal-head" },
          h("span", { className: "pb-modal-title" }, "⚙ " + t.adminTitle),
          h(
            "div",
            { className: "pb-mode-switch" },
            ["weapons", "inventory", "perks"].map((tab) =>
              h(
                "button",
                {
                  key: tab,
                  className: `pb-mode-btn ${tplTab === tab ? "active" : ""}`,
                  onClick: () => {
                    setTplTab(tab);
                    setTplDraft((p) => ({ ...p, [tab]: null }));
                  },
                },
                tab === "weapons"
                  ? t.weaponsTitle
                  : tab === "inventory"
                    ? t.invTitle
                    : t.perksTitle,
              ),
            ),
          ),
          h(
            "button",
            {
              className: "pb-chip accent pb-push-right",
              onClick: () =>
                setTplDraft((p) => ({
                  ...p,
                  [tplTab]: defaultTemplate(tplTab),
                })),
            },
            "+ " + t.newTpl,
          ),
          h(
            "button",
            { className: "pb-chip dim", onClick: () => setModal(null) },
            "✕",
          ),
        ),
        h("p", { className: "pb-admin-hint" }, t.adminHint),
        h(
          "div",
          { className: "pb-admin-grid" },
          h(
            "div",
            { className: "pb-admin-list" },
            (templates[tplTab] || []).length === 0
              ? h("div", { className: "pb-modal-empty" }, t.adminEmpty)
              : (sortedTemplates[tplTab] || []).map((row) =>
                  h(
                    "div",
                    {
                      key: row.id,
                      className: `pb-admin-item ${tplDraft[tplTab]?.id === row.id ? "selected" : ""}`,
                    },
                    h(
                      "button",
                      {
                        className: "pb-admin-item-btn",
                        onClick: () =>
                          setTplDraft((p) => ({ ...p, [tplTab]: row })),
                      },
                      h(
                        "div",
                        { className: "pb-admin-item-name" },
                        row.name || t.noName,
                      ),
                      tplTab === "inventory" &&
                        h(
                          "div",
                          { className: "pb-admin-item-sub" },
                          getTypeLabel(row.type || "other", lang),
                        ),
                      tplTab === "weapons" &&
                        h(
                          "div",
                          { className: "pb-admin-item-sub" },
                          row.skill || "",
                        ),
                      tplTab === "perks" &&
                        h(
                          "div",
                          { className: "pb-admin-item-sub" },
                          (row.effect || "").slice(0, 60),
                        ),
                    ),
                    h(
                      "button",
                      {
                        className: "pb-rowbtn del",
                        onClick: () => deleteTemplate(tplTab, row.id),
                      },
                      "✕",
                    ),
                  ),
                ),
          ),
          h(
            "div",
            { className: "pb-admin-form" },
            !tplDraft[tplTab]
              ? h("div", { className: "pb-modal-empty" }, t.adminPickHint)
              : h(
                  React.Fragment,
                  null,
                  h("span", { className: "pb-label" }, t.adminEditing),
                  h(PbField, {
                    label: t[`tplName_${tplTab}`],
                    value: tplDraft[tplTab].name || "",
                    onChange: (v) =>
                      setTplDraft((p) => ({
                        ...p,
                        [tplTab]: { ...p[tplTab], name: v },
                      })),
                    disabled: false,
                  }),
                  tplTab === "inventory" &&
                    h(
                      "div",
                      { className: "pb-admin-form-grid" },
                      h(
                        "div",
                        { className: "pb-field" },
                        h("span", { className: "pb-label" }, t.i_type),
                        h(
                          "select",
                          {
                            className: "pb-select",
                            value: tplDraft.inventory.type || "other",
                            onChange: (e) =>
                              setTplDraft((p) => ({
                                ...p,
                                inventory: {
                                  ...p.inventory,
                                  type: e.target.value,
                                },
                              })),
                          },
                          ITEM_TYPES.map((o) =>
                            h(
                              "option",
                              { key: o.key, value: o.key },
                              lang === "en" ? o.en : o.cs,
                            ),
                          ),
                        ),
                      ),
                      h(PbField, {
                        label: t.w_weight,
                        value: tplDraft.inventory.weight || "",
                        onChange: (v) =>
                          setTplDraft((p) => ({
                            ...p,
                            inventory: { ...p.inventory, weight: v },
                          })),
                        disabled: false,
                      }),
                    ),
                  tplTab === "perks" &&
                    h(
                      "div",
                      { className: "pb-admin-form-grid" },
                      h(PbField, {
                        label: t.p_rank,
                        value: tplDraft.perks.rank || "1",
                        onChange: (v) =>
                          setTplDraft((p) => ({
                            ...p,
                            perks: { ...p.perks, rank: v },
                          })),
                        disabled: false,
                      }),
                      h(
                        "div",
                        { className: "pb-field" },
                        h("span", { className: "pb-label" }, t.p_effect),
                        h(AutoResizeTextarea, {
                          className: "pb-cell",
                          value: tplDraft.perks.effect || "",
                          onChange: (e) =>
                            setTplDraft((p) => ({
                              ...p,
                              perks: { ...p.perks, effect: e.target.value },
                            })),
                          disabled: false,
                        }),
                      ),
                    ),
                  tplTab === "weapons" &&
                    h(
                      "div",
                      { className: "pb-admin-form-grid" },
                      h(PbField, {
                        label: t.w_skill,
                        value: tplDraft.weapons.skill || "",
                        onChange: (v) =>
                          setTplDraft((p) => ({
                            ...p,
                            weapons: { ...p.weapons, skill: v },
                          })),
                        disabled: false,
                      }),
                      h(
                        "label",
                        {
                          className: "pb-loc-status",
                          style: { alignSelf: "end", paddingBottom: "8px" },
                        },
                        h("input", {
                          type: "checkbox",
                          checked: !!tplDraft.weapons.assigned,
                          onChange: (e) =>
                            setTplDraft((p) => ({
                              ...p,
                              weapons: {
                                ...p.weapons,
                                assigned: e.target.checked,
                              },
                            })),
                        }),
                        t.w_assigned,
                      ),
                      [
                        ["targetNum", t.w_tn],
                        ["damage", t.w_dmg],
                        ["effects", t.w_effects],
                        ["type", t.w_type],
                        ["rateOfFire", t.w_rate],
                        ["range", t.w_range],
                        ["attributes", t.w_qual],
                        ["ammo", t.w_ammo],
                        ["weight", t.w_weight],
                      ].map(([f, label]) =>
                        h(PbField, {
                          key: f,
                          label: label,
                          value: tplDraft.weapons[f] || "",
                          onChange: (v) =>
                            setTplDraft((p) => ({
                              ...p,
                              weapons: { ...p.weapons, [f]: v },
                            })),
                          disabled: false,
                        }),
                      ),
                    ),
                  h(
                    "div",
                    {
                      style: {
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "8px",
                        paddingTop: "6px",
                        borderTop: "1px dashed var(--pb-border)",
                      },
                    },
                    h(
                      "button",
                      {
                        className: "pb-chip save",
                        onClick: () => saveTemplate(tplTab, tplDraft[tplTab]),
                      },
                      "▣ " + t.btnSave,
                    ),
                  ),
                ),
          ),
        ),
      ),
  );
}

const root = createRoot(document.getElementById("root"));
root.render(h(FalloutSheetApp));
