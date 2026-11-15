/* GameWith visage list; set membership and cost checked 15 November 2026. */
const visageCoreEffects = {
  "rathian": "When equipped with a fire weapon, fire damage +7%.",
  "radiant-rathian": "After triggering rupture damage, fire damage +10% for 20s.",
  "radiant-rathalos": "After using a charged skill, fire damage +10% for 15s.",
  "kestodon": "None (cost 1 visages have no core effect)",
  "noios": "None (cost 1 visages have no core effect)",
  "barnos": "None (cost 1 visages have no core effect)",
  "pink-rathian": "After a debuff skill hits a monster, its damage taken +6% for 30s. Cooldown: 60s.",
  "rathalos": "After an ultimate inflicts suppression on a monster, squad damage +6% for 30s. Cooldown: 60s.",
  "tobi-kadachi": "When equipped with a thunder weapon, thunder damage +7%.",
  "radiant-tobi-kadachi": "When dealing piercing damage, thunder damage +10%.",
  "jyuratodus": "Unaffected by movement penalties when stuck in mud.",
  "tzitzi-ya-ku": "Daze duration +0.5s. After a monster is dazed, its damage taken +6% for 30s. Cooldown: 60s.",
  "great-girros": "Paralysis Resistance +3. Prevents paralysis.",
  "jagras": "None (cost 1 visages have no core effect)",
  "mernos": "None (cost 1 visages have no core effect)",
  "vespoid": "None (cost 1 visages have no core effect)",
  "gajau": "None (cost 1 visages have no core effect)",
  "apceros": "None (cost 1 visages have no core effect)",
  "ruger-aidal": "When equipped with a fire weapon, fire damage +15%. (S0 Season only)",
  "diablos": "When equipped with a physical or ailment weapon, physical damage +3.5%.",
  "radiant-diablos": "After triggering ferocity, dragon damage +10% for 45s.",
  "barroth": "เมื่อใช้อาวุธธาตุน้ำ ดาเมจน้ำ +7%",
  "radiant-barroth": "เมื่อชาร์จถึงระดับสูงสุด ดาเมจน้ำ +10% นาน 45 วินาที",
  "anjanath": "After an adventurer uses a buff squadmate skill, squad damage +3.5% for 60s.",
  "radiant-anjanath": "During charged attacks, dragon damage +10%.",
  "radiant-great-jagras": "After eating a BBQ, fire damage +10% for 45s. Effect ends early after taking 100 total damage.",
  "pukei-pukei": "When an ultimate heals a squadmate, squad damage +3.5% for 60s.",
  "radiant-pukei-pukei": "After using a skill that consumes a coating, water damage +10% for 45s.",
  "kulu-ya-ku": "Instinct +1. Attacks will not be deflected.",
  "radiant-kulu-ya-ku": "After triggering combo damage, fire damage +16% for 10s. Cooldown: 20s.",
  "radiant-jyuratodus": "After using shield, squad defense +10 and squad damage +4% for 45s.",
  "paolumu": "When Windproof reaches level 3, grants the entire squad immunity to all wind pressure (including dragon wind pressure).",
  "radiant-paolumu": "While airborne, water damage +10%.",
  "legiana": "When equipped with an ice weapon, ice damage +7%.",
  "odogaron": "Bleeding Resistance +3. Prevents bleeding.",
  "radobaan": "Sleep Resistance +3. Prevents sleep.",
  "great-jagras": "Quick-Bite +3. Greatly increases the speed of eating meat and using items.",
  "radiant-legiana": "While airborne, ice damage +10%.",
  "radiant-radobaan": "After using a charged skill, ice damage +10% for 15s.",
  "radiant-tzitzi-ya-ku": "After triggering daze on a monster, thunder damage +16% for 30s. Cooldown: 60s.",
  "radiant-great-girros": "After triggering combo damage, thunder damage +10% for 15s.",
};
const visageSetEffects = {
  'Ink of Flames': ['ดาเมจไฟ +5%', 'เมื่อโจมตีจุดอ่อน ดาเมจไฟ +24% 20 วิ'],
  'Ink of Water': ['ดาเมจน้ำ +5%', 'เมื่อเพื่อนร่วมทีมใช้ Ultimate ดาเมจน้ำ +6% 60 วิ สะสมได้ 4 ครั้ง'],
  'Ink of Thunder': ['ดาเมจสายฟ้า +5%', 'เมื่อโจมตีมอนสเตอร์ ดาเมจสายฟ้า +5% 12 วิ สะสมได้ 5 ครั้ง'],
  'Ink of Frost': ['ดาเมจน้ำแข็ง +5%', 'หลังโจมตีมอนสเตอร์ ดาเมจน้ำแข็ง +24% 8 วิ'],
  'Ink of Dragon': ['ดาเมจมังกร +5%', 'หลังใช้ Ultimate ดาเมจมังกร +24% 60 วิ'],
  'Ink of Might': ['Physical damage +5%', 'หลังติดคริติคอล Physical damage +12% 60 วิ'],
  'Ink of Combat': ['Affinity +5%', 'เมื่อ Ultimate ใส่ debuff ดาเมจทีม +6.5% 60 วิ'],
  'Ink of Guidance': ['Ultimate charge rate +5%', 'หลัง Ultimate ทำ suppression การใช้ Ultimate ของทีมเพิ่มดาเมจทีมตามเงื่อนไข'],
  'Ink of Protection': ['Ultimate charge rate +5%', 'เมื่อผู้เล่นและ Buddy ฮีลหรือให้โล่เพื่อนร่วมทีม เพิ่มผลฮีล/โล่และดาเมจทีมตามเงื่อนไข'],
  'Ink of Resonance': ['Affinity +5%', 'เมื่อไม่ใช่ตัวหลัก Ultimate damage +32%'],
  'Ink of Grace': ['Ultimate charge rate +5%', 'เมื่อให้บัฟเพื่อนร่วมทีม ดาเมจทีม +6.5% 60 วิ'],
  "Kushala Daora's Tempest": ['Elemental damage +2% (Season 0)', 'Elemental damage +3% หรือ +10% เมื่อมอนถูก suppression (Season 0)']
};
const visageCatalog = [
  {
    "id": "rathian",
    "name": "Rathian",
    "cost": 3,
    "sets": [
      "Ink of Flames"
    ]
  },
  {
    "id": "pink-rathian",
    "name": "Pink Rathian",
    "cost": 4,
    "sets": [
      "Ink of Combat"
    ]
  },
  {
    "id": "rathalos",
    "name": "Rathalos",
    "cost": 3,
    "sets": [
      "Ink of Guidance",
      "Ink of Combat"
    ]
  },
  {
    "id": "radiant-rathalos",
    "name": "Radiant Rathalos",
    "cost": 3,
    "sets": [
      "Ink of Flames"
    ]
  },
  {
    "id": "diablos",
    "name": "Diablos",
    "cost": 4,
    "sets": [
      "Ink of Protection"
    ]
  },
  {
    "id": "black-diablos",
    "name": "Black Diablos",
    "cost": 4,
    "sets": [
      "Ink of Might",
      "Ink of Resonance"
    ]
  },
  {
    "id": "radiant-diablos",
    "name": "Radiant Diablos",
    "cost": 3,
    "sets": [
      "Ink of Dragon",
      "Ink of Protection"
    ]
  },
  {
    "id": "barroth",
    "name": "Barroth",
    "cost": 4,
    "sets": [
      "Ink of Water",
      "Ink of Protection"
    ]
  },
  {
    "id": "radiant-barroth",
    "name": "Radiant Barroth",
    "cost": 3,
    "sets": [
      "Ink of Water"
    ]
  },
  {
    "id": "anjanath",
    "name": "Anjanath",
    "cost": 3,
    "sets": [
      "Ink of Grace"
    ]
  },
  {
    "id": "radiant-anjanath",
    "name": "Radiant Anjanath",
    "cost": 3,
    "sets": [
      "Ink of Might"
    ]
  },
  {
    "id": "radiant-great-jagras",
    "name": "Radiant Great Jagras",
    "cost": 4,
    "sets": [
      "Ink of Guidance"
    ]
  },
  {
    "id": "pukei-pukei",
    "name": "Pukei-Pukei",
    "cost": 3,
    "sets": [
      "Ink of Grace",
      "Ink of Protection"
    ]
  },
  {
    "id": "radiant-pukei-pukei",
    "name": "Radiant Pukei-Pukei",
    "cost": 3,
    "sets": [
      "Ink of Grace",
      "Ink of Might"
    ]
  },
  {
    "id": "kulu-ya-ku",
    "name": "Kulu-Ya-Ku",
    "cost": 3,
    "sets": [
      "Ink of Might",
      "Ink of Flames"
    ]
  },
  {
    "id": "radiant-kulu-ya-ku",
    "name": "Radiant Kulu-Ya-Ku",
    "cost": 4,
    "sets": [
      "Ink of Flames",
      "Ink of Guidance"
    ]
  },
  {
    "id": "jyuratodus",
    "name": "Jyuratodus",
    "cost": 4,
    "sets": [
      "Ink of Water",
      "Ink of Frost"
    ]
  },
  {
    "id": "radiant-jyuratodus",
    "name": "Radiant Jyuratodus",
    "cost": 3,
    "sets": [
      "Ink of Water",
      "Ink of Protection"
    ]
  },
  {
    "id": "tobi-kadachi",
    "name": "Tobi-Kadachi",
    "cost": 4,
    "sets": [
      "Ink of Thunder",
      "Ink of Grace"
    ]
  },
  {
    "id": "paolumu",
    "name": "Paolumu",
    "cost": 4,
    "sets": [
      "Ink of Resonance",
      "Ink of Might"
    ]
  },
  {
    "id": "radiant-paolumu",
    "name": "Radiant Paolumu",
    "cost": 3,
    "sets": [
      "Ink of Guidance"
    ]
  },
  {
    "id": "legiana",
    "name": "Legiana",
    "cost": 4,
    "sets": [
      "Ink of Frost"
    ]
  },
  {
    "id": "great-girros",
    "name": "Great Girros",
    "cost": 4,
    "sets": [
      "Ink of Thunder",
      "Ink of Grace"
    ]
  },
  {
    "id": "odogaron",
    "name": "Odogaron",
    "cost": 3,
    "sets": [
      "Ink of Combat",
      "Ink of Dragon"
    ]
  },
  {
    "id": "radobaan",
    "name": "Radobaan",
    "cost": 3,
    "sets": [
      "Ink of Resonance",
      "Ink of Frost"
    ]
  },
  {
    "id": "tzitzi-ya-ku",
    "name": "Tzitzi-Ya-Ku",
    "cost": 3,
    "sets": [
      "Ink of Water"
    ]
  },
  {
    "id": "radiant-rathian",
    "name": "Radiant Rathian",
    "cost": 4,
    "sets": [
      "Ink of Flames"
    ]
  },
  {
    "id": "aptonoth",
    "name": "Aptonoth",
    "cost": 1,
    "sets": [
      "Ink of Protection"
    ]
  },
  {
    "id": "apceros",
    "name": "Apceros",
    "cost": 1,
    "sets": [
      "Ink of Protection",
      "Ink of Water"
    ]
  },
  {
    "id": "kelbi",
    "name": "Kelbi",
    "cost": 1,
    "sets": [
      "Ink of Frost",
      "Ink of Grace"
    ]
  },
  {
    "id": "hornetaur",
    "name": "Hornetaur",
    "cost": 1,
    "sets": [
      "Ink of Protection",
      "Ink of Dragon"
    ]
  },
  {
    "id": "vespoid",
    "name": "Vespoid",
    "cost": 1,
    "sets": [
      "Ink of Thunder",
      "Ink of Guidance"
    ]
  },
  {
    "id": "gajau",
    "name": "Gajau",
    "cost": 1,
    "sets": [
      "Ink of Water",
      "Ink of Frost"
    ]
  },
  {
    "id": "jagras",
    "name": "Jagras",
    "cost": 1,
    "sets": [
      "Ink of Resonance",
      "Ink of Combat"
    ]
  },
  {
    "id": "mernos",
    "name": "Mernos",
    "cost": 1,
    "sets": [
      "Ink of Water",
      "Ink of Thunder"
    ]
  },
  {
    "id": "kestodon",
    "name": "Kestodon",
    "cost": 1,
    "sets": [
      "Ink of Might",
      "Ink of Flames"
    ]
  },
  {
    "id": "raphinos",
    "name": "Raphinos",
    "cost": 1,
    "sets": [
      "Ink of Grace",
      "Ink of Frost"
    ]
  },
  {
    "id": "shamos",
    "name": "Shamos",
    "cost": 1,
    "sets": [
      "Ink of Grace",
      "Ink of Resonance"
    ]
  },
  {
    "id": "barnos",
    "name": "Barnos",
    "cost": 1,
    "sets": [
      "Ink of Flames",
      "Ink of Dragon"
    ]
  },
  {
    "id": "girros",
    "name": "Girros",
    "cost": 1,
    "sets": [
      "Ink of Thunder",
      "Ink of Combat"
    ]
  },
  {
    "id": "gastodon",
    "name": "Gastodon",
    "cost": 1,
    "sets": [
      "Ink of Might",
      "Ink of Dragon"
    ]
  },
  {
    "id": "noios",
    "name": "Noios",
    "cost": 1,
    "sets": [
      "Ink of Guidance",
      "Ink of Flames"
    ]
  },
  {
    "id": "warrior-atecoli",
    "name": "Warrior Atecoli",
    "cost": 1,
    "sets": [
      "Ink of Might",
      "Ink of Combat"
    ]
  },
  {
    "id": "pitcher-atecoli",
    "name": "Pitcher Atecoli",
    "cost": 1,
    "sets": [
      "Ink of Resonance",
      "Ink of Guidance"
    ]
  },
  {
    "id": "great-jagras",
    "name": "Great Jagras",
    "cost": 3,
    "sets": [
      "Ink of Dragon",
      "Ink of Resonance"
    ]
  },
  {
    "id": "radiant-legiana",
    "name": "Radiant Legiana",
    "cost": 3,
    "sets": [
      "Ink of Frost"
    ]
  },
  {
    "id": "radiant-tobi-kadachi",
    "name": "Radiant Tobi-Kadachi",
    "cost": 3,
    "sets": [
      "Ink of Thunder"
    ]
  },
  {
    "id": "radiant-radobaan",
    "name": "Radiant Radobaan",
    "cost": 3,
    "sets": [
      "Ink of Frost"
    ]
  },
  {
    "id": "radiant-tzitzi-ya-ku",
    "name": "Radiant Tzitzi-Ya-Ku",
    "cost": 3,
    "sets": [
      "Ink of Thunder"
    ]
  },
  {
    "id": "radiant-odogaron",
    "name": "Radiant Odogaron",
    "cost": 4,
    "sets": [
      "Ink of Might",
      "Ink of Combat"
    ]
  },
  {
    "id": "radiant-great-girros",
    "name": "Radiant Great Girros",
    "cost": 3,
    "sets": [
      "Ink of Thunder",
      "Ink of Grace"
    ]
  },
  {
    "id": "radiant-pink-rathian",
    "name": "Radiant Pink Rathian",
    "cost": 4,
    "sets": [
      "Ink of Dragon",
      "Ink of Resonance"
    ]
  },
  {
    "id": "radiant-black-diablos",
    "name": "Radiant Black Diablos",
    "cost": 3,
    "sets": [
      "Ink of Resonance"
    ]
  },
  {
    "id": "kushala-daora",
    "name": "Kushala Daora",
    "cost": 3,
    "sets": [
      "Kushala Daora's Tempest"
    ]
  },
  {
    "id": "ruger-aidal",
    "name": "Ruger Aidal",
    "cost": 3,
    "sets": [
      "Ink of Flames"
    ]
  }
];
