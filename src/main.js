import { createGame } from './systems/engine.js';
import { mount, find } from './ui/shell.js';
import { renderStatusBar, renderNarrative, initMap, updateMap, renderTravelLinesView } from './ui/renderer.js';
import { saveGame, loadGame, clearSave } from './ui/persistence.js';
import { NODES } from './data/nodes.js';
import { ENDINGS } from './data/endings.js';
import { CONSTANTS } from './core/constants.js';

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

  const state = game.getState();

  // Always show intro first — pre-departure activates after "Begin Journey" click
  renderNarrative(['Welcome to the Métis Trail. Click Begin Journey to start.']);
  document.getElementById('intro-overlay')?.classList.add('active');
  document.getElementById('predeparture-overlay')?.classList.remove('active');

  // Always init the map so it's ready behind the intro overlay
  initMap();

  // Event delegation on #game-root survives DOM rebuilds from render()
  const gameRoot = find('#game-root');
  if (gameRoot) {
    gameRoot.addEventListener('click', (e) => {
      if (e.target.closest('#intro-start')) {
        const introOverlay = find('#intro-overlay');
        if (introOverlay) {
          introOverlay.classList.remove('active');
          introOverlay.setAttribute('hidden', '');
        }
        // If pre-departure is enabled, show it now
        const currentState = game.getState();
        if (currentState.preDeparture) {
          showPreDeparture(game);
        } else {
          window.__METIS_RENDER__();
        }
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

  const campClose = find('#camp-close-btn');
  const campContinue = find('#camp-continue');
  if (campClose) campClose.onclick = () => find('#camp-overlay')?.classList.remove('active');
  if (campContinue) campContinue.onclick = () => find('#camp-overlay')?.classList.remove('active');

  const campBtn = find('#btn-camp');
  if (campBtn) campBtn.onclick = () => showCamp(game);

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

  const msg = buildTravelNarrative(prev, state, game);
  publishResult(msg);
  return result;
}

const TRAVEL_FRAGMENTS = {
  plains: {
    rested: [
      'The prairie stretches flat and endless. The ox leans into the traces, steady as the sunrise.',
      'A warm wind pushes at your back. The grass ripples like a green sea beneath the sky.',
      'The cart rolls smooth over open ground. Hawks circle high above, riding thermals.',
      'Miles of unbroken prairie. The ox knows the rhythm — step, pull, breathe, repeat.',
    ],
    tired: [
      'The ox slows. Each rut in the trail costs more energy than the last.',
      'The crew is quiet. The prairie offers no shade, no shelter, only distance.',
      'Dust rises with every step. The oxen\'s breath comes harder now.',
      'The sun beats down. The crew trudges forward, eyes on the horizon.',
    ],
    exhausted: [
      'The ox stumbles. The crew pushes from behind, hands on the cart bed, driving forward.',
      'Every mile is a fight. The oxen strain, the cart groans, the crew is spent.',
      'The prairie offers no mercy. The exhausted crew leans into the work, step by step.',
      'The cart barely moves. The oxen are done, but the trail does not care.',
    ],
  },
  river_valley: {
    rested: [
      'The river valley opens below — green banks, cool water, the sound of current over stone.',
      'Cottonwoods line the river. The air is cooler here, and the oxen drink deep.',
      'The trail follows the river bend. Birdsong rises from the willows.',
      'Water and shade. The crew rests in the valley while the oxen graze.',
    ],
    tired: [
      'The river trail is muddy. The cart wheels sink and the oxen pull harder.',
      'The bank is steep. The crew guides the cart down carefully, one slow foot at a time.',
      'The river crossing looms. The current is strong and the oxen are already weary.',
      'Mud and river stones. The tired crew picks their way along the bank.',
    ],
    exhausted: [
      'The river crossing is brutal. The oxen struggle in the current, the crew wades waist-deep.',
      'The cart tilts on the river stones. The exhausted crew pushes from the water.',
      'The ford takes everything. The oxen are spent, the crew is soaked, but the cart makes it across.',
      'The river does not wait. The exhausted crew drives through, one step at a time.',
    ],
  },
  wooded: {
    rested: [
      'The trail winds through poplar and spruce. Shade dapples the cart path.',
      'The woods are alive with birdsong. The oxen walk easy beneath the canopy.',
      'A cool breeze moves through the trees. The cart passes under green arches.',
      'The wooded corridor is peaceful. Pine needles soften the trail.',
    ],
    tired: [
      'The trail narrows between the trees. Branches scrape the canvas cover.',
      'Roots and ruts. The tired crew navigates the rough ground carefully.',
      'The woods close in. The oxen pick their way through the undergrowth.',
      'A fallen tree blocks the path. The tired crew cuts a way around.',
    ],
    exhausted: [
      'The cart catches on a stump. The exhausted crew frees it with brute force.',
      'The trail through the woods is punishing. Every root, every branch, every rut.',
      'The oxen can barely pull. The exhausted crew pushes from behind in the dark woods.',
      'The woods offer no rest. The exhausted crew drives forward through the trees.',
    ],
  },
  uplands: {
    rested: [
      'The ridge offers a view for miles. The prairie falls away on all sides.',
      'The wind on the ridge is fresh. The oxen walk strong on the high ground.',
      'The uplands stretch wide. The cart rolls easy on the firm, dry ground.',
      'From the ridge, the trail ahead is visible for days. The crew feels the distance shrink.',
    ],
    tired: [
      'The climb is steep. The oxen strain uphill, the crew pushes from behind.',
      'The wind cuts across the ridge. The tired crew huddles against the cart.',
      'The uplands are exposed. No shelter, no shade, just wind and distance.',
      'The trail climbs. The tired oxen take each step slowly, deliberately.',
    ],
    exhausted: [
      'The ridge is merciless. The exhausted crew drags the cart over the crest.',
      'The wind knocks them back. The oxen are done, but the ridge demands more.',
      'The high ground offers no mercy. The exhausted crew pushes through the wind.',
      'The cart barely crests the hill. The crew collapses on the far side.',
    ],
  },
};

function buildTravelNarrative(prev, state, game) {
  const node = game.getCurrentNode();
  const terrain = node?.terrain || 'plains';
  const crew = state.crew;

  // Arrival at new node
  if (state.node > prev.node) {
    const next = game.getNextNode();
    const arrival = next
      ? `You arrive at ${node.name}. Ahead: ${next.name}.`
      : `You arrive at ${node.name}.`;
    return arrival;
  }

  // Journey ends
  if (state.node === prev.node && state.over) {
    return 'The journey ends here.';
  }

  // Pick atmospheric fragment
  const terrainFragments = TRAVEL_FRAGMENTS[terrain] || TRAVEL_FRAGMENTS.plains;
  const crewFragments = terrainFragments[crew] || terrainFragments.rested;
  const fragment = crewFragments[Math.floor(Math.random() * crewFragments.length)];

  // Append mechanical summary only for significant changes
  const mech = [];
  if (state.wear > prev.wear) mech.push('Cart wear increases.');
  if (state.crew !== prev.crew) mech.push(`Crew is ${state.crew}.`);

  return mech.length > 0 ? `${fragment} ${mech.join(' ')}` : fragment;
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
  if (state.preDeparture) {
    showPreDeparture(game);
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
      // After settle animation ends, reveal outcome + Continue button
      let revealed = false;
      const doReveal = () => {
        if (revealed) return;
        revealed = true;
        el.removeEventListener('animationend', doReveal);
        revealDiceOutcome(fullDiceResult);
      };
      el.addEventListener('animationend', doReveal);
      // Fallback: if animationend doesn't fire (e.g. no CSS), show after 500ms
      setTimeout(doReveal, 500);
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
    const costParts = [];
    if (typeof ch.dc === 'number') costParts.push(`DC ${ch.dc}`);
    if (typeof ch.food === 'number' && ch.food < 0) costParts.push(`${ch.food} food`);
    if (typeof ch.wear === 'number' && ch.wear > 0) costParts.push(`+${ch.wear} wear`);
    if (typeof ch.morale === 'number' && ch.morale < 0) costParts.push(`${ch.morale} morale`);
    if (typeof ch.time === 'number' && ch.time > 0) costParts.push(`+${ch.time} day`);
    if (ch.requiresItem) costParts.push(`requires ${ch.requiresItem.name}×${ch.requiresItem.count}`);
    const costText = costParts.join(' · ');
    if (costText) {
      const sub = document.createElement('div');
      sub.className = 'choice-cost';
      sub.textContent = costText;
      btn.appendChild(sub);
    }
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

  // Crafting discoverability hint (#33)
  const recipes = game.getAvailableRecipes();
  let craftHintEl = document.getElementById('settlement-craft-hint');
  if (!craftHintEl) {
    craftHintEl = document.createElement('div');
    craftHintEl.id = 'settlement-craft-hint';
    craftHintEl.className = 'settlement-craft-hint';
    descEl.parentNode.insertBefore(craftHintEl, descEl.nextSibling);
  }
  if (recipes.length > 0) {
    const summary = recipes.length === 1
      ? `⚗️ Crafting: ${recipes[0].name} — ${recipes[0].inputs.map(i => `${i.count}×${i.name}`).join(' + ')}`
      : `⚗️ Crafting available (${recipes.length} recipe${recipes.length > 1 ? 's' : ''})`;
    craftHintEl.textContent = summary;
    craftHintEl.style.display = 'block';
  } else {
    craftHintEl.style.display = 'none';
  }

  const available = game.getAvailableActions();
  const primaryActions = [];
  const secondaryActions = [];
  (available.actions || []).forEach((action) => {
    if (['craft'].includes(action)) secondaryActions.push(action);
    else primaryActions.push(action);
  });

  // Render primary actions (always visible)
  primaryActions.forEach((action) => {
    renderSettlementAction(actionsEl, action, game, before, beforeCart);
  });

  // Render secondary actions behind collapsible toggle
  if (secondaryActions.length > 0) {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'settlement-more-toggle';
    toggleBtn.textContent = 'More actions ▶';

    const secondaryEl = document.createElement('div');
    secondaryEl.className = 'settlement-secondary-actions';

    toggleBtn.addEventListener('click', () => {
      const isExpanded = secondaryEl.classList.toggle('expanded');
      toggleBtn.textContent = isExpanded ? 'Less ▲' : 'More actions ▶';
    });

    secondaryActions.forEach((action) => {
      renderSettlementAction(secondaryEl, action, game, before, beforeCart);
    });

    actionsEl.appendChild(toggleBtn);
    actionsEl.appendChild(secondaryEl);
  }

  document.getElementById('settlement-overlay')?.classList.add('active');
}

function renderSettlementAction(container, action, game, before, beforeCart) {
  // Special handling for craft: show recipe panel instead of a simple button
  if (action === 'craft') {
    const recipes = game.getAvailableRecipes();
    if (recipes.length === 0) {
      const btn = document.createElement('button');
      btn.className = 'ctrl-btn settlement-action-btn secondary-action';
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
      btn.textContent = 'Craft — No recipes available';
      container.appendChild(btn);
      return;
    }
    const recipePanel = document.createElement('div');
    recipePanel.style.cssText = 'width:100%;margin-top:8px;padding:10px;background:rgba(46,90,62,0.08);border:1px solid rgba(46,90,62,0.3);border-radius:6px;';
    const panelTitle = document.createElement('div');
    panelTitle.style.cssText = 'font-family:var(--font-heading);font-size:12px;font-weight:600;color:var(--clr-accent);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;';
    panelTitle.textContent = 'Crafting';
    recipePanel.appendChild(panelTitle);
    recipes.forEach((r) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;padding:6px;background:rgba(255,255,255,0.5);border-radius:4px;';
      const inputs = r.inputs.map((inp) => `${inp.name}×${inp.count} (${inp.have}/${inp.count})`).join(' + ');
      const info = document.createElement('div');
      info.style.cssText = 'flex:1;font-size:12px;';
      info.innerHTML = `<strong>${r.output.icon || ''} ${r.name}</strong> — ${inputs}`;
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
    container.appendChild(recipePanel);
    return;
  }

  // Special handling for trade: show yield estimate per trade good
  if (action === 'trade') {
    const cart = game.getCart();
    const tradeItems = cart.filter((i) => i.type === 'trade' && i.count > 0);
    if (tradeItems.length === 0) {
      const btn = document.createElement('button');
      btn.className = 'ctrl-btn settlement-action-btn primary-action';
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
      btn.textContent = 'Trade — No trade goods';
      container.appendChild(btn);
      return;
    }
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
      tradeBtn.textContent = `Trade ${item.name}`;
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
    container.appendChild(tradePanel);
    return;
  }

  // Generic action button (rest, repair, heal)
  const btn = document.createElement('button');
  btn.className = 'ctrl-btn settlement-action-btn';
  if (['rest', 'repair', 'heal'].includes(action)) btn.classList.add('primary-action');
  else btn.classList.add('secondary-action');
  btn.textContent = actionLabel(action);
  btn.onclick = () => {
    hideOverlays();
    game.settlementAction(action);
    const after = game.getState();
    const afterCart = game.getCart();
    const outcome = buildSettlementOutcome(action, before, after, beforeCart, afterCart);
    if (outcome) publishResult(outcome);
    window.__METIS_RENDER__();
  };
  container.appendChild(btn);
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

  const weightBar = overloaded
    ? `<div style="margin-bottom:10px;padding:8px;background:rgba(180,60,60,0.15);border:1px solid rgba(180,60,60,0.4);border-radius:4px;"><div style="font-weight:700;color:#8B0000;">⚠ Overloaded — ${state.usedWeight} / ${state.capacity} kg</div><div style="font-size:0.9em;color:#8B0000;margin-top:2px;">Offload at least <strong>${excess} kg</strong> before traveling.</div></div>`
    : `<div style="margin-bottom:10px;padding:8px;background:rgba(46,90,62,0.12);border:1px solid rgba(46,90,62,0.3);border-radius:4px;"><div style="font-weight:700;color:#2D4A3E;">Cart — ${state.usedWeight} / ${state.capacity} kg</div></div>`;

  const items = cart
    .map((i) => {
      const canUnload = overloaded && i.count > 0;
      const hint = i.category ? getCategoryHint(i.category) : '';
      const desc = i.desc ? `<div style="font-size:0.8em;color:#5a4a3a;margin-top:2px;">${i.desc}</div>` : '';
      return `
    <div class="cart-row" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.08);">
      <span style="flex:1;"><span style="font-weight:600;">${i.icon || ''} ${i.name} ×${i.count} (${i.wt * i.count} kg)</span>${hint ? `<div style="font-size:0.75em;color:#6b5c4a;">${hint}</div>` : ''}${desc}</span>
      ${canUnload ? `<button class="ctrl-btn unload-btn" data-item="${i.name}" style="padding:2px 10px;font-size:0.85em;">Unload ${i.name} (−${i.wt} kg)</button>` : ''}
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

function getCategoryHint(category) {
  const map = {
    provisions: 'Restores food when needed.',
    repair: 'Reduces cart wear at settlements.',
    parts: 'Used for cart repair and crafting.',
    furs: 'Trade value: high at Edmonton.',
    shelter: 'Survival aid; shelters crew from weather.',
    fuel: 'Required for cold nights and some recipes.',
    hunting: 'Event bonuses and ammunition support.',
    medical: 'Restores crew condition when injured or ill.',
    tool: 'Enables repair and advanced crafting.',
    ammo: 'Hunting and defensive event bonuses.',
  };
  return map[category] || '';
}

function showPreDeparture(game) {
  const items = game.getPreDepartureItems();
  const state = game.getState();
  const listEl = document.getElementById('predeparture-list');
  const weightEl = document.getElementById('predeparture-weight');
  const currentEl = document.getElementById('pd-weight-current');
  const statusEl = document.getElementById('pd-weight-status');
  const confirmBtn = document.getElementById('pd-confirm');
  const autoBtn = document.getElementById('pd-auto');

  if (!listEl || !weightEl || !currentEl || !statusEl || !confirmBtn) return;

  // Auto-pack preset (balanced loadout ~92.5 kg)
  const autoPack = {
    'Pemmican Rations': 10,
    'Spare Axle': 1,
    'Shaganappi': 3,
    'Tool Kit': 1,
    'Bison Hide': 2,
    'Canvas Tarp': 1,
    'Firewood Bundle': 1,
    'Rope (50ft)': 1,
    'Ammunition Belt': 1,
    'Medicine Pouch': 1,
    'Blanket': 1,
    'Beaver Pelts': 1,
  };

  function recalc() {
    let total = 0;
    items.forEach(item => {
      total += item.wt * item.currentCount;
    });
    currentEl.textContent = total.toFixed(1);
    const diff = total - state.capacity;
    weightEl.classList.remove('over', 'at-capacity', 'under');
    statusEl.classList.remove('over', 'at-capacity', 'under');
    if (diff > 0) {
      weightEl.classList.add('over');
      statusEl.classList.add('over');
      statusEl.textContent = `${diff.toFixed(1)} kg over`;
      confirmBtn.disabled = true;
    } else if (diff === 0) {
      weightEl.classList.add('at-capacity');
      statusEl.classList.add('at-capacity');
      statusEl.textContent = 'At capacity';
      confirmBtn.disabled = false;
    } else {
      weightEl.classList.add('under');
      statusEl.classList.add('under');
      statusEl.textContent = `${Math.abs(diff).toFixed(1)} kg spare`;
      confirmBtn.disabled = false;
    }
  }

  function renderList() {
    listEl.innerHTML = items.map(item => {
      const hint = item.category ? getCategoryHint(item.category) : '';
      const itemWeight = (item.wt * item.currentCount).toFixed(1);
      return `
    <div class="pd-row" data-item="${item.name}">
      <div class="pd-item-info">
        <span class="pd-icon">${item.icon || ''}</span>
        <span class="pd-name">${item.name}</span>
        <span class="pd-category-hint">${hint}</span>
      </div>
      <div class="pd-controls">
        <button class="pd-minus" data-item="${item.name}" ${item.currentCount <= 0 ? 'disabled' : ''}>−</button>
        <span class="pd-count">${item.currentCount}</span>
        <button class="pd-plus" data-item="${item.name}" ${item.currentCount >= item.maxCount ? 'disabled' : ''}>+</button>
        <span class="pd-weight">${itemWeight} kg</span>
      </div>
    </div>`;
    }).join('');

    // Bind +/- buttons
    listEl.querySelectorAll('.pd-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.item;
        const item = items.find(i => i.name === name);
        if (item && item.currentCount > 0) {
          item.currentCount--;
          game.setPreDepartureCount(name, item.currentCount);
          recalc();
          renderList();
        }
      });
    });
    listEl.querySelectorAll('.pd-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.item;
        const item = items.find(i => i.name === name);
        if (item && item.currentCount < item.maxCount) {
          item.currentCount++;
          game.setPreDepartureCount(name, item.currentCount);
          recalc();
          renderList();
        }
      });
    });
  }

  confirmBtn.onclick = () => {
    game.confirmPreDeparture();
    document.getElementById('predeparture-overlay')?.classList.remove('active');
    window.__METIS_RENDER__();
  };

  autoBtn.onclick = () => {
    Object.entries(autoPack).forEach(([name, count]) => {
      const item = items.find(i => i.name === name);
      if (item) {
        item.currentCount = count;
        game.setPreDepartureCount(name, count);
      }
    });
    recalc();
    renderList();
  };

  // Initial render
  recalc();
  renderList();
  document.getElementById('predeparture-overlay')?.classList.add('active');
}

function showCrew(game) {
  const c = game.getCrew();
  const el = document.getElementById('crew-status');
  if (!el) return;
  el.innerHTML = `<div>State: ${c.state}</div><div>Morale: ${c.morale}</div><div>Modifier: ${c.mod}</div>`;
  document.getElementById('crew-overlay')?.classList.add('active');
}

function showCamp(game) {
  const state = game.getState();
  if (state.over || state.pendingEvent || state.pendingSettlement) return;
  const foodEl = document.getElementById('camp-food');
  const wearEl = document.getElementById('camp-wear');
  const moraleEl = document.getElementById('camp-morale');
  const crewEl = document.getElementById('camp-crew');
  const subEl = document.getElementById('camp-sub');
  const resultEl = document.getElementById('camp-result');
  const actionsEl = document.getElementById('camp-actions');

  if (foodEl) foodEl.textContent = Math.floor(state.food);
  if (wearEl) wearEl.textContent = state.wear;
  if (moraleEl) moraleEl.textContent = state.morale;
  if (crewEl) crewEl.textContent = state.crew;
  if (subEl) subEl.textContent = `Day ${state.day} — ${state.season}`;
  if (resultEl) { resultEl.style.display = 'none'; resultEl.textContent = ''; }

  const actions = [
    { type: 'rest', label: 'Rest', cost: '1 food' },
    { type: 'forage', label: 'Forage', cost: '1 day' },
    { type: 'hunt', label: 'Hunt', cost: '1 ammo · 1 day' },
    { type: 'repair', label: 'Repair', cost: '1 shaganappi' },
    { type: 'scout', label: 'Scout', cost: '1 day' },
    { type: 'dance', label: 'Dance', cost: 'free' },
    { type: 'deeprest', label: 'Deep Rest', cost: '2 food · 2 days' },
  ];

  if (actionsEl) {
    actionsEl.innerHTML = '';
    actionsEl.style.display = 'grid';
    actionsEl.style.visibility = 'visible';
    const groups = [
      { label: 'Recovery', types: new Set(['rest', 'deeprest']) },
      { label: 'Trail work', types: new Set(['forage', 'hunt', 'scout']) },
      { label: 'Upkeep', types: new Set(['repair', 'dance']) },
    ];
    const groupMap = new Map();
    actions.forEach((a) => {
      const entry = groups.find((g) => g.types.has(a.type));
      if (!entry) return;
      if (!groupMap.has(entry.label)) groupMap.set(entry.label, []);
      groupMap.get(entry.label).push(a);
    });

    groupMap.forEach((list, label) => {
      const header = document.createElement('div');
      header.className = 'camp-group';
      header.textContent = label;
      actionsEl.appendChild(header);
      list.forEach((a) => {
        const btn = document.createElement('button');
        btn.className = 'camp-action-btn';
        btn.innerHTML = `<div class="camp-action-label">${a.label}</div><div class="camp-action-cost">${a.cost}</div>`;
        btn.addEventListener('click', () => {
          const result = game.campAction(a.type);
          const errEl = document.getElementById('camp-result');
          if (!result) {
            if (errEl) { errEl.style.display = 'block'; errEl.textContent = 'No result.'; }
            return;
          }
          if (result.error) {
            if (errEl) { errEl.style.display = 'block'; errEl.textContent = result.error; }
            return;
          }
          const after = game.getState();
          if (foodEl) foodEl.textContent = after.food;
          if (wearEl) wearEl.textContent = after.wear;
          if (moraleEl) moraleEl.textContent = after.morale;
          if (crewEl) crewEl.textContent = after.crew;
          if (subEl) subEl.textContent = `Day ${after.day} — ${after.season}`;
          if (errEl) {
            errEl.style.display = 'block';
            errEl.textContent = (result?.effects || []).join('\n');
          }
          const continueEl = document.getElementById('camp-continue');
          if (continueEl) continueEl.style.display = 'inline-block';
          actionsEl.style.display = 'none';
        });
        actionsEl.appendChild(btn);
        btn.setAttribute('data-camp-type', a.type);
        if (a.type === 'deeprest' || a.type === 'scout') btn.classList.add('costs-days');
      });
    });
  }

  document.getElementById('camp-overlay')?.classList.add('active');
}

function showEnd(game) {
  const state = game.getState();
  const cart = game.getCart();
  const titleEl = document.getElementById('end-title');
  const narrativeEl = document.getElementById('end-narrative');
  const statsEl = document.getElementById('end-stats');
  const sourceEl = document.getElementById('end-source');
  if (!titleEl || !narrativeEl || !statsEl) return;

  const ending = ENDINGS[state.endReason] || ENDINGS.no_trade;
  const isVictory = state.endReason === 'victory';
  const isHighScore = isVictory && state.score >= 1200;

  // Title
  titleEl.textContent = ending.title;

  // Narrative — pick high/low variant for victories
  let narrativeText;
  if (isVictory) {
    narrativeText = isHighScore ? ending.narrative.high : ending.narrative.humble;
  } else {
    // For defeats, pick based on how far they got
    const progress = state.getNode ? (state.node / 15) : 0;
    narrativeText = progress > 0.6 ? ending.narrative.high : ending.narrative.humble;
  }
  narrativeEl.textContent = narrativeText;

  // Source quote
  if (sourceEl) {
    const quoteData = isHighScore && ending.quoteHigh ? ending.quoteHigh : ending.quote;
    if (quoteData && quoteData.quote) {
      const author = quoteData.author || '';
      const work = quoteData.work || '';
      const year = quoteData.year || '';
      const attrib = [author, work, year].filter(Boolean).join(', ');
      sourceEl.innerHTML = `<span class="src-quote">"${quoteData.quote}"</span>` + (attrib ? `<span class="src-attrib">— ${attrib}</span>` : '');
      sourceEl.style.display = 'block';
    } else {
      sourceEl.style.display = 'none';
    }
  }

  // Detailed scoring breakdown
  const tradeUnits = cart.filter((i) => i.type === 'trade' && i.count > 0).reduce((s, i) => s + i.count, 0);
  const foodBonus = Math.min(state.food, 25);
  const crewBonus = state.crew === 'rested' ? 30 : state.crew === 'tired' ? 10 : 0;
  const daysPenalty = state.day * 8;
  const wearPenalty = state.wear * state.wear * 40;

  const scoreLines = [
    { label: 'Base score', value: 1000 },
    { label: `Trade goods (${tradeUnits} × 120)`, value: tradeUnits * 120 },
    { label: `Food bonus (${foodBonus} × 12)`, value: foodBonus * 12 },
    { label: `Crew condition (${state.crew})`, value: crewBonus },
    { label: `Days on trail (${state.day} × -8)`, value: -daysPenalty },
    { label: `Cart wear (${state.wear}² × -40)`, value: -wearPenalty },
  ];

  const totalScore = scoreLines.reduce((s, l) => s + l.value, 0);

  const scoreHtml = scoreLines.map((l) => `
    <div class="stat-row">
      <span class="label">${l.label}</span>
      <span>${l.value >= 0 ? '+' : ''}${l.value}</span>
    </div>
  `).join('') + `
    <div class="stat-row score-row">
      <span class="label">Final Score</span>
      <span>${Math.max(0, totalScore)}</span>
    </div>
    ${!isVictory ? `<div class="stat-row" style="color:#8B2500;font-style:italic;margin-top:8px;">No trade goods delivered — score forfeit.</div>` : ''}
    <div style="margin-top:10px;padding:8px;background:rgba(184,134,11,0.08);border-left:2px solid #B8860B;font-size:11px;color:#5a4a3a;line-height:1.5;">
      ${ending.tip}
    </div>
  `;

  statsEl.innerHTML = scoreHtml;
  document.getElementById('end-overlay')?.classList.add('active');
}

function actionLabel(a) {
  const map = {
    rest: 'Rest · 1 day · +2 food · +25 morale',
    trade: 'Trade',
    repair: 'Repair · −2 wear',
    heal: 'Heal · +20 morale',
    craft: 'Craft',
  };
  return map[a] || a;
}
function actionSubtitle(a) {
  return '';
}

// Expose render globally for event listener callbacks
window.__METIS_RENDER__ = render;
