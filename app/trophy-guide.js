// TrophyGuideView: the open guide for one trophy — steps, own-words guide, and cited sources.
export function renderTrophyGuide(trophy, spoilerOn, earned) {
  const panel = document.getElementById('guide-panel');
  const body = document.getElementById('guide-body');
  const title = document.getElementById('guide-title');
  const hiddenBySpoiler = spoilerOn && trophy.hidden && !earned.has(trophy.name);
  title.textContent = hiddenBySpoiler ? 'Hidden trophy — guide' : 'Guide: ' + trophy.name;
  body.replaceChildren();

  const meta = document.createElement('p');
  const grade = document.createElement('span');
  grade.className = 'grade-badge grade-' + trophy.grade;
  grade.textContent = trophy.grade;
  meta.append(grade, document.createTextNode('  ' + trophy.description + '  '));
  if (trophy.missable) {
    const flag = document.createElement('span');
    flag.className = 'flag-missable';
    flag.textContent = 'MISSABLE';
    meta.append(flag);
  }
  body.append(meta);

  if (hiddenBySpoiler) {
    const note = document.createElement('p');
    note.className = 'guide-text';
    note.textContent = 'This trophy is hidden on PlayStation until earned, and the spoiler setting is on. Tick it off as earned in the checklist above to reveal its guide, or turn the spoiler setting off.';
    body.append(note);
  } else {
    const text = document.createElement('p');
    text.className = 'guide-text';
    text.textContent = trophy.guide;
    const steps = document.createElement('ol');
    for (const step of trophy.steps) {
      const item = document.createElement('li');
      item.textContent = step;
      steps.append(item);
    }
    body.append(text, steps);
  }

  const sources = document.createElement('div');
  sources.className = 'guide-sources';
  const heading = document.createElement('strong');
  heading.textContent = 'Sources for this guide:';
  const list = document.createElement('ul');
  for (const source of trophy.sources) {
    const item = document.createElement('li');
    if (source.url) {
      const link = document.createElement('a');
      link.href = source.url;
      link.textContent = source.name;
      link.target = '_blank';
      link.rel = 'noopener';
      item.append(link);
    } else {
      item.textContent = source.name;
    }
    list.append(item);
  }
  sources.append(heading, list);
  body.append(sources);
  panel.hidden = false;
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
