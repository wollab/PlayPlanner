function calculate(build, catalog) {
  const {gear, armorSets, skillCaps, visages} = catalog;
  const selected = Object.entries(build.gear).flatMap(([slot,id])=>gear.filter(g=>g.id===id && g.slot===slot));
  const totals = {}, origins = {}, sets = {}, materials = {};
  const add = (skills, name) => {
    for (const [key,value] of Object.entries(skills)) {
      totals[key]=(totals[key]||0)+value;
      (origins[key] ??= []).push({name,value});
    }
  };
  for (const item of selected) {
    add(item.skills,item.name);
    if(item.set) sets[item.set]=(sets[item.set]||0)+1;
    for(const [name,qty] of item.materials) materials[name]=(materials[name]||0)+qty;
  }
  for (const [set,count] of Object.entries(sets)) {
    const rule = armorSets[set];
    if (rule && count>=rule.threshold) add(rule.skills,rule.label);
  }
  const levels = Object.fromEntries(Object.entries(totals).map(([key,total])=>[key,Math.min(total,skillCaps[key] ?? total)]));
  const cards = build.visages.map(id=>visages.find(v=>v.id===id));
  const equipped = cards.filter(Boolean);
  const cost = equipped.reduce((sum,v)=>sum+v.cost,0);
  const valid = cost<=(build.budget ?? 12) && new Set(equipped.map(v=>v.id)).size===equipped.length;
  const visageSets = {};
  for (const card of equipped) for (const name of card.sets ?? []) visageSets[name] = (visageSets[name] ?? 0) + 1;
  return {selected,totals,levels,origins,sets,materials,cards,cost,valid,visageSets,core:cards[0]?.core||''};
}

function planHunt(materials, inventory, monsters, drops = {}) {
  const groups = new Map();
  for (const [name, required] of Object.entries(materials)) {
    const owned = Math.max(0,Math.trunc(Number(inventory[name]) || 0));
    const exact = drops[name]?.[0];
    if (exact) {
      const group = exact.name;
      const rows = groups.get(group) || [];
      rows.push({name,required,owned,missing:Math.max(0,required-owned),locations:exact.locations,source:exact});
      groups.set(group, rows);
      continue;
    }
    const source = Object.keys(monsters).find(key=>name.startsWith(key+' '));
    const suffix = source ? name.slice(source.length+1) : '';
    const [part, tier] = suffix.split(' ');
    const info = source && monsters[source];
    const verified = info && !info.unverified?.includes(suffix);
    const group = verified ? source : name.startsWith("Hunter's Jade") ? 'Hunter’s Jade' : 'แหล่งที่ยังไม่มีข้อมูล';
    const rows = groups.get(group)||[];
    rows.push({name,required,owned,missing:Math.max(0,required-owned),
      rank:verified ? info.ranks[tier] : '', part:verified ? info.parts[part] : ''});
    groups.set(group,rows);
  }
  return [...groups].map(([name,rows])=>({name,rows,missing:rows.reduce((sum,row)=>sum+row.missing,0)}))
    .sort((a,b)=>Number(Boolean(monsters[b.name]))-Number(Boolean(monsters[a.name])) || b.missing-a.missing);
}
if (typeof module !== 'undefined') module.exports = {calculate,planHunt};
