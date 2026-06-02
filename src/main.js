import { createGame } from './systems/engine.js';
import { mount, find } from './ui/shell.js';
import { renderStatusBar, renderNarrative, initMap, updateMap, renderTravelLines2 } from './ui/renderer.js';
import { saveGame, loadGame, clearSave } from './ui/persistence.js';
import { NODES } from './data/nodes.js';

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

  const rootEl = find('#game-root');
  if (!rootEl) {
    console.error('Metis bootstrap aborted: #game-root is missing.');
    return;
  }
  renderNarrative(['Welcome to the Métis Trail. Click Begin Journey to start.']);

  const startBtn = find('#intro-start');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const overlay = find('#intro-overlay');
      if (overlay) overlay.remove();
      initMap();
      render();
    });
  } else {
    console.warn('Metis bootstrap: #intro-start not found; Begin Journey button is offline.');
  }

  const travelBtn = find('#btn-travel');
  if (travelBtn) travelBtn.addEventListener('click', () => {
    const { pendingEvent, pendingSettlement, over } = game.getState();
    if (pendingEvent || pendingSettlement || over) return;
    travelOneDay();
    render();
  });

  const campBtn = find('#btn-camp');
  if (campBtn) campBtn.onclick = () => {
    publishCampResult();
    game.makeCamp();
    render();
  };

  const cartBtn = find('#btn-cart');
  if (cartBtn) cartBtn.onclick = () => showCart(game);

  const crewBtn = find('#btn-crew');
  if (crewBtn) crewBtn.onclick = () => showCrew(game);

  const eventContinue = find('#event-continue');
  if (eventContinue) eventContinue.onclick = () => {
    find('#event-overlay')?.classList.remove('active');
  };

  const settlementContinue = find('#settlement-continue');
  if (settlementContinue) settlementContinue.onclick = () => {
    game.settlementAction('continue');
    find('#settlement-overlay')?.classList.remove('active');
    render();
  };

  const settlementClose = find('#settlement-close');
  if (settlementClose) settlementClose.onclick = () => {
    find('#settlement-overlay')?.classList.remove('active');
  };

  const cartClose = find('#cart-close-btn');
  const cartClose2 = find('#cart-close-btn-2');
  if (cartClose) cartClose.onclick = () => find('#cart-overlay')?.classList.remove('active');
  if (cartClose2) cartClose2.onclick = () => find('#cart-overlay')?.classList.remove('active');

  const crewClose = find('#crew-close-btn');
  const crewClose2 = find('#crew-close-btn-2');
  if (crewClose) crewClose.onclick = () => find('#crew-overlay')?.classList.remove('active');
  if (crewClose2) crewClose2.onclick = () => find('#crew-overlay')?.classList.remove('active');

  const restartBtn = find('#end-restart');
  if (restartBtn) restartBtn.onclick = () => {
    clearSave();
    window.location.reload();
  };

  render();
}

window.__METIS_BOOT__ = bootstrap;
let pendingResult = null;

function publishResult(text) {
  pendingResult = text;
}

function travelOneDay() {
  const game = window._metisGame;
  const prev = game.getState();
  const result = game.travelOneDay();
  const state = game.getState();

  if (state.pendingEvent) return null;

  const msgs = [];
  msgs.push('Day advances.');
  msgs.push(`-1 Food.`);
  if (state.crew !== prev.crew) msgs.push(`Crew: ${prev.crew} -> ${state.crew}`);
  if (state.wear > prev.wear) msgs.push(`${state.wear - prev.wear} Wear added.`);
  if (state.morale < prev.morale) msgs.push(`Morale: ${prev.morale} -> ${state.morale}`);
  if (state.node > prev.node) {
    msgs.push(`Arrived at: ${game.getCurrentNode().name}`);
  } else if (state.node === prev.node && state.over) {
    msgs.push('Journey ends here.');
  } else if (state.node === prev.node) {
    msgs.push('Still on the trail.');
  }
  const msg = msgs.join(' ');
  publishResult(msg);
  return result;
}

function publishCampResult() {
  const game = window._metisGame;
  const prev = game.getState();
  const msgs = [];
  msgs.push('Camp.');
  msgs.push('-1 Food.');
  msgs.push('+1 Day.');
  msgs.push('Crew rested.');
  if (prev.morale < 100) {
    const newMorale = Math.min(100, prev.morale + 15);
    msgs.push(`Morale: ${prev.morale} -> ${newMorale}`);
  }
  publishResult(msgs.join(' '));
}

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
  renderTravelLines2(state, game, pendingResult);
  pendingResult = null;
}

function hideOverlays() {
  ['event-overlay', 'settlement-overlay', 'cart-overlay', 'crew-overlay'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
}

let pendingDice = null;

function rollDiceOnce() {
  return Math.floor(Math.random() * 20) + 1;
}

function renderDicePill(result) {
  const rc = document.getElementById('event-roll-display');
  if (!rc) return;
  rc.style.display = 'flex';
  rc.innerHTML = `
    <div class="roll-label">Roll</div>
    <div id="die" class="die small font-spectral">-</div>
    <div class="roll-label">DC ${result.dc}</div>
    <div class="roll-result ${result.success ? 'pass' : 'fail'}">${result.success ? 'Pass' : 'Fail'}</div>
  `;
}

function animateDicePill(result) {
  const el = document.getElementById('die');
  if (!el) return;
  el.className = 'die small font-spectral spin';

  let ticks = 0;
  const maxTicks = 8 + Math.floor(Math.random() * 5);
  const id = setInterval(() => {
    el.textContent = String(Math.floor(Math.random() * 20) + 1);
    ticks += 1;
    if (ticks >= maxTicks) {
      clearInterval(id);
      const settled = rollDiceOnce();
      el.textContent = String(settled);
      el.className = 'die small font-spectral ' + (result.success ? 'pass' : 'fail');
    }
  }, 60);
}

function showEvent(game) {
  const ev = game.getPendingEvent();
  if (!ev) return;
  const textEl = document.getElementById('event-text');
  const choicesEl = document.getElementById('event-choices');
  const continueEl = document.getElementById('event-continue');
  if (!textEl || !choicesEl) return;

  textEl.textContent = ev.text;

  const amountEl = document.getElementById('event-amount');
  if (amountEl) {
    const amount = ev.amount || ev.rollAdjust || null;
    amountEl.textContent = '';
    amountEl.style.display = 'none';
    if (amount) {
      amountEl.textContent = amount;
      amountEl.style.display = 'block';
    }
  }

  const stampEl = document.getElementById('event-stamp');
  if (stampEl) {
    stampEl.textContent = ev.classification || '';
    stampEl.style.display = ev.classification ? 'inline-block' : 'none';
  }

  choicesEl.innerHTML = '';
  continueEl.style.display = 'none';

  const rc = document.getElementById('event-roll-display');
  if (rc) rc.style.display = 'none';

  (ev.choices || []).forEach((ch, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = ch.text;
    btn.onclick = () => {
      const prev = game.getState();
      const stepLog = game.chooseEventChoice(i);
      const entry = stepLog && stepLog[0] ? stepLog[0] : null;
      const res = entry && entry.result ? entry.result : entry;
      if (res && res.roll !== null && res.dc !== null) {
        btn.disabled = true;
        pendingDice = res;
        renderDicePill(res);
        animateDicePill(res);
        setTimeout(() => {
          const outcome = buildEventChoiceOutcome(stepLog, prev, game.getState());
          if (outcome) publishResult(outcome);
          pendingDice = null;
          render();
        }, 650 + Math.random() * 180);
        return;
      }
      const outcome = buildEventChoiceOutcome(stepLog, prev, game.getState());
      if (outcome) publishResult(outcome);
      render();
    };
    choicesEl.appendChild(btn);
  });

  document.getElementById('event-overlay')?.classList.add('active');
}

function buildEventChoiceOutcome(stepLog, before, after) {
  const msgs = [];
  const entry = stepLog && stepLog[0] ? stepLog[0] : null;
  const res = entry && entry.result ? entry.result : entry;
  if (res && res.roll !== null && res.dc !== null) {
    msgs.push(`Rolled ${res.roll} vs DC ${res.dc}: ${res.success ? 'Success' : 'Failure'}`);
  }
  if (res && res.text) msgs.push(res.text);
  if (after.food !== before.food) msgs.push(`${after.food - before.food >= 0 ? '+' : ''}${after.food - before.food} Food`);
  if (after.wear !== before.wear) msgs.push(`Wear ${after.wear - before.wear >= 0 ? '+' : ''}${after.wear - before.wear}`);
  if (after.morale !== before.morale) msgs.push(`Morale ${after.morale - before.morale >= 0 ? '+' : ''}${after.morale - before.morale}`);
  if (after.crew !== before.crew) msgs.push(`Crew: ${before.crew} -> ${after.crew}`);
  if (after.node !== before.node) msgs.push(`Arrived at: ${NODES[after.node]?.name || 'unknown'}`);
  if (res && res.flags && res.flags.length) msgs.push(`Flag: ${res.flags[0]}`);
  if (res && res.reps && res.reps.length) {
    const r = res.reps[0];
    msgs.push(`Reputation ${r.key}: ${r.delta >= 0 ? '+' : ''}${r.delta} (now ${r.value})`);
  }
  if (!msgs.length) return 'The day passes without change.';
  return msgs.join(', ');
}

function showSettlement(game) {
  const next = game.getCurrentNode();
  const before = game.getState();
  const beforeCart = game.getCart();
  const nameEl = document.getElementById('settlement-name');
  const descEl = document.getElementById('settlement-desc');
  const actionsEl = document.getElementById('settlement-actions');
  if (!nameEl || !descEl || !actionsEl) return;

  nameEl.textContent = next.name;
  descEl.textContent = next.desc;
  actionsEl.innerHTML = '';

  const available = game.getAvailableActions();
  (available.actions || []).forEach((action) => {
    const wrap = document.createElement('div');
    wrap.className = 'settlement-action';

    const label = document.createElement('div');
    label.className = 'settlement-action-label';
    label.textContent = actionLabel(action);

    const sub = document.createElement('div');
    sub.className = 'settlement-action-sub';
    sub.textContent = actionSubtitle(action);

    const btn = document.createElement('button');
    btn.className = 'ctrl-btn';
    btn.style.display = 'flex';
    btn.style.flexDirection = 'column';
    btn.style.alignItems = 'flex-start';
    btn.style.gap = '2px';
    btn.appendChild(label);
    btn.appendChild(sub);
    btn.onclick = () => {
      hideOverlays();
      game.settlementAction(action);
      const after = game.getState();
      const afterCart = game.getCart();
      const outcome = buildSettlementOutcome(action, before, after, beforeCart, afterCart);
      if (outcome) publishResult(outcome);
      render();
    };
    actionsEl.appendChild(btn);
  });

  document.getElementById('settlement-overlay')?.classList.add('active');
}

function buildSettlementOutcome(action, before, after, beforeCart, afterCart) {
  const msgs = [];
  if (after.food !== before.food) msgs.push(`${after.food - before.food >= 0 ? '+' : ''}${after.food - before.food} Food`);
  if (after.wear !== before.wear) msgs.push(`Wear ${after.wear - before.wear >= 0 ? '+' : ''}${after.wear - before.wear}`);
  if (after.morale !== before.morale) msgs.push(`Morale ${after.morale - before.morale >= 0 ? '+' : ''}${after.morale - before.morale}`);
  if (after.crew !== before.crew) msgs.push(`Crew: ${before.crew} -> ${after.crew}`);
  if (after.day !== before.day) msgs.push(`${after.day - before.day} Day(s)`);
  if (action === 'trade') {
    const gained = afterCart.reduce((s, i) => s + Math.max(0, i.count - (beforeCart.find(j => j.name === i.name)?.count || 0)), 0);
    if (gained > 0) msgs.push(`Food gained.`);
  }
  if (action === 'repair') msgs.push('Cart repaired.');
  if (action === 'grease') msgs.push('Axle greased.');
  if (action === 'heal') msgs.push('Healed.');
  if (action === 'forage') msgs.push('Foraging...');
  if (action === 'recruit') msgs.push('Reinforcements found.');
  if (action === 'rumours') msgs.push('You learn the latest trail news.');
  if (action === 'rest') msgs.push('Rest. Crew and supplies refreshed.');
  if (!msgs.length) return 'Nothing changed.';
  return msgs.join(', ');
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
  narrativeEl.textContent = state.won ? `You reached Fort Edmonton on day ${state.day}. Your cart held, the crew survived, and the trade goods arrived.` : `Your journey ends on day ${state.day} on the Carlton Trail.`;
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
function actionSubtitle(a) {
  const map = {
    rest: 'Crew rested, morale restored, supplies refresh.',
    trade: 'Spend one trade good for +6-10 food.',
    repair: 'Reduce wheel wear, or apply shaganappi if carried.',
    grease: 'Consume shaganappi to silence axle squeal.',
    forage: 'D20 + crew modifier; 12+ gains 1-4 food.',
    recruit: 'Rests tired crew if not exhausted.',
    rumours: 'Advance one day, learn trail news.',
    heal: 'Crew rested, morale restored.',
    continue: 'Resume the journey.',
  };
  return map[a] || '';
}
