// RoadmapView: the four-stage platinum roadmap and the missable warnings list.
const STAGES = [
  { stage: 1, title: 'Story first', text: 'Chapters 1 to 4, the final mission, and the stranger strands. Play the story in order; the chapter and mission trophies pop as you finish.', filter: (t) => t.roadmap === 1 },
  { stage: 2, title: 'Missables as you go', text: 'The single-moment trophies. Make a manual save before each one — there is no mission replay to go back with.', filter: (t) => t.roadmap === 2 },
  { stage: 3, title: 'Collectibles & exploration', text: 'Meditation spots, card sets, WAiNK locations, vehicles, garages, the Scooter Bros app, and exploring all of Leonida.', filter: (t) => t.roadmap === 3 },
  { stage: 4, title: 'Activities, grinds & 100%', text: 'Stunts, shooting range golds, races, challenges, robberies and the money trophies — then 100% completion and the platinum.', filter: (t) => t.roadmap === 4 },
];

export function renderRoadmap(trophies, earned, onPick) {
  const host = document.getElementById('roadmap-stages');
  host.replaceChildren();
  for (const stage of STAGES) {
    const card = document.createElement('article');
    card.className = 'roadmap-stage';
    const heading = document.createElement('h3');
    const num = document.createElement('span');
    num.className = 'stage-num';
    num.textContent = String(stage.stage);
    heading.append(num, document.createTextNode(stage.title));
    const blurb = document.createElement('p');
    blurb.textContent = stage.text;
    const list = document.createElement('ul');
    for (const trophy of trophies.filter(stage.filter)) {
      const item = document.createElement('li');
      if (earned.has(trophy.name)) item.className = 'earned';
      const link = document.createElement('a');
      link.href = '#checklist';
      link.textContent = trophy.name;
      link.addEventListener('click', () => onPick(trophy));
      item.append(link);
      list.append(item);
    }
    card.append(heading, blurb, list);
    host.append(card);
  }
}

export function renderMissableList(trophies, onPick) {
  const host = document.getElementById('missable-list');
  host.replaceChildren();
  for (const trophy of trophies.filter((t) => t.missable)) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#checklist';
    link.textContent = trophy.name;
    link.addEventListener('click', () => onPick(trophy));
    item.append(link, document.createTextNode(' — ' + trophy.description));
    host.append(item);
  }
}
