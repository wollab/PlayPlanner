/* Search one piece per slot, including skill points from activated armor sets. */
function findArmor(gear, setRules, goals, maxRank, {preferExact = false, caps = {}} = {}) {
  const slots = ['head', 'chest', 'arms', 'waist', 'legs'];
  const targets = goals.map(goal => goal.level);
  const skillVector = skills => goals.map(goal => skills[goal.name] ?? 0);
  const bonuses = new Map(Object.entries(setRules)
    .map(([name, rule]) => [name, {need: rule.threshold, points: skillVector(rule.skills)}])
    .filter(([, rule]) => rule.points.some(Boolean)));
  const pools = slots.map(slot => {
    const bestByProfile = new Map();
    for (const item of gear) {
      if (item.slot !== slot || item.rank > maxRank) continue;
      const points = skillVector(item.skills);
      const set = bonuses.has(item.set) ? item.set : '';
      const defense = item.defense ?? 0;
      const profile = JSON.stringify([set, points]);
      const previous = bestByProfile.get(profile);
      if (!previous || previous.defense < defense) bestByProfile.set(profile, {item, points, set, defense});
    }
    return [...bestByProfile.values()].sort((a, b) =>
      b.points.reduce((sum, value) => sum + value, 0) - a.points.reduce((sum, value) => sum + value, 0) || b.defense - a.defense);
  });
  if (!goals.length || pools.some(pool => pool.length === 0)) return null;

  const remaining = slots.map((_, depth) => {
    const rest = pools.slice(depth);
    return {
      points: goals.map((_, index) => rest.reduce((sum, pool) => sum + Math.max(...pool.map(row => row.points[index])), 0)),
      defense: rest.reduce((sum, pool) => sum + Math.max(...pool.map(row => row.defense)), 0),
      sets: new Map([...bonuses].map(([name]) => [name, rest.filter(pool => pool.some(row => row.set === name)).length]))
    };
  });
  const counts = new Map();
  const selected = [];
  let best = null;

  function score(points, defense, minimumPoints = points) {
    const met = points.filter((points, i) => points >= targets[i]).length;
    const coverage = points.reduce((sum, points, i) => sum + Math.min(1, points / targets[i]), 0);
    const excess = preferExact ? minimumPoints.reduce((sum, points, i) => {
      const effective = Math.min(points, caps[goals[i].name] ?? points);
      return sum + Math.max(0, effective - targets[i]);
    }, 0) : 0;
    return [met, Math.round(coverage * 100000), -excess, defense];
  }
  function beats(left, right) {
    const firstDifference = left.findIndex((value, index) => value !== right[index]);
    return firstDifference >= 0 && left[firstDifference] > right[firstDifference];
  }
  function visit(depth, points, defense) {
    if (depth === slots.length) {
      const ranking = score(points, defense);
      if (!best || beats(ranking, best.ranking)) {
        best = {ranking, points, defense, gear: Object.fromEntries(selected.map(item => [item.slot, item.id]))};
      }
      return;
    }
    const rest = remaining[depth];
    if (best) {
      const upper = points.map((level, i) => level + rest.points[i]);
      for (const [name, rule] of bonuses) {
        const count = counts.get(name) ?? 0;
        if (count < rule.need && count + rest.sets.get(name) >= rule.need) {
          rule.points.forEach((value, i) => { upper[i] += value; });
        }
      }
      // Skill totals only increase, so already counted points bound the minimum possible excess.
      if (!beats(score(upper, defense + rest.defense, points), best.ranking)) return;
    }
    for (const row of pools[depth]) {
      const count = counts.get(row.set) ?? 0;
      const rule = bonuses.get(row.set);
      const unlocksBonus = rule && count + 1 === rule.need;
      if (rule) counts.set(row.set, count + 1);
      selected.push(row.item);
      visit(depth + 1, points.map((level, i) => level + row.points[i] + (unlocksBonus ? rule.points[i] : 0)), defense + row.defense);
      selected.pop();
      if (rule) counts.set(row.set, count);
    }
  }
  visit(0, targets.map(() => 0), 0);
  return best;
}

if (typeof module !== 'undefined') module.exports = {findArmor};
