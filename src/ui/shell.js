import { applyTheme } from './theme.js';

export function mount() {
  const gameRoot = document.getElementById('game-root');
  if (!gameRoot) throw new Error('#game-root missing');
  applyTheme(gameRoot);
  return gameRoot;
}

export function find(selector) {
  return document.querySelector(selector);
}
