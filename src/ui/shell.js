import { applyTheme } from './theme.js';

export function mount() {
  const { root } = createShell();
  const gameRoot = document.getElementById('game-root');
  if (!gameRoot) throw new Error('#game-root missing');
  gameRoot.replaceWith(root);
  return root;
}

export function find(selector) {
  return document.querySelector(selector);
}

export function createShell() {
  const root = document.createElement('div');
  root.id = 'game-container';
  root.innerHTML = `
    <div id="status-bar">
      <span id="s-day"><span class="stat-label">Day </span><span class="stat-value">1</span></span>
      <span id="s-month" class="stat-label">June 15</span>
      <span id="s-season" class="stat-label">Summer</span>
      <span id="s-segment" class="segment-progress">Fort Garry — begin your journey</span>
      <span id="s-food"><span class="stat-label">Food </span><span class="stat-value">30</span></span>
      <span id="s-wear"><span class="stat-label">Wear </span><span class="stat-value">0</span></span>
      <span id="s-crew"><span class="stat-label">Crew </span><span class="stat-value">Rested</span></span>
    </div>
    <div id="map-panel">
      <div id="map"></div>
    </div>
    <div id="bottom-panel">
      <div id="narrative"></div>
      <div id="controls">
        <button class="ctrl-btn" id="btn-travel">Travel</button>
        <button class="ctrl-btn" id="btn-camp">Make Camp</button>
        <button class="ctrl-btn" id="btn-cart">Cart</button>
        <button class="ctrl-btn" id="btn-crew">Crew</button>
      </div>
    </div>
    <div id="intro-overlay" class="overlay active">
      <div class="overlay-card intro-card">
        <h1>Métis Trail</h1>
        <p class="scene-text">Fort Garry, June 1878. Load your cart. Choose your crew. Head west.</p>
        <button class="start-btn" id="intro-start">Begin Journey</button>
      </div>
    </div>
    <div id="event-overlay" class="overlay"></div>
    <div id="settlement-overlay" class="overlay"></div>
    <div id="end-overlay" class="overlay"></div>
  `;
  applyTheme(root);
  return { root };
}
