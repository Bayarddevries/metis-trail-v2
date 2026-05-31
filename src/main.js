import { createGame } from './systems/engine.js';
import { mount, find } from './ui/shell.js';
import { renderStatusBar, renderNarrative, initMap, updateMap } from './ui/renderer.js';
import { saveGame, loadGame, clearSave } from './ui/persistence.js';

export function bootstrap(seed = null) {
  const game = createGame(seed);
  window._metisGame = game;
  window.__METIS_READY__ = true;
  window.__METIS_DEBUG__ = {
    get state() { return game.getState(); },
    get cart() { return game.getCart(); },
    get crew() { return game.getCrew(); },
    get node() { return game.getCurrentNode(); },
    travel: () => game.travelOneDay(),
    camp: () => game.makeCamp(),
    choose: (i) => game.chooseEventChoice(i),
    reroll: (s) => { const g = createGame(s); window._metisGame = g; render(); },
  };
  mount();

  const state = game.getState();
  renderStatusBar(state);
  renderNarrative(['Welcome to the Métis Trail. Click Begin Journey to start.']);

  const startBtn = find('#intro-start');
  if (startBtn) startBtn.addEventListener('click', () => {
    find('#intro-overlay')?.classList.remove('active');
    initMap();
    render();
  });
  find('#btn-travel').addEventListener('click', () => {
    const { pendingEvent, pendingSettlement, over } = game.getState();
    if (pendingEvent || pendingSettlement || over) return;
    game.travelOneDay();
    render();
  });

  find('#btn-camp').onclick = () => {
    game.makeCamp();
    render();
  };

  find('#btn-cart').onclick = () => showCart(game);
  find('#btn-crew').onclick = () => showCrew(game);

  find('#event-continue').onclick = () => {
    find('#event-overlay')?.classList.remove('active');
  };
  find('#settlement-continue').onclick = () => {
    game.settlementAction('continue');
    find('#settlement-overlay')?.classList.remove('active');
    render();
  };
  find('#settlement-close').onclick = () => {
    find('#settlement-overlay')?.classList.remove('active');
  };
  find('#cart-close-btn').onclick = () => find('#cart-overlay')?.classList.remove('active');
  find('#cart-close-btn-2').onclick = () => find('#cart-overlay')?.classList.remove('active');
  find('#crew-close-btn').onclick = () => find('#crew-overlay')?.classList.remove('active');
  find('#crew-close-btn-2').onclick = () => find('#crew-overlay')?.classList.remove('active');
  find('#end-restart').onclick = () => {
    clearSave();
    window.location.reload();
  };

  render();
}

window.__METIS_BOOT__ = bootstrap;

function render() {
  const game = window._metisGame;
  if (!game) return;
  const state = game.getState();
  renderStatusBar(state);
  updateMap(state);

  if (state.over) {
    showEnd(game);
    return;
  }
  if (state.pendingEvent) {
    showEvent(game);
    return;
  }
  if (state.pendingSettlement) {
    showSettlement(game);
    return;
  }
  hideOverlays();
}

function hideOverlays() {
  ['event-overlay', 'settlement-overlay', 'cart-overlay', 'crew-overlay'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
}

function showEvent(game) {
  const ev = game.getPendingEvent();
  if (!ev) return;
  const textEl = document.getElementById('event-text');
  const choicesEl = document.getElementById('event-choices');
  const continueEl = document.getElementById('event-continue');
  if (!textEl || !choicesEl) return;

  textEl.textContent = ev.text;
  choicesEl.innerHTML = '';
  continueEl.style.display = 'none';

  (ev.choices || []).forEach((ch, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = ch.text;
    btn.onclick = () => {
      game.chooseEventChoice(i);
      render();
    };
    choicesEl.appendChild(btn);
  });

  document.getElementById('event-overlay')?.classList.add('active');
}

function showSettlement(game) {
  const state = game.getState();
  const next = game.getCurrentNode();
  const nameEl = document.getElementById('settlement-name');
  const descEl = document.getElementById('settlement-desc');
  const actionsEl = document.getElementById('settlement-actions');
  if (!nameEl || !descEl || !actionsEl) return;

  nameEl.textContent = next.name;
  descEl.textContent = next.desc;
  actionsEl.innerHTML = '';

  const available = game.getAvailableActions();
  (available.actions || []).forEach((action) => {
    const btn = document.createElement('button');
    btn.className = 'ctrl-btn';
    btn.textContent = actionLabel(action);
    btn.onclick = () => {
      hideOverlays();
      game.settlementAction(action);
      render();
    };
    actionsEl.appendChild(btn);
  });

  document.getElementById('settlement-overlay')?.classList.add('active');
}

function showCart(game) {
  const cart = game.getCart();
  const listEl = document.getElementById('inv-list');
  if (!listEl) return;
  listEl.innerHTML = cart.map(i => `<div>${i.icon || ''} ${i.name} ×${i.count} (${i.wt * i.count} kg)</div>`).join('');
  document.getElementById('cart-overlay')?.classList.add('active');
}

function showCrew(game) {
  const c = game.getCrew();
  const el = document.getElementById('crew-status');
  if (!el) return;
  el.innerHTML = `<div>State: ${c.state}</div><div>Morale: ${c.morale}</div><div>Modifier: ${c.mod}</div>`;
  document.getElementById('crew-overlay')?.classList.add('active');
}

function showEnd(game) {
  const state = game.getState();
  const titleEl = document.getElementById('end-title');
  const narrativeEl = document.getElementById('end-narrative');
  const statsEl = document.getElementById('end-stats');
  if (!titleEl || !narrativeEl || !statsEl) return;

  titleEl.textContent = state.won ? 'You Made It!' : 'Journey Over';
  narrativeEl.textContent = state.won
    ? `You reached Fort Edmonton on day ${state.day}. Your cart held, the crew survived, and the trade goods arrived.`
    : `Your journey ends on day ${state.day} on the Carlton Trail.`;
  statsEl.innerHTML = `
    <div class="stat-row"><span class="label">Days</span><span>${state.day}</span></div>
    <div class="stat-row"><span class="label">Score</span><span>${state.score}</span></div>
    <div class="score-row">Score</div>
  `;
  document.getElementById('end-overlay')?.classList.add('active');
}

function actionLabel(a) {
  const map = { rest: 'Rest', trade: 'Trade', repair: 'Repair', grease: 'Grease', forage: 'Forage', recruit: 'Recruit', rumours: 'Gossip', heal: 'Heal', continue: 'Continue West' };
  return map[a] || a;
}
