// Vice City Platinum: bootstrap the guide — load the trophy data, wire the filters,
// the spoiler setting, the saved progress, and the export/import buttons.
import { loadProgress, saveProgress, exportProgress, importProgressFile } from './progress-store.js';
import { renderRoadmap, renderMissableList } from './roadmap.js';
import { renderTrophyList } from './trophy-list.js';
import { renderTrophyGuide } from './trophy-guide.js';

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const knownNames = trophies.map((t) => t.name);
let earned = loadProgress(knownNames);

const filters = { kind: 'all', grade: 'all', query: '', spoilerOn: false, earnedOnly: false };

function renderProgress() {
  const total = trophies.length;
  const done = earned.size;
  const pct = Math.round((done / total) * 100);
  document.getElementById('progress-text').textContent = `${done} of ${total} earned`;
  document.getElementById('progress-pct').textContent = `${pct}% to platinum`;
  document.getElementById('progress-fill').style.width = `${pct}%`;
  const counts = {};
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    const inGrade = trophies.filter((t) => t.grade === grade);
    counts[grade] = inGrade.filter((t) => earned.has(t.name)).length + '/' + inGrade.length;
  }
  document.getElementById('grade-counts').textContent =
    `Platinum ${counts.platinum} · Gold ${counts.gold} · Silver ${counts.silver} · Bronze ${counts.bronze}`;
}

function renderAll() {
  renderProgress();
  renderTrophyList(trophies, earned, filters, {
    onToggle: (trophy, checked) => {
      if (checked) earned.add(trophy.name);
      else earned.delete(trophy.name);
      saveProgress(earned);
      renderAll();
    },
    onOpenGuide: (trophy) => renderTrophyGuide(trophy, filters.spoilerOn, earned),
  });
  renderRoadmap(trophies, earned, (trophy) => renderTrophyGuide(trophy, filters.spoilerOn, earned));
  document.title = `Vice City Platinum — ${earned.size} of ${trophies.length} earned`;
}

function openGuideByName(name) {
  const trophy = trophies.find((t) => t.name === name);
  if (trophy) renderTrophyGuide(trophy, filters.spoilerOn, earned);
}

renderMissableList(trophies, openGuideByName);
renderAll();

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    filters.kind = chip.dataset.kind;
    renderAll();
  });
});

document.getElementById('grade').addEventListener('change', (event) => {
  filters.grade = event.target.value;
  renderAll();
});

document.getElementById('search').addEventListener('input', (event) => {
  filters.query = event.target.value;
  renderAll();
});

document.getElementById('spoiler-toggle').addEventListener('change', (event) => {
  filters.spoilerOn = event.target.checked;
  renderAll();
});

document.getElementById('earned-only').addEventListener('change', (event) => {
  filters.earnedOnly = event.target.checked;
  renderAll();
});

document.getElementById('export').addEventListener('click', () => exportProgress(earned));

document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    earned = await importProgressFile(file, knownNames);
    saveProgress(earned);
    renderAll();
  } catch (error) {
    alert('Could not import that file: ' + error.message);
  }
  event.target.value = '';
});

document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Clear all earned ticks? Your exported file stays safe.')) {
    earned = new Set();
    saveProgress(earned);
    renderAll();
  }
});
