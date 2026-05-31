import { applyTheme } from './theme.js';

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
      <div id="map-debug"></div>
    </div>
    <div id="bottom-panel">
      <div id="narrative"></div>
      <div id="controls">
        <button id="btn-travel" class="ctrl-btn">Travel 1 Day</button>
        <button id="btn-camp" class="ctrl-btn">Make Camp</button>
        <button id="btn-cart" class="ctrl-btn">Cart</button>
        <button id="btn-crew" class="ctrl-btn">Crew</button>
      </div>
    </div>
    <div id="intro-overlay" class="overlay active">
      <div class="overlay-card intro-card">
        <h1>Métis Trail</h1>
        <div class="subtitle">A Carlton Trail Journey — 1878</div>
        <div class="flavor-text">Fort Garry to Fort Edmonton. Build your cart, read the land, honour the trail.</div>
        <button id="intro-start" class="start-btn">Begin Journey</button>
      </div>
    </div>
    <div id="event-overlay" class="overlay"></div>
    <div id="settlement-overlay" class="overlay"></div>
    <div id="cart-overlay" class="overlay"></div>
    <div id="crew-overlay" class="overlay"></div>
    <div id="end-overlay" class="overlay"></div>
  `;
  applyTheme(root);
  return { root, overrides: {} };
}

export function find(selector) {
  return document.querySelector(selector);
}
