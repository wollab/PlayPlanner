'use strict';

const libraryKey = 'hunter-forge-saved-builds-v1';
const currentBuildId = 'current';
const artwork = typeof armorArt === 'undefined' ? {} : armorArt;
const gearById = new Map(gear.map(item => [item.id, item]));
let library = readBuildLibrary();

function readBuildLibrary() {
  try {
    const saved = JSON.parse(localStorage.getItem(libraryKey));
    const builds = Array.isArray(saved?.builds) ? saved.builds.filter(build =>
      /^build-[a-z0-9-]+$/.test(build?.id) && typeof build.name === 'string' &&
      build.gear && Array.isArray(build.visages)) : [];
    const valid = id => id === currentBuildId || builds.some(build => build.id === id);
    return {
      builds,
      a: valid(saved?.a) ? saved.a : currentBuildId,
      b: valid(saved?.b) ? saved.b : (builds[0]?.id ?? currentBuildId)
    };
  } catch {
    return {builds: [], a: currentBuildId, b: currentBuildId};
  }
}

function writeBuildLibrary(next) {
  try {
    localStorage.setItem(libraryKey, JSON.stringify(next));
    library = next;
    return true;
  } catch {
    $('save-feedback').textContent = 'เบราว์เซอร์บันทึกบิลด์ไม่ได้ ลองอนุญาตให้เก็บข้อมูลในเครื่อง';
    return false;
  }
}

function appearanceMarkup(build) {
  const sets = new Map();
  for (const [slot, id] of Object.entries(build.gear)) {
    const item = gearById.get(id);
    if (!item?.set || item.slot !== slot) continue;
    if (!sets.has(item.set)) sets.set(item.set, []);
    sets.get(item.set).push(item);
  }
  if (!sets.size) return empty('เลือกเกราะเพื่อดูภาพเซ็ต');

  const variant = $('art-variant').value;
  const variantLabel = variant === 'male' ? 'ชาย' : 'หญิง';
  const representation = [...sets].map(([name, pieces]) => {
    const source = pieces[0].url;
    const slug = source.split('/').at(-1);
    const url = artwork[slug]?.[variant];
    const picture = url ? '<a class="armor-art-link" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" ' +
      'aria-label="เปิดภาพเซ็ต ' + esc(name) + ' ขนาดเต็ม"><img class="armor-art-image" src="' + esc(url) +
      '" alt="' + esc(name + ' · แบบตัวละคร' + variantLabel) + '" loading="lazy" referrerpolicy="no-referrer"></a>' : '';
    const labels = pieces.map(piece => slots[piece.slot]).join(' · ');
    return '<figure class="armor-art-card">' + picture +
      '<div class="art-unavailable"' + (url ? ' hidden' : '') + '>ดูภาพที่หน้าข้อมูลเซ็ต</div>' +
      '<figcaption><strong>' + esc(name) + '</strong><small>' + esc(labels) +
      '</small>' + link(source, 'GameWith') + '</figcaption></figure>';
  });
  return '<div class="armor-gallery">' + representation.join('') + '</div>';
}

function renderAppearance() {
  $('current-appearance').innerHTML = appearanceMarkup(state);
}

function buildEntry(id) {
  if (id === currentBuildId) return {name: 'ชุดที่กำลังจัด', build: state};
  const saved = library.builds.find(build => build.id === id);
  return saved ? {name: saved.name, build: saved} : {name: 'ชุดที่กำลังจัด', build: state};
}

function renderLibraryControls() {
  const options = [{id:currentBuildId,name:'ชุดที่กำลังจัด'}, ...library.builds]
    .map(build => '<option value="' + esc(build.id) + '">' + esc(build.name) + '</option>').join('');
  for (const side of ['a', 'b']) {
    $('build-' + side).innerHTML = options;
    $('build-' + side).value = library[side];
    $('load-build-' + side).disabled = library[side] === currentBuildId;
  }
}

function renderSavedComparison() {
  if (!library.builds.length) {
    $('saved-comparison').innerHTML = empty('บันทึกชุดแรกเพื่อเทียบกับชุดที่กำลังจัด');
    return;
  }
  const [a, b] = [buildEntry(library.a), buildEntry(library.b)];
  const left = calculate(a.build, catalog);
  const right = calculate(b.build, catalog);
  const sumDefense = result => result.selected.reduce((total, item) => total + (item.defense ?? 0), 0);
  const equipment = (result, slot) => {
    const item = result.selected.find(item => item.slot === slot);
    return item ? item.name + ' · R' + item.rank : '—';
  };
  const cardNames = result => result.cards.map((card, i) => card ? (i === 0 ? 'Core · ' : '') + card.name : '').filter(Boolean).join(', ') || '—';
  const buddyName = entry => buddies.find(buddy => buddy.id === entry.build.buddy)?.name ?? '—';
  const difference = number => number ? (number > 0 ? '+' : '') + number : '0';
  const row = (name, first, second, delta = '—') =>
    '<tr><th scope="row">' + esc(name) + '</th><td>' + esc(first) + '</td><td>' + esc(second) +
    '</td><td>' + esc(delta) + '</td></tr>';

  const defense = [sumDefense(left), sumDefense(right)];
  const equipmentRows = [
    row('DEF จากเกราะ', ...defense, difference(defense[0] - defense[1])),
    ...Object.entries(slots).map(([slot, name]) => row(name, equipment(left, slot), equipment(right, slot))),
    row('Buddy', buddyName(a), buddyName(b)),
    row('Visage', cardNames(left), cardNames(right)),
    row('Visage Cost', left.cost + '/' + (a.build.budget ?? 12), right.cost + '/' + (b.build.budget ?? 12))
  ];
  const setNames = [...new Set([...Object.keys(left.sets), ...Object.keys(right.sets)])].sort();
  const setRows = setNames.map(name => {
    const rule = armorSets[name];
    const describe = result => {
      const count = result.sets[name] ?? 0;
      if (!rule) return count + ' ชิ้น · ยังไม่มีข้อมูลโบนัส';
      return count + '/' + rule.threshold + ' ชิ้น · ' + (count >= rule.threshold ? 'ทำงาน' : 'ยังไม่ทำงาน');
    };
    return row(rule?.label ?? name, describe(left), describe(right));
  });
  const skillNames = [...new Set([...Object.keys(left.levels), ...Object.keys(right.levels)])].sort((x,y) => x.localeCompare(y));
  const skillRows = skillNames.map(name => {
    const first = left.levels[name] ?? 0;
    const second = right.levels[name] ?? 0;
    return row(name, first, second, difference(first - second));
  });
  const header = '<thead><tr><th scope="col">รายการ</th><th scope="col">A · ' + esc(a.name) +
    '</th><th scope="col">B · ' + esc(b.name) + '</th><th scope="col">A − B</th></tr></thead>';
  const table = (title, rows) => '<div class="comparison-scroll"><table><caption>' + title + '</caption>' +
    header + '<tbody>' + rows.join('') + '</tbody></table></div>';
  const galleryOpen = $('compare-appearance')?.open;
  $('saved-comparison').innerHTML = '<details id="compare-appearance"' + (galleryOpen ? ' open' : '') +
    '><summary>เทียบภาพเซ็ตของ A และ B</summary><div class="appearance-pair"><div><h3>A · ' + esc(a.name) +
    '</h3>' + appearanceMarkup(a.build) + '</div><div><h3>B · ' + esc(b.name) + '</h3>' +
    appearanceMarkup(b.build) + '</div></div></details>' +
    table('อุปกรณ์และพลังป้องกัน', equipmentRows) +
    (setRows.length ? table('โบนัสเซ็ตเกราะ', setRows) : '') + table('เลเวลสกิล', skillRows);
}

$('export-builds').addEventListener('click', () => {
  if (!library.builds.length) {
    $('save-feedback').textContent = 'ยังไม่มีบิลด์ที่บันทึกไว้';
    return;
  }
  const blob = new Blob([JSON.stringify({format:'hunter-forge-builds',version:1,builds:library.builds}, null, 2)],
    {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'hunter-forge-builds.json';
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $('save-feedback').textContent = 'สร้างไฟล์สำรองแล้ว';
});

$('import-builds').addEventListener('change', async event => {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    $('save-feedback').textContent = 'ไฟล์ใหญ่เกิน 2 MB';
    return;
  }
  try {
    const parsed = JSON.parse(await file.text());
    if (parsed.format !== 'hunter-forge-builds' || parsed.version !== 1 || !Array.isArray(parsed.builds) || parsed.builds.length > 1000) {
      throw new Error('รูปแบบไฟล์ไม่ถูกต้อง');
    }
    const existing = new Set(library.builds.map(build => build.id));
    const additions = [];
    for (const build of parsed.builds) {
      if (!/^build-[a-z0-9-]+$/.test(build?.id) || typeof build.name !== 'string' || !build.name.trim() ||
          build.name.length > 60 || !build.gear || !Array.isArray(build.visages) || build.visages.length > 5 ||
          !Number.isInteger(build.budget) || build.budget < 0 || build.budget > 99) {
        throw new Error('ข้อมูลบิลด์ไม่ครบ');
      }
      for (const [slot, id] of Object.entries(build.gear)) {
        if (!(slot in slots) || (id && gearById.get(id)?.slot !== slot)) throw new Error('ไม่พบอุปกรณ์ในคลัง');
      }
      if (build.visages.some(id => id && !visages.some(card => card.id === id)) ||
          (build.buddy && !buddies.some(buddy => buddy.id === build.buddy))) throw new Error('ไม่พบ Visage หรือ Buddy ในคลัง');
      if (!existing.has(build.id)) {
        existing.add(build.id);
        additions.push({id:build.id,name:build.name,gear:{...build.gear},
          visages:Array.from({length:5},(_,i)=>build.visages[i] || ''),buddy:build.buddy || '',budget:build.budget});
      }
    }
    if (!writeBuildLibrary({...library,builds:[...additions,...library.builds]})) return;
    $('save-feedback').textContent = 'นำเข้า ' + additions.length + ' บิลด์ · ข้ามบิลด์ที่มีอยู่แล้ว ' + (parsed.builds.length-additions.length) + ' บิลด์';
    renderLibraryControls();
    renderSavedComparison();
  } catch (error) {
    $('save-feedback').textContent = 'นำเข้าไม่ได้: ' + (error instanceof SyntaxError ? 'ไฟล์ JSON ไม่ถูกต้อง' : error.message);
  }
});

$('build-library').addEventListener('error', event => {
  if (!event.target.classList?.contains('armor-art-image')) return;
  const picture = event.target.parentElement;
  picture.hidden = true;
  picture.nextElementSibling.hidden = false;
}, true);
$('art-variant').addEventListener('change', () => {
  renderAppearance();
  renderSavedComparison();
});

$('save-build').addEventListener('submit', event => {
  event.preventDefault();
  const name = $('build-name').value.trim();
  if (!name) {
    $('save-feedback').textContent = 'ใส่ชื่อบิลด์ก่อนบันทึก';
    return;
  }
  const id = 'build-' + (globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36) + '-' + Math.random().toString(36).slice(2));
  const build = {id, name, gear: {...state.gear}, visages: [...state.visages], buddy: state.buddy, budget: state.budget};
  if (!writeBuildLibrary({...library, builds: [build, ...library.builds], b: id})) return;
  $('build-name').value = '';
  $('save-feedback').textContent = 'บันทึก “' + name + '” แล้ว เลือกไว้เป็นบิลด์ B';
  renderLibraryControls();
  renderSavedComparison();
});

for (const side of ['a', 'b']) {
  $('build-' + side).addEventListener('change', event => {
    const next = {...library, [side]: event.target.value};
    if (!writeBuildLibrary(next)) library = next;
    renderLibraryControls();
    renderSavedComparison();
  });
  $('load-build-' + side).addEventListener('click', () => {
    const entry = buildEntry(library[side]);
    if (entry.build === state) return;
    update(() => {
      state.gear = Object.fromEntries(Object.keys(slots).map(slot => {
        const item = gearById.get(entry.build.gear[slot]);
        return [slot, item?.slot === slot ? item.id : ''];
      }));
      state.visages = Array.from({length:5}, (_, i) => visages.find(card => card.id === entry.build.visages[i])?.id ?? '');
      state.buddy = buddies.find(buddy => buddy.id === entry.build.buddy)?.id ?? '';
      state.budget = integer(entry.build.budget, 99, 12);
    });
    $('save-feedback').textContent = 'เปิด “' + entry.name + '” ในหน้าจัดชุดแล้ว';
  });
}

document.addEventListener('hunter-forge:build-change', () => {
  renderAppearance();
  if (library.a === currentBuildId || library.b === currentBuildId) renderSavedComparison();
});
renderLibraryControls();
renderAppearance();
renderSavedComparison();
