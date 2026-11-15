'use strict';

const searchableSkills = [...new Set([
  ...gear.filter(item => item.slot !== 'weapon').flatMap(item => Object.keys(item.skills)),
  ...Object.values(armorSets).flatMap(rule => Object.keys(rule.skills))
])].sort((a, b) => a.localeCompare(b));
const skillOptionText = searchableSkills.map(name =>
  '<option value="' + esc(name) + '">' + esc(name+' · '+skillSummary(name)) + '</option>').join('');
const goalCount = 3;

$('armor-coverage').innerHTML = 'เกราะ ' + armorLibrary.pieces + ' ชิ้น · ' +
  importedArmor.length.toLocaleString('en-US') + ' รายการแยกตาม Rarity<br><small>คลังเกราะจาก GameWith</small>';
$('skill-goals').innerHTML = Array.from({length: goalCount}, (_, index) =>
  '<div class="goal-row"><label>สกิลที่ ' + (index + 1) + '<select id="goal-' + index +
  '"><option value="">เลือกสกิล</option>' + skillOptionText + '</select></label><label>Lv ขั้นต่ำ<select id="goal-lv-' +
  index + '" aria-label="เลเวลขั้นต่ำสกิลที่ ' + (index + 1) + '" disabled></select></label><div class="goal-description" id="goal-note-'+index+'"></div></div>').join('');

const availableRanks = [...new Set(importedArmor.map(item => item.rank))].sort((a, b) => a - b);
$('rank-limit').innerHTML = availableRanks.map(rank => '<option value="' + rank + '">R' + rank + '</option>').join('');
$('rank-limit').value = availableRanks.at(-1);

$('skill-filter').addEventListener('input', event => {
  const query = event.target.value.trim().toLowerCase();
  for (let index = 0; index < goalCount; index++) {
    const field = $('goal-' + index);
    const selected = field.value;
    field.innerHTML = '<option value="">เลือกสกิล</option>' + searchableSkills
      .filter(name => name === selected || (name+' '+skillSummary(name)).toLowerCase().includes(query))
      .map(name => '<option value="' + esc(name) + '">' + esc(name+' · '+skillSummary(name)) + '</option>').join('');
    field.value = selected;
  }
});

function updateGoalLevel(index, desired) {
  const name = $('goal-' + index).value;
  const field = $('goal-lv-' + index);
  const cap = skillCaps[name] ?? 1;
  field.disabled = !name;
  field.innerHTML = name ? Array.from({length: cap}, (_, i) =>
    '<option value="' + (i + 1) + '">Lv ' + (i + 1) + '</option>').join('') : '<option>—</option>';
  if (name) field.value = Math.min(cap, desired ?? cap);
  $('goal-note-'+index).innerHTML = name ? abilityButton('skill',name,name,field.value)+' · '+esc(skillSummary(name)) : '';
}

function showSearchMessage(message) {
  $('search-result').innerHTML = '<p class="muted" role="status">' + esc(message) + '</p>';
}

for (let index = 0; index < goalCount; index++) {
  $('goal-' + index).addEventListener('change', () => {
    updateGoalLevel(index);
    showSearchMessage('กดค้นหาเพื่อจัดชุดตามสกิลที่เลือก');
  });
  $('goal-lv-' + index).addEventListener('change', () => { updateGoalLevel(index, Number($('goal-lv-'+index).value)); showSearchMessage('กดค้นหาเพื่อใช้เลเวลใหม่'); });
}
$('rank-limit').addEventListener('change', () => showSearchMessage('กดค้นหาเพื่อใช้เพดาน Rarity ใหม่'));
$('prefer-exact').addEventListener('change', () => showSearchMessage('กดค้นหาเพื่อใช้เงื่อนไขใหม่'));

const skillEffects = {
  'Bow Skill Boost': level => level ? 'ดาเมจท่าธนู +' + [0,4,8,13,20][level] + '%' + (level===4?' และพลังโจมตีธาตุ +25':'') : '',
  'Charge Enhancement': level => level ? 'เมื่อเปิดบัฟ ดาเมจ +' + [0,4,8,12,16,20,24,31][level] + '% นาน 15 วิ' +
    (level===7?' และพลังโจมตีธาตุ +50':'') : '',
  'Charge Up': level => level ? 'ดาเมจ +' + [0,4,8,12,16,20,24,31][level] + '% เมื่อ Stamina เต็ม 5 วิ' +
    (level===7?' และพลังโจมตีธาตุ +50':'') : ''
};

function searchForArmor() {
  const goals = Array.from({length: goalCount}, (_, i) => ({
    name: $('goal-' + i).value,
    level: Number($('goal-lv-' + i).value)
  })).filter(goal => goal.name);
  if (!goals.length) return showSearchMessage('เลือกสกิลอย่างน้อยหนึ่งอย่างก่อนค้นหา');
  if (new Set(goals.map(goal => goal.name)).size !== goals.length) {
    return showSearchMessage('เลือกแต่ละสกิลเพียงครั้งเดียว แล้วกำหนด Lv ที่ต้องการในแถวเดียว');
  }
  const result = findArmor(gear, armorSets, goals, Number($('rank-limit').value), {
    preferExact: $('prefer-exact').checked, caps: skillCaps
  });
  if (!result) return showSearchMessage('คลังยังมีเกราะไม่ครบ 5 ส่วนสำหรับเพดาน Rarity นี้');

  const build = calculate({gear:result.gear,visages:[]}, catalog);
  const met = result.ranking[0];
  const summary = met === goals.length ? 'ถึงเป้าครบทุกสกิล' : 'ชุดที่ใกล้ที่สุด · ถึงเป้า ' + met + '/' + goals.length + ' สกิล';
  const levels = goals.map(({name, level}) => {
    const actual = build.levels[name] ?? 0;
    const value = skillEffects[name]?.(actual);
    const missing = actual < level ? ' · ขาด ' + (level - actual) + ' Lv' : '';
    const excess = actual > level ? ' · เกิน ' + (actual - level) + ' Lv' : '';
    const detail = [value, skillNotes[name]].filter(Boolean).join(' · ');
    return '<li>' + abilityButton('skill',name,name,actual) + ' <span class="' + (missing?'negative':'positive') +
      '">Lv ' + actual + ' / ' + level + esc(missing || excess) + '</span>' +
      (detail ? '<small>' + esc(detail) + '</small>' : '') + '</li>';
  }).join('');
  const items = build.selected.map(item => '<li>' + slots[item.slot] + ' · ' + abilityButton('gear',item.id,item.name) + ' · R' + item.rank + '</li>').join('');
  const allSkills = Object.entries(build.levels).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))
    .map(([name,level])=>'<li>'+abilityButton('skill',name,name,level)+' · Lv '+level+'</li>').join('');
  $('search-result').innerHTML = '<p class="search-summary" role="status"><strong>' + summary + '</strong> · DEF ' +
    result.defense + '</p><ul class="search-skills">' + levels + '</ul><ul class="search-items">' +
    items + '</ul><details class="result-skills"><summary>ดูสกิลทั้งหมดในชุด</summary><ul>' + allSkills +
    '</ul></details><button type="button" id="apply-found">ใส่เกราะชุดนี้</button><p class="muted">ผลหลักเลือกตามสกิลที่กำหนดและ DEF ยังไม่ได้เรียงตามดาเมจ</p>';
  $('apply-found').addEventListener('click', () => {
    $('armor-filter').value = '';
    update(() => Object.assign(state.gear, result.gear), 'ใส่เกราะที่ค้นหาแล้ว');
    $('apply-found').textContent = 'ใส่เกราะแล้ว';
    if (!$('view-found-appearance')) {
      $('apply-found').insertAdjacentHTML('afterend',' <a id="view-found-appearance" href="#build-library">ดูภาพ / บันทึกบิลด์</a>');
    }
  });
  const alternatives = [];
  for (const slot of ['head','chest','arms','waist','legs']) {
    const candidate = findArmor(gear.filter(item => item.id !== result.gear[slot]), armorSets, goals,
      Number($('rank-limit').value), {preferExact: $('prefer-exact').checked, caps: skillCaps});
    if (candidate && candidate.ranking[0] === goals.length &&
        !alternatives.some(other => JSON.stringify(other.gear) === JSON.stringify(candidate.gear))) {
      alternatives.push(candidate);
    }
  }
  if (alternatives.length) {
    const list = document.createElement('div');
    list.innerHTML = '<details><summary>ชุดทางเลือกที่ถึงเป้า (' + alternatives.length +
      ' ชุด)</summary><p class="muted">ตัวอย่างชุดที่เปลี่ยนเกราะทีละส่วน เรียงตาม DEF · ยังไม่มีสูตร DPS รวมที่ยืนยันได้</p><div id="alternative-builds"></div></details>';
    $('search-result').append(list);
    const container = list.querySelector('#alternative-builds');
    alternatives.sort((a,b) => b.defense-a.defense).forEach((alternative, index) => {
      const calculated = calculate({gear:alternative.gear,visages:[]},catalog);
      const card = document.createElement('div');
      card.className = 'effect';
      card.innerHTML = '<strong>ชุดทางเลือก ' + (index+1) + ' · DEF ' + alternative.defense + '</strong><br>' +
        calculated.selected.map(item => abilityButton('gear',item.id,item.name) + ' · R' + item.rank).join(' / ') +
        '<details><summary>ดูสกิลทั้งหมด</summary><ul>' + Object.entries(calculated.levels)
          .sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))
          .map(([name,level])=>'<li>'+abilityButton('skill',name,name,level)+' · Lv '+level+'</li>').join('') +
        '</ul></details><button type="button">ใส่เกราะชุดนี้</button>';
      card.querySelector('button:last-child:not(.ability-name)').addEventListener('click', () => {
        $('armor-filter').value = '';
        update(() => Object.assign(state.gear, alternative.gear), 'ใส่ชุดทางเลือกแล้ว');
      });
      container.append(card);
    });
  }
}

$('skill-search').addEventListener('submit', event => {
  event.preventDefault();
  searchForArmor();
});
$('bow-example').addEventListener('click', () => {
  $('skill-filter').value = '';
  $('skill-filter').dispatchEvent(new Event('input'));
  $('goal-0').value = 'Bow Skill Boost';
  $('goal-1').value = 'Charged Power Shot';
  $('goal-2').value = '';
  updateGoalLevel(0, 4);
  updateGoalLevel(1, 7);
  updateGoalLevel(2);
  searchForArmor();
});
