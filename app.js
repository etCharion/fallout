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

// --- Minimal Lucide-like SVG icons ---
const ICONS = {
  Trash2: [
    "M3 6h18",
    "M8 6V4h8v2",
    "M19 6l-1 14H6L5 6",
    "M10 11v6",
    "M14 11v6",
  ],
  Plus: ["M12 5v14", "M5 12h14"],
  Save: [
    "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z",
    "M17 21v-8H7v8",
    "M7 3v5h8",
  ],
  Edit3: ["M12 20h9", "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"],
  UserPlus: [
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
    "M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8",
    "M19 8v6",
    "M22 11h-6",
  ],
  X: ["M18 6 6 18", "M6 6l12 12"],
  Zap: ["M13 2 3 14h9l-1 8 10-12h-9l1-8Z"],
  Globe: [
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
    "M3 12h18",
    "M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9Z",
  ],
  Upload: [
    "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
    "M17 8l-5-5-5 5",
    "M12 3v12",
  ],
  Eye: [
    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z",
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  ],
  EyeOff: [
    "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24",
    "M1 1l22 22",
  ],
  Settings: [
    "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  ],
  Search: ["M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"],
};

function Icon({ name, size = 16, className = "" }) {
  const paths = ICONS[name] || [];
  return React.createElement(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: className,
    },
    paths.map((d, i) => React.createElement("path", { key: i, d: d })),
  );
}

const TRANSLATIONS = {
  cs: {
    headerTitle: "RPG HRA",
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
    skillName: "NÁZEV",
    skillVal: "HODNOTA",
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
    dr_phys: "Fyz.",
    dr_en: "En.",
    dr_rad: "Rad.",
    dr_hp: "BZ",
    poisonRes: "JEDOVÉ OZ",
    loc_head: "HLAVA (1-2)",
    loc_torso: "TRUP (3-8)",
    loc_larm: "LEVÁ RUKA (9-11)",
    loc_rarm: "PRAVÁ RUKA (12-14)",
    loc_lleg: "LEVÁ NOHA (15-17)",
    loc_rleg: "PRAVÁ NOHA (18-20)",
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
    invTitle: "VYBAVENÍ",
    caps: "ZÁTKY",
    i_item: "PŘEDMĚT",
    i_weight: "VÁHA",
    i_qty: "KS",
    perksTitle: "PERKY A RYSY",
    p_name: "NÁZEV",
    p_rank: "ST.",
    p_effect: "ÚČINEK",
    newChar: "Nová Postava",
    loading: "NAČÍTÁNÍ...",
    noData: "ŽÁDNÁ DATA",
    selectChar: "-- VYBER POSTAVU --",
    btnNew: "Nová",
    btnEdit: "Upravit",
    btnSave: "Uložit",
    btnDelete: "Smazat",
    btnAdd: "PŘIDAT",
    confirmDelete: "Opravdu smazat tuto postavu?",
    editMode: "EDIT MODE",
    uploadImg: "Nahrát obrázek",
    i_type: "TYP",
    w_assigned: "PŘIŘ.",
    dragTip: "Chyť a přetáhni",
    btnNotes: "POZNÁMKY",
    notesTitle: "POZNÁMKY A HISTORIE",
  },
  en: {
    headerTitle: "THE ROLEPLAYING GAME",
    name: "NAME",
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
    skillName: "NAME",
    skillVal: "RANK",
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
    dr_phys: "Phys.",
    dr_en: "En.",
    dr_rad: "Rad.",
    dr_hp: "HP",
    poisonRes: "POISON DR",
    loc_head: "HEAD (1-2)",
    loc_torso: "TORSO (3-8)",
    loc_larm: "LEFT ARM (9-11)",
    loc_rarm: "RIGHT ARM (12-14)",
    loc_lleg: "LEFT LEG (15-17)",
    loc_rleg: "RIGHT LEG (18-20)",
    weaponsTitle: "WEAPONS",
    w_name: "NAME",
    w_skill: "SKILL",
    w_tn: "TN",
    w_dmg: "DAMAGE",
    w_effects: "EFFECTS",
    w_type: "TYPE",
    w_rate: "RATE",
    w_range: "RANGE",
    w_qual: "QUALITIES",
    w_ammo: "AMMO",
    w_weight: "WEIGHT",
    invTitle: "EQUIPMENT",
    caps: "CAPS",
    i_item: "ITEM",
    i_weight: "LBS.",
    i_qty: "QTY",
    perksTitle: "PERKS & TRAITS",
    p_name: "NAME",
    p_rank: "RANK",
    p_effect: "EFFECT",
    newChar: "New Character",
    loading: "LOADING...",
    noData: "NO DATA",
    selectChar: "-- SELECT CHARACTER --",
    btnNew: "New",
    btnEdit: "Edit",
    btnSave: "Save",
    btnDelete: "Delete",
    btnAdd: "ADD",
    confirmDelete: "Are you sure you want to delete this character?",
    editMode: "EDIT MODE",
    uploadImg: "Upload Image",
    i_type: "TYPE",
    w_assigned: "ASSN.",
    dragTip: "Drag to reorder",
    btnNotes: "NOTES",
    notesTitle: "NOTES & HISTORY",
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
  resHead: { phys: "0", en: "0", rad: "0", bz: "0" },
  resTorso: { phys: "0", en: "0", rad: "0", bz: "0" },
  resLArm: { phys: "0", en: "0", rad: "0", bz: "0" },
  resRArm: { phys: "0", en: "0", rad: "0", bz: "0" },
  resLLeg: { phys: "0", en: "0", rad: "0", bz: "0" },
  resRLeg: { phys: "0", en: "0", rad: "0", bz: "0" },
  poisonRes: "0",
  weapons: [],
  inventory: [],
  perks: [],
  caps: "0",
  notes: "",
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
  return c;
}

function AutoResizeTextarea({ value, onChange, disabled, className, style }) {
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
  return React.createElement("textarea", {
    ref: textareaRef,
    value: value,
    onChange: (e) => {
      onChange(e);
      adjustHeight();
    },
    disabled: disabled,
    rows: 1,
    className: `resize-none overflow-hidden block ${className || ""}`,
    style: style,
  });
}

function InputGroup({ label, value, onChange, isEditing, className = "" }) {
  return React.createElement(
    "div",
    { className: `flex flex-col ${className}` },
    React.createElement(
      "label",
      { className: "text-[10px] uppercase font-bold text-stone-500 mb-1" },
      label,
    ),
    React.createElement("input", {
      type: "text",
      value: value,
      onChange: (e) => onChange(e.target.value),
      disabled: !isEditing,
      className:
        "border-b-2 border-stone-800 bg-transparent px-1 py-1 font-bold text-stone-800 focus:border-amber-600 focus:outline-none disabled:border-stone-200",
    }),
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

function BodyPartCard({ name, data, field, update, edit, t }) {
  return React.createElement(
    "div",
    {
      className:
        "border-2 border-stone-800 p-2 bg-stone-100 print:border-black print:bg-white",
    },
    React.createElement(
      "div",
      {
        className:
          "text-[10px] font-bold uppercase mb-1 border-b-2 border-stone-800 pb-1",
      },
      name,
    ),
    React.createElement(
      "div",
      { className: "grid grid-cols-4 gap-1" },
      ["phys", "en", "rad", "bz"].map((k) =>
        React.createElement(
          "div",
          {
            key: k,
            className:
              k === "bz"
                ? "flex flex-col items-center border-l-2 border-stone-800 pl-1"
                : "flex flex-col items-center",
          },
          React.createElement(
            "span",
            {
              className:
                k === "bz"
                  ? "text-[9px] text-red-700 font-bold mb-0.5"
                  : "text-[9px] text-stone-500 font-bold mb-0.5",
            },
            k === "phys"
              ? t.dr_phys
              : k === "en"
                ? t.dr_en
                : k === "rad"
                  ? t.dr_rad
                  : t.dr_hp,
          ),
          React.createElement("input", {
            type: "number",
            className:
              "w-full text-center bg-white border-2 border-stone-800 text-sm font-bold p-1 print:border-black",
            value: data[k],
            onChange: (e) => update(`${field}.${k}`, e.target.value),
            disabled: !edit,
          }),
        ),
      ),
    ),
  );
}

function TemplatePicker({ isOpen, onClose, onSelect, templates, type, lang }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  if (!isOpen) return null;
  const filtered = templates.filter((t) => {
    const matchesSearch = (t.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType =
      type !== "inventory" || filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  });
  return React.createElement(
    "div",
    {
      className:
        "fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm",
      onMouseDown: onClose,
    },
    React.createElement(
      "div",
      {
        className:
          "bg-white border-4 border-stone-800 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl",
        onMouseDown: (e) => e.stopPropagation(),
      },
      React.createElement(
        "div",
        {
          className:
            "p-4 border-b-4 border-stone-800 flex justify-between items-center bg-stone-100",
        },
        React.createElement(
          "h3",
          { className: "font-bold text-lg uppercase tracking-wider" },
          type === "weapons"
            ? "Výběr zbraně"
            : type === "inventory"
              ? "Výběr vybavení"
              : "Výběr perku",
        ),
        React.createElement(
          "button",
          { onClick: onClose, className: "p-1 hover:bg-stone-200" },
          React.createElement(Icon, { name: "X", size: 24 }),
        ),
      ),
      React.createElement(
        "div",
        { className: "p-4 space-y-4" },
        React.createElement(
          "div",
          { className: "flex gap-2" },
          React.createElement("input", {
            type: "text",
            placeholder: "Hledat...",
            className:
              "flex-1 border-2 border-stone-800 p-2 focus:outline-none focus:ring-2 focus:ring-amber-500",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            autoFocus: true,
          }),
          type === "inventory" &&
            React.createElement(
              "select",
              {
                className: "border-2 border-stone-800 p-2 focus:outline-none",
                value: filterType,
                onChange: (e) => setFilterType(e.target.value),
              },
              React.createElement("option", { value: "all" }, "Všechny typy"),
              ITEM_TYPES.map((it) =>
                React.createElement(
                  "option",
                  { key: it.key, value: it.key },
                  lang === "en" ? it.en : it.cs,
                ),
              ),
            ),
        ),
      ),
      React.createElement(
        "div",
        { className: "flex-1 overflow-y-auto p-4 space-y-1" },
        filtered.length === 0
          ? React.createElement(
              "div",
              { className: "text-center py-8 text-stone-400 italic" },
              "Nenalezeny žádné šablony",
            )
          : filtered.map((tpl) =>
              React.createElement(
                "button",
                {
                  key: tpl.id,
                  onClick: () => {
                    onSelect(tpl);
                    onClose();
                  },
                  className:
                    "w-full text-left p-3 border-2 border-transparent hover:border-stone-800 hover:bg-amber-50 group flex justify-between items-center transition-all",
                },
                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "div",
                    { className: "font-bold group-hover:text-amber-800" },
                    tpl.name,
                  ),
                  React.createElement(
                    "div",
                    { className: "text-xs text-stone-500" },
                    type === "inventory"
                      ? getTypeLabel(tpl.type, lang)
                      : type === "weapons"
                        ? tpl.skill
                        : "",
                  ),
                ),
                React.createElement(Icon, {
                  name: "Plus",
                  size: 18,
                  className: "text-stone-300 group-hover:text-amber-600",
                }),
              ),
            ),
      ),
    ),
  );
}

function FalloutSheetApp() {
  const [user, setUser] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [selectedCharId, setSelectedCharId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [localChar, setLocalChar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("cs");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
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
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [theme, setTheme] = useState("paper");
  const [pickerConfig, setPickerConfig] = useState({
    isOpen: false,
    type: "weapons",
  });
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
        console.error(error);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, [user]);
  useEffect(() => {
    if (!user) return;
    const cW = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "fallout_templates_weapons",
    );
    const cI = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "fallout_templates_inventory",
    );
    const cP = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "fallout_templates_perks",
    );
    const unsubW = onSnapshot(cW, (s) =>
      setTemplates((p) => ({
        ...p,
        weapons: s.docs.map((d) => ({ id: d.id, ...d.data() })),
      })),
    );
    const unsubI = onSnapshot(cI, (s) =>
      setTemplates((p) => ({
        ...p,
        inventory: s.docs.map((d) => ({ id: d.id, ...d.data() })),
      })),
    );
    const unsubP = onSnapshot(cP, (s) =>
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

  useEffect(() => {
    if (selectedCharId) {
      const found = characters.find((c) => c.id === selectedCharId);
      if (found && !isEditing) setLocalChar(normalizeCharacter(found));
    } else {
      setLocalChar(null);
    }
  }, [selectedCharId, characters, isEditing]);

  const updateField = (path, value) => {
    if (!localChar) return;
    setLocalChar((prev) => {
      if (!prev) return null;
      const copy = { ...prev };
      if (path.includes(".")) {
        const pts = path.split(".");
        let cur = copy;
        for (let i = 0; i < pts.length - 1; i++) cur = cur[pts[i]];
        cur[pts[pts.length - 1]] = value;
      } else {
        copy[path] = value;
      }
      return copy;
    });
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
  const handleCreate = async () => {
    if (!user) return;
    const nc = {
      ...DEFAULT_CHARACTER,
      name: lang === "en" ? "New Character" : "Nová Postava",
      id: crypto.randomUUID(),
      createdAt: serverTimestamp(),
    };
    try {
      await setDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "fallout_characters",
          nc.id,
        ),
        nc,
      );
      setSelectedCharId(nc.id);
      setIsEditing(true);
      setLocalChar(nc);
    } catch (e) {
      console.error(e);
    }
  };
  const handleSave = async () => {
    if (!user || !localChar) return;
    try {
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
        localChar,
      );
      setIsEditing(false);
    } catch (e) {
      console.error(e);
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
        setIsEditing(false);
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
          h = img.height;
        if (w > h) {
          if (w > MAX) {
            h *= MAX / w;
            w = MAX;
          }
        } else {
          if (h > MAX) {
            w *= MAX / h;
            h = MAX;
          }
        }
        cvs.width = w;
        cvs.height = h;
        cvs.getContext("2d")?.drawImage(img, 0, 0, w, h);
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

  if (loading)
    return React.createElement(
      "div",
      { className: "p-10 text-center font-mono text-green-700" },
      t.loading,
    );

  return React.createElement(
    "div",
    {
      className: `min-h-screen bg-stone-200 text-stone-900 font-mono pb-20 selection:bg-amber-300 ${theme === "pipboy" ? "theme-pipboy" : ""}`,
    },
    theme === "pipboy" &&
      React.createElement("div", { className: "pipboy-overlay" }),
    React.createElement(
      "header",
      {
        className:
          "bg-stone-800 text-amber-500 p-4 sticky top-0 z-50 shadow-md border-b-4 border-amber-600 print:hidden overflow-x-auto",
      },
      React.createElement(
        "div",
        {
          className:
            "max-w-6xl mx-auto flex flex-nowrap gap-4 items-center justify-between min-w-max",
        },
        React.createElement(
          "div",
          { className: "flex items-center gap-2" },
          React.createElement(Icon, {
            name: "Zap",
            size: 24,
            className: "animate-pulse",
          }),
          React.createElement(
            "span",
            { className: "text-xl font-bold tracking-widest hidden sm:inline" },
            "PIP-BOY 2000 MK VI",
          ),
        ),
        React.createElement(
          "div",
          { className: "flex flex-nowrap gap-1 items-center" },
          React.createElement(
            "button",
            {
              onClick: () => setTheme(theme === "paper" ? "pipboy" : "paper"),
              className:
                "flex items-center gap-1 bg-stone-900 border-2 border-amber-600 px-3 py-1 text-sm hover:bg-stone-700 transition-colors",
              title: "Změnit styl",
            },
            React.createElement(Icon, {
              name: theme === "paper" ? "Eye" : "EyeOff",
              size: 14,
            }),
          ),
          React.createElement(
            "button",
            {
              onClick: () => setLang(lang === "cs" ? "en" : "cs"),
              className:
                "flex items-center gap-1 bg-stone-900 border-2 border-amber-600 px-3 py-1 text-sm hover:bg-stone-700",
            },
            React.createElement(Icon, { name: "Globe", size: 14 }),
            lang.toUpperCase(),
          ),
          React.createElement(
            "select",
            {
              className:
                "bg-stone-900 border-2 border-amber-600 text-amber-500 p-2 focus:outline-none",
              value: selectedCharId || "",
              onChange: (e) => {
                setSelectedCharId(e.target.value || null);
                setIsEditing(false);
              },
            },
            React.createElement("option", { value: "" }, t.selectChar),
            characters.map((c) =>
              React.createElement("option", { key: c.id, value: c.id }, c.name),
            ),
          ),
          React.createElement(
            "button",
            {
              onClick: () => setIsAdminOpen(true),
              className:
                "btn-admin bg-stone-700 text-amber-200 hover:bg-stone-600",
            },
            React.createElement(Icon, { name: "Settings", size: 16 }),
            " Administrace",
          ),
          React.createElement(
            "button",
            {
              onClick: handleCreate,
              className: "btn-admin bg-amber-700 text-stone-900",
            },
            React.createElement(Icon, { name: "UserPlus", size: 16 }),
            t.btnNew,
          ),
          selectedCharId &&
            React.createElement(
              React.Fragment,
              null,
              !isEditing
                ? React.createElement(
                    "button",
                    {
                      onClick: () => setIsEditing(true),
                      className: "btn-admin bg-blue-700 text-white",
                    },
                    React.createElement(Icon, { name: "Edit3", size: 16 }),
                    t.btnEdit,
                  )
                : React.createElement(
                    "button",
                    {
                      onClick: handleSave,
                      className:
                        "btn-admin bg-green-700 text-white animate-pulse",
                    },
                    React.createElement(Icon, { name: "Save", size: 16 }),
                    t.btnSave,
                  ),
              React.createElement(
                "button",
                {
                  onClick: handleDelete,
                  className: "btn-admin bg-red-800 text-white",
                  disabled: !isEditing && !selectedCharId,
                },
                React.createElement(Icon, { name: "Trash2", size: 16 }),
                t.btnDelete,
              ),
            ),
        ),
      ),
    ),
    React.createElement(
      "main",
      { className: "max-w-7xl mx-auto p-2 sm:p-6 print:p-0" },
      !localChar
        ? React.createElement(
            "div",
            { className: "text-center mt-20 opacity-50" },
            React.createElement(
              "h2",
              { className: "text-2xl font-bold text-stone-600" },
              t.noData,
            ),
          )
        : React.createElement(
            "div",
            {
              className: `bg-[#fdfaf5] shadow-2xl border-4 border-stone-800 p-4 sm:p-8 relative print:shadow-none print:border-none print:p-0 character-sheet-container ${isEditing ? "ring-4 ring-amber-400/30" : ""}`,
            },
            React.createElement(
              "section",
              {
                className:
                  "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 border-b-2 border-stone-800 pb-6 items-start",
              },
              React.createElement(
                "div",
                {
                  className:
                    "md:col-span-1 flex flex-col items-center justify-center",
                },
                React.createElement(
                  "div",
                  {
                    className: `relative group w-32 h-32 flex items-center justify-center border-2 ${isEditing ? "border-amber-400 border-dashed cursor-pointer bg-amber-50" : "border-transparent"}`,
                    onClick: () => isEditing && fileInputRef.current?.click(),
                  },
                  localChar.imageUrl
                    ? React.createElement("img", {
                        key: `portrait-${localChar.id}`,
                        src: localChar.imageUrl,
                        alt: "Char",
                        className:
                          "w-full h-full object-cover character-portrait",
                      })
                    : React.createElement("img", {
                        key: `fallback-${localChar.id}`,
                        src: "https://upload.wikimedia.org/wikipedia/en/5/52/Fallout_Vault_Boy.png",
                        alt: "Vault Boy",
                        className:
                          "w-24 h-auto opacity-80 mix-blend-multiply character-portrait-fallback",
                        onError: (e) =>
                          (e.currentTarget.style.display = "none"),
                      }),
                  isEditing &&
                    React.createElement(
                      "div",
                      {
                        className:
                          "absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity",
                      },
                      React.createElement(Icon, { name: "Upload", size: 24 }),
                      React.createElement(
                        "span",
                        {
                          className: "text-xs font-bold mt-1 text-center px-1",
                        },
                        t.uploadImg,
                      ),
                    ),
                ),
                React.createElement("input", {
                  type: "file",
                  ref: fileInputRef,
                  onChange: handleImageUpload,
                  accept: "image/*",
                  className: "hidden",
                }),
              ),
              React.createElement(
                "div",
                {
                  className:
                    "md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4",
                },
                React.createElement(
                  "div",
                  { className: "col-span-2 md:col-span-4 mb-2" },
                  React.createElement(
                    "h1",
                    {
                      className:
                        "font-bold text-2xl tracking-tighter uppercase text-stone-800",
                    },
                    "Fallout ",
                    React.createElement(
                      "span",
                      {
                        className:
                          "text-sm font-normal block sm:inline sm:ml-2 text-stone-500",
                      },
                      t.headerTitle,
                    ),
                  ),
                ),
                React.createElement(InputGroup, {
                  label: t.name,
                  value: localChar.name,
                  onChange: (v) => updateField("name", v),
                  isEditing: isEditing,
                  className: "col-span-2",
                }),
                React.createElement(InputGroup, {
                  label: t.origin,
                  value: localChar.origin,
                  onChange: (v) => updateField("origin", v),
                  isEditing: isEditing,
                  className: "col-span-2",
                }),
                React.createElement(InputGroup, {
                  label: t.level,
                  value: localChar.level,
                  onChange: (v) => updateField("level", v),
                  isEditing: isEditing,
                }),
                React.createElement(InputGroup, {
                  label: t.xp,
                  value: localChar.xp,
                  onChange: (v) => updateField("xp", v),
                  isEditing: isEditing,
                }),
                React.createElement(InputGroup, {
                  label: t.xpNext,
                  value: localChar.xpNext,
                  onChange: (v) => updateField("xpNext", v),
                  isEditing: isEditing,
                }),
                React.createElement(
                  "div",
                  { className: "flex items-end pb-1" },
                  React.createElement(
                    "button",
                    {
                      onClick: () => setIsNotesExpanded(!isNotesExpanded),
                      className:
                        "w-full border-2 border-stone-800 py-1 px-2 font-bold text-xs hover:bg-stone-800 hover:text-white transition-colors uppercase tracking-wider",
                    },
                    t.btnNotes,
                  ),
                ),
              ),
            ),
            isNotesExpanded &&
              React.createElement(
                "section",
                { className: "mb-6 p-4 border-2 border-stone-800 bg-white" },
                React.createElement(
                  "h3",
                  {
                    className:
                      "text-xs font-bold uppercase mb-2 text-stone-500",
                  },
                  t.notesTitle,
                ),
                React.createElement(AutoResizeTextarea, {
                  value: localChar.notes || "",
                  onChange: (e) => updateField("notes", e.target.value),
                  disabled: !isEditing,
                  className:
                    "w-full min-h-[100px] bg-transparent border-none focus:outline-none font-bold text-stone-800",
                }),
              ),
            React.createElement(
              "section",
              { className: "mb-6" },
              React.createElement(
                "div",
                {
                  className:
                    "grid grid-cols-7 gap-1 sm:gap-4 text-center bg-white p-2 border-2 border-stone-800 print:bg-transparent print:border-none print:p-0",
                },
                [
                  "strength",
                  "perception",
                  "endurance",
                  "charisma",
                  "intelligence",
                  "agility",
                  "luck",
                ].map((key, idx) =>
                  React.createElement(
                    "div",
                    { key, className: "flex flex-col items-center" },
                    React.createElement(
                      "span",
                      {
                        className:
                          "text-[9px] sm:text-xs font-bold mb-1 w-full truncate",
                      },
                      [
                        t.strength,
                        t.perception,
                        t.endurance,
                        t.charisma,
                        t.intelligence,
                        t.agility,
                        t.luck,
                      ][idx],
                    ),
                    React.createElement("input", {
                      type: "number",
                      value: localChar[key],
                      onChange: (e) => updateField(key, e.target.value),
                      disabled: !isEditing,
                      className:
                        "w-full text-center text-xl sm:text-2xl font-bold bg-white border-2 border-stone-800 p-1 focus:border-amber-500 focus:outline-none print:border print:border-stone-800",
                    }),
                  ),
                ),
              ),
            ),
            React.createElement(
              "div",
              {
                className:
                  "grid grid-cols-1 lg:grid-cols-2 gap-8 print-maingrid",
              },
              React.createElement(
                "section",
                { className: "print-skills" },
                React.createElement(
                  "h3",
                  { className: "section-title section-skills" },
                  t.skillsTitle,
                ),
                React.createElement(
                  "div",
                  { className: "border-2 border-stone-800 bg-white" },
                  React.createElement(
                    "div",
                    {
                      className:
                        "grid grid-cols-12 bg-stone-800 text-stone-100 text-xs py-1 px-2 font-bold print:bg-stone-300 print:text-black",
                    },
                    React.createElement(
                      "div",
                      { className: "col-span-1" },
                      "TAG",
                    ),
                    React.createElement(
                      "div",
                      { className: "col-span-8" },
                      t.skillName,
                    ),
                    React.createElement(
                      "div",
                      { className: "col-span-3 text-center" },
                      t.skillVal,
                    ),
                  ),
                  skillsList.map((sk) =>
                    React.createElement(
                      "div",
                      {
                        key: sk.key,
                        className:
                          "grid grid-cols-12 items-center border-b-2 border-stone-800 py-1 px-2 hover:bg-amber-50",
                      },
                      React.createElement(
                        "div",
                        { className: "col-span-1 flex justify-center" },
                        React.createElement("input", {
                          type: "checkbox",
                          checked: !!localChar.skills[sk.key],
                          onChange: (e) =>
                            updateField(`skills.${sk.key}`, e.target.checked),
                          disabled: !isEditing,
                          className: "accent-amber-600 w-4 h-4",
                        }),
                      ),
                      React.createElement(
                        "div",
                        {
                          className:
                            "col-span-8 text-sm uppercase font-semibold",
                        },
                        sk.label,
                      ),
                      React.createElement(
                        "div",
                        { className: "col-span-3" },
                        React.createElement("input", {
                          type: "number",
                          value: localChar.skills[`${sk.key}Val`],
                          onChange: (e) =>
                            updateField(`skills.${sk.key}Val`, e.target.value),
                          disabled: !isEditing,
                          className:
                            "w-full text-center bg-transparent border-b-2 border-stone-800 focus:border-amber-500 focus:outline-none",
                        }),
                      ),
                    ),
                  ),
                ),
              ),
              React.createElement(
                "div",
                { className: "flex flex-col gap-6 print-right" },
                React.createElement(
                  "section",
                  { className: "grid grid-cols-2 gap-4" },
                  React.createElement(
                    "div",
                    {
                      className:
                        "border-2 border-stone-800 p-2 text-center bg-white",
                    },
                    React.createElement(
                      "div",
                      {
                        className: "text-xs font-bold text-stone-500 uppercase",
                      },
                      t.health,
                    ),
                    React.createElement(
                      "div",
                      { className: "flex gap-2 justify-center items-end" },
                      React.createElement("input", {
                        type: "number",
                        className: "stat-input-lg w-12",
                        value: localChar.hpCurrent,
                        onChange: (e) =>
                          updateField("hpCurrent", e.target.value),
                        disabled: !isEditing,
                      }),
                      React.createElement(
                        "span",
                        { className: "text-2xl" },
                        "/",
                      ),
                      React.createElement("input", {
                        type: "number",
                        className: "stat-input-lg w-12",
                        value: localChar.hpMax,
                        onChange: (e) => updateField("hpMax", e.target.value),
                        disabled: !isEditing,
                      }),
                    ),
                  ),
                  React.createElement(
                    "div",
                    {
                      className:
                        "border-2 border-stone-800 p-2 text-center bg-white",
                    },
                    React.createElement(
                      "div",
                      {
                        className: "text-xs font-bold text-stone-500 uppercase",
                      },
                      t.initiative,
                    ),
                    React.createElement("input", {
                      type: "number",
                      className: "stat-input-lg w-full",
                      value: localChar.initiative,
                      onChange: (e) =>
                        updateField("initiative", e.target.value),
                      disabled: !isEditing,
                    }),
                  ),
                  React.createElement(
                    "div",
                    {
                      className:
                        "border-2 border-stone-800 p-2 text-center bg-white",
                    },
                    React.createElement(
                      "div",
                      {
                        className: "text-xs font-bold text-stone-500 uppercase",
                      },
                      t.defense,
                    ),
                    React.createElement("input", {
                      type: "number",
                      className: "stat-input-lg w-full",
                      value: localChar.defense,
                      onChange: (e) => updateField("defense", e.target.value),
                      disabled: !isEditing,
                    }),
                  ),
                  React.createElement(
                    "div",
                    {
                      className:
                        "border-2 border-stone-800 p-2 text-center bg-white",
                    },
                    React.createElement(
                      "div",
                      {
                        className: "text-xs font-bold text-stone-500 uppercase",
                      },
                      t.meleeDmg,
                    ),
                    React.createElement("input", {
                      type: "number",
                      className: "stat-input-lg w-full",
                      value: localChar.meleeDamage,
                      onChange: (e) =>
                        updateField("meleeDamage", e.target.value),
                      disabled: !isEditing,
                    }),
                  ),
                ),
                React.createElement(
                  "section",
                  {
                    className:
                      "border-2 border-stone-800 p-2 text-center bg-white",
                  },
                  React.createElement(
                    "div",
                    { className: "text-xs font-bold text-stone-500 uppercase" },
                    t.luckPoints,
                  ),
                  React.createElement("input", {
                    type: "number",
                    className: "stat-input-lg w-full",
                    value: localChar.luckPoints,
                    onChange: (e) => updateField("luckPoints", e.target.value),
                    disabled: !isEditing,
                  }),
                ),
                React.createElement(
                  "section",
                  null,
                  React.createElement(
                    "h3",
                    {
                      className:
                        "section-title section-hitlocs flex justify-between",
                    },
                    React.createElement("span", null, t.hitLocs),
                  ),
                  React.createElement(
                    "div",
                    { className: "grid grid-cols-2 gap-2 text-sm" },
                    React.createElement(BodyPartCard, {
                      name: t.loc_head,
                      data: localChar.resHead,
                      field: "resHead",
                      update: updateField,
                      edit: isEditing,
                      t: t,
                    }),
                    React.createElement(BodyPartCard, {
                      name: t.loc_torso,
                      data: localChar.resTorso,
                      field: "resTorso",
                      update: updateField,
                      edit: isEditing,
                      t: t,
                    }),
                    React.createElement(BodyPartCard, {
                      name: t.loc_larm,
                      data: localChar.resLArm,
                      field: "resLArm",
                      update: updateField,
                      edit: isEditing,
                      t: t,
                    }),
                    React.createElement(BodyPartCard, {
                      name: t.loc_rarm,
                      data: localChar.resRArm,
                      field: "resRArm",
                      update: updateField,
                      edit: isEditing,
                      t: t,
                    }),
                    React.createElement(BodyPartCard, {
                      name: t.loc_lleg,
                      data: localChar.resLLeg,
                      field: "resLLeg",
                      update: updateField,
                      edit: isEditing,
                      t: t,
                    }),
                    React.createElement(BodyPartCard, {
                      name: t.loc_rleg,
                      data: localChar.resRLeg,
                      field: "resRLeg",
                      update: updateField,
                      edit: isEditing,
                      t: t,
                    }),
                  ),
                  React.createElement(
                    "div",
                    {
                      className:
                        "mt-2 border-2 border-green-800/20 p-2 bg-green-50 print:bg-white print:border-black",
                    },
                    React.createElement(
                      "div",
                      { className: "flex justify-between items-center" },
                      React.createElement(
                        "span",
                        { className: "font-bold text-stone-700" },
                        t.poisonRes,
                        ":",
                      ),
                      React.createElement("input", {
                        type: "number",
                        className:
                          "w-16 text-center border-b border-stone-500 bg-transparent font-bold text-lg",
                        value: localChar.poisonRes,
                        onChange: (e) =>
                          updateField("poisonRes", e.target.value),
                        disabled: !isEditing,
                      }),
                    ),
                  ),
                ),
              ),
            ),
            React.createElement(
              "section",
              { className: "mt-8" },
              React.createElement(
                "div",
                {
                  className:
                    "flex items-center justify-between border-b-2 border-stone-800 mb-3",
                },
                React.createElement(
                  "h3",
                  {
                    className: "section-title section-weapons mb-0 border-none",
                  },
                  t.weaponsTitle,
                ),
                isEditing &&
                  React.createElement(
                    "div",
                    { className: "flex gap-2 items-center" },
                    React.createElement(
                      "button",
                      {
                        onClick: () =>
                          setPickerConfig({ isOpen: true, type: "weapons" }),
                        className: "btn-add min-w-[120px] justify-center",
                      },
                      React.createElement(Icon, { name: "Search", size: 14 }),
                      " Vybrat šablonu",
                    ),
                    React.createElement(
                      "button",
                      {
                        onClick: () => addItem("weapons"),
                        className: "btn-add min-w-[40px] justify-center",
                      },
                      React.createElement(Icon, { name: "Plus", size: 14 }),
                      t.btnAdd,
                    ),
                  ),
              ),
              React.createElement(
                "div",
                { className: "overflow-x-auto mt-2" },
                React.createElement(
                  "table",
                  {
                    className:
                      "w-full text-left text-xs sm:text-sm border-collapse table-fixed",
                  },
                  React.createElement(
                    "thead",
                    null,
                    React.createElement(
                      "tr",
                      {
                        className:
                          "bg-stone-800 text-stone-100 print:bg-stone-300 print:text-black",
                      },
                      [
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
                      ].map((h, i) =>
                        React.createElement(
                          "th",
                          {
                            key: i,
                            className: `p-1 ${i === 0 ? "w-[15%]" : i === 1 ? "w-[10%]" : i === 2 ? "w-[5%]" : i === 3 ? "w-[5%]" : i === 4 ? "w-[8%]" : i === 5 ? "w-[15%]" : i === 6 ? "w-[8%]" : i === 7 ? "w-[5%]" : i === 8 ? "w-[5%]" : i === 9 ? "w-[10%]" : i === 10 ? "w-[8%]" : "w-[5%]"}`,
                          },
                          h,
                        ),
                      ),
                      isEditing &&
                        React.createElement("th", { className: "p-1 w-6" }),
                    ),
                  ),
                  React.createElement(
                    "tbody",
                    null,
                    localChar.weapons.map((w) =>
                      React.createElement(
                        "tr",
                        {
                          key: w.id,
                          className: `border-b-2 border-stone-800 hover:bg-stone-100 align-top ${isEditing ? "cursor-move" : ""}`,
                          draggable: isEditing,
                          onDragStart: onDragStartRow("weapons", w.id),
                          onDragOver: onDragOverRow(),
                          onDrop: onDropRow("weapons", w.id),
                        },
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          React.createElement(AutoResizeTextarea, {
                            className: "tbl-inp",
                            value: w.name,
                            disabled: !isEditing,
                            onChange: (e) =>
                              updateListItem(
                                "weapons",
                                w.id,
                                "name",
                                e.target.value,
                              ),
                          }),
                        ),
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          React.createElement(AutoResizeTextarea, {
                            className: "tbl-inp",
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
                        ),
                        React.createElement(
                          "td",
                          { className: "p-1 text-center" },
                          React.createElement("input", {
                            type: "checkbox",
                            checked: !!w.assigned,
                            onChange: (e) =>
                              updateListItem(
                                "weapons",
                                w.id,
                                "assigned",
                                e.target.checked,
                              ),
                            disabled: !isEditing,
                            className: "accent-amber-600 w-4 h-4",
                          }),
                        ),
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          React.createElement("input", {
                            className: "tbl-inp text-center",
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
                        ),
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          React.createElement("input", {
                            className: "tbl-inp text-center",
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
                        ),
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          React.createElement(AutoResizeTextarea, {
                            className: "tbl-inp",
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
                        ),
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          React.createElement("input", {
                            className: "tbl-inp",
                            value: w.type,
                            disabled: !isEditing,
                            onChange: (e) =>
                              updateListItem(
                                "weapons",
                                w.id,
                                "type",
                                e.target.value,
                              ),
                          }),
                        ),
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          React.createElement("input", {
                            className: "tbl-inp text-center",
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
                        ),
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          React.createElement("input", {
                            className: "tbl-inp text-center",
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
                        ),
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          React.createElement(AutoResizeTextarea, {
                            className: "tbl-inp",
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
                        ),
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          React.createElement("input", {
                            className: "tbl-inp",
                            value: w.ammo,
                            disabled: !isEditing,
                            onChange: (e) =>
                              updateListItem(
                                "weapons",
                                w.id,
                                "ammo",
                                e.target.value,
                              ),
                          }),
                        ),
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          React.createElement("input", {
                            className: "tbl-inp text-center",
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
                        ),
                        isEditing &&
                          React.createElement(
                            "td",
                            { className: "p-1 text-center" },
                            React.createElement(
                              "button",
                              {
                                onClick: () => removeItem("weapons", w.id),
                                className: "text-red-600",
                              },
                              React.createElement(Icon, {
                                name: "X",
                                size: 16,
                              }),
                            ),
                          ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
            React.createElement(
              "div",
              { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mt-8" },
              React.createElement(
                "section",
                null,
                React.createElement(
                  "div",
                  {
                    className:
                      "flex items-center justify-between border-b-2 border-stone-800 mb-3",
                  },
                  React.createElement(
                    "h3",
                    {
                      className:
                        "section-title section-inventory mb-0 border-none",
                    },
                    t.invTitle,
                  ),
                  React.createElement(
                    "div",
                    { className: "flex gap-2 items-center overflow-hidden" },
                    React.createElement(
                      "span",
                      {
                        className:
                          "text-xs font-bold text-amber-700 whitespace-nowrap",
                      },
                      t.caps,
                      ":",
                    ),
                    React.createElement("input", {
                      className:
                        "w-12 border-b-2 border-stone-800 bg-transparent text-right font-mono",
                      value: localChar.caps,
                      onChange: (e) => updateField("caps", e.target.value),
                      disabled: !isEditing,
                    }),
                    isEditing &&
                      React.createElement(
                        React.Fragment,
                        null,
                        React.createElement(
                          "button",
                          {
                            onClick: () =>
                              setPickerConfig({
                                isOpen: true,
                                type: "inventory",
                              }),
                            className: "btn-add min-w-[32px] justify-center",
                          },
                          React.createElement(Icon, {
                            name: "Search",
                            size: 14,
                          }),
                        ),
                        React.createElement(
                          "button",
                          {
                            onClick: () => addItem("inventory"),
                            className: "btn-add min-w-[32px] justify-center",
                          },
                          React.createElement(Icon, { name: "Plus", size: 14 }),
                        ),
                      ),
                  ),
                ),
                React.createElement(
                  "table",
                  { className: "w-full text-left text-sm table-fixed mt-2" },
                  React.createElement(
                    "thead",
                    null,
                    React.createElement(
                      "tr",
                      { className: "bg-stone-300 text-stone-800 text-xs" },
                      React.createElement(
                        "th",
                        { className: "p-1 w-[40%]" },
                        t.i_item,
                      ),
                      React.createElement(
                        "th",
                        { className: "p-1 w-[20%]" },
                        t.i_type,
                      ),
                      React.createElement(
                        "th",
                        { className: "p-1 w-[20%] text-center" },
                        t.i_weight,
                      ),
                      React.createElement(
                        "th",
                        { className: "p-1 w-[15%] text-center" },
                        t.i_qty,
                      ),
                      isEditing &&
                        React.createElement("th", { className: "w-[5%]" }),
                    ),
                  ),
                  React.createElement(
                    "tbody",
                    null,
                    localChar.inventory.map((it) =>
                      React.createElement(
                        "tr",
                        {
                          key: it.id,
                          className: `border-b-2 border-stone-800 align-top ${isEditing ? "cursor-move" : ""}`,
                          draggable: isEditing,
                          onDragStart: onDragStartRow("inventory", it.id),
                          onDragOver: onDragOverRow(),
                          onDrop: onDropRow("inventory", it.id),
                        },
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          React.createElement(AutoResizeTextarea, {
                            className: "tbl-inp",
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
                        ),
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          isEditing
                            ? React.createElement(
                                "select",
                                {
                                  className:
                                    "tbl-inp border-2 border-stone-800 bg-transparent text-xs",
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
                                  React.createElement(
                                    "option",
                                    { key: o.key, value: o.key },
                                    lang === "en" ? o.en : o.cs,
                                  ),
                                ),
                              )
                            : React.createElement(
                                "div",
                                {
                                  className: "text-xs uppercase text-stone-700",
                                },
                                getTypeLabel(it.type || "other", lang),
                              ),
                        ),
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          React.createElement("input", {
                            className: "tbl-inp text-center",
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
                        ),
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          React.createElement("input", {
                            className: "tbl-inp text-center",
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
                        ),
                        isEditing &&
                          React.createElement(
                            "td",
                            { className: "p-1 text-center" },
                            React.createElement(
                              "button",
                              {
                                onClick: () => removeItem("inventory", it.id),
                                className: "text-red-500",
                              },
                              React.createElement(Icon, {
                                name: "X",
                                size: 14,
                              }),
                            ),
                          ),
                      ),
                    ),
                  ),
                ),
              ),
              React.createElement(
                "section",
                null,
                React.createElement(
                  "div",
                  {
                    className:
                      "flex items-center justify-between border-b-2 border-stone-800 mb-3",
                  },
                  React.createElement(
                    "h3",
                    {
                      className: "section-title section-perks mb-0 border-none",
                    },
                    t.perksTitle,
                  ),
                  isEditing &&
                    React.createElement(
                      "div",
                      { className: "flex gap-2 items-center" },
                      React.createElement(
                        "button",
                        {
                          onClick: () =>
                            setPickerConfig({ isOpen: true, type: "perks" }),
                          className: "btn-add min-w-[32px] justify-center",
                        },
                        React.createElement(Icon, { name: "Search", size: 14 }),
                      ),
                      React.createElement(
                        "button",
                        {
                          onClick: () => addItem("perks"),
                          className: "btn-add min-w-[32px] justify-center",
                        },
                        React.createElement(Icon, { name: "Plus", size: 14 }),
                      ),
                    ),
                ),
                React.createElement(
                  "table",
                  { className: "w-full text-left text-sm table-fixed mt-2" },
                  React.createElement(
                    "thead",
                    null,
                    React.createElement(
                      "tr",
                      { className: "bg-stone-300 text-stone-800 text-xs" },
                      React.createElement(
                        "th",
                        { className: "p-1 w-[35%]" },
                        t.p_name,
                      ),
                      React.createElement(
                        "th",
                        { className: "p-1 w-[10%] text-center" },
                        t.p_rank,
                      ),
                      React.createElement(
                        "th",
                        { className: "p-1 w-[50%]" },
                        t.p_effect,
                      ),
                      isEditing &&
                        React.createElement("th", { className: "w-[5%]" }),
                    ),
                  ),
                  React.createElement(
                    "tbody",
                    null,
                    localChar.perks.map((pk) =>
                      React.createElement(
                        "tr",
                        {
                          key: pk.id,
                          className: `border-b-2 border-stone-800 align-top ${isEditing ? "cursor-move" : ""}`,
                          draggable: isEditing,
                          onDragStart: onDragStartRow("perks", pk.id),
                          onDragOver: onDragOverRow(),
                          onDrop: onDropRow("perks", pk.id),
                        },
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          React.createElement(AutoResizeTextarea, {
                            className: "tbl-inp",
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
                        ),
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          React.createElement("input", {
                            className: "tbl-inp text-center",
                            value: pk.rank,
                            disabled: !isEditing,
                            onChange: (e) =>
                              updateListItem(
                                "perks",
                                pk.id,
                                "rank",
                                e.target.value,
                              ),
                          }),
                        ),
                        React.createElement(
                          "td",
                          { className: "p-1" },
                          React.createElement(AutoResizeTextarea, {
                            className: "tbl-inp",
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
                        isEditing &&
                          React.createElement(
                            "td",
                            { className: "p-1 text-center" },
                            React.createElement(
                              "button",
                              {
                                onClick: () => removeItem("perks", pk.id),
                                className: "text-red-500",
                              },
                              React.createElement(Icon, {
                                name: "X",
                                size: 14,
                              }),
                            ),
                          ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
    ),
    React.createElement(TemplatePicker, {
      isOpen: pickerConfig.isOpen,
      type: pickerConfig.type,
      templates: templates[pickerConfig.type] || [],
      onSelect: addFromTemplate,
      onClose: () => setPickerConfig({ ...pickerConfig, isOpen: false }),
      lang: lang,
    }),
    isAdminOpen &&
      React.createElement(
        "div",
        {
          className:
            "fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 print:hidden",
          onMouseDown: () => setIsAdminOpen(false),
        },
        React.createElement(
          "div",
          {
            className:
              "w-full max-w-5xl bg-[#fdfaf5] border-2 border-stone-800 shadow-2xl p-4 sm:p-6",
            onMouseDown: (e) => e.stopPropagation(),
          },
          React.createElement(
            "div",
            {
              className:
                "flex items-center justify-between mb-4 border-b-2 border-stone-800 pb-2",
            },
            React.createElement(
              "h2",
              { className: "text-lg font-bold uppercase tracking-wide" },
              "Administrace – databáze",
            ),
            React.createElement(
              "button",
              {
                className: "btn-admin bg-red-800 text-white",
                onClick: () => setIsAdminOpen(false),
              },
              React.createElement(Icon, { name: "X", size: 16 }),
              " Zavřít",
            ),
          ),
          React.createElement(
            "div",
            { className: "flex gap-2 mb-4" },
            ["weapons", "inventory", "perks"].map((tab) =>
              React.createElement(
                "button",
                {
                  key: tab,
                  className: `btn-admin ${tplTab === tab ? "bg-amber-700 text-stone-900" : "bg-stone-700 text-amber-200 hover:bg-stone-600"}`,
                  onClick: () => {
                    setTplTab(tab);
                    setTplDraft((p) => ({ ...p, [tab]: null }));
                  },
                },
                tab === "weapons"
                  ? "Zbraně"
                  : tab === "inventory"
                    ? "Vybavení"
                    : "Perky",
              ),
            ),
          ),
          React.createElement(
            "div",
            { className: "grid grid-cols-1 lg:grid-cols-2 gap-4" },
            React.createElement(
              "div",
              { className: "border-2 border-stone-800 bg-white" },
              React.createElement(
                "div",
                {
                  className:
                    "flex justify-between items-center p-2 bg-stone-800 text-stone-100",
                },
                React.createElement(
                  "div",
                  { className: "font-bold text-sm" },
                  tplTab === "weapons"
                    ? "Zbraně"
                    : tplTab === "inventory"
                      ? "Vybavení"
                      : "Perky",
                ),
                React.createElement(
                  "button",
                  {
                    className: "btn-add",
                    onClick: () =>
                      setTplDraft((p) => ({
                        ...p,
                        [tplTab]: defaultTemplate(tplTab),
                      })),
                  },
                  React.createElement(Icon, { name: "Plus", size: 14 }),
                  " Nový",
                ),
              ),
              React.createElement(
                "div",
                { className: "max-h-[60vh] overflow-auto" },
                (templates[tplTab] || []).length === 0
                  ? React.createElement(
                      "div",
                      { className: "p-3 text-sm text-stone-500" },
                      "Zatím prázdné.",
                    )
                  : (templates[tplTab] || []).map((row) =>
                      React.createElement(
                        "div",
                        {
                          key: row.id,
                          className:
                            "p-2 border-b-2 border-stone-800 flex items-start justify-between gap-2 hover:bg-amber-50",
                        },
                        React.createElement(
                          "button",
                          {
                            className: "text-left flex-1",
                            onClick: () =>
                              setTplDraft((p) => ({ ...p, [tplTab]: row })),
                          },
                          React.createElement(
                            "div",
                            { className: "font-bold text-sm" },
                            row.name || "(beze jména)",
                          ),
                          tplTab === "inventory" &&
                            React.createElement(
                              "div",
                              { className: "text-xs text-stone-600" },
                              getTypeLabel(row.type || "other", lang),
                            ),
                          tplTab === "weapons" &&
                            React.createElement(
                              "div",
                              { className: "text-xs text-stone-600" },
                              row.skill || "",
                            ),
                        ),
                        React.createElement(
                          "button",
                          {
                            className: "text-red-700",
                            onClick: () => deleteTemplate(tplTab, row.id),
                          },
                          React.createElement(Icon, {
                            name: "Trash2",
                            size: 16,
                          }),
                        ),
                      ),
                    ),
              ),
            ),
            React.createElement(
              "div",
              { className: "border-2 border-stone-800 bg-white p-3" },
              !tplDraft[tplTab]
                ? React.createElement(
                    "div",
                    { className: "text-sm text-stone-500" },
                    "Vyber položku vlevo, nebo vytvoř novou.",
                  )
                : React.createElement(
                    "div",
                    { className: "flex flex-col gap-3" },
                    React.createElement(
                      "div",
                      {
                        className: "text-xs uppercase font-bold text-stone-600",
                      },
                      "Editace",
                    ),
                    React.createElement(InputGroup, {
                      label:
                        tplTab === "perks"
                          ? "Název perku"
                          : tplTab === "inventory"
                            ? "Název předmětu"
                            : "Název zbraně",
                      value: tplDraft[tplTab].name || "",
                      onChange: (v) =>
                        setTplDraft((p) => ({
                          ...p,
                          [tplTab]: { ...p[tplTab], name: v },
                        })),
                      isEditing: true,
                    }),
                    tplTab === "inventory" &&
                      React.createElement(
                        "div",
                        { className: "grid grid-cols-2 gap-3" },
                        React.createElement(
                          "div",
                          { className: "flex flex-col" },
                          React.createElement(
                            "label",
                            {
                              className:
                                "text-[10px] uppercase font-bold text-stone-500 mb-1",
                            },
                            "Typ",
                          ),
                          React.createElement(
                            "select",
                            {
                              className:
                                "border-b-2 border-stone-800 bg-transparent px-1 py-1 font-bold text-stone-800 focus:border-amber-600 focus:outline-none",
                              value: tplDraft[tplTab].type || "other",
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
                              React.createElement(
                                "option",
                                { key: o.key, value: o.key },
                                lang === "en" ? o.en : o.cs,
                              ),
                            ),
                          ),
                        ),
                        React.createElement(InputGroup, {
                          label: "Váha",
                          value: tplDraft[tplTab].weight || "",
                          onChange: (v) =>
                            setTplDraft((p) => ({
                              ...p,
                              inventory: { ...p.inventory, weight: v },
                            })),
                          isEditing: true,
                        }),
                      ),
                    tplTab === "perks" &&
                      React.createElement(
                        "div",
                        { className: "grid grid-cols-2 gap-3" },
                        React.createElement(InputGroup, {
                          label: "Stupeň",
                          value: tplDraft[tplTab].rank || "1",
                          onChange: (v) =>
                            setTplDraft((p) => ({
                              ...p,
                              perks: { ...p.perks, rank: v },
                            })),
                          isEditing: true,
                        }),
                        React.createElement(
                          "div",
                          { className: "flex flex-col" },
                          React.createElement(
                            "label",
                            {
                              className:
                                "text-[10px] uppercase font-bold text-stone-500 mb-1",
                            },
                            "Účinek",
                          ),
                          React.createElement(AutoResizeTextarea, {
                            className: "border-2 border-stone-800 p-2 text-sm",
                            value: tplDraft[tplTab].effect || "",
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
                      React.createElement(
                        "div",
                        { className: "grid grid-cols-2 gap-3" },
                        React.createElement(InputGroup, {
                          label: "Dovednost",
                          value: tplDraft[tplTab].skill || "",
                          onChange: (v) =>
                            setTplDraft((p) => ({
                              ...p,
                              weapons: { ...p.weapons, skill: v },
                            })),
                          isEditing: true,
                        }),
                        React.createElement(
                          "div",
                          { className: "flex items-center gap-2 mt-5" },
                          React.createElement("input", {
                            type: "checkbox",
                            checked: !!tplDraft[tplTab].assigned,
                            onChange: (e) =>
                              setTplDraft((p) => ({
                                ...p,
                                weapons: {
                                  ...p.weapons,
                                  assigned: e.target.checked,
                                },
                              })),
                          }),
                          React.createElement(
                            "span",
                            { className: "text-sm font-bold" },
                            "PŘIŘ.",
                          ),
                        ),
                        React.createElement(InputGroup, {
                          label: "CČ",
                          value: tplDraft[tplTab].targetNum || "",
                          onChange: (v) =>
                            setTplDraft((p) => ({
                              ...p,
                              weapons: { ...p.weapons, targetNum: v },
                            })),
                          isEditing: true,
                        }),
                        React.createElement(InputGroup, {
                          label: "Pošk.",
                          value: tplDraft[tplTab].damage || "",
                          onChange: (v) =>
                            setTplDraft((p) => ({
                              ...p,
                              weapons: { ...p.weapons, damage: v },
                            })),
                          isEditing: true,
                        }),
                        React.createElement(InputGroup, {
                          label: "Účinky",
                          value: tplDraft[tplTab].effects || "",
                          onChange: (v) =>
                            setTplDraft((p) => ({
                              ...p,
                              weapons: { ...p.weapons, effects: v },
                            })),
                          isEditing: true,
                        }),
                        React.createElement(InputGroup, {
                          label: "Druh",
                          value: tplDraft[tplTab].type || "",
                          onChange: (v) =>
                            setTplDraft((p) => ({
                              ...p,
                              weapons: { ...p.weapons, type: v },
                            })),
                          isEditing: true,
                        }),
                        React.createElement(InputGroup, {
                          label: "Rych.",
                          value: tplDraft[tplTab].rateOfFire || "",
                          onChange: (v) =>
                            setTplDraft((p) => ({
                              ...p,
                              weapons: { ...p.weapons, rateOfFire: v },
                            })),
                          isEditing: true,
                        }),
                        React.createElement(InputGroup, {
                          label: "Dostř.",
                          value: tplDraft[tplTab].range || "",
                          onChange: (v) =>
                            setTplDraft((p) => ({
                              ...p,
                              weapons: { ...p.weapons, range: v },
                            })),
                          isEditing: true,
                        }),
                        React.createElement(InputGroup, {
                          label: "Atributy",
                          value: tplDraft[tplTab].attributes || "",
                          onChange: (v) =>
                            setTplDraft((p) => ({
                              ...p,
                              weapons: { ...p.weapons, attributes: v },
                            })),
                          isEditing: true,
                        }),
                        React.createElement(InputGroup, {
                          label: "Munice",
                          value: tplDraft[tplTab].ammo || "",
                          onChange: (v) =>
                            setTplDraft((p) => ({
                              ...p,
                              weapons: { ...p.weapons, ammo: v },
                            })),
                          isEditing: true,
                        }),
                        React.createElement(InputGroup, {
                          label: "Váha",
                          value: tplDraft[tplTab].weight || "",
                          onChange: (v) =>
                            setTplDraft((p) => ({
                              ...p,
                              weapons: { ...p.weapons, weight: v },
                            })),
                          isEditing: true,
                        }),
                      ),
                    React.createElement(
                      "div",
                      {
                        className:
                          "flex justify-end gap-2 pt-2 border-t-2 border-stone-800",
                      },
                      React.createElement(
                        "button",
                        {
                          className: "btn-admin bg-green-700 text-white",
                          onClick: () => saveTemplate(tplTab, tplDraft[tplTab]),
                        },
                        React.createElement(Icon, { name: "Save", size: 16 }),
                        " Uložit",
                      ),
                    ),
                  ),
            ),
          ),
        ),
      ),
  );
}

const root = createRoot(document.getElementById("root"));
root.render(React.createElement(FalloutSheetApp));
