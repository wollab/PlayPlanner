'use strict';
const $ = id => document.getElementById(id);
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (url,label) => '<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+' ↗</a>';
const options = (rows,label,empty=true) => (empty?'<option value="">— ไม่ใส่ —</option>':'')+
  rows.map(row=>'<option value="'+row.id+'">'+esc(label(row))+'</option>').join('');
const empty = text => '<p class="muted">'+text+'</p>';
const effect = text => '<div class="effect">'+text+'</div>';
const catalog = {gear,armorSets,skillCaps,visages};
const storageKey = 'hunter-forge-mho-v1';
const integer = (v,max,fallback=0) => v === '' || !Number.isFinite(Number(v)) ? fallback : Math.min(max,Math.max(0,Math.trunc(Number(v))));
const clone = value => JSON.parse(JSON.stringify(value));
function initial() {
  const first = presets.find(p => p.id === 'midori');
  const fresh = {gear:{...first.gear},visages:[...first.visages],buddy:first.buddy,budget:12,preset:'midori',inventory:{},missingOnly:false};
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved || !saved.gear || !Array.isArray(saved.visages)) return fresh;
    for (const slot of Object.keys(slots)) fresh.gear[slot]=gear.find(g=>g.id===saved.gear[slot] && g.slot===slot)?.id||'';
    fresh.visages = Array.from({length:5},(_,i)=>visages.find(v=>v.id===saved.visages[i])?.id||'');
    fresh.buddy = buddies.find(b=>b.id===saved.buddy)?.id||'';
    fresh.preset = presets.find(p=>p.id===saved.preset)?.id||'midori';
    fresh.budget = integer(saved.budget,99,12);
    fresh.missingOnly = saved.missingOnly===true;
    for(const name of new Set(gear.flatMap(g=>g.materials.map(m=>m[0])))) {
      fresh.inventory[name]=integer(saved.inventory?.[name],99999);
    }
  } catch (_) { /* Local storage may be disabled. */ }
  return fresh;
}
const state = initial();
function save() {
  try { localStorage.setItem(storageKey,JSON.stringify(state)); } catch (_) { /* The planner still operates in memory. */ }
}
function update(fn, status='') {
  fn();
  save();
  render();
  document.dispatchEvent(new Event('hunter-forge:build-change'));
  if(status) $('status').textContent=status;
}

$('gear').innerHTML = Object.entries(slots).map(([id,title])=>
  '<div><label for="slot-'+id+'"><span>'+title+'</span><span class="rowtext"><select id="slot-'+id+'"></select></span></label><div id="source-'+id+'" class="item-source"></div></div>').join('');
function renderGearOptions() {
  const query=$('armor-filter').value.trim().toLowerCase();
  for (const slot of Object.keys(slots)) {
    const choices=gear.filter(item=>item.slot===slot && (slot==='weapon' || !query ||
      item.id===state.gear[slot] || [item.name,item.set,...Object.keys(item.skills),
        ...Object.keys(armorSets[item.set]?.skills ?? {})].some(text=>text.toLowerCase().includes(query))));
    const select=$('slot-'+slot);
    select.innerHTML=options(choices,item=>item.name+' · R'+item.rank);
    select.value=state.gear[slot]||'';
  }
}
$('armor-filter').addEventListener('input',renderGearOptions);
const cardLabels=['Core','ช่อง 2','ช่อง 3','ช่อง 4','ช่อง 5'];
$('cards').innerHTML = cardLabels.map((label,i)=>'<label for="card-'+i+'"><span>'+label+
  '</span><select id="card-'+i+'">'+options(visages,v=>v.name+' · '+v.cost+' · '+(v.core || v.sets.join(' / ')))+'</select></label>').join('');
$('buddy').innerHTML = options(buddies,b=>b.name+' · '+b.effect);
$('preset').innerHTML = options(presets,p=>p.name,false);
for (const slot of Object.keys(slots)) $('slot-'+slot).addEventListener('change',e=>update(()=>{state.gear[slot]=e.target.value;}));
for (let i=0;i<5;i++) $('card-'+i).addEventListener('change',e=>update(()=>{state.visages[i]=e.target.value;}));
$('buddy').addEventListener('change',e=>update(()=>{state.buddy=e.target.value;}));
$('budget').addEventListener('change',e=>update(()=>{state.budget=integer(e.target.value,99,12);}));
$('visage-recommend').addEventListener('change', renderVisageSuggestions);
$('preset').addEventListener('change',e=>update(()=>{state.preset=e.target.value;}));
$('missing-only').addEventListener('change',e=>update(()=>{state.missingOnly=e.target.checked;}));
$('hunt').addEventListener('change',e=>{
  if(!e.target.matches('input[data-material]')) return;
  const name=e.target.dataset.material;
  const quantity=integer(e.target.value,99999);
  update(()=>{state.inventory[name]=quantity;});
  Array.from($('hunt').querySelectorAll('input')).find(x=>x.dataset.material===name)?.focus();
});
$('apply').addEventListener('click',()=>update(()=>{
  const p = presets.find(p=>p.id===state.preset);
  state.gear=clone(p.gear); state.visages=Array.from({length:5},(_,i)=>p.visages[i]||''); state.buddy=p.buddy;
},'โหลดบิลด์แล้ว'));
$('clear').addEventListener('click',()=>update(()=>{
  state.gear={}; state.visages=Array(5).fill(''); state.buddy='';
},'ล้างชุดแล้ว'));

function renderVisageDetails(result) {
  $('visage-details').innerHTML = result.cards.map((card,index) => {
    if (!card) return '';
    const core = card.core || 'ยังไม่มีข้อมูล Core ที่ตรวจยืนยันได้';
    return '<div class="effect"><strong>'+abilityButton('visage',card.id,card.name)+' · Cost '+card.cost+'</strong> · '+(index===0?'Core':'ช่อง '+(index+1))+
      '<br>เซ็ต: '+esc(card.sets.join(' / '))+'<br>Core effect'+(index===0?' (ช่องนี้ทำงานเมื่อเข้าเงื่อนไข)':' (ทำงานเมื่อใส่ช่อง Core)')+
      ': '+esc(core)+'<br>'+link(card.url,'รายละเอียดการ์ด')+'</div>';
  }).join('');
}

function renderVisageSuggestions() {
  const recommendations = {
    fire: {cards:['rathian','radiant-rathalos','ruger-aidal','kestodon','noios'],text:'อาวุธไฟ · Ink of Flames 5 ใบ Core Rathian เพิ่มไฟเมื่อใช้อาวุธไฟ Ruger Aidal มีเงื่อนไข Season 0 เฉพาะ Core'},
    water: {cards:['radiant-barroth','tzitzi-ya-ku','radiant-jyuratodus','apceros','gajau'],text:'อาวุธน้ำ · Ink of Water 5 ใบ Core Radiant Barroth ต้องชาร์จถึงระดับสูงสุด'},
    thunder: {cards:['radiant-tobi-kadachi','radiant-tzitzi-ya-ku','radiant-great-girros','vespoid','mernos'],text:'อาวุธสายฟ้า · Ink of Thunder 5 ใบ Core Radiant Tobi-Kadachi เพิ่มดาเมจสายฟ้าขณะทำ piercing'}
  };
  const suggestion = recommendations[$('visage-recommend').value];
  const target = $('visage-suggestion');
  if (!suggestion) { target.innerHTML=''; return; }
  const total=suggestion.cards.reduce((sum,id)=>sum+(visages.find(card=>card.id===id)?.cost||0),0);
  target.innerHTML='<div class="effect">'+esc(suggestion.text)+'<br>'+suggestion.cards.map(id=>abilityButton('visage',id,visages.find(card=>card.id===id)?.name||id)).join(' / ')+
    '<br>Cost '+total+' / '+state.budget+' · ตัวอย่างสำหรับลอง ไม่ทราบว่าคุณมีการ์ดใด'+
    (total>state.budget?'<br>Cost เกินเพดานที่ตั้งไว้':'')+'<br><button type="button" '+(total>state.budget?'disabled':'')+'>ใส่ชุดแนะนำ</button></div>';
  target.querySelector('button:not(.ability-name)').addEventListener('click',()=>update(()=>{state.visages=[...suggestion.cards];},'ใส่ Visage แนะนำแล้ว'));
}

function render() {
  const current = calculate(state,catalog);
  const preset = presets.find(p=>p.id===state.preset);
  const reference = calculate(preset,catalog);
  renderGearOptions();
  for (const slot of Object.keys(slots)) {
    $('slot-'+slot).value=state.gear[slot]||'';
    const g=current.selected.find(g=>g.slot===slot);
    $('source-'+slot).innerHTML=g ? [abilityButton('gear',g.id,g.name),g.type,g.element,g.attack!==undefined?'ATK '+g.attack:'',g.defense!==undefined?'DEF '+g.defense:'',
      g.materialsUnknown?'ยังไม่มีสูตรวัสดุ':g.step,link(g.url,'ที่มา')].filter(Boolean).join(' · '):'';
  }
  for(let i=0;i<5;i++) {
    const field=$('card-'+i);
    field.value=state.visages[i]||'';
    for(const option of field.options) option.disabled=Boolean(option.value && state.visages.some((v,j)=>i!==j && v===option.value));
  }
  $('budget').value=state.budget;
  renderVisageSuggestions();
  $('cost').textContent=current.cost+' / '+state.budget+' Cost';
  $('cost').classList.toggle('bad',!current.valid);
  $('card-note').textContent=current.valid?'Core effect ทำงานเฉพาะการ์ดช่อง Core · เอฟเฟกต์สุ่มขึ้นกับการ์ดที่มี':current.cost>state.budget?'Cost เกิน: ถอดหรือเปลี่ยนการ์ดก่อนใช้ชุดนี้':'มีการ์ดชื่อซ้ำ';
  renderVisageDetails(current);
  $('buddy').value=state.buddy;
  $('preset').value=state.preset;
  $('missing-only').checked=state.missingOnly;
  const buddy=buddies.find(b=>b.id===state.buddy);
  $('buddy-note').innerHTML=buddy?link(buddy.url,'ดูข้อมูล Buddy'):'';
  $('preset-source').innerHTML=link(preset.url,preset.label)+(preset.original?' · '+link(preset.original,'Game8 ต้นทาง'):'')+'<br>'+esc(preset.note);
  const skills=Object.keys(current.levels).sort((a,b)=>current.levels[b]-current.levels[a]||a.localeCompare(b));
  $('skill-count').textContent=skills.length+' สกิล';
  const opened=new Set(Array.from($('skills').querySelectorAll('details[open]')).map(x=>x.dataset.skill));
  $('skills').innerHTML=skills.map(s=>{
    const cap=skillCaps[s], lv=current.levels[s], total=current.totals[s];
    return '<details class="skill" data-skill="'+esc(s)+'"'+(opened.has(s)?' open':'')+'><summary><span>'+esc(s)+
      '</span><strong>Lv '+lv+(cap?' / '+cap:'')+'</strong></summary>'+
      (cap?'<meter aria-label="'+esc(s)+'" max="'+cap+'" value="'+lv+'"></meter>':'')+
      '<ul>'+current.origins[s].map(i=>'<li>'+esc(i.name)+' +'+i.value+'</li>').join('')+'</ul>'+
      (lv<total?'<p class="muted">แต้มดิบ '+total+'</p>':'')+
      (skillNotes[s]?'<p class="muted">'+esc(skillNotes[s])+'</p>':'')+
      abilityButton('skill',s,'รายละเอียด '+s,lv)+'</details>';
  }).join('')||empty('เลือกอาวุธหรือเกราะเพื่อเริ่ม');
  $('sets').innerHTML=Object.entries(current.sets).map(([s,count])=>{
    const rule=armorSets[s];
    if (!rule) return effect(esc(s)+' · ยังไม่มีข้อมูลโบนัสเซ็ต');
    return effect(esc(rule.label)+' · '+count+'/'+rule.threshold+' ชิ้น · '+(count>=rule.threshold?'ทำงาน':'ยังไม่ถึงเงื่อนไข'));
  }).join('')||empty('ยังไม่มีเกราะในเซ็ต');
  const core=current.cards[0];
  $('effects').innerHTML=!current.valid ? empty('ปรับ Visage ให้ผ่านเงื่อนไขก่อน') :
    Object.keys(current.visageSets).length ? Object.entries(current.visageSets).map(([name,count]) => {
      const set = visageSetEffects[name];
      const first = name === "Kushala Daora's Tempest" ? 1 : 2;
      const second = name === "Kushala Daora's Tempest" ? 2 : 4;
      return effect(esc(name)+' · '+count+' ชิ้น<br>'+first+' ชิ้น: '+(count>=first?esc(set?.[0]||'ดูแหล่งข้อมูล'):'ยังไม่เปิด')+
        '<br>'+second+' ชิ้น: '+(count>=second?esc(set?.[1]||'ดูแหล่งข้อมูล'):'ยังไม่เปิด'));
    }).join('') + (core ? effect('Core: '+esc(core.name)+'<br>'+esc(current.core||'ยังไม่ได้ยืนยัน ดูข้อมูลการ์ด')):'') : empty('ยังไม่ได้เลือกการ์ด');
  $('buddy-effects').innerHTML=buddy?effect(abilityButton('buddy',buddy.id,buddy.name)+' · '+esc(buddy.effect)):empty('ยังไม่ได้เลือก Buddy');
  const keys=Array.from(new Set([...skills,...Object.keys(reference.levels)])).sort((a,b)=>(reference.levels[b]??0)-(reference.levels[a]??0)||a.localeCompare(b));
  const changes=Object.keys(slots).flatMap(s=>{
    const next=reference.selected.find(g=>g.slot===s);
    return next && state.gear[s]!==next.id?['<li>'+slots[s]+': '+esc(next.name)+' · R'+next.rank+'</li>']:[];
  });
  $('compare').innerHTML='<table><caption>เลเวลสกิลเกราะและอาวุธ</caption><thead><tr><th scope="col">สกิล</th><th scope="col">ของคุณ</th><th scope="col">อ้างอิง</th><th scope="col">ต่าง</th></tr></thead><tbody>'+
    keys.map(s=>{
      const left=current.levels[s]||0, right=reference.levels[s]||0, delta=left-right;
      return '<tr><td>'+esc(s)+'</td><td>'+left+'</td><td>'+right+'</td><td class="'+(delta>0?'positive':delta<0?'negative':'')+'">'+(delta>0?'+':'')+delta+'</td></tr>';
    }).join('')+'</tbody></table>'+
    (changes.length?'<details class="skill"><summary><span>ชิ้นที่ต้องเปลี่ยน</span></summary><ul>'+changes.join('')+'</ul></details>':'<p class="muted" style="margin-top:8px">อาวุธและเกราะตรงกับบิลด์อ้างอิง</p>');
  renderHunt(current);
}
function renderHunt(result) {
  const groups=planHunt(result.materials,state.inventory,monsters,huntDrops);
  const count=groups.reduce((a,g)=>a+g.rows.filter(r=>r.missing>0).length,0);
  $('hunt-count').textContent=count+' รายการที่ขาด';
  const withoutRecipe=result.selected.filter(item=>item.materialsUnknown);
  const gap=withoutRecipe.length?effect('ยังไม่มีสูตรในคลัง '+withoutRecipe.length+' ชิ้น รายการด้านล่างจึงอาจไม่ครบ'):'';
  $('hunt').innerHTML=gap+(groups.map(({name,rows,missing})=>{
    const monster=monsters[name] || rows[0]?.source;
    const visible=rows.filter(r=>!state.missingOnly||r.missing>0);
    if(!visible.length) return '';
    return '<section class="hunt-group"><h3>'+esc(name)+(monster?link(monster.url,'ดูดรอป'):'')+'</h3>'+
      (monster?'<p class="muted">'+(monster.weak?'แพ้ธาตุ '+esc(monster.weak)+' · ':'')+'ขาด '+missing+' ชิ้น</p>':
        name==='Hunter’s Jade'?'<p class="muted">Jade IV: Free Hunts ระดับ IV, Research Points Shop หรือ Field Hunts · Jade ชนิดอื่นดูรางวัล Free Hunt และร้านตามระดับ '+link(GW+'items/hunters-jade-4','Jade IV')+'</p>':
        empty('ยังไม่พบรายการดรอปที่ยืนยันได้ · ตรวจแหล่งที่ลิงก์สูตรอุปกรณ์'))+
      '<table><thead><tr><th scope="col">วัตถุดิบ</th><th scope="col">ใช้</th><th scope="col">มี</th><th scope="col">ขาด</th></tr></thead><tbody>'+
      visible.map(r=>'<tr><td>'+esc(r.name)+(r.locations?'<small>'+r.locations.map(loc=>esc(loc.rank)+(loc.part?' · ทำลาย '+esc(loc.part):'')).join(' / ')+'</small>':r.rank?'<small>แรงก์ '+r.rank+(r.part?' · '+r.part:'')+'</small>':'')+
        '</td><td>'+r.required+'</td><td><input aria-label="จำนวน '+esc(r.name)+' ที่มี" data-material="'+esc(r.name)+
        '" type="number" min="0" max="99999" value="'+r.owned+'"></td><td class="'+(r.missing?'negative':'positive')+'">'+r.missing+'</td></tr>').join('')+
      '</tbody></table></section>';
  }).join('')||empty(groups.length?'ของที่มีข้อมูลสูตรครบตามยอดแล้ว':withoutRecipe.length?'ยังไม่มีสูตรสำหรับชิ้นที่เลือก':'เลือกอุปกรณ์เพื่อเริ่มแผนล่า'));
}
render();
