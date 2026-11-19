// TrophyListView: the checklist cards — names, descriptions, grades, flags, and earned ticks.
export function trophyIsHidden(trophy, spoilerOn, earned) {
  return spoilerOn && trophy.hidden && !earned.has(trophy.name);
}

export function renderTrophyList(trophies, earned, filters, callbacks) {
  const host = document.getElementById('trophy-list');
  const emptyNote = document.getElementById('empty-note');
  const filterNote = document.getElementById('filter-note');
  host.replaceChildren();
  const query = filters.query.trim().toLowerCase();
  const shown = trophies.filter((trophy) => {
    if (filters.kind === 'missable' && !trophy.missable) return false;
    if (filters.kind === 'online') return false;
    if (filters.kind !== 'all' && filters.kind !== 'missable' && trophy.kind !== filters.kind) return false;
    if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
    if (filters.earnedOnly && !earned.has(trophy.name)) return false;
    if (query && !(trophy.name.toLowerCase().includes(query) || trophy.description.toLowerCase().includes(query))) return false;
    return true;
  });
  const earnedShown = shown.filter((t) => earned.has(t.name)).length;
  filterNote.textContent = `Showing ${shown.length} of ${trophies.length} trophies (${earnedShown} earned in this view).`;
  emptyNote.hidden = shown.length !== 0;
  if (filters.kind === 'online') {
    filterNote.textContent = 'Showing 0 of 55 trophies: the official list has no online trophies — every trophy is single-player.';
  }

  for (const trophy of shown) {
    const card = document.createElement('article');
    card.className = 'trophy-card' + (earned.has(trophy.name) ? ' is-earned' : '');
    card.dataset.trophyId = String(trophy.id);
    const top = document.createElement('div');
    top.className = 'trophy-top';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.className = 'trophy-check';
    box.checked = earned.has(trophy.name);
    box.setAttribute('aria-label', 'Mark ' + trophy.name + ' as earned');
    box.addEventListener('change', () => callbacks.onToggle(trophy, box.checked));
    const nameWrap = document.createElement('div');
    const name = document.createElement('h3');
    name.className = 'trophy-name';
    const hidden = trophyIsHidden(trophy, filters.spoilerOn, earned);
    name.textContent = hidden ? 'Hidden trophy' : trophy.name;
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    desc.textContent = hidden ? 'Hidden on PlayStation until earned.' : trophy.description;
    nameWrap.append(name, desc);
    top.append(box, nameWrap);

    const tags = document.createElement('div');
    tags.className = 'trophy-tags';
    const grade = document.createElement('span');
    grade.className = 'grade-badge grade-' + trophy.grade;
    grade.textContent = trophy.grade;
    tags.append(grade);
    const kind = document.createElement('span');
    kind.className = 'kind-tag';
    kind.textContent = trophy.kind;
    tags.append(kind);
    if (trophy.hidden) {
      const flag = document.createElement('span');
      flag.className = 'flag-hidden';
      flag.textContent = 'HIDDEN';
      tags.append(flag);
    }
    if (trophy.missable) {
      const flag = document.createElement('span');
      flag.className = 'flag-missable';
      flag.textContent = 'MISSABLE';
      tags.append(flag);
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'guide-button';
    button.textContent = 'Read the guide';
    button.addEventListener('click', () => callbacks.onOpenGuide(trophy));
    card.append(top, tags, button);
    host.append(card);
  }
}
