import { createGame } from './systems/engine.js';
import { mount, find } from './ui/shell.js';
import { renderStatusBar, renderNarrative } from './ui/renderer.js';
import { mountDebugUI } from './ui/debug.js';
import { saveGame, loadGame, clearSave } from './ui/persistence.js';

export function bootstrap(seed = null) {
  const game = createGame(seed);
  const root = mount();
  document.body.style.fontFamily = "var(--font-body)";
  renderer = stateRenderer(game);

  find('#intro-start').onclick = () => {
    find('#intro-overlay').classList.remove('active');
    renderer();
  };

  find('#btn-travel').onclick = () => {
    if (game.getState().pendingEvent || game.getState().pendingSettlement) return;
    game.travelOneDay();
    renderer();
  };
  find('#btn-camp').onclick = () => {
    game.makeCamp();
    renderer();
  };
  find('#btn-cart').onclick = () => showCart(game, root);
  find('#btn-crew').onclick = () => showCrew(game);
  find('#end-restart').onclick = () => {
    clearSave();
    window.location.reload();
  };

  mountDebugUI(game);
}

let renderer = null;
function stateRenderer(game) {
  return () => {
    const state = game.getState();
    renderStatusBar(state);
    if (state.pendingEvent) presentEvent(game);
    else if (state.pendingSettlement) presentSettlement(game);
    else if (state.over) showEnd(game);
  };
}

function presentEvent(game) {
  const ev = game.getPendingEvent();
  if (!ev) return;
  const el = document.getElementById('event-overlay');
  el.innerHTML = `
    <div class="overlay-card">
      <div id="event-text"><p>${ev.text}</p></div>
      <div id="event-choices"></div>
    </div>`;
  el.classList.add('active');
  const choices = document.getElementById('event-choices');
  ev.choices.forEach((ch, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = ch.text;
    btn.onclick = () => {
      game.chooseEventChoice(i);
      renderer();
    };
    choices.appendChild(btn);
  });
}

function presentSettlement(game) {
  const state = game.getState();
  const next = game.getCurrentNode();
  const el = document.getElementById('settlement-overlay');
  el.innerHTML = `
    <div class="overlay-card">
      <h2>${next.name}</h2>
      <div class="settlement-desc">${next.desc}</div>
      <div id="settlement-actions"></div>
      <button class="ctrl-btn" id="settlement-continue">Continue West</button>
    </div>`;
  el.classList.add('active');
  document.getElementById('settlement-continue').onclick = () => {
    game.settlementAction('continue');
    renderer();
  };
}

function showCart(game) {
  const cart = game.getCart();
  const el = document.getElementById('cart-overlay');
  el.innerHTML = `
    <div class="overlay-card">
      <h2>Cart</h2>
      <div id="inv-list">${cart.map(i => `<div>${i.icon || ''} ${i.name} ×${i.count} (${i.wt * i.count} kg)</div>`).join('')}</div>
      <button class="ctrl-btn" id="cart-close-btn">Close</button>
    </div>`;
  el.classList.add('active');
  document.getElementById('cart-close-btn').onclick = () => el.classList.remove('active');
}

function showCrew(game) {
  const c = game.getCrew();
  const el = document.getElementById('crew-overlay');
  el.innerHTML = `
    <div class="overlay-card">
      <h2>Crew</h2>
      <div>State: ${c.state}</div>
      <div>Morale: ${c.morale}</div>
      <div>Modifier: ${c.mod}</div>
      <button class="ctrl-btn" id="crew-close-btn">Close</button>
    </div>`;
  el.classList.add('active');
  document.getElementById('crew-close-btn').onclick = () => el.classList.remove('active');
}

function showEnd(game) {
  const state = game.getState();
  const el = document.getElementById('end-overlay');
  el.innerHTML = `
    <div class="overlay-card end-card">
      <h1>${state.won ? 'You Made It!' : 'Journey Over'}</h1>
      <div class="end-stats">
        <div class="stat-row"><span class="label">Days</span><span>${state.day}</span></div>
        <div class="stat-row"><span class="label">Score</span><span>${state.score}</span></div>
        <div class="score-row">Score</div>
      </div>
      <button id="end-restart" class="restart-btn">Play Again</button>
    </div>`;
  el.classList.add('active');
  document.getElementById('end-restart').onclick = () => {
    clearSave();
    window.location.reload();
  };
}
