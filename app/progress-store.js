// ProgressStore: earned trophies saved in localStorage, exported to a file and imported back.
export const PROGRESS_KEY = 'vice-city-platinum-progress-v1';

export function loadProgress(knownNames) {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    const known = new Set(knownNames);
    return new Set(parsed.filter((name) => known.has(name)));
  } catch {
    return new Set();
  }
}

export function saveProgress(earned) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...earned]));
}

export function exportProgress(earned) {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned] }, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'vice-city-platinum-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

export async function importProgressFile(file, knownNames) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('That file does not hold a trophy list.');
  const known = new Set(knownNames);
  const earned = new Set(names.filter((name) => typeof name === 'string' && known.has(name)));
  return earned;
}
