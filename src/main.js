import { createGame } from './systems/engine.js';
import { mount, find } from './ui/shell.js';
import { renderStatusBar, renderNarrative, initMap, updateMap, renderTravelLinesView } from './ui/renderer.js';
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
    reroll: (s) => { const g = createGame(s); window._metisGame = g; window.__METIS_RENDER__(); },
  };

  mount();

  const rootEl = find('#game-root');
  if (!rootEl) {
    console.error('Metis bootstrap aborted: #game-root is missing.');
    return;
  }
  renderNarrative(['Welcome to the Métis Trail. Click Begin Journey to start.']);

  // Always init the map so it's ready behind the intro overlay
  initMap();

  // Event delegation on #game-root survives DOM rebuilds from render()
  const gameRoot = find('#game-root');
  if (gameRoot) {
    gameRoot.addEventListener('click', (e) => {
      if (e.target.closest('#intro-start')) {
        const overlay = find('#intro-overlay');
        if (overlay) {
          overlay.classList.remove('active');
          overlay.setAttribute('hidden', '');
        }
        window.__METIS_RENDER__();
      }
    });
  } else {
    console.warn('Metis bootstrap: #game-root not found; Begin Journey button is offline.');
  }

  const travelBtn = find('#btn-travel');
  if (travelBtn) {
    travelBtn.addEventListener('click', () => {
      const { pendingEvent, pendingSettlement, over } = game.getState();
      if (pendingEvent || pendingSettlement || over) return;
      const blocked = travelOneDay();
      if (blocked === true) return;
      window.__METIS_RENDER__();
    });
    travelBtn.setAttribute('data-metis-travel-bound', '1');
  }

  const campBtn = find('#btn-camp');
  if (campBtn) campBtn.onclick = () => {
    publishCampResult();
    game.makeCamp();
    window.__METIS_RENDER__();
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
    window.__METIS_RENDER__();
  };

  const settlementClose = find('#settlement-close');
  if (settlementClose) settlementClose.onclick = () => {
    game.settlementAction('continue');
    find('#settlement-overlay')?.classList.remove('active');
    window.__METIS_RENDER__();
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

  // Don't call render() here — it would hide the intro overlay immediately.
  // The intro's "Begin Journey" button calls render() on click.
}

window.__METIS_BOOT__ = bootstrap;
let pendingResult = null;

function publishResult(text) {
window.__METIS_PENDING_RESULT__ = text;
}

function travelOneDay() {
  const game = window._metisGame;
  const prev = game.getState();

  // Overload guard: check BEFORE advancing — don't consume a day just to block
  if (prev.usedWeight > prev.capacity) {
    showCart(game);
    publishResult('Cart is overloaded. Offload items before traveling.');
    return true;
  }

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
  game.makeCamp();
  const after = game.getState();
  const msgs = [];
  msgs.push('Camp.');
  if (after.food !== prev.food) msgs.push(`${after.food - prev.food >= 0 ? '+' : ''}${after.food - prev.food} Food`);
  msgs.push(`Crew: ${prev.crew} -> ${after.crew}`);
  if (after.morale !== prev.morale) msgs.push(`Morale: ${prev.morale} -> ${after.morale}`);
  msgs.push(`${after.day - prev.day} Day(s)`);
  publishResult(msgs.join(' '));
}

function render() {
  const game = window._metisGame;
  if (!game) return;

  if (!window._metisMapInited && window.__METIS_READY__ && document.getElementById('intro-overlay')?.classList.contains('active')) {
    initMap();
    window._metisMapInited = true;
  }

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
  renderTravelLinesView(state, game, window.__METIS_PENDING_RESULT__);
  window.__METIS_PENDING_RESULT__ = null;
  renderTrailIntel(state);
}

function renderTrailIntel(state) {
  const el = document.getElementById('trail-intel');
  if (!el) return;
  const intel = (state.trailIntel || []).filter((i) => state.day - i.fromDay <= 3);
  if (intel.length === 0) {
    el.innerHTML = '';
    el.style.display = 'none';
    return;
  }
  el.style.display = 'block';
  el.innerHTML = intel.map((i) => {
    const daysOld = state.day - i.fromDay;
    const freshness = daysOld <= 1 ? '🟢' : daysOld <= 2 ? '🟡' : '🔴';
    return `<div class="intel-item" style="font-size:0.85em;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.08);"><span style="margin-right:4px;">${freshness}</span>${i.text}${i.bonus ? ' <span style="color:#B8860B;font-size:0.8em;">(+' + i.bonus.dcBonus + ' DC)</span>' : ''}</div>`;
  }).join('');
}

function hideOverlays() {
  ['intro-overlay', 'event-overlay', 'settlement-overlay', 'cart-overlay', 'crew-overlay'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
}

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

function animateDicePill(result, fullDiceResult) {
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
      el.textContent = String(result.roll);
      // Dramatic final pose: remove spin, add settle animation + pass/fail color
      el.className = 'die small font-spectral settled ' + (result.success ? 'pass' : 'fail');
      // After settle animation, reveal outcome + Continue button
      setTimeout(() => {
        revealDiceOutcome(fullDiceResult);
      }, 500);
    }
  }, 60);
}

function revealDiceOutcome(diceResult) {
  const result = diceResult.result;
  const outcomeEl = document.getElementById('event-dice-outcome');
  if (outcomeEl) {
    // Roll line
    const rollHtml = `<span class="outcome-roll">Rolled ${result.roll} vs DC ${result.dc}</span>`;
    const resultHtml = result.success
      ? '<span class="outcome-pass">Success</span>'
      : '<span class="outcome-fail">Failure</span>';

    // Flavor text: strip "Success. " / "Failure. " prefix from result.text
    let flavorText = result.text || '';
    flavorText = flavorText.replace(/^(Success|Failure)\.\s*/, '');
    const flavorClass = result.success ? 'success' : 'fail';
    const flavorHtml = flavorText
      ? `<p class="outcome-flavor ${flavorClass}">${flavorText}</p>`
      : '';

    // Compact mechanical summary (stat changes only)
    const mechMsgs = [];
    const after = window._metisGame.getState();
    const before = diceResult.before;
    if (after.food !== before.food) mechMsgs.push(`${after.food - before.food >= 0 ? '+' : ''}${after.food - before.food} Food`);
    if (after.wear !== before.wear) mechMsgs.push(`Wear ${after.wear - before.wear >= 0 ? '+' : ''}${after.wear - before.wear}`);
    if (after.morale !== before.morale) mechMsgs.push(`Morale ${after.morale - before.morale >= 0 ? '+' : ''}${after.morale - before.morale}`);
    if (after.crew !== before.crew) mechMsgs.push(`Crew: ${before.crew} → ${after.crew}`);
    const mechHtml = mechMsgs.length
      ? `<div class="outcome-mechanical">${mechMsgs.join(' · ')}</div>`
      : '';

    outcomeEl.innerHTML = `${rollHtml} — ${resultHtml}${flavorHtml}${mechHtml}`;
    outcomeEl.classList.add('visible');
  }
  // Show Continue button with glow
  const continueEl = document.getElementById('event-continue');
  if (continueEl) {
    continueEl.style.display = 'inline-block';
    continueEl.classList.add('ready');
  }
}

function showEvent(game) {
  const ev = game.getPendingEvent();
  if (!ev) return;
  const textEl = document.getElementById('event-text');
  const choicesEl = document.getElementById('event-choices');
  const continueEl = document.getElementById('event-continue');
  if (!textEl || !choicesEl) return;

  textEl.textContent = ev.text;

  const sourceEl = document.getElementById('event-source');
  if (sourceEl) {
    if (ev.source && ev.source.quote) {
      const quote = ev.source.quote;
      const author = ev.source.author || '';
      const work = ev.source.work || '';
      const year = ev.source.year || '';
      const attrib = [author, work, year].filter(Boolean).join(', ');
      sourceEl.innerHTML = `<span class="src-quote">"${quote}"</span>` + (attrib ? `<span class="src-attrib">— ${attrib}</span>` : '');
      sourceEl.style.display = 'block';
    } else {
      sourceEl.style.display = 'none';
    }
  }

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
  continueEl.classList.remove('ready');

  // Hide dice display and outcome from previous roll
  const rc = document.getElementById('event-roll-display');
  if (rc) rc.style.display = 'none';
  const outcomeEl = document.getElementById('event-dice-outcome');
  if (outcomeEl) {
    outcomeEl.textContent = '';
    outcomeEl.classList.remove('visible');
  }

  // Track whether this event has a pending dice roll
  let diceResult = null;

  // Continue button handler — shared by dice and non-dice paths
  continueEl.onclick = () => {
    continueEl.classList.remove('ready');
    // If there was a dice result, publish it now
    if (diceResult) {
      const outcome = buildEventChoiceOutcome(diceResult.stepLog, diceResult.before, game.getState());
      if (outcome) publishResult(outcome);
      diceResult = null;
    }
    // Close overlay and re-render
    continueEl.style.display = 'none';
    const overlay = document.getElementById('event-overlay');
    if (overlay) overlay.classList.remove('active');
    window.__METIS_RENDER__();
  };

  (ev.choices || []).forEach((ch, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = ch.text;
    btn.onclick = () => {
      const prev = game.getState();
      const stepLog = game.chooseEventChoice(i);
      const entry = stepLog && stepLog[0] ? stepLog[0] : null;
      const res = entry && entry.result ? entry.result : entry;

      // Hide all choice buttons immediately
      document.querySelectorAll('.choice-btn').forEach(b => { b.style.display = 'none'; });

      if (res && res.roll !== null && res.dc !== null) {
        // Dice roll path: animate, then wait for user to click Continue
        diceResult = { stepLog, before: prev, result: res };
        renderDicePill(res);
        animateDicePill(res, diceResult);
        return;
      }
      // Non-dice path: show flavor text + outcome, wait for user to click Continue
      const flavorText = res && res.text ? res.text.replace(/^(Success|Failure)\.\s*/, '') : '';
      const oc = document.getElementById('event-dice-outcome');
      if (oc) {
        let html = '';
        if (flavorText) {
          html += `<p class="outcome-flavor neutral">${flavorText}</p>`;
        }
        // Compact mechanical summary
        const afterState = game.getState();
        const mechMsgs = [];
        if (afterState.food !== prev.food) mechMsgs.push(`${afterState.food - prev.food >= 0 ? '+' : ''}${afterState.food - prev.food} Food`);
        if (afterState.wear !== prev.wear) mechMsgs.push(`Wear ${afterState.wear - prev.wear >= 0 ? '+' : ''}${afterState.wear - prev.wear}`);
        if (afterState.morale !== prev.morale) mechMsgs.push(`Morale ${afterState.morale - prev.morale >= 0 ? '+' : ''}${afterState.morale - prev.morale}`);
        if (afterState.crew !== prev.crew) mechMsgs.push(`Crew: ${prev.crew} → ${afterState.crew}`);
        if (mechMsgs.length) {
          html += `<div class="outcome-mechanical">${mechMsgs.join(' · ')}</div>`;
        }
        oc.innerHTML = html;
        oc.classList.add('visible');
      }
      continueEl.style.display = 'inline-block';
      continueEl.classList.add('ready');
    };
    choicesEl.appendChild(btn);
  });

  // For events with no choices, show Continue immediately
  if (!ev.choices || ev.choices.length === 0) {
    continueEl.style.display = 'inline-block';
    continueEl.classList.add('ready');
  }

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
    // Special handling for craft: show recipe panel instead of a simple button
    if (action === 'craft') {
      const recipes = game.getAvailableRecipes();
      if (recipes.length === 0) {
        // Show disabled craft button with "no recipes available" sub
        const wrap = document.createElement('div');
        wrap.className = 'settlement-action';
        const btn = document.createElement('button');
        btn.className = 'ctrl-btn';
        btn.style.display = 'flex';
        btn.style.flexDirection = 'column';
        btn.style.alignItems = 'flex-start';
        btn.style.gap = '2px';
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        const label = document.createElement('div');
        label.className = 'settlement-action-label';
        label.textContent = 'Craft';
        const sub = document.createElement('div');
        sub.className = 'settlement-action-sub';
        sub.textContent = 'No recipes available.';
        btn.appendChild(label);
        btn.appendChild(sub);
        actionsEl.appendChild(btn);
        return;
      }
      // Show recipe panel
      const recipePanel = document.createElement('div');
      recipePanel.style.cssText = 'width:100%;margin-top:8px;padding:10px;background:rgba(46,90,62,0.08);border:1px solid rgba(46,90,62,0.3);border-radius:6px;';
      const panelTitle = document.createElement('div');
      panelTitle.style.cssText = 'font-family:var(--font-heading);font-size:12px;font-weight:600;color:var(--clr-accent);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;';
      panelTitle.textContent = 'Crafting';
      recipePanel.appendChild(panelTitle);
      recipes.forEach((r) => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;padding:6px;background:rgba(255,255,255,0.5);border-radius:4px;';
        const inputs = r.inputs.map((inp) => `${inp.name} ×${inp.count} (${inp.have}/${inp.count})`).join(' + ');
        const info = document.createElement('div');
        info.style.cssText = 'flex:1;font-size:12px;';
        info.innerHTML = `<strong>${r.output.icon || ''} ${r.name}</strong> — ${inputs} → <span style="color:var(--clr-accent);">${r.output.mbValue} MB</span>`;
        const craftBtn = document.createElement('button');
        craftBtn.className = 'ctrl-btn';
        craftBtn.style.cssText = 'padding:3px 10px;font-size:11px;white-space:nowrap;';
        craftBtn.textContent = 'Craft';
        craftBtn.disabled = !r.inputs.every((inp) => inp.have >= inp.count);
        if (craftBtn.disabled) craftBtn.style.opacity = '0.4';
        craftBtn.onclick = () => {
          hideOverlays();
          game.craftRecipe(r.id);
          publishResult(`Crafted ${r.name}.`);
          window.__METIS_RENDER__();
        };
        row.appendChild(info);
        row.appendChild(craftBtn);
        recipePanel.appendChild(row);
      });
      actionsEl.appendChild(recipePanel);
      return;
    }

    // Special handling for trade: show yield estimate per trade good
    if (action === 'trade') {
      const cart = game.getCart();
      const tradeItems = cart.filter((i) => i.type === 'trade' && i.count > 0);
      if (tradeItems.length === 0) {
        const wrap = document.createElement('div');
        wrap.className = 'settlement-action';
        const btn = document.createElement('button');
        btn.className = 'ctrl-btn';
        btn.style.cssText = 'display:flex;flex-direction:column;align-items:flex-start;gap:2px;opacity:0.5;cursor:not-allowed;';
        const label = document.createElement('div');
        label.className = 'settlement-action-label';
        label.textContent = 'Trade';
        const sub = document.createElement('div');
        sub.className = 'settlement-action-sub';
        sub.textContent = 'No trade goods.';
        btn.appendChild(label);
        btn.appendChild(sub);
        actionsEl.appendChild(btn);
        return;
      }
      // Show trade panel with per-item yield estimates
      const tradePanel = document.createElement('div');
      tradePanel.style.cssText = 'width:100%;margin-top:8px;padding:10px;background:rgba(46,90,62,0.08);border:1px solid rgba(46,90,62,0.3);border-radius:6px;';
      const panelTitle = document.createElement('div');
      panelTitle.style.cssText = 'font-family:var(--font-heading);font-size:12px;font-weight:600;color:var(--clr-accent);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;';
      panelTitle.textContent = 'Trade';
      tradePanel.appendChild(panelTitle);
      tradeItems.forEach((item) => {
        const est = game.getTradeEstimate(item.name);
        const multStr = est && est.mult > 1 ? ' ↑' : est && est.mult < 1 ? ' ↓' : '';
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;padding:6px;background:rgba(255,255,255,0.5);border-radius:4px;';
        const info = document.createElement('div');
        info.style.cssText = 'flex:1;font-size:12px;';
        info.innerHTML = `${item.icon || ''} ${item.name} ×${item.count} <span style="color:var(--clr-accent);">${est ? est.min + '-' + est.max + ' food' : ''}${multStr}</span>`;
        const tradeBtn = document.createElement('button');
        tradeBtn.className = 'ctrl-btn';
        tradeBtn.style.cssText = 'padding:3px 10px;font-size:11px;white-space:nowrap;';
        tradeBtn.textContent = 'Trade';
        tradeBtn.onclick = () => {
          hideOverlays();
          const result = game.tradeItem(item.name);
          if (result) {
            publishResult(`Traded 1 ${result.item} → +${result.foodGain} food.`);
          } else {
            publishResult('Trade failed — no trade goods available.');
          }
          window.__METIS_RENDER__();
        };
        row.appendChild(info);
        row.appendChild(tradeBtn);
        tradePanel.appendChild(row);
      });
      actionsEl.appendChild(tradePanel);
      return;
    }

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
      window.__METIS_RENDER__();
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
  if (action === 'gossip') {
    const intel = after.trailIntel && after.trailIntel.length > 0 ? after.trailIntel[after.trailIntel.length - 1] : null;
    if (intel && intel.text) {
      msgs.push(`You spend a day gossiping. "${intel.text}"`);
    } else {
      msgs.push('You spend a day gossiping. The locals share what they know.');
    }
  }
  if (action === 'rest') msgs.push('Rest. Crew and supplies refreshed.');
  if (action === 'craft') msgs.push('Item crafted.');
  if (!msgs.length) return 'Nothing changed.';
  return msgs.join(', ');
}

function showCart(game) {
  const state = game.getState();
  const cart = game.getCart();
  const listEl = document.getElementById('inv-list');
  if (!listEl) return;

  const overloaded = state.usedWeight > state.capacity;
  const excess = state.usedWeight - state.capacity;

  // Weight summary header
  const weightBar = overloaded
    ? `<div style="margin-bottom:10px;padding:8px;background:rgba(180,60,60,0.15);border:1px solid rgba(180,60,60,0.4);border-radius:4px;">
        <div style="font-weight:700;color:#8B0000;">⚠ Overloaded — ${state.usedWeight} / ${state.capacity} kg</div>
        <div style="font-size:0.9em;color:#8B0000;margin-top:2px;">Offload at least <strong>${excess} kg</strong> before traveling.</div>
       </div>`
    : `<div style="margin-bottom:10px;padding:8px;background:rgba(46,90,62,0.12);border:1px solid rgba(46,90,62,0.3);border-radius:4px;">
        <div style="font-weight:700;color:#2D4A3E;">Cart — ${state.usedWeight} / ${state.capacity} kg</div>
       </div>`;

  // Item list — only show unload buttons when overloaded, and only on items with count > 0
  const items = cart
    .map((i) => {
      const canUnload = overloaded && i.count > 0;
      const mbDisplay = i.mbValue ? `<span style="font-size:0.75em;color:var(--clr-accent);margin-left:4px;">${i.mbValue} MB</span>` : '';
      return `
    <div class="cart-row" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.08);">
      <span style="flex:1;">${i.icon || ''} ${i.name} ×${i.count} (${i.wt * i.count} kg)${mbDisplay}</span>
      ${canUnload ? `<button class="ctrl-btn unload-btn" data-item="${i.name}" style="padding:2px 10px;font-size:0.85em;">Unload −${i.wt} kg</button>` : ''}
    </div>`;
    })
    .join('');

  listEl.innerHTML = weightBar + items;

  listEl.querySelectorAll('.unload-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const itemName = btn.dataset.item;
      game.offloadItem(itemName);
      // Refresh cart; if no longer overloaded, close overlay and re-render
      const newState = game.getState();
      if (newState.usedWeight <= newState.capacity) {
        document.getElementById('cart-overlay')?.classList.remove('active');
        window.__METIS_RENDER__();
      } else {
        showCart(game);
      }
    });
  });

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
  const map = { rest: 'Rest', trade: 'Trade', repair: 'Repair', forage: 'Forage', recruit: 'Recruit', rumours: 'Rumours', gossip: 'Gossip', heal: 'Heal', craft: 'Craft', continue: 'Continue West' };
  return map[a] || a;
}
function actionSubtitle(a) {
  const map = {
    rest: 'Crew rested, morale restored, supplies refresh.',
    trade: 'Spend one trade good for food. Yield varies by item and settlement.',
    repair: 'Reduce wheel wear, or apply shaganappi if carried.',
    forage: 'D20 + crew modifier; 12+ gains 1-4 food.',
    recruit: 'Rests tired crew if not exhausted.',
    rumours: 'Advance one day. Hear scattered news — less reliable than proper gossip.',
    gossip: 'Spend a day learning trail news and local gossip. Costs 1 day.',
    heal: 'Crew rested, morale restored.',
    craft: 'Combine items into higher-value trade goods.',
    continue: 'Resume the journey.',
  };
  return map[a] || '';
}

// Expose render globally for event listener callbacks
window.__METIS_RENDER__ = render;
