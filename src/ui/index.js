import { createShell } from './shell.js';

export function mount() {
  const { root } = createShell();
  const gameRoot = document.getElementById('game-root');
  if (!gameRoot) throw new Error('#game-root missing');
  gameRoot.replaceWith(root);
  return root;
}
