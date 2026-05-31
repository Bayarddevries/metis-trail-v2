const STORAGE_KEY = 'metis-trail-v2.save';

export function saveGame(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch (e) {
    console.warn('Save failed', e);
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw).data : null;
  } catch (e) {
    return null;
  }
}

export function clearSave() {
  localStorage.removeItem(STORAGE_KEY);
}
