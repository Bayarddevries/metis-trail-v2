import { CONSTANTS } from '../core/constants.js';

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

export function mountDebugUI(game) {
  const url = new URL(location.href);
  if (!url.searchParams.has('debug')) return;

  const panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.bottom = '0';
  panel.style.right = '0';
  panel.style.width = '360px';
  panel.style.maxHeight = '50vh';
  panel.style.background = '#1e1e1e';
  panel.style.color = '#e8dcc8';
  panel.style.fontFamily = 'ui-monospace, monospace';
  panel.style.fontSize = '12px';
  panel.style.overflow = 'auto';
  panel.style.borderTop = '2px solid #8B2500';
  panel.style.padding = '8px';
  panel.style.zIndex = '9999';

  const stateEl = document.createElement('pre');
  stateEl.id = 'debug-state';
  const btn = document.createElement('button');
  btn.textContent = '✕';
  btn.onclick = () => panel.remove();
  panel.append(btn, stateEl);
  document.body.appendChild(panel);

  setInterval(() => {
    try {
      const s = game.getState();
      stateEl.textContent = JSON.stringify(s, null, 2);
    } catch (e) {
      stateEl.textContent = 'no state';
    }
  }, 500);
}
