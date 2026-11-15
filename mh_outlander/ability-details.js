'use strict';

// Thai summaries of the mechanics in GameWith's skill index.
Object.assign(skillNotes, {
  Adversity:'เพิ่มดาเมจและ DEF ชั่วคราวหลังล้ม ได้สูงสุด 2 ครั้ง',
  Airborne:'เพิ่มดาเมจโจมตีกลางอากาศ',
  'Ammo Enhancement':'เพิ่มดาเมจกระสุนปกติ กระจาย และเจาะของ Bowgun',
  Ballistics:'ลูกธนูและกระสุนทำดาเมจเต็มได้จากระยะใกล้ขึ้น',
  'Battle Spirit':'เพิ่มโอกาสคริติคอลเมื่อมอนสเตอร์ใหญ่โกรธ',
  'Bento Lover':'เพิ่มดาเมจชั่วคราวหลังกินอาหารระหว่างต่อสู้',
  'Blast Resistance':'ลดผลของสถานะ Blastblight',
  'Bleeding Resistance':'ลดผลของเลือดออก',
  Blessing:'มีโอกาสลดดาเมจที่ได้รับ',
  'Botanical Expert':'เก็บสมุนไพรและของใช้ได้มากขึ้น',
  Breaker:'ทำลายหรือตัดชิ้นส่วนมอนสเตอร์ใหญ่ได้ง่ายขึ้น',
  'Buddy Boost':'เพิ่มดาเมจของ Buddy',
  'Capacity Boost':'เพิ่มดาเมจชั่วคราวหลังรีโหลดกระสุน',
  'Capturing Expert':'มีโอกาสสูงที่จะได้รางวัลจับเพิ่ม',
  'Carve Master':'ชำแหละเพิ่ม 1 ครั้งเมื่อไม่ได้เข้าภารกิจกลางคัน',
  'Combo Enhancement':'โจมตีต่อเนื่องเพื่อเพิ่มดาเมจชั่วคราว โดย Pierce และ Rupture ไม่เปิดบัฟ',
  'Counter Boost':'เพิ่มดาเมจชั่วคราวหลัง Perfect Evade หรือ Parry',
  'Critical Element':'เพิ่มดาเมจธาตุเมื่อโจมตีติดคริติคอล',
  'Defense Up':'เพิ่มพลังป้องกัน',
  'Demonic Strength':'เพิ่มดาเมจขณะอยู่ใน Demon Mode',
  Deterrence:'ลดโอกาสที่มอนสเตอร์เล็กจะเข้ามาโจมตี',
  Fearless:'เพิ่มดาเมจเมื่อมีแถบเลือดสีเทาที่ฟื้นได้',
  'Flash Draw':'เพิ่มดาเมจชั่วคราวหลังโจมตีด้วยท่าชักอาวุธ',
  'Flinching-Free':'ลดอาการชะงักจากดาเมจเล็กน้อย',
  'Gathering Master':'เก็บของเร็วขึ้นและไม่ชะงักระหว่างเก็บ',
  'Geo Expert':'เก็บซ้ำจากจุดเก็บทรัพยากรได้มากขึ้น',
  'Grace Under Pressure':'เพิ่ม DEF ระหว่างที่มอนสเตอร์อยู่ใน Radiant Rage',
  'Guard Technique':'ลดเวลาชะงักและ Stamina ที่ใช้เมื่อป้องกัน',
  'Health Boost':'เพิ่มพลังชีวิตสูงสุด',
  'Health Cycle':'โจมตีส่วนที่แตกของมอนสเตอร์ใหญ่เพื่อฟื้นเลือดตามดาเมจ',
  'Health Recovery':'ฟื้นแถบเลือดสีเทาเร็วขึ้น',
  'Honey Harvester':'เก็บน้ำผึ้งได้มากขึ้น',
  'Hunting Instinct':'เพิ่มดาเมจชั่วคราวเมื่อใช้อุปกรณ์หรือสิ่งมีชีวิตในฉาก',
  'Immovable Stance':'เพิ่มดาเมจชั่วคราวหลังทำ Ferocity',
  Improviser:'ฟื้นเลือดเพิ่มจากสิ่งที่กดใช้ได้ในฉาก เช่น Sporepuff',
  Insight:'เพิ่มโอกาสคริติคอล',
  Instinct:'ป้องกันการโจมตีเด้ง',
  Intimidation:'สะสมค่าทำให้มึนด้วยอาวุธทุบเพื่อเพิ่มดาเมจชั่วคราว',
  'Iron Skin':'ลดผลของสถานะพลังป้องกันลดลง',
  'Item Master':'ยืดเวลาเอฟเฟกต์ของไอเทมบางชนิด',
  'Master Climber':'ลด Stamina ที่ใช้หลบขณะเกาะผนังหรือเถาวัลย์',
  'Morph Boost':'เพิ่มดาเมจชั่วคราวขณะเปลี่ยนรูปอาวุธ',
  'Offensive Defense':'เพิ่มดาเมจชั่วคราวหลัง Perfect Guard',
  'Paralysis Resistance':'ลดระยะเวลาอัมพาต',
  Pierce:'โจมตีส่วนเดิมต่อเนื่องด้วย Lance เพื่อเพิ่มดาเมจชั่วคราว',
  'Piercing Strike':'เพิ่มดาเมจเมื่อการโจมตี Pierce ครั้งเดียวโดนอย่างน้อย 3 ฮิต',
  'Poison Resistance':'ลดดาเมจจากพิษ',
  'Quick-Bite':'กินเนื้อและใช้ยาได้เร็วขึ้น',
  'Radiant Sense':'เพิ่มดาเมจใส่มอนสเตอร์ที่อยู่ใน Radiant Rage',
  'Recovery Booster':'เพิ่มปริมาณเลือดที่ฟื้นจากไอเทมหรือของในฉาก',
  Rejuvenation:'ฟื้นเลือดต่อเนื่องจนถึงระดับที่สกิลกำหนด',
  'Relentless Pursuit':'เพิ่มดาเมจชั่วคราวหลังมอนสเตอร์ชะงักหรือถูก Suppress',
  'Roar Resistance':'ลดผลจากเสียงคำราม',
  'Sleep Resistance':'ลดระยะเวลาหลับ',
  'Specimen Expert':'ลดโอกาสที่ซากแมลงเล็กจะแตกจนชำแหละไม่ได้',
  'Spirit Bind Blade':'เพิ่มดาเมจชั่วคราวเมื่อ Spirit Gauge ขึ้นระดับ',
  'Stamina Conversion':'เพิ่มดาเมจของสกิลโจมตีที่ใช้ Stamina',
  'Stun Resistance':'ลดระยะเวลามึน',
  'Suppression Recovery':'ฟื้นเลือดเมื่อโจมตีมอนสเตอร์ที่ถูก Suppress',
  'Thrifty Meal':'มีโอกาสใช้ของกินหรือเครื่องดื่มโดยไม่เสียไอเทม',
  'Tremor Resistance':'ลดผลของแรงสั่นสะเทือนพื้น',
  Unleashed:'เพิ่มโอกาสคริติคอลชั่วคราวเมื่อเข้าเงื่อนไขของสกิล',
  'Weakspot Exploit':'เพิ่มโอกาสคริติคอลเมื่อโจมตีจุดอ่อน',
  Windproof:'ลดผลของแรงลม',
  Wrecker:'เพิ่มดาเมจชั่วคราวหลังใช้ Great Sword ทำให้ชะงักหรือทำลายชิ้นส่วน'
});
for (const [element, thai] of Object.entries({Fire:'ไฟ',Water:'น้ำ',Ice:'น้ำแข็ง',Thunder:'สายฟ้า',Dragon:'มังกร'})) {
  skillNotes[element+' Damage Up'] = 'เพิ่มดาเมจธาตุ'+thai+' · ผลแรงขึ้นเมื่อสู้กับ Radiant';
  skillNotes[element+' Resistance'] = 'เพิ่มความต้านทานธาตุ'+thai;
}

const skillSummary = name => skillNotes[name] || 'ยังไม่มีคำอธิบายที่ยืนยันได้';
function abilityButton(kind, id, label, level = '') {
  return '<button type="button" class="ability-name" data-kind="'+esc(kind)+'" data-id="'+esc(id)+
    '" data-level="'+esc(level)+'">'+esc(label)+'</button>';
}
function setupAbilityDialog() {
  const dialog = $('ability-dialog');
  document.addEventListener('click', event => {
    const button = event.target.closest('button.ability-name');
    if (!button) return;
    const {kind,id,level} = button.dataset;
    let title = id, url = GW+'skills', body = '';
    if (kind === 'skill') {
      const numericEffect = typeof skillEffects[id] === 'function' ? skillEffects[id](Number(level)) : '';
      body = '<p>'+esc(skillSummary(id))+'</p>'+
        (skillCaps[id] ? '<p>Lv สูงสุด '+skillCaps[id]+'</p>' : '')+
        (numericEffect ? '<p>Lv '+esc(level)+' · '+esc(numericEffect)+'</p>' : '');
    } else {
      const item = (kind === 'gear' ? gear : kind === 'visage' ? visages : buddies).find(row=>row.id===id);
      if (!item) return;
      title = item.name;
      url = item.url;
      if (kind === 'gear') {
        const stats = ['R'+item.rank,item.element,item.attack != null && 'ATK '+item.attack,
          item.defense != null && 'DEF '+item.defense].filter(Boolean);
        const skills = Object.entries(item.skills).map(([name,lv]) =>
          '<li><strong>'+esc(name)+' · Lv '+lv+'</strong><br>'+esc(skillSummary(name))+'</li>').join('');
        const bonus = armorSets[item.set];
        body = '<p>'+esc(stats.join(' · '))+'</p>'+
          (skills ? '<ul>'+skills+'</ul>' : '<p>ไม่มีแต้มสกิลบนชิ้นนี้</p>')+
          (bonus ? '<p>'+esc(bonus.label)+' · '+bonus.threshold+' ชิ้น</p>' : '');
      } else if (kind === 'visage') {
        const sets = item.sets.map(name => '<li><strong>'+esc(name)+'</strong><br>'+
          esc((visageSetEffects[name] || []).join(' / ') || 'ยังไม่มีคำอธิบายโบนัสเซ็ต')+'</li>').join('');
        body = '<p>Cost '+item.cost+' · ช่อง Core: '+esc(item.core || 'ยังไม่มีข้อมูลยืนยัน')+'</p><ul>'+sets+'</ul>';
      } else {
        body = '<p>'+esc(item.effect)+'</p>';
      }
    }
    $('ability-title').textContent = title;
    $('ability-content').innerHTML = body+(url ? link(url,'แหล่งข้อมูล') : '');
    dialog.showModal();
  });
}
document.addEventListener('DOMContentLoaded', setupAbilityDialog);
