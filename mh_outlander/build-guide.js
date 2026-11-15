'use strict';

const weaponPaths = {
  'Great Sword':['Charge Enhancement','Wrecker'],
  'Long Sword':['Spirit Bind Blade','Flash Draw'],
  'Dual Blades':['Demonic Strength','Combo Enhancement'],
  Lance:['Pierce','Offensive Defense'],
  Hammer:['Intimidation','Charge Enhancement'],
  'Charge Blade':['Morph Boost','Offensive Defense'],
  'Heavy Bowgun':['Ammo Enhancement','Capacity Boost','Piercing Strike'],
  Bow:['Bow Skill Boost','Charged Power Shot','Stamina Conversion']
};
const elements = {Fire:'🔥 ไฟ',Water:'💧 น้ำ',Thunder:'⚡ สายฟ้า',Ice:'❄ น้ำแข็ง',Dragon:'มังกร',None:'ไร้ธาตุ'};
const weapons = gear.filter(item => item.slot === 'weapon');
const guideType = $('guide-type');
const guideElement = $('guide-element');
const guideWeapon = $('guide-weapon');
const guideResults = $('guide-results');
const selectOptions = (rows, placeholder) => '<option value="">'+esc(placeholder)+'</option>'+
  options(rows,row=>row.label,false);
const rows = values => values.map(id=>({id,label:id}));
guideType.innerHTML = selectOptions(rows(Object.keys(weaponPaths)), 'เลือกประเภทอาวุธ');

function renderGuide() {
  const type = guideType.value, element = guideElement.value;
  const weapon = weapons.find(item=>item.id===guideWeapon.value);
  const matches = weapons.filter(item=>item.type===type && item.element===element);
  guideElement.disabled = !type;
  guideWeapon.disabled = !matches.length;
  guideWeapon.innerHTML = selectOptions(matches.map(item=>({
    id:item.id,label:item.name+' · R'+item.rank+' · ATK '+item.attack
  })), matches.length ? 'เลือกอาวุธ' : 'ยังไม่มีอาวุธในคลังสำหรับตัวเลือกนี้');
  if (weapon && matches.includes(weapon)) guideWeapon.value = weapon.id;
  if (!type || !element) {
    guideResults.innerHTML = '';
    return;
  }

  const elementSkill = element+' Damage Up';
  const weaponSkills = Object.keys(weapon?.skills || {});
  const suggested = [...new Set([...(skillCaps[elementSkill] ? [elementSkill] : []),
    ...weaponSkills,...weaponPaths[type]])].filter(name=>searchableSkills.includes(name));
  const skills = suggested.map(name=>'<li>'+abilityButton('skill',name,name)+
    '<small>'+esc(skillSummary(name))+'</small><button type="button" data-guide-skill="'+esc(name)+
    '">เพิ่มเป็นเป้าค้นหา</button></li>').join('');
  const armor = Object.keys(slots).filter(slot=>slot!=='weapon').map(slot=>
    gear.filter(item=>item.slot===slot && suggested.some(name=>item.skills[name]))
      .sort((a,b)=>armorFit(b,suggested)-armorFit(a,suggested) || b.defense-a.defense)[0]).filter(Boolean);
  const armorList = armor.map(item=>'<li>'+esc(slots[item.slot])+' · '+abilityButton('gear',item.id,item.name)+
    ' · R'+item.rank+'<small>'+esc(suggested.filter(name=>item.skills[name])
      .map(name=>name+' +'+item.skills[name]).join(' / '))+'</small></li>').join('');
  const setName = {Fire:'Ink of Flames', Water:'Ink of Water', Thunder:'Ink of Thunder'}[element];
  const cards = visages.filter(card=>card.sets.includes(setName) && card.cost>1).slice(0,3);
  const cardList = cards.map(card=>'<li>'+abilityButton('visage',card.id,card.name)+
    ' · Cost '+card.cost+'<small>'+esc(card.core || setName)+'</small></li>').join('');
  const buddy = buddies.find(item=>item.id===({Fire:'kojiro',Thunder:'pipa',Ice:'ro',Dragon:'daisho'}[element]));
  guideResults.innerHTML = (weapon ? '<p>'+abilityButton('gear',weapon.id,weapon.name)+'</p>' :
    '<p class="muted">'+(matches.length ? 'เลือกอาวุธเพื่อใช้กับชุดนี้' :
      'คลังยังไม่มีอาวุธคู่นี้ · ดูแนวทางสกิลด้านล่างได้')+'</p>')+
    '<div class="guide-grid"><section><h3>สกิลที่เข้ากับสายนี้</h3><ul>'+skills+'</ul></section>'+
    (armorList ? '<section><h3>ตัวอย่างเกราะที่ให้แต้มตรงสาย</h3><ul>'+armorList+'</ul></section>' : '')+
    (cardList || buddy ? '<section><h3>Visage และ Buddy เข้าธาตุ</h3><ul>'+cardList+
      (buddy ? '<li>'+abilityButton('buddy',buddy.id,buddy.name)+'<small>'+esc(buddy.effect)+'</small></li>' : '')+
      '</ul></section>' : '')+'</div>'+
    '<p class="muted">เกราะตัวอย่างเรียงตามแต้มที่ตรงกับรายการแนะนำ ใช้ปุ่มเพิ่มเป้าเพื่อค้นชุด 5 ส่วน</p>';
}

function armorFit(item, skills) {
  return skills.reduce((sum, name)=>sum+(item.skills[name] || 0),0);
}
guideElement.innerHTML = selectOptions(Object.entries(elements).map(([id,label])=>({id,label})), 'เลือกธาตุ');
guideType.addEventListener('change',()=> {
  guideElement.value = '';
  guideWeapon.value = '';
  renderGuide();
});
guideElement.addEventListener('change',()=> {
  guideWeapon.value = '';
  renderGuide();
});
guideWeapon.addEventListener('change',()=> {
  if (guideWeapon.value) update(()=>{ state.gear.weapon = guideWeapon.value; },'เลือกอาวุธแล้ว');
  renderGuide();
});
guideResults.addEventListener('click',event=> {
  const name = event.target.closest('[data-guide-skill]')?.dataset.guideSkill;
  if (!name) return;
  const fields = Array.from({length:goalCount},(_,i)=>$('goal-'+i));
  const existing = fields.findIndex(field=>field.value===name);
  const index = existing>=0 ? existing : fields.findIndex(field=>!field.value);
  if (index<0) {
    $('guide-status').textContent = 'เลือกครบ 3 สกิลแล้ว เปลี่ยนเป้าเดิมในส่วนค้นชุดได้';
    return;
  }
  if (existing<0) {
    $('skill-filter').value = '';
    $('skill-filter').dispatchEvent(new Event('input'));
    fields[index].value = name;
    fields[index].dispatchEvent(new Event('change'));
  }
  $('guide-status').textContent = 'เป้าค้นหา: '+name;
  fields[index].focus();
});
let lastGuideWeapon = state.gear.weapon;
document.addEventListener('hunter-forge:build-change',()=> {
  if (state.gear.weapon===lastGuideWeapon) return;
  lastGuideWeapon = state.gear.weapon;
  const weapon = weapons.find(item=>item.id===state.gear.weapon);
  if (!weapon) {
    guideWeapon.value = '';
    renderGuide();
    return;
  }
  if (!weapon || (guideWeapon.value===weapon.id && guideType.value===weapon.type)) return;
  guideType.value = weapon.type;
  guideElement.value = weapon.element;
  renderGuide();
  guideWeapon.value = weapon.id;
  renderGuide();
});
renderGuide();
