import { createGame } from './systems/engine.js';
import { mount, find } from './ui/shell.js';
import { renderStatusBar, journalLog, initMap, updateMap, monthName } from './ui/renderer.js';
import { saveGame, loadGame, clearSave } from './ui/persistence.js';
import { mountDebugUI } from './ui/debug.js';
import { applyTheme } from './ui/theme.js';
import { NODES } from './data/nodes.js';
import { ENDINGS } from './data/endings.js';
import { CONSTANTS } from './core/constants.js';
import { saveScore, getTopScores, getMyScores, syncLocalScores } from './firebase.js';
import Haptics from './ui/haptics.js';
import { getItemIcon } from './ui/icons.js';

// Sync any locally-saved scores on page load
syncLocalScores();

// First-person travel journal entry generator
function buildTravelJournalEntry(prevNode, node, after, prevWear) {
  if (!prevNode || !node) {
    return 'Another day on the Carlton Trail. The prairie stretches on, dry and endless.';
  }

  const openings = [
    `We pushed west from ${prevNode.name}, heading toward ${node.name}.`,
    `The cart rolled out of ${prevNode.name} at first light. ${node.name} lies ahead.`,
    `Left ${prevNode.name} behind. The road to ${node.name} beckons.`,
    `We broke camp and set our faces west — ${node.name} was the day's goal.`,
    `Dawn found us loading up and moving on. ${prevNode.name} gave way to open trail.`,
  ];

  const middles = [
    `The wheels creak beneath our load. The oxen plod on, patient as the grass.`,
    `A long day under a wide sky. Not a tree for miles, just the big empty.`,
    `The trail winds through grass taller than a man on horseback.`,
    `Clouds built in the west but held their rain. We counted the oxen at midday — all present.`,
    `The jingle of harness, the groan of the cart. The rhythm of the trail.`,
  ];

  const wear = after.wear > prevWear
    ? ' The cart took a beating on the rough trail — the axle groans louder now.'
    : '';

  const weather = after.weather && after.weather !== 'clear'
    ? ` ${({ overcast: 'A grey ceiling of cloud followed us all day.', rain: 'A cold rain came on by noon — we huddled under canvas.', storm: 'Thunder rolled across the prairie. We pressed on regardless.', snow: 'Snow fell fine as powder, dusting the oxen\'s backs.' })[after.weather] || ''}`
    : '';

  // Pick varied fragments based on day number to avoid repetition
  const day = after.day || 1;
  const opening = openings[day % openings.length];
  const middle = middles[(day * 3) % middles.length];

  return `${opening}${wear}${weather} ${middle}`;
}

// First-person event journal entry generator
function buildEventJournalEntry(eventData, result) {
  const desc = eventData.text || 'Something happened on the trail.';
  if (!result || result.roll === null) {
    return desc;
  }
  const outcome = result.text || (result.success ? 'It went well enough.' : 'That did not go as hoped.');
  // Strip "Success. " / "Failure. " prefix for cleaner prose
  const clean = outcome.replace(/^(Success|Failure)\.\s*/, '');
  return `${desc} ${clean}`;
}

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
  renderNarrative(['Welcome to the Métis Trail. Click Begin Journey to start.']);
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

  // Profanity filter for party names
  const PROFANE = /\b(f+u+c+k+|s+h+i+t+|b+i+t+c+h+|a+s+s+h+o+l+e+|d+a+m+n+|c+u+n+t+|f+a+g+|n+i+g+g+|r+e+t+a+r+d+|w+h+o+r+e+|s+l+u+t+|p+i+s+s+|t+i+t+s+|d+i+c+k+|p+u+s+s+y+|c+o+c+k+|m+e+r+d+e+|p+u+t+a+|b+a+r+d+a+s+h+|b+o+r+d+e+l+|c+h+i+n+k+|g+o+o+k+|k+i+k+e+|s+p+i+c+|w+e+t+b+a+c+k+|t+r+a+n+n+y+|d+y+k+e+|k+a+f+i+r+|m+u+l+a+t+t+o+|p+a+k+i+|s+q+u+a+w+|w+o+g+|z+i+g+g+e+r+)\b/gi;
  function sanitizeName(raw) {
    let cleaned = raw.replace(PROFANE, (m) => '*'.repeat(m.length));
    // Also block names that are just symbols/numbers
    if (!/[a-zA-Z]/.test(cleaned)) cleaned = 'Traveller';
    return cleaned.substring(0, 32);
  }

  // Event delegation on #game-root survives DOM rebuilds from render()
  const gameRoot = find('#game-root');
  if (gameRoot) {
    gameRoot.addEventListener('click', (e) => {
      if (e.target.closest('#intro-start')) {
        // Save player name (sanitized)
        const rawName = nameInput?.value?.trim() || '';
        const nameVal = sanitizeName(rawName) || 'Traveller';
        if (nameVal) {
          localStorage.setItem('metisPlayerName', nameVal);
        }
        // Update input to show sanitized version
        if (nameInput && rawName !== nameVal) {
          nameInput.value = nameVal;
        }
        const introOverlay = find('#intro-overlay');
        if (introOverlay) {
          introOverlay.classList.remove('active');
          introOverlay.setAttribute('hidden', '');
        }
        // If pre-departure is enabled, show it now
        const currentState = game.getState();
        if (currentState.preDeparture) {
          showShop(game);
        } else {
          window.__METIS_RENDER__();
        }
      }
    });
  } else {
    console.warn('Metis bootstrap: #game-root not found; Begin Journey button is offline.');
  }

  // Delegated click for pre-departure confirm button (outside #game-root)
  document.addEventListener('click', (e) => {
    if (e.target.closest('#pd-confirm')) {
      e.preventDefault();
      e.stopPropagation();
      const btn = e.target.closest('#pd-confirm');
      if (btn.disabled) return;
      const game = window._metisGame;
      // Get shop state from showShop closure via window
      if (window.__METIS_SHOP_ITEMS && window.__METIS_SHOP_PURCHASED) {
        window.__METIS_SHOP_ITEMS.forEach(item => {
          if (window.__METIS_SHOP_PURCHASED[item.name] > 0) {
            for (let i = 0; i < window.__METIS_SHOP_PURCHASED[item.name]; i++) {
              if (item.category === 'provisions') {
                game.addFood(item.count);
              } else {
                game.buyItem(item.name, item.wt, item.category);
              }
            }
          }
        });
      }
      game.confirmPreDeparture();
      document.getElementById('predeparture-overlay')?.classList.remove('active');
      window.__METIS_RENDER__();
    }
  });

  const travelBtn = find('#btn-travel');
  if (travelBtn) {
    travelBtn.addEventListener('click', () => {
      const { pendingEvent, pendingSettlement, over } = game.getState();
      if (pendingEvent || pendingSettlement || over) return;
      const prevWear = game.getState().wear;
      const blocked = travelOneDay();
      Haptics.travel();
      if (blocked === true) return;
      // Play wear damage sound if wear increased
      const after = game.getState();
      if (after.wear > prevWear) Haptics.wear();
      // Log travel to journal
      const node = NODES[after.node];
      const prevNode = NODES[after.node - 1];
      journalLog({
        day: after.day,
        date: monthName(after.month) + ' ' + after.day,
        title: 'On the Trail',
        text: buildTravelJournalEntry(prevNode, node, after, prevWear),
        mech: after.wear > prevWear ? 'Wear +1' : '',
        collapsed: true
      });
      window.__METIS_RENDER__();
    });
    travelBtn.setAttribute('data-metis-travel-bound', '1');
  }

  const campClose = find('#camp-close-btn');
  const campContinue = find('#camp-continue');

  if (campClose) campClose.onclick = () => find('#camp-overlay')?.classList.remove('active');
  if (campContinue) {
    campContinue.onclick = () => {
      find('#camp-overlay')?.classList.remove('active');
      // After camp action, the travel loop waits for user to press Travel again
    };
  }

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
    const st = game.getState().pendingSettlement;
    const after = game.getState();
    if (st) {
      journalLog({
        day: after.day,
        date: monthName(after.month) + ' ' + after.day,
        title: `Arrived at ${st.name}`,
        text: st.desc || `${st.name} — a ${st.type} settlement on the Carlton Trail.`,
        mech: '',
        collapsed: true,
      });
    }
    game.settlementAction('continue');
    find('#settlement-overlay')?.classList.remove('active');
    window.__METIS_RENDER__();
  };

  const settlementClose = find('#settlement-close');
  if (settlementClose) settlementClose.onclick = () => {
    const st = game.getState().pendingSettlement;
    const after = game.getState();
    if (st) {
      journalLog({
        day: after.day,
        date: monthName(after.month) + ' ' + after.day,
        title: `Arrived at ${st.name}`,
        text: st.desc || `${st.name} — a ${st.type} settlement on the Carlton Trail.`,
        mech: '',
        collapsed: true,
      });
    }
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
    // Roll line
    const rollHtml = `<span class="outcome-roll">Rolled ${result.roll} — need ${result.dc}+</span>`;
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
  hideOverlays();
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
        const mechParts = [];
        if (after.food !== diceResult.before.food) mechParts.push(`${after.food - diceResult.before.food >= 0 ? '+' : ''}${(after.food - diceResult.before.food).toFixed(1)} Food`);
        if (after.wear !== diceResult.before.wear) mechParts.push(`Wear ${after.wear - diceResult.before.wear >= 0 ? '+' : ''}${after.wear - diceResult.before.wear}`);
        if (after.morale !== diceResult.before.morale) mechParts.push(`Morale ${after.morale - diceResult.before.morale >= 0 ? '+' : ''}${after.morale - diceResult.before.morale}`);
        if (after.crew !== diceResult.before.crew) mechParts.push(`Crew: ${diceResult.before.crew} → ${after.crew}`);
        journalLog({
          day: after.day,
          date: monthName(after.month) + ' ' + after.day,
          title: eventData.classification || 'Event',
          text: buildEventJournalEntry(eventData, res),
          dice: res && res.roll !== null ? `Rolled ${res.roll} — need ${res.dc}+ — ${res.success ? '✓ Success' : '✗ Failure'}` : null,
          mech: mechParts.join(' · '),
          collapsed: true,
        });
      }
      diceResult = null;
      eventData = null;
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
    msgs.push(`Rolled ${res.roll} (needed ${res.dc}+): ${res.success ? 'Success' : 'Failure'}`);
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
  Haptics.arrive();
  const state = game.getState();
  const node = game.getCurrentNode();
  const before = game.getState();
  const beforeCart = game.getCart();

  const nameEl = document.getElementById('settlement-name');
  const badgeEl = document.getElementById('settlement-badge');
  const distanceEl = document.getElementById('settlement-distance');
  const descEl = document.getElementById('settlement-desc');
  const actionsEl = document.getElementById('settlement-actions');
  if (!nameEl || !badgeEl || !distanceEl || !descEl || !actionsEl) return;

  // Settlement header
  nameEl.textContent = node.name;
  
  // Type badge
  const typeLabels = { hbc: 'HBC Fort', metis: 'Métis Camp', nwmp: 'NWMP Post', mission: 'Mission', trading: 'Trading Post' };
  badgeEl.textContent = typeLabels[node.type] || node.type.toUpperCase();
  badgeEl.className = 'settlement-badge ' + (node.type || 'hbc');
  
  // Distance from Fort Garry
  const distKm = Math.round((node.dist || 0) * 50); // approximate km per segment
  distanceEl.textContent = `${distKm} km from Fort Garry`;
  
  // Description
  descEl.textContent = node.desc || '';

  // Clear actions
  actionsEl.innerHTML = '';

  // Get settlement-specific actions from engine
  const actions = game.getSettlementActions(node.type);
  
  // Render each action as a card (matching camp card pattern)
  actions.forEach((action) => {
    renderSettlementActionCard(actionsEl, action, game, before, beforeCart, node);
  });

  document.getElementById('settlement-overlay')?.classList.add('active');
}

function renderSettlementActionCard(container, action, game, before, beforeCart, node) {
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
  riskRow.textContent = `Risk: ${action.risk}`;

  const flavorRow = document.createElement('div');
  flavorRow.className = 'settlement-action-card-flavor';
  flavorRow.textContent = action.flavor;

  const btn = document.createElement('button');
  btn.className = 'settlement-action-card-btn';
  btn.textContent = 'Do It';

  // Determine if action can be performed
  const state = game.getState();
  const cart = game.getCart();
  const credit = state.credit?.[node.type] || 0;
  let canDo = true;
  let needsHide = true;

  // Check preconditions for each action
  switch (action.id) {
    case 'trade':
      canDo = cart.some(i => i.type === 'trade' && i.count > 0);
      break;
    case 'buy_supplies':
      canDo = credit > 0;
      break;
    case 'rest':
      canDo = state.food >= 1;
      break;
    case 'get_intel':
      canDo = credit >= 1;
      break;
    case 'trade_gossip':
      canDo = true;
      break;
    case 'recruit_crew':
      canDo = credit >= 2 && state.food >= 1 && (state.crewCount || 3) < 6;
      break;
    case 'dance':
      canDo = state.food >= 1;
      break;
    case 'share_food':
      canDo = state.food >= 2;
      break;
    case 'craft_hides':
      const hides = cart.find(i => i.name === 'Bison Hide' || i.name === 'Beaver Pelts' || i.name === 'Elk Hide' || i.name === 'Deer Hide');
      const shag = cart.find(i => i.name === 'Shaganappi');
      canDo = (hides?.count || 0) >= 3 && (shag?.count || 0) >= 1;
      break;
    case 'pay_fines':
      canDo = (state.fines || 0) > 0 && credit >= (state.fines || 0);
      break;
    case 'get_permits':
      canDo = credit >= 2;
      break;
    case 'report_duty':
      canDo = true;
      break;
    case 'buy_ammo':
      canDo = credit >= 1.5;
      break;
    case 'heal_crew':
      const med = cart.find(i => i.name === 'Medicine Pouch');
      canDo = credit >= 2 || (med?.count || 0) >= 1;
      break;
    case 'get_blessing':
      canDo = state.food >= 1;
      break;
    case 'trade_limited':
      canDo = true;
      break;
  }

  if (!canDo) {
    btn.disabled = true;
    btn.classList.add('disabled');
  }

  // Special handling for trade: show sub-options for each trade good
  if (action.id === 'trade') {
    const tradeItems = cart.filter(i => i.type === 'trade' && i.count > 0);
    if (tradeItems.length === 0) {
      btn.disabled = true;
      btn.classList.add('disabled');
    } else {
      btn.onclick = () => {
        // Expand to show individual trade goods
        card.querySelectorAll('.settlement-trade-sub').forEach(el => el.remove());
        tradeItems.forEach(item => {
          const mbVal = item.mbValue || 1;
          const subRow = document.createElement('div');
          subRow.className = 'settlement-trade-sub';
          subRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;margin:4px 0;padding:6px;background:rgba(255,255,255,0.5);border-radius:4px;font-size:12px;';
          subRow.innerHTML = `${getItemIcon(item.name)} ${item.name} ×${item.count} <span style="color:var(--clr-accent);">→ ${mbVal} MB each</span>`;
          const subBtn = document.createElement('button');
          subBtn.className = 'ctrl-btn';
          subBtn.style.cssText = 'padding:2px 8px;font-size:10px;white-space:nowrap;';
          subBtn.textContent = `Trade 1`;
          subBtn.onclick = () => {
            hideOverlays();
            const beforeMB = game.getState().mbValue;
            game.settlementAction('trade');
            const afterMB = game.getState().mbValue;
            const gained = (item.mbValue || 1);
            publishResult(`Traded 1 ${item.name} → +${gained.toFixed(2)} MB credit.`);
            window.__METIS_RENDER__();
          };
          subRow.appendChild(subBtn);
          card.appendChild(subRow);
        });
        btn.textContent = 'Hide';
        btn.onclick = () => {
          card.querySelectorAll('.settlement-trade-sub').forEach(el => el.remove());
          btn.textContent = 'Trade';
          btn.onclick = () => {};
        };
      };
    }
  } else {
    btn.onclick = () => {
      if (!canDo) return;
      if (needsHide) hideOverlays();
      const st = game.getState().pendingSettlement;
      const beforeJournal = game.getState();
      const result = game.settlementAction(action.id);
      const after = game.getState();
      const afterCart = game.getCart();
      const outcome = buildSettlementOutcome(action.id, beforeJournal, after, beforeCart, afterCart);
      if (outcome) publishResult(outcome);
      // Log settlement action to journal
      if (st) {
        const mechParts = [];
        if (after.food !== beforeJournal.food) mechParts.push(`${after.food - beforeJournal.food >= 0 ? '+' : ''}${(after.food - beforeJournal.food).toFixed(1)} Food`);
        if (after.wear !== beforeJournal.wear) mechParts.push(`Wear ${after.wear - beforeJournal.wear >= 0 ? '+' : ''}${after.wear - beforeJournal.wear}`);
        if (after.morale !== beforeJournal.morale) mechParts.push(`Morale ${after.morale - beforeJournal.morale >= 0 ? '+' : ''}${after.morale - beforeJournal.morale}`);
        if (after.crew !== beforeJournal.crew) mechParts.push(`Crew: ${beforeJournal.crew} → ${after.crew}`);
        journalLog({
          day: after.day,
          date: monthName(after.month) + ' ' + after.day,
          title: `${action.label} at ${st.name}`,
          text: buildSettlementJournalText(action.id, st),
          mech: mechParts.join(' · '),
          collapsed: true,
        });
      }
      window.__METIS_RENDER__();
    };
  }

  card.appendChild(nameRow);
  card.appendChild(costRow);
  card.appendChild(riskRow);
  card.appendChild(flavorRow);
  card.appendChild(btn);

  container.appendChild(card);
}

function buildSettlementOutcome(action, before, after, beforeCart, afterCart) {
  const msgs = [];
  if (after.food !== before.food) msgs.push(`${after.food - before.food >= 0 ? '+' : ''}${after.food - before.food} Food`);
  if (after.wear !== before.wear) msgs.push(`Wear ${after.wear - before.wear >= 0 ? '+' : ''}${after.wear - before.wear}`);
  if (after.morale !== before.morale) msgs.push(`Morale ${after.morale - before.morale >= 0 ? '+' : ''}${after.morale - before.morale}`);
  if (after.crew !== before.crew) msgs.push(`Crew: ${before.crew} -> ${after.crew}`);
  if (after.day !== before.day) msgs.push(`${after.day - before.day} Day(s)`);
  if (action === 'trade') {
    const lost = beforeCart.reduce((s, i) => s + i.count, 0) - afterCart.reduce((s, i) => s + i.count, 0);
    if (lost > 0) msgs.push(`Traded ${lost} good(s) for MB credit.`);
  }
  if (action === 'buy_food') msgs.push('Bought food with MB credit.');
  if (action === 'buy_repair') msgs.push('Repaired cart with MB credit.');
  if (action === 'buy_heal') msgs.push('Healed crew with MB credit.');
  if (action === 'buy_info') msgs.push('Gathered trail intelligence.');
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
    ? `<div style="margin-bottom:10px;padding:8px;background:rgba(180,60,60,0.15);border:1px solid rgba(180,60,60,0.4);border-radius:0;"><div style="font-weight:700;color:#8B0000;">⚠ Overloaded — ${state.usedWeight} / ${state.capacity} kg</div><div style="font-size:0.9em;color:#8B0000;margin-top:2px;">Offload at least <strong>${excess} kg</strong> before traveling.</div></div>`
    : `<div style="margin-bottom:10px;padding:8px;background:rgba(46,90,62,0.12);border:1px solid rgba(46,90,62,0.3);border-radius:0;"><div style="font-weight:700;color:#2D4A3E;">Cart — ${state.usedWeight} / ${state.capacity} kg</div></div>`;

  const items = cart
    .map((i) => {
      const canUnload = i.count > 0;
      const hint = i.category ? getCategoryHint(i.category) : '';
      const desc = i.desc ? `<div style="font-size:0.8em;color:#5a4a3a;margin-top:2px;">${i.desc}</div>` : '';
      const mbStr = (i.type === 'trade' || i.category === 'furs') && i.mbValue
        ? `<span style="color:var(--clr-accent);font-size:0.85em;margin-left:4px;">${i.mbValue} ₥</span>`
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
      const itemName = btn.dataset.item;
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
    furs: 'Trade goods. Sell at settlements for ₥ credit. Need ₥ to win.',
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
  const balanceEl = document.getElementById('shop-balance');
  const shopStatusEl = document.getElementById('shop-status');
  const foodCountEl = document.getElementById('shop-food-count');

  if (!listEl || !weightEl || !currentEl || !statusEl || !confirmBtn || !balanceEl || !shopStatusEl || !foodCountEl) return;

  // Starting ₥ from trade goods in cart
  let balance = game.getCart().reduce((sum, i) => sum + (i.mbValue || 0) * i.count, 0);
  const startingBalance = balance;

  // Shop items: name, description, price, category, weight
  const shopItems = [
    { name: 'Pemmican Rations', desc: 'Dried meat and fat. 1 food/day keeps the crew alive.', price: 2.5, category: 'provisions', wt: 2.5, count: 5 },
    { name: 'Spare Axle', desc: 'Hard maple. Heavy but essential for a Red River cart.', price: 3.0, category: 'parts', wt: 15, count: 1 },
    { name: 'Shaganappi', desc: 'Rawhide strips. Binding, lashing, and cart repair.', price: 1.5, category: 'repair', wt: 3, count: 3 },
    { name: 'Tool Kit', desc: 'Axe, auger, drawknife. Required for major repairs.', price: 2.5, category: 'parts', wt: 8, count: 1 },
    { name: 'Canvas Tarp', desc: 'Waterproof. Shelter and cart-raft conversion.', price: 2.0, category: 'shelter', wt: 4, count: 1 },
    { name: 'Firewood Bundle', desc: 'Dried poplar. Required for cold nights.', price: 1.0, category: 'fuel', wt: 6, count: 2 },
    { name: 'Rope (50ft)', desc: 'Hemp. Crossings, repairs, binding.', price: 1.5, category: 'parts', wt: 3, count: 1 },
    { name: 'Ammunition Belt', desc: 'Shot and ball. For hunting and defence.', price: 2.0, category: 'hunting', wt: 2, count: 1 },
    { name: 'Medicine Pouch', desc: 'Herbal remedies and bandages.', price: 3.0, category: 'medical', wt: 1.5, count: 1 },
    { name: 'Blanket', desc: 'Wool. Winter survival.', price: 2.0, category: 'shelter', wt: 3, count: 2 },
  ];

  // Track purchased counts
  const purchased = {};
  shopItems.forEach(item => { purchased[item.name] = 0; });

  // Expose for delegated confirm handler
  window.__METIS_SHOP_ITEMS = shopItems;
  window.__METIS_SHOP_PURCHASED = purchased;

  function recalc() {
    let totalWeight = 0;
    let totalFood = 0;
    shopItems.forEach(item => {
      totalWeight += item.wt * purchased[item.name];
      if (item.category === 'provisions') totalFood += purchased[item.name] * 5; // 5 rations per purchase
    });
    // Add trade goods weight
    const cart = game.getCart();
    cart.forEach(i => { totalWeight += i.wt * i.count; });

    currentEl.textContent = totalWeight.toFixed(1);
    balanceEl.textContent = Math.round(balance);
    foodCountEl.textContent = 'Food: ' + totalFood;

    const capacity = state.capacity;
    weightEl.classList.remove('over', 'at-capacity', 'under');
    statusEl.classList.remove('over', 'at-capacity', 'under');

    if (totalWeight > capacity) {
      weightEl.classList.add('over');
      statusEl.classList.add('over');
      statusEl.textContent = `${(totalWeight - capacity).toFixed(1)} kg over`;
      confirmBtn.disabled = true;
    } else {
      weightEl.classList.add('under');
      statusEl.classList.add('under');
      statusEl.textContent = `${(capacity - totalWeight).toFixed(1)} kg spare`;
      confirmBtn.disabled = totalFood < 10;
      if (totalFood < 10) {
        shopStatusEl.textContent = `Need ${10 - totalFood} more food to begin.`;
        shopStatusEl.style.color = 'var(--clr-danger)';
      } else {
        shopStatusEl.textContent = 'Ready to depart!';
        shopStatusEl.style.color = 'var(--clr-success)';
      }
    }
  }

  function renderList() {
    listEl.innerHTML = shopItems.map(item => {
      const canBuy = balance >= item.price;
      const itemWeight = (item.wt * item.count).toFixed(1);
      const qty = purchased[item.name];
      return `
    <div class="pd-row" data-item="${item.name}">
      <div class="pd-item-info">
        <span class="pd-icon">${getItemIcon(item.name)}</span>
        <span class="pd-name">${item.name}</span>
        <div style="font-size:0.75em;color:var(--clr-muted);margin-top:2px;">${item.desc}</div>
      </div>
      <div class="pd-controls">
        <span class="pd-count">${qty > 0 ? '×' + qty : '—'}</span>
        <button class="pd-buy" data-item="${item.name}" ${canBuy ? '' : 'disabled'}>Buy (${item.price} ₥)</button>
        ${qty > 0 ? `<button class="pd-remove" data-item="${item.name}">Remove</button>` : ''}
        <span class="pd-weight">${itemWeight} kg</span>
      </div>
    </div>`;
    }).join('');

    listEl.querySelectorAll('.pd-buy').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.item;
        const item = shopItems.find(i => i.name === name);
        if (item && balance >= item.price) {
          balance -= item.price;
          purchased[item.name]++;
          recalc();
          renderList();
        }
      });
    });

    listEl.querySelectorAll('.pd-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.item;
        const item = shopItems.find(i => i.name === name);
        if (item && purchased[item.name] > 0) {
          balance += item.price;
          purchased[item.name]--;
          recalc();
          renderList();
        }
      });
    });
  }

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
};

function getCampFlavorText(type, rollTotal, effects) {
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
  } else {
    tier = 'mid';
  }
  const options = pool[tier] || pool.mid || [];
  if (!options.length) return (effects || []).join('\n');
  const flavor = options[Math.floor(Math.random() * options.length)];
  return flavor + '\n' + (effects || []).join('\n');
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
      type: 'pemmican_process', icon: '🥩', label: 'Process Pemmican',
      cost: '3 food',
      risk: 'On fail: poor yield, meat spoils',
      flavor: 'Slice the lean meat thin. Dry it over the fire. Pound it fine. Render the tallow. Pack it tight.',
      canDo: state.food >= 3,
      needRoll: true,
    },
    {
      type: 'deeprest', icon: '⛺', label: 'Deep Rest',
      cost: '2 food · 2 days',
      risk: 'Lose two days but crew fully recovers',
      flavor: 'Two days of proper rest. Hot food, long sleep, time to mend what is broken.',
      canDo: state.food >= 2,
      needRoll: false,
    },
    {
      type: 'push_on', icon: '⏩', label: 'Push On',
      cost: '1.5 food · wear +1 · morale −5',
      risk: 'Skip camp. No recovery. Cart takes extra damage.',
      flavor: 'No rest. The trail does not wait. Drive on through the evening light.',
      canDo: true,
      needRoll: false,
    },
  ];

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
      riskRow.textContent = `Risk: ${a.risk}`;

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
          let result;
          if (a.type === 'push_on') {
            pushOn(game);
            result = { effects: ['Pushed on — extra wear, less food, lower morale'], critical: false };
          } else {
            result = game.campAction(a.type);
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

          // Show dice roll if this action used one
          if (a.needRoll && result.roll !== null && rollEl) {
            const DC = {
              rest: 12, forage: 10, hunt: 10, repair: 8, scout: 9, dance: 8, pemmican_process: 10,
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
            let ticks = 0;
            const maxTicks = 6 + Math.floor(Math.random() * 4);
            const spinId = setInterval(() => {
              dieEl.textContent = String(Math.floor(Math.random() * 20) + 1);
              ticks++;
              if (ticks >= maxTicks) {
                clearInterval(spinId);
                dieEl.textContent = String(result.roll);
                dieEl.className = 'die small font-spectral settled ' + (isSuccess ? 'pass' : 'fail');
                Haptics.uiTap();
                // Show result text after settle
                if (errEl) {
                  errEl.style.display = 'block';
                  let html = '';
                  if (result.critical) {
                    html += `<div class="camp-critical">⚠ Critical Failure</div>`;
                  }
                  html += result.effects.join('<br>');
                  errEl.innerHTML = html;
                }
                const continueEl = document.getElementById('camp-continue');
                if (continueEl) continueEl.style.display = 'inline-block';
              }
            }, 60);
          } else {
            // No dice — show result immediately
            if (errEl) {
              errEl.style.display = 'block';
              let html = '';
              if (result.critical) {
                html += `<div class="camp-critical">⚠ Critical Failure</div>`;
              }
              html += (result?.effects || []).join('<br>');
              errEl.innerHTML = html;
            }
            const continueEl = document.getElementById('camp-continue');
            if (continueEl) continueEl.style.display = 'inline-block';
          }

          // Log camp action to journal
          const actionLabels = {
            rest: 'Rest', forage: 'Forage', hunt: 'Hunt', repair: 'Repair',
            scout: 'Scout', dance: 'Dance', pemmican_process: 'Process Pemmican',
            deeprest: 'Deep Rest', push_on: 'Push On',
          };
          const mechParts = [];
          if (after.food !== state.food) mechParts.push(`${after.food - state.food >= 0 ? '+' : ''}${(after.food - state.food).toFixed(1)} Food`);
          if (after.wear !== state.wear) mechParts.push(`Wear ${after.wear - state.wear >= 0 ? '+' : ''}${after.wear - state.wear}`);
          if (after.morale !== state.morale) mechParts.push(`Morale ${after.morale - state.morale >= 0 ? '+' : ''}${after.morale - state.morale}`);
          if (after.crew !== state.crew) mechParts.push(`Crew: ${state.crew} → ${after.crew}`);
          journalLog({
            day: after.day,
            date: monthName(after.month) + ' ' + after.day,
            title: `Camp: ${actionLabels[a.type] || a.type}`,
            text: a.flavor,
            dice: result.roll !== null ? `Rolled ${result.roll} — need ${({rest:12,forage:10,hunt:10,repair:8,scout:9,dance:8,pemmican_process:10}[a.type]||10)}+ — ${result.rollTotal >= ({rest:12,forage:10,hunt:10,repair:8,scout:9,dance:8,pemmican_process:10}[a.type]||10) ? '✓ Success' : '✗ Failure'}${result.critical ? ' — ⚠ CRITICAL' : ''}` : null,
            mech: mechParts.join(' · '),
            collapsed: true,
          });
        });
      }

      actionsEl.appendChild(card);
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
      sourceEl.innerHTML = `<span class="src-quote">"${quoteData.quote}"</span>` + (attrib ? `<span class="src-attrib">— ${attrib}</span>` : '') + (quoteData.context ? `<span class="src-context">${quoteData.context}</span>` : '');
      sourceEl.style.display = 'block';
    } else {
      sourceEl.style.display = 'none';
    }
  }

  // Detailed scoring breakdown — use engine's getEndgameScore (DESIGN.md §10: base = 500)
  const breakdown = game.getEndgameScore();
  const scoreLines = [
    { label: 'Base score', value: breakdown.base },
    { label: `MB value (${Math.round(state.mbValue || 0)} × 80)`, value: breakdown.mbValue },
    { label: `Food bonus (${Math.min(state.food, 25)} × 12)`, value: breakdown.foodBonus },
    { label: `Crew condition (${state.crew})`, value: breakdown.crewCondition },
    { label: `Days on trail (${state.day} × -8)`, value: breakdown.daysPenalty },
    { label: `Cart wear (${state.wear}² × -40)`, value: breakdown.wearPenalty },
  ];

  const totalScore = breakdown.score;

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
    lbBtn.className = 'restart-btn';
    lbBtn.style.marginTop = '10px';
    lbBtn.textContent = '🏆 View Hall of Fame';
    lbBtn.onclick = () => showLeaderboard();
    endCard.appendChild(lbBtn);
  }
}

// ── Leaderboard ─────────────────────────────────────────────────────

let cachedTopScores = null;
let cachedMyScores = null;

function showLeaderboard() {
  document.getElementById('end-overlay')?.classList.remove('active');
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

function actionLabel(a) {
  const map = {
    rest: 'Rest · 1 day · +2 food · +25 morale',
    trade: 'Trade Goods → MB Credit',
    repair: 'Repair · −2 wear',
    heal: 'Heal · +20 morale',
    craft: 'Craft',
    buy_food: 'Buy Food (0.5 MB)',
    buy_repair: 'Repair (2 MB)',
    buy_heal: 'Heal (1 MB)',
    buy_info: 'Intel (0.5 MB)',
  };
  return map[a] || a;
}
function actionSubtitle(a) {
  return '';
}

// Narrative journal text for settlement actions
function buildSettlementJournalText(action, st) {
  const stName = st?.name || 'the settlement';
  const texts = {
    rest: `A day of rest at ${stName}. The crew recovers, the oxen graze. The weight of the trail lifts, if only for a day.`,
    trade: `Trade goods exchanged at ${stName}. The ledgers are updated, the cart a little lighter, the credit a little heavier.`,
    repair: `The cart is tended at ${stName}. Shaganappi and effort — the wheels turn smoother.`,
    heal: `The crew is tended at ${stName}. Wounds dressed, spirits mended.`,
    buy_food: `Supplies taken on at ${stName}. The cart grows heavier with food for the trail ahead.`,
    buy_repair: `Cart repaired at ${stName}. The wear comes off, the wheels turn true.`,
    buy_heal: `The crew is healed at ${stName}. Morale restored, strength returned.`,
    buy_info: `News gathered at ${stName}. The trail ahead becomes a little less uncertain.`,
    craft: `Work done at ${stName}. Raw materials become something more useful.`,
    forage: `Foraging around ${stName}. The land yields what it can.`,
    gossip: `Talk at ${stName}. News from other travellers, rumours from the trail.`,
    recruit: `New hands found at ${stName}. The crew grows by one.`,
    rumours: `Stories traded at ${stName}. Every traveller has one.`,
  };
  return texts[action] || `Time spent at ${stName}.`;
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
    const tab = tabBtn.dataset.tab;
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
