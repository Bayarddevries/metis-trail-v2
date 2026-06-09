# Weather System Design Document

**Created:** 2026-06-08 by OWL
**GitHub Issue:** #13
**Scope:** Tier 1 (Minimal) — weather as a modifier layer on existing mechanics

---

## 1. Executive Summary

The weather system adds a per-day weather state (`clear`, `overcast`, `rain`, `storm`, `snow`) that modifies travel wear accumulation, food consumption, morale drift, and event probability. Weather is determined by a season-aware Markov chain seeded from the game seed, making it deterministic per playthrough but unpredictable to the player. The system adds a compact weather indicator to the status bar and 4 new weather-specific events, contributing ~5-10% additional tension while keeping win rate within the 25-40% target.

---

## 2. Weather States

| State | Icon | Description |
|-------|------|-------------|
| `clear` | ☀ | Clear skies, no penalties or bonuses |
| `overcast` | ☁ | Grey skies, minor morale effect |
| `rain` | 🌧 | Rain, increased wear and food cost |
| `storm` | ⛈ | Thunderstorm, significant penalties, may trigger storm events |
| `snow` | ❄ | Snow (autumn/winter only), highest penalties |

### Season Availability & Base Probabilities

Seasons from `calendar.js`: summer (Jun-Aug), autumn (Sep-Oct), early winter (Nov+).

**Summer (Jun-Aug):**
- clear: 45%, overcast: 25%, rain: 20%, storm: 10%, snow: 0%

**Autumn (Sep-Oct):**
- clear: 30%, overcast: 30%, rain: 20%, storm: 10%, snow: 10%

**Early Winter (Nov+):**
- clear: 15%, overcast: 20%, rain: 15%, storm: 10%, snow: 40%

Note: early winter = game over if not at node 15 (Fort Edmonton). Snow in early winter is common but the game typically ends before prolonged snow matters.

### Markov Chain Transition Logic

Weather doesn't roll independently each day — it uses a simple Markov chain for persistence:

- **From clear:** 55% stay clear, 30% → overcast, 10% → rain, 5% → storm, 0% → snow
- **From overcast:** 20% → clear, 40% stay overcast, 25% → rain, 10% → storm, 5% → snow
- **From rain:** 10% → clear, 25% → overcast, 40% stay rain, 20% → storm, 5% → snow
- **From storm:** 5% → clear, 20% → overcast, 35% → rain, 30% stay storm, 10% → snow
- **From snow:** 0% → clear, 10% → overcast, 15% → rain, 5% → storm, 70% stay snow

Transitions that would produce impossible weather for the current season (e.g., snow in summer) redistribute probability to `overcast` instead.

First day weather is drawn from the season's base probability distribution.

---

## 3. Mechanical Effects Table

| State | Travel Wear | Food Consumption | Morale | Event Chance | Camp Effectiveness |
|-------|------------|-----------------|--------|-------------|-------------------|
| clear | No change (base) | No change (1.35/day) | No change | Base (0.45) | Normal |
| overcast | No change | No change | -1/day (dampens) | Base (0.45) | Normal |
| rain | +25% wear chance (terrain × 1.25) | +0.3/day (total 1.65) | -2/day | +10% (0.55) | Morale +10 instead of +15 |
| storm | +50% wear chance (terrain × 1.50) | +0.5/day (total 1.85) | -4/day | +15% (0.60) | Morale +5 instead of +15 |
| snow | +40% wear chance (terrain × 1.40) | +0.5/day (total 1.85) | -3/day | +10% (0.55) | Morale +5 instead of +15 |

### Terrain-Specific Weather Interactions

This is the Tier 2 feature. For Tier 1, all terrains use the same modifiers above. Tier 2 would add:
- **plains + storm:** exposed, additional -2 morale (wind/lack of shelter)
- **wooded + rain:** sheltered, wear bonus halved (×1.125 instead of ×1.25)
- **river_valley + rain:** muddy trail, additional +0.1 food consumption
- **uplands + storm:** lightning risk, chance of weather event even outside normal event system

**For Tier 1, terrain-specific effects are limited to narrative flavor only — atmospheric fragments reflect the weather.**

---

## 4. Weather Transition Logic Detail

### Implementation Approach

```javascript
// In engine.js, inside createGame():
const WEATHER_STATES = ['clear', 'overcast', 'rain', 'storm', 'snow'];

// Season base weights (normalized)
const SEASON_BASE = {
  summer:     { clear: 45, overcast: 25, rain: 20, storm: 10, snow: 0 },
  autumn:     { clear: 30, overcast: 30, rain: 20, storm: 10, snow: 10 },
  early_winter: { clear: 15, overcast: 20, rain: 15, storm: 10, snow: 40 },
};

// Markov transition matrix: fromState -> to -> weight
const WEATHER_TRANSITION = {
  clear:     { clear: 55, overcast: 30, rain: 10, storm: 5, snow: 0 },
  overcast:  { clear: 20, overcast: 40, rain: 25, storm: 10, snow: 5 },
  rain:      { clear: 10, overcast: 25, rain: 40, storm: 20, snow: 5 },
  storm:     { clear: 5, overcast: 20, rain: 35, storm: 30, snow: 10 },
  snow:      { clear: 0, overcast: 10, rain: 15, storm: 5, snow: 70 },
};

function pickWeighted(weights, rand) {
  const total = Object.values(weights).reduce((s, w) => s + w, 0);
  let r = rand() * total;
  for (const [key, w] of Object.entries(weights)) {
    r -= w;
    if (r <= 0) return key;
  }
  return Object.keys(weights)[0];
}

// Initialize weather from season base
S.weather = pickWeighted(SEASON_BASE[seasonFor(S.month)], rand);

// Each travel day:
function advanceWeather() {
  let next = pickWeighted(WEATHER_TRANSITION[S.weather], rand);
  // Block impossible weather (e.g., snow in summer)
  const seasonWeights = SEASON_BASE[seasonFor(S.month)];
  if (seasonWeights[next] === 0) {
    next = 'overcast'; // fallback
  }
  S.weather = next;
}
```

---

## 5. New Source Entries

New source entries for weather-specific atmospheric text and event citations:

| Key | Author | Work | Quote | Theme |
|-----|--------|------|-------|-------|
| `LACOMBE_STORM` | Father Albert Lacombe | Missionary Journals, 1878 | "The thunder rolled across the prairie like cannon fire. Lightning split the sky to the west, and the oxen bellowed in terror." | Summer thunderstorm |
| `FONSECA_RAIN` | William G. Fonseca | On the St. Paul Trail in the Sixties, 1900 | "Three days of rain turned the trail to the consistency of axle grease. The carts sank to the hubs and the oxen could scarcely move them." | Autumn rain / mud |
| `SCHULTZ_SNOW` | John C. Schultz | The Old Crow Wing Trail, 1894 | "The first storm of the season caught us on the open prairie. By morning, the cart ruts were filled with snow and the trail was gone." | Early snow |
| `LACOMBE_WIND` | Father Albert Lacombe | Missionary Journals, 1878 | "A hot wind blew from the south for three days, carrying the smell of sun-baked grass and dust that stung the eyes." | Overcast/windy conditions |
| `BREHAUT_WET_AXE` | Harry Baker Brehaut | The Red River Cart and Trails, 1972 | "Wet weather swelled the wooden axles, making the wheels bind. A cart that rolled freely in dry weather could become nearly immovable after a rain." | Wet weather mechanical effects |
| `FONSECA_OVERCAST` | William G. Fonseca | On the St. Paul Trail in the Sixties, 1900 | "A grey sky hung low over the prairie for days. The air was heavy and still, and the oxen moved as if they could sense a storm coming." | Overcast/dreary travel |

All entries follow the existing `SOURCES` object format in `src/data/sources/index.js`.

---

## 6. New Weather Events

4 new events added to existing terrain pools. Each references a weather state in its narrative.

### 6.1 `plains_thunderstorm` (plains pool)

**Trigger:** Added to plains event pool. Most impactful in summer. (EVENT_CHANCE already applies — no special trigger needed.)

**Narrative:** The sky turns green-black to the west. Thunder rolls across the open prairie like cannon fire. Lightning stitches the clouds to the earth, and the oxen bellow in terror. There is no shelter on the plains — only the cart and the storm.

**Choices:**
1. **Hobble the oxen and huddle under the cart** (always) — The storm passes in twenty minutes. Everyone is soaked but alive. *morale -4*
2. **Push for the nearest coulee** (DC 11) — Lower ground offers shelter from the wind and lightning. / A lightning-struck tree falls nearby. *wear +1, morale -6*

**Source:** `LACOMBE_STORM`

### 6.2 `river_valley_flash_flood` (river_valley pool)

**Narrative:** Three days of rain upstream. The river is brown and rising, debris spinning in the current. The ford you crossed yesterday is gone — today the water is waist-deep and growing. The trail along the bank has become a river itself.

**Choices:**
1. **Wait for the water to drop** (always) — You camp on high ground. By morning the river has dropped enough to cross. *time +1*
2. **Push through while you can** (DC 13) — The oxen find footing. The cart tilts but holds. / A submerged log catches the axle. *wear +2, food -2*

**Source:** `FONSECA_RAIN`

### 6.3 `upland_early_snow` (uplands pool)

**Narrative:** The first storm of the season catches you on the open uplands. By morning, the cart ruts are filled with snow and the trail is gone. The temperature plunges. The oxen breathe white plumes into the still air.

**Choices:**
1. **Make camp and wait for the thaw** (always) — You wait for the sun to melt the snow. A lost day, but the crew is intact. *time +1, morale -2*
2. **Push through — follow the ridge** (DC 11) — The going is brutal but you keep moving. / The snow deepens. Progress is measured in yards. *crew → tired, morale -8*

**Source:** `SCHULTZ_SNOW`

### 6.4 `plains_windstorm` (plains pool)

**Narrative:** A wind comes out of the north that never stops. It pushes at the cart from the side, threatening to tip it with every gust. The canvas tarp flaps and strains at its ties. The oxen lean against the wind and refuse to move forward.

**Choices:**
1. **Lower the cart bed and wait it out** (always) — You crouch behind the cart and wait. The wind lasts hours. When it passes, the prairie is scarred with dust devils. *time +1*
2. **Strap down the load and push into the wind** (DC 10) — The oxen groan but move forward. / A gust catches the canvas. Supplies scatter. *food -3, wear +1*

**Source:** `LACOMBE_WIND`

---

## 7. UI Changes

### 7.1 Status Bar Weather Indicator

Add a weather stat between Season and Segment progress in the status bar:

```html
<span class="stat">
  <span class="stat-label">Weather</span>
  <span class="stat-value" id="s-weather">☀ Clear</span>
</span>
```

Display format: `{icon} {State}` — e.g., "☀ Clear", "☁ Overcast", "🌧 Rain", "⛈ Storm", "❄ Snow"

Color coding:
- clear: `#C99A3B` (existing accent gold)
- overcast: `#8ab17d` (muted green-grey)
- rain: `#6B8E9B` (slate blue)
- storm: `#8B2500` (dark red — danger)
- snow: `#B8C4D0` (pale blue-grey)

### 7.2 Travel Narrative Weather Fragments

The existing `TRAVEL_FRAGMENTS` structure is extended with weather variants. For each terrain × crew state, 1-2 weather-specific fragments are added for non-clear weather:

- `TRAVLE_FRAGMENTS[terrain][crew].rain` — rain variant
- `TRAVEL_FRAGMENTS[terrain][crew].storm` — storm variant
- `TRAVEL_FRAGMENTS[terrain][crew].snow` — snow variant
- `TRAVEL_FRAGMENTS[terrain][crew].overcast` — overcast variant

Each variant is an array of 2-3 fragments (matching the existing pattern of 4 fragments per terrain × crew).

The `buildTravelNarrative()` function checks `state.weather` and selects from the weather-specific fragment pool when available, falling back to the existing `terrain × crew` pool for clear weather.

Example (plains, rested, rain):
> "Rain drums on the canvas tarp. The ox leans into the traces, steady despite the water streaming from its back. The prairie smells of wet earth and sage."

### 7.3 CSS Additions

Add to `src/template.css` (and sync to `dist/index.html`):

```css
/* Weather indicator in status bar */
.stat-value.weather-clear { color: #C99A3B; }
.stat-value.weather-overcast { color: #8ab17d; }
.stat-value.weather-rain { color: #6B8E9B; }
.stat-value.weather-storm { color: #8B2500; }
.stat-value.weather-snow { color: #B8C4D0; }
```

### 7.4 No New Overlays

The weather system does NOT add any new overlay panels. Weather information is displayed passively in the status bar and woven into the travel narrative. Players experience weather through its mechanical effects and narrative context, not through a separate UI panel.

---

## 8. Engine API Changes

### New State Fields

Added to `S` (internal state) and exposed via `getState()`:

```javascript
weather: 'clear',        // current weather state
weatherForecast: null,   // reserved for Tier 2 (hint of upcoming change)
```

`getState()` returns `weather` field. `main.js` reads it to set the status bar display.

### New Internal Functions

Inside `createGame()` closure (not on the public API):

- `advanceWeather()` — called at the start of `travelOneDay()`, updates `S.weather` via Markov chain
- `weatherWearMultiplier()` — returns the wear chance multiplier for current weather
- `weatherFoodModifier()` — returns additional food consumption for current weather
- `weatherMoraleModifier()` — returns morale drift modifier for current weather

### Modified Functions

**`travelOneDay()`:**
1. Call `advanceWeather()` at the top (before food/wear/morale changes)
2. Food subtraction: `DAILY_FOOD + weatherFoodModifier()`
3. Wear check: `wearChance × weatherWearMultiplier()`
4. Morale drift: base -2/day + `weatherMoraleModifier()`
5. Event chance: `EVENT_CHANCE + weatherEventModifier()`

**`makeCamp()`:**
- Clear weather: morale +15 (existing)
- Overcast: morale +15 (no change)
- Rain/storm/snow: morale +10, +5, +5 respectively

### No New Public API Methods

The weather system does NOT add any new methods to the public `game` object. Weather is fully internal to the engine, exposed only through `getState().weather` which is already part of the existing state shape.

**Important for sim compatibility:** `tests/simulate-entry.js` does NOT need to change its decision logic — the sim makes decisions based on `game.getState()` fields it already reads. Weather effects are applied internally by the engine.

---

## 9. Files Changed

| File | Change Type | Description |
|------|------------|-------------|
| `src/core/constants.js` | Modify | Add weather constants (states, season base weights, transition matrix, modifiers) |
| `src/systems/engine.js` | Modify | Add weather to state, weather transition logic, modify `travelOneDay()` and `makeCamp()` for weather effects, expose `weather` in `getState()` |
| `src/data/events.js` | Modify | Add 4 new weather events to appropriate terrain pools |
| `src/data/sources/index.js` | Modify | Add 6 new source entries for weather text |
| `src/main.js` | Modify | Update `buildTravelNarrative()` to select weather-specific fragments; extend `TRAVEL_FRAGMENTS` with weather variants; add weather CSS classes |
| `src/template.html` | Modify | Add weather stat to status bar; add weather CSS classes |
| `dist/index.html` | Modify | Sync status bar HTML and CSS changes |
| `tests/simulate-entry.js` | Minor | Optionally add weather-to-death tracking in sim output (weather deaths tallied separately) |

---

## 10. Balance Impact Estimate

### Expected Win Rate Change

Baseline: 35% win rate (v64, 200-sim).

Weather adds tension through three channels:
1. **Increased food consumption:** Rain (+0.3/day), storm/snow (+0.5/day). Assuming ~15-20% of travel days have rain/storm, expected average food consumption increases from 1.35 to ~1.42/day. Over ~40 travel days, that's ~2.8 extra food consumed per game.
2. **Increased wear accumulation:** +25-50% wear chance in bad weather. Could push 3-5% more games to cart_failure.  
3. **Morale pressure:** Rain (-2/day), storm (-4/day), snow (-3/day) accelerate morale loss. Could push 2-3% more games to abandonment.

**Estimated new win rate: 28-33%** (weather contributes ~2-7% additional deaths).

### Death Distribution Impact

| Death Type | Current % | Expected Change | New % |
|-----------|-----------|----------------|-------|
| starvation | ~20% | +3-5% (food pressure) | ~23-25% |
| cart_failure | ~22% | +2-4% (wear pressure) | ~24-26% |
| abandoned | ~5% | +2-3% (morale pressure) | ~7-8% |
| winter | ~13% | no change | ~13% |
| no_trade | ~40% | -5-10% (fewer reach Edmonton) | ~30-35% |

Weather is expected to contribute to ~10-15% of all deaths (a meaningful but not dominant factor), matching the design target.

### Tuning Levers

If weather pushes win rate below 25%:
1. Reduce food modifiers: rain +0.2 (was +0.3), storm/snow +0.3 (was +0.5)
2. Reduce wear multipliers: rain ×1.15 (was ×1.25), storm ×1.30 (was ×1.50)
3. Reduce morale penalties: rain -1 (was -2), storm -2 (was -4)

If weather has negligible impact (<2% win rate change):
1. Increase storm frequency in autumn
2. Add terrain-specific weather effects (Tier 2)

---

## 11. Implementation Order

### Step 1: Constants & Engine Core
1. Add weather constants to `src/core/constants.js`
2. Add `weather` field to game state in `engine.js`
3. Implement `advanceWeather()` with Markov chain
4. Implement weather modifier functions
5. Modify `travelOneDay()` to apply weather effects
6. Modify `makeCamp()` for weather-adjusted morale recovery
7. Expose `weather` in `getState()`

### Step 2: Sources
8. Add 6 new source entries to `src/data/sources/index.js`

### Step 3: Events
9. Add 4 new weather events to `src/data/events.js`

### Step 4: Travel Narrative
10. Extend `TRAVEL_FRAGMENTS` with weather variants in `src/main.js`
11. Update `buildTravelNarrative()` to select weather-specific fragments

### Step 5: UI
12. Add weather stat to status bar in `src/template.html`
13. Add weather CSS classes to `src/template.html`
14. Sync changes to `dist/index.html`

### Step 6: Build & Verify
15. Run `bun scripts/build.mjs`
16. Verify build succeeds, no JS errors in console
17. Verify weather indicator appears in status bar
18. Verify weather changes during travel

### Step 7: Sim & Balance
19. Run `bun scripts/build-test.mjs` (200 sims)
20. Report win rate, death distribution
21. Tune if outside 25-40% target

### Step 8: Documentation
22. Update `CHANGELOG.md` with weather system entry
23. Update `HANDOFF.md` with new version state
24. Update `ISSUES.md` — mark #13 resolved
25. Commit and push

---

## 12. Verification Plan

### Build Verification
- `bun scripts/build.mjs` completes without errors
- `dist/index.html` contains weather stat in status bar
- `dist/app.js` contains weather logic (grep for `advanceWeather` or `WEATHER_TRANSITION`)

### Runtime Verification (Browser)
- Weather indicator shows "☀ Clear" on day 1 (summer start)
- Weather changes over multiple travel days
- Weather-specific travel narrative fragments appear during non-clear weather
- Storm/rain weather increases visible wear accumulation rate
- Food depletes faster during rain/storm

### Sim Verification
- Run 200 sims: `bun scripts/build-test.mjs`
- Win rate between 25-40%
- Weather-related deaths (starvation, cart_failure, abandoned) increased by 5-10% total
- No new timeout/loop bugs introduced
- Average days survived decreased slightly (tighter margins)

### Source Audit
- All 6 new source entries follow existing format
- All 4 new events use `getSource('KEY')` — no inline source objects
- Source quotes thematically match event content

---

## Appendix: Tier 2 Preview (Not in Scope)

If Tier 1 is approved and implemented, Tier 2 would add:
- Terrain-specific weather modifiers (plains exposed, wooded sheltered)
- Weather affects event pool composition (storm events more likely during storms)
- Player choice: "Push on" vs "Wait out the storm" at travel time
- Extended forecast hint ("The sky is darkening.")
- 6-10 more weather events across pools
- River crossing difficulty scales with recent rain

These are documented here for future reference but NOT part of this implementation.
