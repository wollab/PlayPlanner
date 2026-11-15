/* Factual starter catalog; sources in each record and in README. */
const GW = 'https://gamewith.ai/monster-hunter-outlanders/en/';
const armorLibrary = typeof module !== 'undefined' ? require('./armor-catalog.js') : armorCatalog;
const armorSource = 'https://mhoutlandersbuild.com/armor';
const slots = { weapon:'อาวุธ', head:'หัว', chest:'อก', arms:'แขน', waist:'เอว', legs:'ขา' };
const F = 'Fire Damage Up', H = 'Health Cycle', W = 'Weakspot Follow-Up';
const armor = (id, slot, name, set, skills, parts) => ({
  id, slot, name: name + ' III', set, rank: 8, url: GW+'armor/'+set.toLowerCase(), skills, step:'อัปเกรด',
  materials: [["Hunter's Jade III",2], ...parts.map(p=>[set+' '+p+' III',3])]
});
const starterGear = [
  {id:'blood',slot:'weapon',name:'Wyvern Blade "Blood" III',rank:8,type:'Long Sword',element:'Fire',attack:331,skills:{},step:'อัปเกรด',url:GW+'weapons/wyvern-blade-blood',materials:[["Hunter's Jade III",2],['Rathalos Scale III',3],['Rathalos Shell III',3]]},
  {id:'fall',slot:'weapon',name:'Wyvern Blade "Fall" II',rank:6,type:'Long Sword',element:'Fire',attack:201,skills:{},step:'คราฟต์',url:GW+'weapons/wyvern-blade-fall',materials:[["Hunter's Jade II",1],['Rathalos Scale II',2],['Rathalos Shell II',2]]},
  {id:'scimitar',slot:'weapon',name:'Anja Scimitar III',rank:8,type:'Long Sword',element:'Fire',attack:347,skills:{},step:'อัปเกรด',url:GW+'weapons/anja-scimitar',materials:[["Hunter's Jade III",2],['Anjanath Pelt III',3],['Anjanath Fang III',3]]},
  {id:'blazing-bow',slot:'weapon',name:'Blazing Bow I',rank:3,type:'Bow',element:'Fire',attack:79,skills:{},step:'คราฟต์',url:GW+'weapons/blazing-bow',materials:[["Hunter's Jade I",1],['Anjanath Pelt I',1],['Anjanath Fang I',1]]},
  {id:'rathslinger-r10',slot:'weapon',name:'Rathslinger IV',rank:10,type:'Bow',element:'Fire',attack:498,skills:{},step:'อัปเกรด',url:GW+'weapons/rathslinger',materials:[["Hunter's Jade IV",2],['Rathalos Scale IV',3],['Rathalos Shell IV',3]]},
  {id:'strikebow-r10',slot:'weapon',name:'Radiant Kadachi Strikebow IV',rank:10,type:'Bow',element:'Thunder',attack:526,skills:{},step:'อัปเกรด',url:GW+'weapons/radiant-kadachi-strikebow',materials:[["Hunter's Jade IV",2],['Radiant Tobi-Kadachi Pelt IV',3],['Radiant Tobi-Kadachi Membrane IV',3]]},
  armor('r-head','head','Rathalos Helm','Rathalos',{[F]:1,Breaker:1,Deterrence:1},['Shell']),
  armor('r-chest','chest','Rathalos Mail','Rathalos',{[F]:2,[H]:1},['Shell','Scale']),
  armor('r-arms','arms','Rathalos Vambraces','Rathalos',{Deterrence:2,'Fire Resistance':1},['Webbing','Plate','Scale']),
  armor('r-waist','waist','Rathalos Coil','Rathalos',{Wrecker:1,'Weakspot Exploit':1,'Fire Resistance':1},['Webbing','Tail','Scale']),
  armor('r-legs','legs','Rathalos Greaves','Rathalos',{'Fire Resistance':1,Wrecker:2},['Shell']),
  armor('a-head','head','Anja Helm','Anjanath',{[W]:1,Wrecker:1,'Quick-Bite':1},['Scale','Fang','Nosebone','Plate']),
  armor('a-chest','chest','Anja Mail','Anjanath',{'Fire Resistance':1,'Charge Enhancement':1,[W]:1},['Pelt','Fang']),
  armor('a-arms','arms','Anja Vambraces','Anjanath',{[W]:1,[H]:1,'Quick-Bite':1},['Scale','Pelt']),
  armor('a-waist','waist','Anja Coil','Anjanath',{[F]:2,[H]:1},['Scale','Fang','Nosebone','Tail']),
  armor('a-legs','legs','Anja Greaves','Anjanath',{[F]:1,[H]:1,Adversity:1},['Scale','Pelt']),
];
const importedArmor = armorLibrary.items.map(([id,slot,name,set,rank,defense,skills,materials,step,url]) =>
  ({id,slot,name,set,rank,defense,skills,materials:materials ?? [],materialsUnknown:materials === null,step,url}));
const importedIds = new Set(importedArmor.map(item => item.id));
const weaponRows = typeof module !== 'undefined' ? require('./weapon-catalog.js') : weaponCatalog;
const importedWeapons = weaponRows.flatMap(([slug,name,type,range,attack,affinity,element,elementAttack,sharpness,skill]) => {
  const url = GW+'weapons/'+slug;
  const rank = Number(range.split('-').at(-1));
  if (starterGear.some(item=>item.url===url && item.rank===rank)) return [];
  return [{id:'weapon-'+slug+'-r'+rank,slot:'weapon',name,type,rank,rankRange:range,attack,
    affinity,element,elementAttack,sharpness,skills:skill ? {[skill]:10} : {},url,
    materials:[],materialsUnknown:true}];
});
const gear = [...starterGear.filter(item => !importedIds.has(item.id)), ...importedWeapons, ...importedArmor];
const armorSets = {
  Rathalos:{threshold:3, label:"Rathalos's Weakness", skills:{'Weakspot Exploit':1}},
  Anjanath:{threshold:3, label:'Anjanath Ember', skills:{[F]:1}},
  ...armorLibrary.sets
};
const skillCaps = {[F]:7,[H]:3,[W]:5,Breaker:3,Deterrence:3,Wrecker:4,Adversity:1,'Quick-Bite':3,'Fire Resistance':3,'Charge Enhancement':7,'Weakspot Exploit':3,...armorLibrary.caps};
const skillNotes = {
  Wrecker:'ใช้กับ Great Sword',
  'Stamina Conversion':'เพิ่มดาเมจของท่าโจมตีที่ใช้สตามินา',
  'Charged Power Shot':'เพิ่มดาเมจขณะรักษาระดับชาร์จของอาวุธระยะไกล',
  Flawless:'เพิ่มดาเมจเมื่อเลือดเต็ม',
  'Weakspot Follow-Up':'มีโอกาสโจมตีเพิ่มเมื่อโจมตีส่วนที่แตกแล้ว',
  'Bow Skill Boost':'เพิ่มดาเมจของ Skill 1, 2 และ 3 ของ Bow',
  'Charge Enhancement':'ต้องโจมตีชาร์จแบบฟันหรือทุบให้โดนก่อน ลูกธนูชาร์จใช้เปิดบัฟนี้ไม่ได้',
  'Charge Up':'เพิ่มดาเมจเมื่อ Stamina เต็มต่อเนื่อง 5 วินาที'
};
const oldVisages = [
  ['radiant-rathian','Radiant Rathian',4,'หลังทำ Rupture: ดาเมจไฟ +10% นาน 20 วิ'],
  ['rathian','Rathian',3,'เมื่อใช้อาวุธธาตุไฟ: ดาเมจไฟ +7%'],
  ['radiant-rathalos','Radiant Rathalos',3,'หลังใช้ Charged Skill: ดาเมจไฟ +10% นาน 15 วิ'],
  ['kestodon','Kestodon',1,''],['noios','Noios',1,''],['barnos','Barnos',1,'']
].map(([id,name,cost,core])=>({id,name,cost,core,url:GW+'visages/set/ink-of-flames'}));
const visages = visageCatalog.map(card => ({
  ...card,
  core: visageCoreEffects[card.id] ?? (card.cost === 1 ? 'ไม่มี Core effect' : ''),
  url: GW+'visages/'+card.id
}));
const buddies = [
  ['kojiro','Kojiro','หลังทำ Rupture: เพิ่มดาเมจไฟชั่วคราว 10 วิ · ค่าขึ้นกับระดับ Aid'],
  ['daisho','Daisho','หลัง Parry หรือ Ferocity: เพิ่มดาเมจมังกรชั่วคราว'],
  ['pipa','Pipa','หลังทำ Piercing Damage: เพิ่มดาเมจสายฟ้า'],
  ['ro','Ro','หลังทำ Charge Damage: เพิ่มดาเมจน้ำแข็งชั่วคราว'],
  ['hoppy','Hoppy','ช่วยหยุดมอนสเตอร์ด้วยกับดักและ Ultimate']
].map(([id,name,effect])=>({id,name,effect,url:GW+'articles/buddy-tier-list'}));
const monsters = {
  Rathalos:{weak:'Dragon',url:GW+'monsters/rathalos',ranks:{II:'★8–9',III:'★10–11'}, parts:{'Scale':'ลำตัว','Shell':'หัว','Webbing':'ปีก','Tail':'หาง'}},
  Anjanath:{weak:'Water',url:GW+'monsters/anjanath',ranks:{I:'★3–6',II:'★7–9',III:'★10'},parts:{'Scale':'ขาหลัง','Nosebone':'หัว'},unverified:['Nosebone III']}
};
const presets = [
  {id:'bow-fire',name:'ตัวเอก · Bow ธาตุไฟ',label:'GameWith · Bow Builds',url:GW+'articles/best-bow-builds',gear:{weapon:'rathslinger-r10',head:'pink-rathian-head-r10',chest:'rathalos-chest-r10',arms:'radiant-kadachi-arms-r10',waist:'anjanath-waist-r10',legs:'radiant-pukei-pukei-legs-r9'},visages:[],buddy:'',note:'ชุดธนูไฟของตัวเอก · R9/R10 · แหล่งอ้างอิงอัปเดต 11 พ.ย. 2026'},
  {id:'bow-luka',name:'Luka · Bow ทั่วไป',label:'GameWith · Bow Builds',url:GW+'articles/best-bow-builds',gear:{weapon:'strikebow-r10',head:'radiant-pukei-pukei-head-r9',chest:'radiant-pukei-pukei-chest-r9',arms:'radiant-paolumu-arms-r9',waist:'pukei-pukei-waist-r9',legs:'radiant-pukei-pukei-legs-r9'},visages:[],buddy:'',note:'ชุด Luka สำหรับ Non-Radiant ตาม GameWith · อ้างอิงอัปเดต 11 พ.ย. 2026'},
  {id:'midori',name:'Midori · Long Sword ไฟ',label:'Game8 ผ่าน MH Outlanders Wiki',url:'https://mhoutlanders.net/adventurers/midori/',original:'https://game8.co/games/Monster-Hunter-Outlanders/archives/602026',gear:{weapon:'blood',head:'r-head',chest:'r-chest',arms:'a-arms',waist:'a-waist',legs:'a-legs'},visages:['radiant-rathian','rathian','radiant-rathalos','kestodon','noios'],buddy:'kojiro',note:'เลือกระดับ R8 เพราะชิ้นชื่อ III มีหลายระดับ การ์ดนอก Core เป็นตัวอย่างที่เว็บจัดให้เพื่อเปิด Ink of Flames'},
  {id:'rathalos',name:'Rathalos ล้วน · ตัวอย่างเทียบ',label:'ตัวอย่างของ Hunter Forge',url:armorSource,gear:{weapon:'blood',head:'r-head',chest:'r-chest',arms:'r-arms',waist:'r-waist',legs:'r-legs'},visages:[],buddy:'',note:'ใช้ดูว่าเปลี่ยนจากเกราะผสมเป็นชุด Rathalos ล้วนแล้วได้หรือเสียสกิลอะไร'}
];
if (typeof module !== 'undefined') module.exports = {slots,gear,armorSets,skillCaps,visages,buddies,monsters,presets};
