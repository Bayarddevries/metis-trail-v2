import { createGame } from './systems/engine.js';
import { mount, find } from './ui/shell.js';
import { renderStatusBar, journalLog, initMap, updateMap, monthName } from './ui/renderer.js';
import { clearSave } from './ui/persistence.js';
import { mountDebugUI } from './ui/debug.js';
import { applyTheme } from './ui/theme.js';
import { NODES } from './data/nodes.js';
import Haptics from './ui/haptics.js';
import { getItemIcon } from './ui/icons.js';
import {
  buildTravelReflection,
  buildEventAutoEntry, buildEventReflection, buildCampEntry,
  buildSettlementArrivalEntry, buildSettlementJourneyEntry, buildSettlementActionEntry, buildSettlementReflection,
} from './ui/journalNarrative.js';
import { ENDINGS } from './data/endings.js';

// Sync any locally-saved scores on page load

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

  // Journal click handler — toggle collapsed/expanded on header click
  var journal = document.getElementById('journal');
  if (journal) {
    journal.addEventListener('click', (e) => {
      var header = e.target.closest('.journal-header');
      if (header) {
        var entry = header.closest('.journal-entry');
        if (entry) entry.classList.toggle('collapsed');
      }
    });
  }

  // Apply theme CSS custom properties
  applyTheme(rootEl);

  const state = game.getState();

  // Always show intro first — pre-departure activates after "Begin Journey" click
  document.getElementById('intro-overlay')?.classList.add('active');
  document.getElementById('predeparture-overlay')?.classList.remove('active');

  // Always init the map so it's ready behind the intro overlay
  initMap();

  // Mount debug panel when ?debug=1
  mountDebugUI(game);

  // Pre-fill name input from localStorage
  const nameInput = find('#intro-name-input');
  if (nameInput) {
    const savedName = localStorage.getItem('metisPlayerName');
    if (savedName) nameInput.value = savedName;
  }

  // Track visited settlements for arrival vs journey entries
  const visitedSettlements = new Set();

  // ── Stat-tap overlays ──────────────────────────────────────────
  document.getElementById('stat-food')?.addEventListener('click', () => {
    if (window._metisGame) showCart(window._metisGame);
  });
  document.getElementById('stat-crew')?.addEventListener('click', () => {
    if (window._metisGame) showCrew(window._metisGame);
  });

  // ── Settings menu ──────────────────────────────────────────────
  document.getElementById('settings-btn')?.addEventListener('click', () => {
    document.getElementById('settings-overlay')?.classList.add('active');
  });
  document.getElementById('settings-close')?.addEventListener('click', () => {
    document.getElementById('settings-overlay')?.classList.remove('active');
  });
  document.getElementById('settings-new-game')?.addEventListener('click', () => {
    clearSave();
    window.location.reload();
  });

  // ── Overlay exclusivity ────────────────────────────────────────
  // When any overlay opens, close others
  const overlayIds = ['event-overlay', 'settlement-overlay', 'cart-overlay', 'crew-overlay', 'camp-overlay', 'predeparture-overlay', 'settings-overlay'];
  function closeAllOverlays() {
    overlayIds.forEach(id => document.getElementById(id)?.classList.remove('active'));
  }

  // ── Save-game version migration ────────────────────────────────
  const SAVE_VERSION = 2;
  const savedRaw = localStorage.getItem('metis-trail-v2.save');
  if (savedRaw) {
    try {
      const parsed = JSON.parse(savedRaw);
      const saveVer = parsed.schemaVersion || parsed.data?.schemaVersion || 0;
      if (saveVer < SAVE_VERSION) {
        localStorage.removeItem('metis-trail-v2.save');
        console.info(`[Metis] Cleared incompatible save (v${saveVer} < v${SAVE_VERSION})`);
      }
    } catch(e) { /* ignore corrupt saves */ }
  }

  // Don't call render() here — it would hide the intro overlay immediately.
  // The intro's "Begin Journey" button calls render() on click.

  // ── Intro start handler ────────────────────────────────────────
  document.addEventListener('click', (e) => {
    if (e.target.closest('#intro-start')) {
      const rawName = nameInput?.value?.trim() || '';
      const nameVal = rawName || 'Traveller';
      if (nameVal) localStorage.setItem('metisPlayerName', nameVal);
      const introOverlay = document.getElementById('intro-overlay');
      if (introOverlay) {
        introOverlay.classList.remove('active');
        introOverlay.setAttribute('hidden', '');
      }
      if (game.getState().preDeparture) {
        showShop(game);
      } else {
        window.__METIS_RENDER__();
      }
    }
  });

  // ── Travel / Camp button handlers ──────────────────────────────
  const travelBtn = document.getElementById('btn-travel');
  const campBtn = document.getElementById('btn-camp');

  if (travelBtn) {
    travelBtn.addEventListener('click', () => {
      const { pendingEvent, pendingSettlement, over } = game.getState();
      if (pendingEvent || pendingSettlement || over) return;
      const prevWear = game.getState().wear;
      const blocked = travelOneDay();
      Haptics.travel();
      if (blocked === true) return; // overload guard
      // If travelOneDay() returned truthy (not true), it opened camp — don't re-render
      if (blocked) return;
      const after = game.getState();
      if (after.wear > prevWear) Haptics.wear();
      // Log travel to journal
      const node = NODES[after.node];
      const prevNode = NODES[after.node - 1];
      const cart = game.getCart();
      journalLog({
        day: after.day,
        date: monthName(after.month) + ' ' + after.day,
        title: 'On the Trail',
        text: buildTravelReflection(prevNode, node, after, cart, after.day),
        mech: after.wear > prevWear ? 'Wear +1' : '',
        collapsed: false
      });
      window.__METIS_RENDER__();
    });
  }

  if (campBtn) {
    campBtn.addEventListener('click', () => {
      showCamp(game);
    });
  }

  // ── Journal toggle ─────────────────────────────────────────────
  const journalToggle = document.getElementById('journal-toggle');
  if (journalToggle) {
    journalToggle.addEventListener('click', () => {
      const panel = document.getElementById('bottom-panel');
      if (panel) {
        panel.classList.toggle('collapsed');
        const icon = document.getElementById('journal-toggle-icon');
        if (icon) icon.textContent = panel.classList.contains('collapsed') ? '▶' : '▼';
      }
    });
  }

  // ── Overlay close handlers ─────────────────────────────────────
  const eventContinue = document.getElementById('event-continue');
  if (eventContinue) eventContinue.onclick = () => {
    document.getElementById('event-overlay')?.classList.remove('active');
  };

  const settlementContinue = document.getElementById('settlement-continue');
  if (settlementContinue) settlementContinue.onclick = () => {
    const st = game.getState().pendingSettlement;
    const after = game.getState();
    if (st) {
      const cart = game.getCart();
      const weather = after.weather || 'clear';
      const isFirstVisit = !visitedSettlements.has(st.name);
      if (isFirstVisit) visitedSettlements.add(st.name);
      const text = isFirstVisit
        ? buildSettlementArrivalEntry(st)
        : buildSettlementJourneyEntry(st, weather, cart);
      journalLog({
        day: after.day,
        date: monthName(after.month) + ' ' + after.day,
        title: `Arrived at ${st.name}`,
        text: text,
        mech: '',
        collapsed: false,
      });
    }
    game.settlementAction('continue');
    document.getElementById('settlement-overlay')?.classList.remove('active');
    window.__METIS_RENDER__();
  };

  const cartClose = document.getElementById('cart-close-btn');
  const cartClose2 = document.getElementById('cart-close-btn-2');
  if (cartClose) cartClose.onclick = () => document.getElementById('cart-overlay')?.classList.remove('active');
  if (cartClose2) cartClose2.onclick = () => document.getElementById('cart-overlay')?.classList.remove('active');

  const crewClose = document.getElementById('crew-close-btn');
  const crewClose2 = document.getElementById('crew-close-btn-2');
  if (crewClose) crewClose.onclick = () => document.getElementById('crew-overlay')?.classList.remove('active');
  if (crewClose2) crewClose2.onclick = () => document.getElementById('crew-overlay')?.classList.remove('active');

  const restartBtn = document.getElementById('end-restart');
  if (restartBtn) restartBtn.onclick = () => {
    clearSave();
    window.location.reload();
  };
}

window.__METIS_BOOT__ = bootstrap;

// Mobile Safari 100svh fallback — address bar causes layout issues
(function fixMobileViewport() {
  const root = document.getElementById('game-root');
  const container = document.getElementById('game-container');
  if (!root) return;
  function setHeight() {
    const h = window.innerHeight;
    root.style.height = h + 'px';
    if (container) container.style.height = h + 'px';
  }
  // Only apply on small screens where address bar is an issue
  if (window.innerWidth < 768) {
    setHeight();
    window.addEventListener('resize', setHeight);
  }
})();

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
  if (state.over) return null; // End game handling will take over
  if (state.pendingSettlement) return null; // Settlement handling will take over

  // Show camp overlay after travel day (instead of auto-advancing)
  showCamp(game);
  return result;
}

// Push On: skip camp, apply penalties, continue travel loop
function pushOn(game) {
  game.pushOn();
}

const TRAVEL_FRAGMENTS = {
  plains: {
    rested: [
      'Flat prairie, no trees, no hills. Just the ox and the cart and the sky.',
      'Wind at your back. Good day for miles.',
      'The ox knows the rhythm. Step, pull, breathe. Step, pull, breathe.',
      'Ruts deep enough to guide the wheels. A dog trots alongside the cart, tongue out in the heat.',
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
    weather: {
      rain: [
        'Rain drums on the canvas tarp. The ox leans into the traces, steady despite the water streaming from its back.',
        'The prairie smells of wet earth and sage. Puddles form in the cart ruts, and the oxen splash through them.',
        'Grey sheets of rain sweep across the plains. The crew pulls their coats tight and keeps moving.',
        'The cart wheels sink soft into the damp ground. Each step costs more than the last, but the rain will pass.',
      ],
      storm: [
        'Thunder cracks overhead. The oxen flinch at every flash, but the traces hold and the cart rolls on.',
        'Lightning stitches the horizon. The crew shields their eyes and drives forward into the teeth of the storm.',
        'The wind hits like a wall. The canvas tarp strains at its ties, and the cart groans against the gusts.',
        'Hailstones bounce off the cart bed. The oxen bellow but press on — there is no shelter on the open prairie.',
      ],
      snow: [
        'Snow falls soft and silent, blanketing the prairie white. The oxen\'s breath rises in plumes.',
        'The cart ruts fill with snow. The trail ahead is a white void — the oxen pick their way carefully.',
        'A bitter wind drives snow into every gap in clothing. The crew huddles close to the cart for warmth.',
        'The prairie is a white wasteland. Snowflakes sting the eyes, but the oxen know the way.',
      ],
      overcast: [
        'A grey sky hangs low over the prairie. The air is thick and still, and the trail stretches ahead under flat light.',
        'No sun, no shadow — just the endless grey prairie under a featureless sky. The oxen walk as if they sense weather coming.',
        'The overcast dulls the colors of the prairie. Everything is grey-green and muted, and the air smells of waiting.',
      ],
    },
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
    weather: {
      rain: [
        'Rain swells the river. Brown water laps at the trail bank, and the ford ahead looks mean.',
        'The river valley is shrouded in drizzle. The oxen\'s hooves squelch in the muddy bank trail.',
        'Three days of rain have turned the valley trail into a stream. The cart wheels spin in the muck.',
        'Rain drips from every leaf and branch. The river runs high and brown beside the trail.',
      ],
      storm: [
        'Thunder echoes off the valley walls. Lightning flashes above the river, and the oxen pull at the traces.',
        'Storm water pours down the valley sides. The trail becomes a stream, and the cart wheels slide.',
        'The river roars in the storm. Crossing today would be suicide — the crew watches from the bank.',
        'Wind howls through the valley. The canvas cover snaps like a whip, and the cart creaks with every gust.',
      ],
      snow: [
        'Snow dusts the riverbanks white. The water runs black through the icy banks, steam rising where warm meets cold.',
        'The valley holds the cold. Snow falls between the trees, and the river\'s edge crunches underfoot.',
        'A hard frost grips the valley. The oxen\'s breath freezes on their muzzles, and the cart wheels ring on the frozen ground.',
      ],
      overcast: [
        'The valley is grey and still under a flat sky. The river murmurs below, indifferent to the weather.',
        'Mist hangs in the river valley. The far bank is a shadow, and the oxen walk with uncertain steps.',
        'Overcast and close. The valley walls seem to press in, and the air smells of wet stone and cold water.',
      ],
    },
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
    weather: {
      rain: [
        'Rain finds every gap in the canopy. The trail underfoot turns to red mud between the roots.',
        'The woods drip and splash. Water runs down every trunk, and the cart steams in the damp air.',
        'Rain drums on the leaves above. The crew is dry enough beneath the canopy, but the trail is treacherous.',
        'The forest floor is sodden. The oxen slog through puddles, and the cart wheels cut deep ruts in the mud.',
      ],
      storm: [
        'Thunder shakes the treetops. A branch cracks overhead — the oxen flinch but the crew presses on.',
        'Lightning splits a dead tree at the trail\'s edge. The crew steers clear of the burning stump.',
        'The wind tears at the canopy. Branches and leaves rain down, and the cart pushes through the debris.',
        'Rain and wind together. The woods glow with each lightning flash, and the oxen pick their way through the dark.',
      ],
      snow: [
        'Snow sifts through the bare branches. The woods are quiet — too quiet — and the cart leaves the only tracks.',
        'The trees hold the snow. Every branch is white, and the trail is a tunnel of grey and silver.',
        'Cold seeps through the woods. The oxen\'s breath fogs the air, and the cart\'s metal parts burn to touch.',
      ],
      overcast: [
        'Grey light filters through the trees. The woods are dim and close, and every sound seems muffled.',
        'The forest is still under a flat sky. No birds sing — only the creak of the cart and the oxen\'s steady tread.',
      ],
    },
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
    weather: {
      rain: [
        'Rain on the ridge is cold and sharp. The oxen slip on the wet grass, and the crew braces the cart from behind.',
        'The uplands are a grey wash of rain and mist. The trail ahead vanishes into the low clouds.',
        'Water streams down the ridge. The cart wheels slide on the sodden turf, and the oxen fight for footing.',
      ],
      storm: [
        'Lightning finds the ridge. The crew drops low and waits — the cart is the highest point for miles.',
        'Thunder cracks so close the air tastes of metal. The oxen refuse to move until the worst passes.',
        'The storm hits the ridge like a hammer. Wind, rain, and hail — the crew huddles behind the cart and waits.',
      ],
      snow: [
        'Snow on the ridge is blinding. The white ground and white sky merge, and the oxen walk by memory.',
        'The wind drives snow horizontally across the uplands. The crew can barely see the trail ahead.',
        'A crust of ice over snow. The oxen break through with every step, and the cart lurches on the frozen ground.',
      ],
      overcast: [
        'The ridge is grey and featureless under a flat sky. No sun, no shadow — just the endless upland.',
        'Low clouds sit on the uplands like a blanket. The trail ahead disappears into the mist.',
      ],
    },
  },
};

function buildTravelNarrative(prev, state, game) {
  const node = game.getCurrentNode();
  const terrain = node?.terrain || 'plains';
  const crew = state.crew;
  const weather = state.weather || 'clear';

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

  // Pick atmospheric fragment — weather variants take priority over crew state
  const terrainFragments = TRAVEL_FRAGMENTS[terrain] || TRAVEL_FRAGMENTS.plains;
  let fragment;
  if (weather !== 'clear' && terrainFragments.weather && terrainFragments.weather[weather]) {
    const weatherPool = terrainFragments.weather[weather];
    fragment = weatherPool[Math.floor(Math.random() * weatherPool.length)];
  } else {
    const crewFragments = terrainFragments[crew] || terrainFragments.rested;
    fragment = crewFragments[Math.floor(Math.random() * crewFragments.length)];
  }

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
    showShop(game);
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
  ['intro-overlay', 'event-overlay', 'settlement-overlay', 'cart-overlay', 'crew-overlay', 'camp-overlay', 'predeparture-overlay', 'settings-overlay', 'leaderboard-overlay', 'end-overlay'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
}


function renderDicePill(result) {
  const rc = document.getElementById('event-roll-display');
  if (!rc) return;
  rc.style.display = 'flex';
  rc.innerHTML = `
    <div class="roll-label">Roll</div>
    <div id="die" class="die small font-spectral">-</div>
    <div class="roll-label">Need ${result.dc}+</div>
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
    // Roll line — show raw roll + modifiers = total, and effective DC
    const mod = result.total - result.roll;
    const modStr = mod !== 0 ? ` (${mod >= 0 ? '+' : ''}${mod}${result.modBreakdown && result.modBreakdown.length ? ': ' + result.modBreakdown.join(', ') : ''})` : '';
    const rollHtml = `<span class="outcome-roll">Rolled ${result.roll}${modStr} = ${result.total} — need ${result.dc}+</span>`;
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
    // Item give/consume and other effects from the engine
    if (result.effects && result.effects.length) {
      mechMsgs.push(...result.effects);
    }
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

// Event image mapping — picks the right category image for each event
const EVENT_IMAGE_MAP = {
  // By classification
  'Weather': 'events/event_storm.png',
  'Supply Find': 'events/event_supplies.png',
  'Survival': 'events/event_cart.png',
  'Disease': 'events/event_sick.png',
  'Trade & Regulation': 'events/event_people.png',
  'Free Trade': 'events/event_people.png',
  'Supply & Scarcity': 'events/event_supplies.png',
  'Law & Order': 'events/event_people.png',
  'Law & Desertion': 'events/event_people.png',
  'Community & Hospitality': 'events/event_camp.png',
  'Trail Justice': 'events/event_people.png',
  'Charity & Healing': 'events/event_sick.png',
  'Hardship & Loss': 'events/event_sick.png',
  'Trail News': 'events/event_people.png',
  'Freight & Trade': 'events/event_people.png',
};

// Fallback by keyword in event ID for unclassified events
function pickEventImage(ev) {
  // Classification match first
  if (ev.classification && EVENT_IMAGE_MAP[ev.classification]) {
    return EVENT_IMAGE_MAP[ev.classification];
  }
  const id = ev.id || '';
  // Keyword fallback for common unclassified events
  if (/fire|wind|storm|hail|thunder/.test(id)) return 'events/event_storm.png';
  if (/river|ford|ferry|boat|crossing|flood|ice_break/.test(id)) return 'events/event_river.png';
  if (/buffalo|bison|hunt/.test(id)) return 'events/event_buffalo.png';
  if (/camp|cookery|night|dance|prayer/.test(id)) return 'events/event_camp.png';
  if (/axle|wheel|cart_fort|sandbar|cart_raft|cache/.test(id)) return 'events/event_cart.png';
  if (/trader|scout|cree|elder|nwmp|mp_check|inspection|rivalry|court|welcome|charity|news|boat|brigade/.test(id)) return 'events/event_people.png';
  if (/cholera|smallpox|snow_blind|frost|deserter/.test(id)) return 'events/event_sick.png';
  if (/cache|find|herb|bee|tree|blanket|gather|beaver|ammo|firewood/.test(id)) return 'events/event_supplies.png';
  // Terrain-based default
  if (/river/.test(id)) return 'events/event_river.png';
  return 'events/event_prairie.png'; // broadest fallback
}

function showEvent(game) {
  const ev = game.getPendingEvent();
  if (!ev) return;
  hideOverlays();
  const textEl = document.getElementById('event-text');
  const choicesEl = document.getElementById('event-choices');
  const continueEl = document.getElementById('event-continue');
  if (!textEl || !choicesEl) return;

  // Map event to category image
  const eventArtEl = document.getElementById('event-art');
  if (eventArtEl) {
    const img = pickEventImage(ev);
    if (img) {
      eventArtEl.src = img;
      eventArtEl.style.display = 'block';
    } else {
      eventArtEl.style.display = 'none';
    }
  }

  textEl.textContent = ev.text;

  const sourceEl = document.getElementById('event-source');
  if (sourceEl) {
    if (ev.source && ev.source.quote) {
      const rawQuote = ev.source.quote;
      const quote = rawQuote.replace(/^"|"$/g, '');
      const author = ev.source.author || '';
      const work = ev.source.work || '';
      const year = ev.source.year || '';
      const attrib = [author, work, year].filter(Boolean).join(', ');
      sourceEl.innerHTML = `<span class="src-quote">"${quote}"</span>` + (attrib ? `<span class="src-attrib">— ${attrib}</span>` : '') + (ev.source.context ? `<span class="src-context">${ev.source.context}</span>` : '');
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
  let eventData = null; // captured for journal logging
  let eventBefore = null; // captured before auto-event resolution

  // Continue button handler — shared by dice and non-dice paths
  continueEl.onclick = () => {
    continueEl.classList.remove('ready');
    // If there was a dice result, publish it now
    if (diceResult) {
      const outcome = buildEventChoiceOutcome(diceResult.stepLog, diceResult.before, game.getState());
      if (outcome) publishResult(outcome);
      // Log event to journal
      if (eventData) {
        const after = game.getState();
        const res = diceResult.result;
        const cart = game.getCart();
        const weather = after.weather || 'clear';
        // Use engine effects as single source of truth for journal too
        const mechParts = (res && res.effects) ? [...res.effects] : [];
        journalLog({
          day: after.day,
          date: monthName(after.month) + ' ' + after.day,
          title: eventData.classification || 'Event',
          text: buildEventReflection(eventData, res, weather, cart),
          dice: res && res.roll !== null ? `Rolled ${res.roll}${res.total - res.roll !== 0 ? ` (${res.total - res.roll >= 0 ? '+' : ''}${res.total - res.roll}${res.modBreakdown && res.modBreakdown.length ? ': ' + res.modBreakdown.join(', ') : ''})` : ''} = ${res.total} — need ${res.dc}+ — ${res.success ? '✓ Success' : '✗ Failure'}` : null,
          mech: mechParts.join(' · '),
          collapsed: false,
        });
      }
      diceResult = null;
      eventData = null;
    } else {
      // Auto-event (no dice, no choices) — log to journal
      if (eventData) {
        const after = game.getState();
        const cart = game.getCart();
        const weather = after.weather || 'clear';
        const beforeState = eventBefore || after;
        const mechParts = [];
        if (after.food !== beforeState.food) mechParts.push(`${after.food - beforeState.food >= 0 ? '+' : ''}${(after.food - beforeState.food).toFixed(1)} Food`);
        if (after.wear !== beforeState.wear) mechParts.push(`Wear ${after.wear - beforeState.wear >= 0 ? '+' : ''}${after.wear - beforeState.wear}`);
        journalLog({
          day: after.day,
          date: monthName(after.month) + ' ' + after.day,
          title: eventData.classification || 'Event',
          text: buildEventAutoEntry(eventData.text || '', weather, cart),
          mech: mechParts.join(' · '),
          collapsed: false,
        });
        eventData = null;
        eventBefore = null;
      }
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
    const hasItem = !ch.requiresItem || (game.getCart()?.some(it => it.name === ch.requiresItem.name && it.count >= ch.requiresItem.count));
    if (ch.requiresItem && !hasItem) {
      btn.disabled = true;
      btn.style.opacity = '0.45';
      btn.style.cursor = 'not-allowed';
    }
    btn.textContent = ch.text;
    const costParts = [];
    if (typeof ch.dc === 'number') costParts.push(`Roll ${ch.dc}+`);
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
      // Capture event data before chooseEventChoice clears it
      eventData = { classification: ev.classification, text: ev.text };
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
        const mechMsgs = [];
        // Item give/consume and other effects from the engine
        if (res && res.effects && res.effects.length) {
          mechMsgs.push(...res.effects);
        }
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
    // Set eventData + before state for auto-event journal logging
    eventData = { classification: ev.classification, text: ev.text };
    eventBefore = { ...game.getState() };
  }

  document.getElementById('event-overlay')?.classList.add('active');
}

function buildEventChoiceOutcome(stepLog, before, after) {
  const msgs = [];
  const entry = stepLog && stepLog[0] ? stepLog[0] : null;
  const res = entry && entry.result ? entry.result : entry;
  if (res && res.roll !== null && res.dc !== null) {
    const mod = res.total - res.roll;
    const modStr = mod !== 0 ? ` (${mod >= 0 ? '+' : ''}${mod}${res.modBreakdown && res.modBreakdown.length ? ': ' + res.modBreakdown.join(', ') : ''})` : '';
    msgs.push(`Rolled ${res.roll}${modStr} = ${res.total} (needed ${res.dc}+): ${res.success ? 'Success' : 'Failure'}`);
  }
  if (res && res.text) msgs.push(res.text);
  // Item give/consume and other effects from the engine (single source of truth)
  if (res && res.effects && res.effects.length) {
    msgs.push(...res.effects);
  }
  if (!msgs.length) return 'The day passes without change.';
  return msgs.join(', ');
}

function showSettlement(game) {
  hideOverlays();
  Haptics.arrive();
  const state = game.getState();
  const node = game.getCurrentNode();

  const nameEl = document.getElementById('settlement-name');
  const badgeEl = document.getElementById('settlement-badge');
  const distanceEl = document.getElementById('settlement-distance');
  const descEl = document.getElementById('settlement-desc');
  const actionsEl = document.getElementById('settlement-actions');
  const rollEl = document.getElementById('settlement-roll-display');
  const resultEl = document.getElementById('settlement-result');
  const continueEl = document.getElementById('settlement-continue');
  if (!nameEl || !badgeEl || !distanceEl || !descEl || !actionsEl) return;

  // Set settlement image
  const artEl = document.getElementById('settlement-art');
  if (artEl) {
    if (node.art) {
      artEl.src = node.art;
      artEl.style.display = 'block';
    } else {
      artEl.style.display = 'none';
    }
  }

  // Reset UI
  nameEl.textContent = node.name;
  const typeLabels = { hbc: 'HBC Fort', metis: 'Métis Camp', nwmp: 'NWMP Post', mission: 'Mission', trading: 'Trading Post' };
  badgeEl.textContent = typeLabels[node.type] || node.type.toUpperCase();
  badgeEl.className = 'settlement-badge ' + (node.type || 'hbc');
  const distKm = Math.round((node.dist || 0) * 50);
  distanceEl.textContent = `${distKm} km from Fort Garry`;
  descEl.textContent = node.desc || '';

  // Render status pills (food/wear/morale/crew)
  const statusEl = document.getElementById('settlement-status');
  if (statusEl) {
    const foodCls = state.food <= 5 ? ' style="color:var(--clr-danger)"' : '';
    const wearCls = state.wear >= 4 ? ' style="color:var(--clr-danger)"' : '';
    const crewCls = state.crew === 'exhausted' ? ' style="color:var(--clr-danger)"' : state.crew === 'tired' ? ' style="color:var(--clr-warn)"' : '';
    statusEl.innerHTML = `
      <span class="pill"${foodCls}>🍖 ${Math.floor(state.food)} Food</span>
      <span class="pill"${wearCls}>🔧 ${state.wear} Wear</span>
      <span class="pill">😊 ${state.morale} Morale</span>
      <span class="pill"${crewCls}>👥 ${state.crew}</span>
    `;
  }

  actionsEl.innerHTML = '';
  if (rollEl) { rollEl.style.display = 'none'; rollEl.innerHTML = ''; }
  if (resultEl) { resultEl.style.display = 'none'; resultEl.textContent = ''; }
  if (continueEl) continueEl.style.display = 'none';

  // Get settlement-specific actions from engine
  const actions = game.getSettlementActions(node.type);

  // Render actions — group ones sharing groupId into a single card with radio sub-options
  const grouped = {};
  const ungrouped = [];
  actions.forEach(a => {
    if (a.groupId) {
      if (!grouped[a.groupId]) grouped[a.groupId] = [];
      grouped[a.groupId].push(a);
    } else {
      ungrouped.push(a);
    }
  });

  // Track whether an action has been performed this visit
  let settlementActionPerformed = false;

  // Helper: check if action can be performed
  function checkCanDo(action) {
    const st = game.getState();
    const cart = game.getCart();
    switch (action.groupId || action.id) {
      case 'trade_furs_food': return cart.some(i => (i.type === 'trade' || i.category === 'furs') && i.count > 0);
      case 'trade_furs_supplies': return cart.some(i => (i.type === 'trade' || i.category === 'furs') && i.count > 0);
      case 'rest': return st.food >= 1;
      case 'trade_gossip': return true;
      case 'dance': return st.food >= 1;
      case 'share_food': return st.food >= 2;
      case 'rest_blessing': return true;
      case 'heal_crew': return (cart.find(i => i.name === 'Medicine Pouch')?.count || 0) >= 1 || st.food >= 2;
      default: return true;
    }
  }

  // Render a grouped set of actions as one card with radio sub-options
  function renderGroupedCard(groupActions) {
    const groupId = groupActions[0].groupId;
    const groupLabel = groupActions[0].groupLabel;
    const card = document.createElement('div');
    card.className = 'settlement-action-card settlement-action-group';

    const nameRow = document.createElement('div');
    nameRow.className = 'settlement-action-card-name';
    nameRow.textContent = groupLabel;
    card.appendChild(nameRow);

    // Shared description if any
    const sharedDesc = groupActions[0].desc;
    if (sharedDesc) {
      const descRow = document.createElement('div');
      descRow.className = 'settlement-action-card-desc';
      descRow.textContent = sharedDesc;
      card.appendChild(descRow);
    }

    // Radio sub-options
    const optionsWrap = document.createElement('div');
    optionsWrap.className = 'settlement-action-group-options';

    let selectedIndex = 0;
    groupActions.forEach((action, idx) => {
      const canDo = !settlementActionPerformed && checkCanDo(action);
      const optRow = document.createElement('label');
      optRow.className = 'settlement-action-group-option' + (canDo ? '' : ' disabled');

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `group_${groupId}`;
      radio.value = idx;
      radio.checked = idx === 0;
      radio.disabled = !canDo;
      radio.className = 'settlement-action-group-radio';

      const optLabel = document.createElement('span');
      optLabel.className = 'settlement-action-group-label';
      optLabel.textContent = action.label;

      const optDetail = document.createElement('span');
      optDetail.className = 'settlement-action-group-detail';
      optDetail.textContent = `Cost: ${action.cost} → ${action.risk}`;

      optRow.appendChild(radio);
      optRow.appendChild(optLabel);
      optRow.appendChild(optDetail);
      optionsWrap.appendChild(optRow);
    });
    card.appendChild(optionsWrap);

    // Single Do It button for the group
    const btn = document.createElement('button');
    btn.className = 'settlement-action-card-btn';
    btn.textContent = 'Do It';

    const canDoAny = groupActions.some(a => checkCanDo(a));
    if (!canDoAny) {
      btn.disabled = true;
      btn.classList.add('disabled');
    }

    card.appendChild(btn);
    actionsEl.appendChild(card);

    if (canDoAny) {
      btn.addEventListener('click', () => {
        if (settlementActionPerformed) return;
        settlementActionPerformed = true;

        // Find selected option
        const checked = optionsWrap.querySelector('input[type="radio"]:checked');
        const selectedGroupIndex = checked ? parseInt(checked.value, 10) : 0;
        const selectedAction = groupActions[selectedGroupIndex];

        // Disable all buttons
        actionsEl.querySelectorAll('.settlement-action-card-btn').forEach(b => {
          b.disabled = true;
          b.classList.add('disabled');
        });

        const beforeState = game.getState();
        const beforeCart = game.getCart();
        const result = game.settlementAction(selectedAction.id);
        const afterState = game.getState();
        const afterCart = game.getCart();

        // Hide all action cards, show result in-place
        actionsEl.querySelectorAll('.settlement-action-card').forEach(c => { c.style.display = 'none'; });

        const flavor = buildSettlementActionEntry(selectedAction.id, selectedAction.cost, selectedAction.risk || selectedAction.flavor);
        const reflectionText = buildSettlementReflection(node, afterState, afterCart);
        const fullText = flavor + ' ' + reflectionText;

        const mechParts = [];
        if (afterState.food !== beforeState.food) mechParts.push(`${afterState.food - beforeState.food >= 0 ? '+' : ''}${(afterState.food - beforeState.food).toFixed(1)} Food`);
        if (afterState.wear !== beforeState.wear) mechParts.push(`Wear ${afterState.wear - beforeState.wear >= 0 ? '+' : ''}${afterState.wear - beforeState.wear}`);
        if (afterState.morale !== beforeState.morale) mechParts.push(`Morale ${afterState.morale - beforeState.morale >= 0 ? '+' : ''}${afterState.morale - beforeState.morale}`);
        if (afterState.crew !== beforeState.crew) mechParts.push(`Crew: ${beforeState.crew} → ${afterState.crew}`);

        const resultCard = document.createElement('div');
        resultCard.className = 'settlement-action-card';
        resultCard.style.borderColor = 'var(--clr-accent)';

        const rcName = document.createElement('div');
        rcName.className = 'settlement-action-card-name';
        rcName.textContent = selectedAction.label;
        resultCard.appendChild(rcName);

        const rcFlavor = document.createElement('div');
        rcFlavor.className = 'settlement-action-card-flavor';
        rcFlavor.textContent = fullText;
        resultCard.appendChild(rcFlavor);

        if (mechParts.length) {
          const rcMech = document.createElement('div');
          rcMech.className = 'settlement-action-card-cost';
          rcMech.textContent = mechParts.join(' · ');
          resultCard.appendChild(rcMech);
        }

        if (intelText(groupActions[0].id)) {
          const rcIntel = document.createElement('div');
          rcIntel.className = 'settlement-action-card-desc';
          const intel = afterState.trailIntel || [];
          if (intel.length > 0) rcIntel.textContent = intel[intel.length - 1].text;
          resultCard.appendChild(rcIntel);
        }

        const rcBtn = document.createElement('button');
        rcBtn.className = 'settlement-action-card-btn';
        rcBtn.textContent = 'Continue West';
        rcBtn.addEventListener('click', () => {
          actionsEl.querySelectorAll('.settlement-action-card').forEach(c => { c.style.display = 'none'; });
          if (continueEl) continueEl.style.display = 'none';
          game.settlementAction('continue');
          window.__METIS_RENDER__();
        });
        resultCard.appendChild(rcBtn);
        actionsEl.appendChild(resultCard);
      });
    }
  }

  // Helper for intel check
  function intelText(id) {
    return ['get_intel','trade_gossip','gossip'].includes(id);
  }

  // Render a single ungrouped action card
  function renderSingleCard(action) {
    const card = document.createElement('div');
    card.className = 'settlement-action-card';

    const nameRow = document.createElement('div');
    nameRow.className = 'settlement-action-card-name';
    nameRow.textContent = action.label;

    const costRow = document.createElement('div');
    costRow.className = 'settlement-action-card-cost';
    costRow.textContent = `Cost: ${action.cost}`;

    const riskRow = document.createElement('div');
    riskRow.className = 'settlement-action-card-risk';
    riskRow.textContent = action.risk ? `Receive: ${action.risk}` : '';

    const flavorRow = document.createElement('div');
    flavorRow.className = 'settlement-action-card-flavor';
    flavorRow.textContent = action.flavor;

    const descRow = document.createElement('div');
    descRow.className = 'settlement-action-card-desc';
    descRow.textContent = action.desc || '';

    const btn = document.createElement('button');
    btn.className = 'settlement-action-card-btn';
    btn.textContent = 'Do It';

    const canDo = !settlementActionPerformed && checkCanDo(action);
    if (!canDo) {
      btn.disabled = true;
      btn.classList.add('disabled');
    }

    card.appendChild(nameRow);
    card.appendChild(costRow);
    if (riskRow.textContent) card.appendChild(riskRow);
    card.appendChild(flavorRow);
    if (descRow.textContent) card.appendChild(descRow);
    card.appendChild(btn);
    actionsEl.appendChild(card);

    if (canDo) {
      btn.addEventListener('click', () => {
        if (settlementActionPerformed) return;
        settlementActionPerformed = true;

        actionsEl.querySelectorAll('.settlement-action-card-btn').forEach(b => {
          b.disabled = true;
          b.classList.add('disabled');
        });

        const beforeState = game.getState();
        const beforeCart = game.getCart();
        const result = game.settlementAction(action.id);
        const afterState = game.getState();
        const afterCart = game.getCart();

        actionsEl.querySelectorAll('.settlement-action-card').forEach(c => { c.style.display = 'none'; });

        const flavor = buildSettlementActionEntry(action.id, action.cost, action.risk || action.flavor);
        const reflectionText = buildSettlementReflection(node, afterState, afterCart);
        const fullText = flavor + ' ' + reflectionText;

        const mechParts = [];
        if (afterState.food !== beforeState.food) mechParts.push(`${afterState.food - beforeState.food >= 0 ? '+' : ''}${(afterState.food - beforeState.food).toFixed(1)} Food`);
        if (afterState.wear !== beforeState.wear) mechParts.push(`Wear ${afterState.wear - beforeState.wear >= 0 ? '+' : ''}${afterState.wear - beforeState.wear}`);
        if (afterState.morale !== beforeState.morale) mechParts.push(`Morale ${afterState.morale - beforeState.morale >= 0 ? '+' : ''}${afterState.morale - beforeState.morale}`);
        if (afterState.crew !== beforeState.crew) mechParts.push(`Crew: ${beforeState.crew} → ${afterState.crew}`);

        const resultCard = document.createElement('div');
        resultCard.className = 'settlement-action-card';
        resultCard.style.borderColor = 'var(--clr-accent)';

        const rcName = document.createElement('div');
        rcName.className = 'settlement-action-card-name';
        rcName.textContent = action.label;
        resultCard.appendChild(rcName);

        const rcFlavor = document.createElement('div');
        rcFlavor.className = 'settlement-action-card-flavor';
        rcFlavor.textContent = fullText;
        resultCard.appendChild(rcFlavor);

        if (mechParts.length) {
          const rcMech = document.createElement('div');
          rcMech.className = 'settlement-action-card-cost';
          rcMech.textContent = mechParts.join(' · ');
          resultCard.appendChild(rcMech);
        }

        if (intelText(action.id)) {
          const rcIntel = document.createElement('div');
          rcIntel.className = 'settlement-action-card-desc';
          const intel = afterState.trailIntel || [];
          if (intel.length > 0) rcIntel.textContent = intel[intel.length - 1].text;
          resultCard.appendChild(rcIntel);
        }

        const rcBtn = document.createElement('button');
        rcBtn.className = 'settlement-action-card-btn';
        rcBtn.textContent = 'Continue West';
        rcBtn.addEventListener('click', () => {
          actionsEl.querySelectorAll('.settlement-action-card').forEach(c => { c.style.display = 'none'; });
          if (continueEl) continueEl.style.display = 'none';
          game.settlementAction('continue');
          window.__METIS_RENDER__();
        });
        resultCard.appendChild(rcBtn);
        actionsEl.appendChild(resultCard);
      });
    }
  }

  // Render grouped actions first, then ungrouped
  Object.values(grouped).forEach(renderGroupedCard);
  ungrouped.forEach(renderSingleCard);

  document.getElementById('settlement-overlay')?.classList.add('active');
}

// (renderSettlementActionCard and showSettlementResult removed — logic inlined in showSettlement)

function buildSettlementOutcome(action, before, after, beforeCart, afterCart) {
  const msgs = [];
  if (after.food !== before.food) msgs.push(`${after.food - before.food >= 0 ? '+' : ''}${after.food - before.food} Food`);
  if (after.wear !== before.wear) msgs.push(`Wear ${after.wear - before.wear >= 0 ? '+' : ''}${after.wear - before.wear}`);
  if (after.morale !== before.morale) msgs.push(`Morale ${after.morale - before.morale >= 0 ? '+' : ''}${after.morale - before.morale}`);
  if (after.crew !== before.crew) msgs.push(`Crew: ${before.crew} -> ${after.crew}`);
  if (after.day !== before.day) msgs.push(`${after.day - before.day} Day(s)`);
  if (action === 'trade') {
    const lost = beforeCart.reduce((s, i) => s + i.count, 0) - afterCart.reduce((s, i) => s + i.count, 0);
    if (lost > 0) msgs.push(`Traded ${lost} good(s) for supplies.`);
  }
  if (action === 'repair') msgs.push('Cart repaired.');
  if (action === 'grease') msgs.push('Axle greased.');
  if (action === 'heal') msgs.push('Healed.');
  if (action === 'forage') msgs.push('Foraging...');
  if (action === 'get_intel') msgs.push('Gathered trail intelligence.');
  if (action === 'gossip' || action === 'trade_gossip' || action === 'rumours') {
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
  hideOverlays();
  const state = game.getState();
  const cart = game.getCart();
  const listEl = document.getElementById('inv-list');
  if (!listEl) return;

  const overloaded = state.usedWeight > state.capacity;
  const excess = state.usedWeight - state.capacity;

  const weightBar = overloaded
    ? `<div style="margin-bottom:10px;padding:8px;background:rgba(180,60,60,0.15);border:1px solid rgba(180,60,60,0.4);border-radius:0;"><div style="font-weight:700;color:#8B0000;">⚠ Overloaded — ${state.usedWeight} / ${state.capacity} kg</div><div style="font-size:0.9em;color:#8B0000;margin-top:2px;">Offload at least <strong>${excess} kg</strong> before traveling.</div></div>`
    : `<div style="margin-bottom:10px;padding:8px;background:rgba(46,90,62,0.12);border:1px solid rgba(46,90,62,0.3);border-radius:0;"><div style="font-weight:700;color:#2D4A3E;">Cart — ${state.usedWeight} / ${state.capacity} kg</div></div>`;

  const items = cart
    .map((i) => {
      const canUnload = i.count > 0;
      const hint = i.category ? getCategoryHint(i.category) : '';
      const desc = i.desc ? `<div style="font-size:0.8em;color:#5a4a3a;margin-top:2px;">${i.desc}</div>` : '';
      const mbStr = (i.type === 'trade' || i.category === 'furs')
        ? `<span style="color:var(--clr-accent);font-size:0.85em;margin-left:4px;">Trade good</span>`
        : '';
      return `
    <div class="cart-row" style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.08);">
      <span style="flex:1;"><span style="font-weight:600;">${getItemIcon(i.name)} ${i.name} ×${i.count} (${(i.wt * i.count).toFixed(1)} kg)</span>${mbStr}${hint ? `<div style="font-size:0.75em;color:#6b5c4a;margin-top:1px;">${hint}</div>` : ''}${desc}</span>
      ${canUnload ? `<button class="ctrl-btn unload-btn" data-item="${i.name}" style="padding:2px 10px;font-size:0.85em;flex-shrink:0;">Unload (−${i.wt} kg)</button>` : ''}
    </div>`;
    })
    .join('');

  listEl.innerHTML = weightBar + items;

  listEl.querySelectorAll('.unload-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const itemName = btn.getAttribute('data-item');
      game.offloadItem(itemName);
      const newState = game.getState();
      if (overloaded && newState.usedWeight <= newState.capacity) {
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
    provisions: '1 food/day keeps the crew alive. Running out means death.',
    repair: 'Reduces cart wear. No repair supplies = stranded when cart breaks.',
    parts: 'Needed for cart repair and crafting recipes at settlements.',
    furs: 'Trade goods. Deliver to Fort Edmonton for endgame score.',
    shelter: 'Cold nights and river crossings. Tarp doubles as raft.',
    fuel: 'Required for cold nights. Without fire, crew condition drops.',
    hunting: 'Ammo enables hunting camp action. Also used in defensive events.',
    medical: 'Heals crew when injured or ill. Saves morale in crisis events.',
    tool: 'Enables major repairs and advanced crafting at settlements.',
    ammo: 'Required for hunting. Some events need ammunition.',
  };
  return map[category] || '';
}

function showShop(game) {
  const state = game.getState();
  const listEl = document.getElementById('predeparture-list');
  const weightEl = document.getElementById('predeparture-weight');
  const currentEl = document.getElementById('pd-weight-current');
  const statusEl = document.getElementById('pd-weight-status');
  const confirmBtn = document.getElementById('pd-confirm');
  // Pre-departure overlay elements (required)
  if (!listEl || !weightEl || !currentEl || !statusEl || !confirmBtn) return;
  // Settlement shop overlay elements (optional - may be null in pre-departure)
  const balanceEl = document.getElementById('shop-balance');
  const shopStatusEl = document.getElementById('shop-status');
  const foodCountEl = document.getElementById('shop-food-count');
  const isPreDeparture = !!state.preDeparture;

  // Show the correct overlay
  if (isPreDeparture) {
    document.getElementById('predeparture-overlay')?.classList.add('active');
    document.getElementById('predeparture-overlay')?.removeAttribute('hidden');

    // Starter kit (auto-included)
    const starterItems = [
      { name: 'Medicine Pouch', wt: 1.5, category: 'medical', count: 1 },
      { name: 'Ammunition Belt', wt: 2, category: 'hunting', count: 1 },
      { name: 'Canvas Tarp', wt: 4, category: 'shelter', count: 1 },
    ];

    // Extra items player can pick ONE from
    const extraItems = [
      { name: 'Pemmican Rations', wt: 2.5, category: 'provisions', count: 7, desc: 'Dried meat and fat. The staple of the prairie.' },
      { name: 'Spare Axle', wt: 15, category: 'parts', count: 1, desc: 'Hard maple. Heavy but essential for a Red River cart.' },
      { name: 'Shaganappi', wt: 3, category: 'repair', count: 3, desc: 'Rawhide strips. Binding, lashing, and cart repair.' },
      { name: 'Tool Kit', wt: 8, category: 'parts', count: 1, desc: 'Axe, auger, drawknife. Required for major repairs.' },
      { name: 'Firewood Bundle', wt: 6, category: 'fuel', count: 1, desc: 'Dried poplar. Required for cold nights.' },
      { name: 'Rope (50ft)', wt: 3, category: 'parts', count: 1, desc: 'Hemp. Crossings, repairs, binding.' },
      { name: 'Blanket', wt: 3, category: 'shelter', count: 2, desc: 'Wool. Winter survival.' },
    ];

    // Track selected extra item
    let selectedExtra = null;

    function recalc() {
      let totalWeight = 0;
      const cart = game.getCart();
      cart.forEach(i => { totalWeight += i.wt * i.count; });
      starterItems.forEach(item => { totalWeight += item.wt * item.count; });
      if (selectedExtra) {
        totalWeight += selectedExtra.wt * selectedExtra.count;
      }

      currentEl.textContent = totalWeight.toFixed(1);
      weightEl.classList.remove('over', 'at-capacity', 'under');
      statusEl.classList.remove('over', 'at-capacity', 'under');

      if (totalWeight > state.capacity) {
        weightEl.classList.add('over');
        statusEl.classList.add('over');
        statusEl.textContent = `${(totalWeight - state.capacity).toFixed(1)} kg over`;
        confirmBtn.disabled = true;
      } else {
        weightEl.classList.add('under');
        statusEl.classList.add('under');
        statusEl.textContent = `${(state.capacity - totalWeight).toFixed(1)} kg spare`;
        confirmBtn.disabled = false;
      }
    }

    function renderList() {
      let html = '<div style="font-family:var(--font-heading);font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--clr-accent);margin:10px 0 6px;">Starter Kit (auto-included)</div>';
      starterItems.forEach(item => {
        html += `<div class="pd-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--clr-muted);">
          <div class="pd-item-info">
            <span class="pd-name">${item.name}</span>
            <div style="font-size:0.75em;color:var(--clr-muted);margin-top:2px;">${item.wt} kg</div>
          </div>
        </div>`;
      });

      html += '<div style="font-family:var(--font-heading);font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--clr-accent);margin:14px 0 6px;">Pick ONE Extra Item</div>';
      extraItems.forEach(item => {
        const isSelected = selectedExtra && selectedExtra.name === item.name;
        const itemWeight = (item.wt * item.count).toFixed(1);
        html += `<div class="pd-row extra-item-row" data-item="${item.name}" style="display:flex;justify-content:space-between;align-items:center;padding:10px;border:2px solid ${isSelected ? 'var(--clr-accent)' : 'var(--clr-muted)'};background:${isSelected ? 'rgba(139,105,20,0.1)' : 'transparent'};cursor:pointer;border-radius:0;transition:border-color 0.15s,background 0.15s;" onmouseover="this.style.borderColor='var(--clr-accent)'" onmouseout="this.style.borderColor='${isSelected ? 'var(--clr-accent)' : 'var(--clr-muted)'}'">
          <div class="pd-item-info" style="flex:1;">
            <span class="pd-name" style="font-weight:${isSelected ? '700' : '600'};">${item.name} ×${item.count}</span>
            <div style="font-size:0.75em;color:var(--clr-muted);margin-top:2px;">${item.desc}</div>
            <div style="font-size:0.7em;color:var(--clr-accent);margin-top:2px;">${itemWeight} kg total</div>
          </div>
          <div class="pd-controls" style="display:flex;align-items:center;gap:8px;">
            ${isSelected ? '<span style="color:var(--clr-accent);font-family:var(--font-heading);font-size:14px;">✓ Selected</span>' : '<button class="pd-extra-pick" data-item="' + item.name + '" style="padding:6px 14px;background:var(--clr-accent);color:var(--clr-bg);border:2px solid var(--clr-accent);font-family:var(--font-heading);font-weight:600;cursor:pointer;">Pick This</button>'}
          </div>
        </div>`;
      });

      if (cart.length > 0) {
        html += '<div style="font-family:var(--font-heading);font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--clr-accent);margin:14px 0 6px;">Your Trade Goods</div>';
        cart.forEach(item => {
          const itemWeight = (item.wt * item.count).toFixed(1);
          html += `<div class="pd-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--clr-muted);">
            <div class="pd-item-info">
              <span class="pd-name">${item.name} ×${item.count}</span>
              <div style="font-size:0.75em;color:var(--clr-muted);margin-top:2px;">${itemWeight} kg total</div>
            </div>
          </div>`;
        });
      }
      listEl.innerHTML = html;

      // Attach pick handlers
      listEl.querySelectorAll('.pd-extra-pick').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const name3 = btn.getAttribute('data-item');
          selectedExtra = extraItems.find(i => i.name === name3);
          recalc();
          renderList();
        });
      });

      // Also allow clicking the whole row
      listEl.querySelectorAll('.extra-item-row').forEach(row => {
        row.addEventListener('click', () => {
          const rowItem = row.getAttribute('data-item');
          if (!selectedExtra || selectedExtra.name !== rowItem) {
            selectedExtra = extraItems.find(i => i.name === rowItem);
          } else {
            selectedExtra = null;
          }
          recalc();
          renderList();
        });
      });
    }

    const cart = game.getCart();
    recalc();
    renderList();

    // Direct click handler on confirm button
    confirmBtn.onclick = () => {
      const game = window._metisGame;
      // Add starter kit
      starterItems.forEach(item => {
        for (let i = 0; i < item.count; i++) {
          game.buyItem(item.name, item.wt, item.category);
        }
      });
      // Add selected extra item
      if (selectedExtra) {
        for (let i = 0; i < selectedExtra.count; i++) {
          game.buyItem(selectedExtra.name, selectedExtra.wt, selectedExtra.category);
        }
      }
      game.addFood(15);
      game.confirmPreDeparture();
      document.getElementById('predeparture-overlay')?.classList.remove('active');
      window.__METIS_RENDER__();
    };
    return;
  }
}

function showCrew(game) {
  hideOverlays();
  const c = game.getCrew();
  const el = document.getElementById('crew-status');
  if (!el) return;
  el.innerHTML = `<div>State: ${c.state}</div><div>Morale: ${c.morale}</div><div>Modifier: ${c.mod}</div>`;
  document.getElementById('crew-overlay')?.classList.add('active');
}

const CAMP_FLAVOR = {
  rest: {
    high: [
      'The crew sleeps deeply under a sky full of stars. Morning comes with fresh energy and quiet purpose.',
      'A perfect night by the fire. The oxen rest well, the crew wakes restored — tomorrow feels full of promise.',
      'The camp is peaceful, the fire burns steady, and sleep comes easy. You wake before dawn, rested and ready.',
    ],
    mid: [
      'The night is adequate. Sleep comes in fits, but the crew wakes functional if not truly refreshed.',
      'A serviceable rest. The ground is hard but the fire holds. Morning finds the crew ready to move on.',
      'You sleep light and wake stiff, but the crew is rested enough. The trail waits.',
    ],
    low: [
      'A rough night. The fire dies and the cold creeps in. The crew wakes tired, and the day ahead feels long.',
      'Sleep is fitful and short. The crew rises grumbling, and morale suffers for it.',
      'The camp offers little comfort. The crew wakes cold and irritable, and the morning is slow to start.',
    ],
  },
  forage: {
    high: [
      'Berry bushes heavy with saskatoon fruit, and a patch of wild turnips beside a creek. The land provides generously.',
      'You find a meadow thick with edible roots and early berries. The foraging is excellent — the crew eats well tonight.',
      'A stroke of luck: a patch of wild onions, gooseberries, and a patch of camas root. The foraging bucket is full.',
    ],
    mid: [
      'A modest haul — some wild onions, a few berries, and some edible greens. Enough to supplement the rations.',
      'You forage enough to keep the pot boiling. Not a feast, but not a famine either.',
      'The land yields enough to keep the crew fed. Unspectacular but welcome.',
    ],
    low: [
      'The prairie offers little today. A few bitter roots and not much else. The foraging was lean.',
      'You find almost nothing edible. A handful of bitter roots. The crew goes to bed hungry.',
      'A wasted afternoon. The forage comes back nearly empty-handed, and the rations remain thin.',
    ],
  },
  hunt: {
    high: [
      'A young bull, separated from the herd. The shot is clean and the butchering efficient. The crew feasts tonight.',
      'A prairie grouse covey flushes at your feet. The hunt is quick and the meat is tender. A good day.',
      'A deer at the creek crossing. One shot, one kill. The crew will eat well for days.',
    ],
    mid: [
      'You take a shot but the hit is poor. Some food, but not a clean kill. The crew makes do.',
      'A close call — you wound it but it runs. You track it down eventually, but the meat is less than hoped.',
      'A jackrabbit and a grouse. Not a feast, but the pot will boil tonight.',
    ],
    low: [
      'The shot goes wide. The game scatters and you return to camp empty-handed.',
      'You track a deer for hours but never get a clean shot. The ammunition is wasted.',
      'No game today. The prairie is empty and the hunt returns nothing.',
    ],
  },
  pemmican_process: {
    high: [
      'The women work fast — slicing the lean meat into thin sheets, setting them on drying racks over the fire. By evening the flails are pounding, the kettles are rendering tallow, and the pemmican bags are being stitched shut with sinew. The crew will eat well for weeks.',
      'A full day of processing. The women move through the steps like a dance — slice, dry, pound, render, pack. The smell of boiling fat and dried meat fills the camp. Tomorrow the pemmican bags rest heavy in the cart.'
    ],
    mid: [
      'The work is steady but the yield is modest. Some meat dried well, some did not. The tallow is rendered but the bags are only half full. Enough to keep the crew fed.',
      'A few hours of slicing and drying. The sun is hot and the work is slow, but the pemmican takes shape. The women Knead and pack while the crew tends the fire.'
    ],
    low: [
      'The meat is lean and the drying is slow. A wasted afternoon — the forage returns nearly empty-handed, and the rations remain thin.',
      'The work drags. The heat spoils more than it preserves. The women do what they can, but the yield is poor.'
    ],
  },
  scout: {
    high: [
      'The scout returns with detailed news: the next stretch is clear, with good water and firm ground. You map the way forward with confidence.',
      'A successful reconnaissance. The scout finds the best path and marks it. Tomorrow\'s travel will be smoother.',
      'The scout spots a shortcut through a coulée that saves half a day. The trail ahead looks favorable.',
    ],
    low: [
      'The scout comes back with nothing. The trail ahead remains a mystery.',
      'The scouting party finds no clear path. You will have to feel your way forward tomorrow.',
      'The scout returns empty-handed. No shortcuts, no intelligence — just more trail.',
    ],
    mid: [
      'The scout brings back some useful information. Not a breakthrough, but enough to plan tomorrow\'s leg.',
    ],
  },
  repair: {
    high: [
      'The repair is sound. The shaganappi binds tight and the cart rolls smoother by morning. Good work.',
      'A clean repair job. The cartwright would be proud. The wear comes off and the cart feels solid again.',
    ],
    mid: [
      'A decent repair. The cart is sounder than before, and the shaganappi was well-used.',
      'The work holds. Not pretty, but the cart will make it to the next settlement.',
    ],
    low: [
      'The repair is rough but it holds. The shaganappi is well-spent, even if the work is ugly.',
      'The fix is imperfect. Some wear comes off, but the cart still groans. It will do until the next settlement.',
    ],
  },
  dance: {
    high: [
      'The fiddle starts and the crew dances until the fire burns low. Someone\'s boots throw sparks. A Red River jig, then a reel. Nobody talks about tomorrow.',
      'A night of song and dance. The old tunes from Red River ring out across the dark.',
      'The dancing is spirited and the stories are long. The crew goes to bed smiling.',
    ],
    low: [
      'A quiet night. A few songs, some half-hearted dancing. The mood lifts, but only a little.',
      'The crew is too tired for much revelry. A few tunes around the fire, then early sleep.',
    ],
    mid: [
      'A few songs. Some half-hearted dancing. Nobody\'s heart\'s in it, but the fire\'s warm and the night passes.',
      'A decent evening by the fire. Not the best night, but the spirits are lifted.',
    ],
  },
  deeprest: {
    high: [
      'Two days of proper rest. The crew emerges refreshed, the oxen are strong, and the cart feels lighter. The trail ahead looks better.',
      'A full deep rest. Hot food, long sleep, and time to mend what is broken. The crew is ready for whatever comes.',
    ],
    low: [
      'Two days lost to rest. The crew needed it, but the trail does not wait. Still, you leave camp stronger than you arrived.',
      'The deep rest costs time and food, but the crew needed it. Tomorrow you push forward with renewed strength.',
    ],
    mid: [
      'The rest does its work. Two days of recovery, and the crew is noticeably improved.',
    ],
  },
  push_on: {
    high: [
      'You drive on through the evening light. The cart groans but holds. Every mile gained is a mile closer.',
      'No rest, no respite. The oxen strain but the trail yields. You make camp after dark, exhausted but ahead.',
    ],
    low: [
      'The push costs dearly. The cart takes a beating, the crew is spent, and the food runs lower. But the trail does not wait.',
      'A hard push. The oxen are done, the crew is grumbling, and the cart axle groans louder than ever. But you gained ground.',
    ],
    mid: [
      'You press on without rest. The food runs lower, the cart takes wear, but the miles add up.',
      'No camp tonight. The trail stretches on, and so do you. Tomorrow will be harder, but today you gained ground.',
    ],
  },
};

function getCampFlavorText(type, rollTotal, effects, items) {
  const pool = CAMP_FLAVOR[type];
  if (!pool) return (effects || []).join('\n');
  let tier;
  if (type === 'rest') {
    tier = rollTotal >= 15 ? 'high' : rollTotal >= 8 ? 'mid' : 'low';
  } else if (type === 'forage') {
    tier = rollTotal >= 12 ? 'high' : rollTotal >= 8 ? 'mid' : 'low';
  } else if (type === 'hunt') {
    tier = rollTotal >= 10 ? 'high' : rollTotal >= 6 ? 'mid' : 'low';
  } else if (type === 'scout') {
    tier = rollTotal >= 12 ? 'high' : rollTotal >= 8 ? 'mid' : 'low';
  } else if (type === 'repair') {
    tier = rollTotal >= 9 ? 'high' : rollTotal >= 5 ? 'mid' : 'low';
  } else if (type === 'dance') {
    tier = rollTotal >= 10 ? 'high' : rollTotal >= 6 ? 'mid' : 'low';
  } else if (type === 'pemmican_process') {
    tier = rollTotal >= 12 ? 'high' : rollTotal >= 7 ? 'mid' : 'low';
  } else if (type === 'deeprest') {
    tier = rollTotal >= 10 ? 'high' : rollTotal >= 5 ? 'mid' : 'low';
  } else if (type === 'push_on') {
    tier = 'mid';
  } else {
    tier = 'mid';
  }
  const options = pool[tier] || pool.mid || [];
  if (!options.length) return (effects || []).join('\n');
  let flavor = options[Math.floor(Math.random() * options.length)];
  // Hunt: append pelt info if items were dropped
  if (type === 'hunt' && items && items.length > 0) {
    const peltNames = items.map(i => `${i.name} (${i.rarity})`).join(', ');
    flavor += ` You also recover: ${peltNames}.`;
  }
  return flavor + '\n' + (effects || []).join('\n');
}

function showCamp(game) {
  hideOverlays();
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
  // Reset camp dice display from previous camp
  const campRollEl = document.getElementById('camp-roll-display');
  if (campRollEl) { campRollEl.style.display = 'none'; campRollEl.innerHTML = ''; }

  const terrain = NODES[state.node]?.terrain || 'plains';
  const hasAmmo = game.getCart()?.some(i => i.name === 'Ammunition Belt' && i.count > 0);
  const hasShag = game.getCart()?.some(i => i.name === 'Shaganappi' && i.count > 0);

  // Action definitions with cost, risk, and flavor text
  const actions = [
    {
      type: 'rest', icon: '🛏️', label: 'Rest',
      cost: '1 food',
      risk: 'On fail: rough night, crew tired, +5 morale',
      flavor: 'Sleep under the stars. The oxen graze. The fire crackles low.',
      canDo: state.food >= 1,
      needRoll: true,
    },
    {
      type: 'forage', icon: '🌿', label: 'Forage',
      cost: '1 day',
      risk: 'On fail: lean haul, almost nothing found',
      flavor: 'Search the grass for wild turnips, saskatoon berries, edible roots.',
      canDo: true,
      needRoll: true,
    },
    {
      type: 'hunt', icon: '🏹', label: 'Hunt',
      cost: '1 Ammunition Belt · 1 day',
      risk: 'On fail: lose ammo, no pelts. Crit fail: morale −2',
      flavor: terrain === 'river_valley' ? 'Track beaver along the creek.'
        : terrain === 'uplands' ? 'Stalk elk through the high ground.'
        : terrain === 'wooded' ? 'Hunt deer at the forest edge.'
        : 'Stalk bison on the open prairie.',
      canDo: !!hasAmmo,
      needRoll: true,
    },
    {
      type: 'repair', icon: '🔧', label: 'Repair',
      cost: '1 Shaganappi',
      risk: 'On fail: shaganappi wasted. Crit fail: wear +1',
      flavor: 'Bind the wheels, lash the joints. Shaganappi holds the cart together.',
      canDo: !!hasShag && state.wear > 0,
      needRoll: true,
    },
    {
      type: 'scout', icon: '🔭', label: 'Scout',
      cost: '1 day',
      risk: 'On fail: nothing useful. Crit fail: next event has no warning',
      flavor: 'Ride ahead. Read the trail. Water, grass, and what lies beyond the next rise.',
      canDo: state.node < NODES.length - 1,
      needRoll: true,
    },
    {
      type: 'dance', icon: '🎻', label: 'Dance',
      cost: 'free',
      risk: 'On fail: half-hearted. Crit fail: morale −3',
      flavor: 'The fiddle starts. A Red River jig. Boots on hard ground. Nobody thinks about tomorrow.',
      canDo: true,
      needRoll: true,
    },
    {
      type: 'push_on',
      icon: '⏩',
      label: 'Push On',
      cost: '1.5 food · wear +1 · morale −5',
      risk: 'Skip camp. No recovery. Cart takes extra damage.',
      flavor: 'No rest. The trail does not wait. Drive on through the evening light.',
      canDo: true,
      needRoll: false,
    },
  ];

  // Reset UI for camp overlay
  if (actionsEl) {
    actionsEl.innerHTML = '';
    actionsEl.style.display = 'grid';

    actions.forEach((a) => {
      const card = document.createElement('div');
      card.className = 'camp-card';

      const nameRow = document.createElement('div');
      nameRow.className = 'camp-card-name';
      nameRow.innerHTML = `<span class="camp-card-icon">${a.icon}</span> ${a.label}`;

      const costRow = document.createElement('div');
      costRow.className = 'camp-card-cost';
      costRow.textContent = `Cost: ${a.cost}`;

      const riskRow = document.createElement('div');
      riskRow.className = 'camp-card-risk';
      riskRow.textContent = `Receive: ${a.risk}`;

      const flavorRow = document.createElement('div');
      flavorRow.className = 'camp-card-flavor';
      flavorRow.textContent = a.flavor;

      const btn = document.createElement('button');
      btn.className = 'camp-card-btn';
      btn.textContent = 'Do It';
      if (!a.canDo) {
        btn.disabled = true;
        btn.classList.add('disabled');
      }

      card.appendChild(nameRow);
      card.appendChild(costRow);
      card.appendChild(riskRow);
      card.appendChild(flavorRow);
      card.appendChild(btn);

      if (a.canDo) {
        btn.addEventListener('click', () => {
          // #81 — One action per camp visit: disable all other buttons
          document.querySelectorAll('.camp-card-btn').forEach(b => {
            b.disabled = true;
            b.classList.add('disabled');
          });

          let result;
          if (a.type === 'push_on') {
            pushOn(game);
            result = { effects: ['Pushed on — extra wear, less food, lower morale'], critical: false };
            // Push On doesn't stay in camp — close overlay immediately
            const after2 = game.getState();
            journalLog({
              day: after2.day,
              date: monthName(after2.month) + ' ' + after2.day,
              title: 'Camp: Push On',
              text: a.flavor,
              mech: `-1.5 Food · +1 Wear · -5 Morale`,
              collapsed: false,
            });
            document.getElementById('camp-overlay')?.classList.remove('active');
            window.__METIS_RENDER__();
            return;
          } else {
            result = game.campAction(a.type);
          }
          // Attach foodAfter for narrative templates (engine result doesn't include it)
          if (result && !result.error) {
            result.foodAfter = game.getState().food;
          }
          const errEl = document.getElementById('camp-result');
          const rollEl = document.getElementById('camp-roll-display');
          if (!result) {
            if (errEl) { errEl.style.display = 'block'; errEl.textContent = 'No result.'; }
            return;
          }
          if (result.error) {
            if (errEl) { errEl.style.display = 'block'; errEl.textContent = result.error; }
            return;
          }
          const after = game.getState();
          if (foodEl) foodEl.textContent = Math.floor(after.food);
          if (wearEl) wearEl.textContent = after.wear;
          if (moraleEl) moraleEl.textContent = after.morale;
          if (crewEl) crewEl.textContent = after.crew;
          if (subEl) subEl.textContent = `Day ${after.day} — ${after.season}`;

          // Hide all cards, show result
          document.querySelectorAll('.camp-card').forEach(c => { c.style.display = 'none'; });

          // Build rich flavor text for the result
          const flavorText = getCampFlavorText(a.type, result.rollTotal, result.effects, result.items);

          // Show dice roll if this action used one
          if (a.needRoll && result.roll !== null && rollEl) {
            const DC = {
              rest: 12, forage: 10, hunt: 10, repair: 8, scout: 9, dance: 8,
            }[a.type] || 10;
            const isSuccess = result.rollTotal >= DC;
            rollEl.style.display = 'flex';
            rollEl.innerHTML = `
              <div class="roll-label">Roll</div>
              <div class="die small font-spectral spin" id="camp-die">${result.roll}</div>
              <div class="roll-total">Need ${DC}+ ${isSuccess ? '✓' : '✗'}</div>
            `;
            // Animate the die
            const dieEl = document.getElementById('camp-die');
            if (dieEl) {
              let ticks = 0;
              const maxTicks = 6 + Math.floor(Math.random() * 4);
              const spinId = setInterval(() => {
                if (!dieEl.parentNode) { clearInterval(spinId); return; }
                dieEl.textContent = String(Math.floor(Math.random() * 20) + 1);
                ticks++;
                if (ticks >= maxTicks) {
                  clearInterval(spinId);
                  dieEl.textContent = String(result.roll);
                  dieEl.className = 'die small font-spectral settled ' + (isSuccess ? 'pass' : 'fail');
                  if (Haptics) Haptics.uiTap();
                  // Show result text after settle
                  if (errEl) {
                    errEl.style.display = 'block';
                    let html = '';
                    if (result.critical) {
                      html += '<div class="camp-critical">⚠ Critical Failure</div>';
                    }
                    html += flavorText;
                    errEl.innerHTML = html;
                  }
                  const continueEl = document.getElementById('camp-continue');
                  if (continueEl) continueEl.style.display = 'inline-block';
                }
              }, 60);
            }
          } else {
            // No dice — show result immediately
            if (errEl) {
              errEl.style.display = 'block';
              let html = '';
              if (result.critical) {
                html += `<div class="camp-critical">⚠ Critical Failure</div>`;
              }
              html += flavorText;
              errEl.innerHTML = html;
            }
            const continueEl = document.getElementById('camp-continue');
            if (continueEl) continueEl.style.display = 'inline-block';
          }

          // Log camp action to journal
          const actionLabels = {
            rest: 'Rest', forage: 'Forage', hunt: 'Hunt', repair: 'Repair',
            scout: 'Scout', dance: 'Dance', push_on: 'Push On',
          };
          const mechParts = [];
          if (after.food !== state.food) mechParts.push(`${after.food - state.food >= 0 ? '+' : ''}${(after.food - state.food).toFixed(1)} Food`);
          if (after.wear !== state.wear) mechParts.push(`Wear ${after.wear - state.wear >= 0 ? '+' : ''}${after.wear - state.wear}`);
          if (after.morale !== state.morale) mechParts.push(`Morale ${after.morale - state.morale >= 0 ? '+' : ''}${after.morale - state.morale}`);
          if (after.crew !== state.crew) mechParts.push(`Crew: ${state.crew} → ${after.crew}`);
          const cart = game.getCart();
          const weather = after.weather || 'clear';
          const campEntry = buildCampEntry(a.type, result, 0, cart, weather);
          const campReflection = buildCampReflection(a.type, result, cart, weather, after.day);
          journalLog({
            day: after.day,
            date: monthName(after.month) + ' ' + after.day,
            title: `Camp: ${actionLabels[a.type] || a.type}`,
            text: campReflection,
            dice: result.roll !== null ? `Rolled ${result.roll} — need ${({rest:12,forage:10,hunt:10,repair:8,scout:9,dance:8,pemmican_process:10}[a.type]||10)}+ — ${result.rollTotal >= ({rest:12,forage:10,hunt:10,repair:8,scout:9,dance:8,pemmican_process:10}[a.type]||10) ? '✓ Success' : '✗ Failure'}${result.critical ? ' — ⚠ CRITICAL' : ''}` : null,
            mech: mechParts.join(' · '),
            collapsed: false,
          });
        });
      }

      actionsEl.appendChild(card);
    });
  }

  // Wire the Continue West button
  const campContinueBtn = document.getElementById('camp-continue');
  if (campContinueBtn) {
    campContinueBtn.onclick = () => {
      document.getElementById('camp-overlay')?.classList.remove('active');
      window.__METIS_RENDER__();
    };
  }

  document.getElementById('camp-overlay')?.classList.add('active');
}

function showEnd(game) {
  hideOverlays();
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
      const rawQuote = quoteData.quote;
      const quote = rawQuote.replace(/^"|"$/g, '');
      const author = quoteData.author || '';
      const work = quoteData.work || '';
      const year = quoteData.year || '';
      const attrib = [author, work, year].filter(Boolean).join(', ');
      sourceEl.innerHTML = `<span class="src-quote">"${quote}"</span>` + (attrib ? `<span class="src-attrib">— ${attrib}</span>` : '') + (quoteData.context ? `<span class="src-context">${quoteData.context}</span>` : '');
      sourceEl.style.display = 'block';
    } else {
      sourceEl.style.display = 'none';
    }
  }

  // Detailed scoring breakdown — use engine's getEndgameScore
  let scoreLines;
  try {
    const scoreData = game.getEndgameScore();
    const bd = scoreData?.breakdown || {};
    const safeNum = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? Math.round(n) : 0;
    };
    scoreLines = [
      { label: 'Base score', value: safeNum(bd.base) },
      { label: 'Trade goods delivered', value: safeNum(bd.tradeGoods) },
      { label: `Food bonus (${Math.min(safeNum(state.food), 25)} × 12)`, value: safeNum(bd.foodBonus) },
      { label: `Crew condition (${state.crew || 'unknown'})`, value: safeNum(bd.crewCondition) },
      { label: `Days on trail (${safeNum(state.day)} × -8)`, value: safeNum(bd.daysPenalty) },
      { label: `Cart wear (${safeNum(state.wear)}² × -40)`, value: safeNum(bd.wearPenalty) },
    ];
  } catch(e) {
    console.warn('[Metis] Score calc error:', e);
    scoreLines = [
      { label: 'Base score', value: 500 },
      { label: 'MB value', value: 0 },
      { label: 'Food bonus', value: 0 },
      { label: 'Crew condition', value: 0 },
      { label: 'Days on trail', value: 0 },
      { label: 'Cart wear', value: 0 },
    ];
  }
  const totalScore = (() => {
    try { return Math.max(0, Math.round(Number(game.getEndgameScore()?.score) || 0)); }
    catch(e) { return 0; }
  })();

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
    ${!isVictory ? `<div class="stat-row" style="color:#8B2500;font-style:italic;margin-top:8px;">Journey ended before reaching Edmonton — trade goods not delivered.</div>` : ''}
    <div style="margin-top:10px;padding:8px;background:rgba(184,134,11,0.08);border-left:2px solid #B8860B;font-size:11px;color:#5a4a3a;line-height:1.5;">
      ${ending.tip}
    </div>
  `;

  statsEl.innerHTML = scoreHtml;
  document.getElementById('end-overlay')?.classList.add('active');

  // Auto-save score to Firebase
  const playerName = localStorage.getItem('metisPlayerName') || '';
  const scoreData = game.getScoreData();
  saveScore(scoreData, playerName).then((result) => {
    if (result.local) {
      console.log('[Metis] Score saved locally (Firestore unavailable)');
    } else {
      console.log('[Metis] Score saved to Firestore:', result.id);
    }
  });

  // Show "View Hall of Fame" button on end screen instead of auto-popup
  const endCard = document.querySelector('#end-overlay .end-card');
  if (endCard && !document.getElementById('end-leaderboard-btn')) {
    const lbBtn = document.createElement('button');
    lbBtn.id = 'end-leaderboard-btn';
    lbBtn.className = 'restart-btn end-btn';
    lbBtn.textContent = '🏆 View Hall of Fame';
    lbBtn.onclick = () => showLeaderboard();
    endCard.appendChild(lbBtn);
  }
}

// ── Leaderboard ─────────────────────────────────────────────────────

let cachedTopScores = null;
let cachedMyScores = null;

function showLeaderboard() {
  hideOverlays();
  document.getElementById('leaderboard-overlay')?.classList.add('active');
  loadHallOfFame();
  loadMyScores();
}

function loadHallOfFame() {
  const container = document.getElementById('lb-hall-of-fame');
  if (!container) return;
  container.innerHTML = '<div class="lb-loading">Loading...</div>';

  getTopScores().then((scores) => {
    cachedTopScores = scores;
    if (!scores || scores.length === 0) {
      container.innerHTML = '<div class="lb-empty">No scores yet. Be the first!</div>';
      return;
    }
    container.innerHTML = '<div class="lb-list">' + scores.map((s, i) => renderLbEntry(s, i + 1)).join('') + '</div>';
  }).catch((err) => {
    console.warn('[Metis] Hall of Fame load failed:', err);
    container.innerHTML = '<div class="lb-error">Leaderboard unavailable — playing offline</div>';
  });
}

function loadMyScores() {
  const container = document.getElementById('lb-my-list');
  if (!container) return;
  container.innerHTML = '<div class="lb-loading">Loading...</div>';

  const name = localStorage.getItem('metisPlayerName') || '';
  if (!name) {
    container.innerHTML = '<div class="lb-empty">Set your party name in the intro to track personal scores.</div>';
    return;
  }

  getMyScores(name).then((scores) => {
    cachedMyScores = scores;
    if (!scores) {
      document.getElementById('lb-my-list').innerHTML = '<div class="lb-error">Unable to load personal scores — playing offline</div>';
      return;
    }
    if (scores.length === 0) {
      document.getElementById('lb-my-list').innerHTML = '<div class="lb-empty">No personal scores yet. Play a game!</div>';
      return;
    }
    renderMyScoresSorted();
  }).catch((err) => {
    console.warn('[Metis] My Scores load failed:', err);
    document.getElementById('lb-my-list').innerHTML = '<div class="lb-error">Unable to load personal scores — playing offline</div>';
  });
}

function renderMyScoresSorted() {
  const container = document.getElementById('lb-my-list');
  if (!container || !cachedMyScores) return;
  const sortKey = document.getElementById('lb-sort-select')?.value || 'score';
  const sorted = sortScores(cachedMyScores, sortKey);
  container.innerHTML = '<div class="lb-list">' + sorted.map((s, i) => renderLbEntry(s, i + 1)).join('') + '</div>';
}

function sortScores(scores, key) {
  const copy = [...scores];
  switch (key) {
    case 'score': return copy.sort((a, b) => (b.score || 0) - (a.score || 0));
    case 'day': return copy.sort((a, b) => (b.day || 0) - (a.day || 0));
    case 'wear': return copy.sort((a, b) => (b.wear || 0) - (a.wear || 0));
    case 'food-asc': return copy.sort((a, b) => (a.food || 0) - (b.food || 0));
    case 'tradesMade': return copy.sort((a, b) => (b.tradesMade || 0) - (a.tradesMade || 0));
    case 'nodes': return copy.sort((a, b) => (b.nodes || 0) - (a.nodes || 0));
    case 'eventsResolved': return copy.sort((a, b) => (b.eventsResolved || 0) - (a.eventsResolved || 0));
    case 'morale': return copy.sort((a, b) => (b.morale || 0) - (a.morale || 0));
    default: return copy;
  }
}

function renderLbEntry(s, rank) {
  const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
  const icon = s.won ? '🏆' : '💀';
  const dateStr = s.date?.toDate ? s.date.toDate().toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }) : '';
  const metaLabel = s.won ? `${s.day || 0}d` : (s.endReason || '').replace(/_/g, ' ');
  return `
    <div class="lb-entry">
      <span class="lb-rank ${rankClass}">#${rank}</span>
      <span class="lb-icon">${icon}</span>
      <span class="lb-name">${escapeHtml(s.name || 'Traveller')}</span>
      <span class="lb-score">${s.score || 0}</span>
      <span class="lb-meta">${dateStr} · ${metaLabel}</span>
    </div>`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Expose render globally for event listener callbacks
window.__METIS_RENDER__ = render;

// ── Leaderboard event listeners ─────────────────────────────────────

document.addEventListener('click', (e) => {
  // Tab switching
  const tabBtn = e.target.closest('.lb-tab');
  if (tabBtn) {
    document.querySelectorAll('.lb-tab').forEach((t) => t.classList.remove('active'));
    tabBtn.classList.add('active');
    const tab = tabBtn.getAttribute('data-tab');
    document.getElementById('lb-hall-of-fame').style.display = tab === 'hall-of-fame' ? 'block' : 'none';
    document.getElementById('lb-my-scores').style.display = tab === 'my-scores' ? 'block' : 'none';
  }
  // Close button
  if (e.target.closest('#leaderboard-close')) {
    document.getElementById('leaderboard-overlay')?.classList.remove('active');
  }
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'lb-sort-select') {
    renderMyScoresSorted();
  }
});
