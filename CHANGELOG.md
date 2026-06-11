# Changelog

All notable changes are documented here. Format loosely follows Keep a Changelog.

## [v10] — 2026-06-11

### Sprint 6/7 — Gameplay Polish (Phase A + B + C)

**Settlement Actions Rewrite (#79, #88)**
- Replaced broken `renderSettlementActionCard()` / `showSettlementResult()` with inline rendering in `showSettlement()`
- Root cause of "nothing happens" bug: trade sub-button handler referenced undefined `beforeJournal` variable, causing silent JS error that killed entire click handler
- Settlement action cards now match camp card style: icon, name, cost, risk, flavor text in grid layout
- Added `settlement-roll-display` and `settlement-result` overlay areas (matching camp pattern) for dice roll animation + flavor text
- Settlement result shows in-place with flavor text + effects + Continue West button (no modal)
- Gossip flavor text now includes settlement-type-specific voices (hbc, metis, mission, nwmp, trading) with actual intel text from `trailIntel`

**Camp Push On (#81)**
- After clicking Push On, camp overlay now closes automatically and returns to travel loop
- No more redundant "Continue West" button after Push On (since push_on already advanced the day)
- Journal entry logged immediately on Push On

**Dice Roll Visibility (#83)**
- Roll label and roll total text color changed from `--clr-ink-on-dark` (faint parchment) to `--clr-ink-on-light` (dark green `#1a3a1a`)
- Now clearly visible against the faint gold `--clr-camp-pill-bg` background
- Applied to both camp and settlement roll displays

**Blessing Roll Buff (#80)**
- Added `blessingDays: 0` to game state
- `get_blessing` settlement action sets `blessingDays = 3`
- `travelOneDay()` decrements `blessingDays` after `advance()`
- `resolveChoice` and `totalMod` add +1 to all dice rolls when `blessingDays > 0`
- ✝ indicator shown in status bar via `#s-blessing` element
- `--clr-blessing` CSS variable added

**One Action Per Visit (#81)**
- `performedAction` flag in settlement overlay disables all action buttons after first click
- Settlement action buttons call `onActionPerformed()` callback
- Camp overlay already hid cards; now also prevents multiple clicks via flag

**Shop Buy/Remove Clarity (#75)**
- Redesigned `showShop()` renderList to show trade goods section with ₥ value
- Color-coded buttons: green Buy, red Remove/Swapped button order (Remove left, Buy right)

**Scrolling Consolidation (#83)**
- 100vh → 100dvh for proper mobile viewport
- Sticky status bar (top:0) and bottom panel (bottom:0)
- Journal reduced 28vh → 22vh
- Removed inner shop scroll
- overflow:hidden on html/body
- Status bar: flex-start with 12px gap (was space-between) for mobile scrolling
- Status bar height: 44px desktop, 40px mobile
- Tightened 768px/420px/360px breakpoints

**End Screen Score Fix (#70)**
- `getEndgameScore()`: removed early return for `!S.won` that returned empty breakdown `{}`, causing NaN
- Added `safeNum()` helper in `showEnd()` using `Number.isFinite()` check
- Optional chaining `breakdown?.base` prevents crashes
- Added loading timeout and `.catch()` to `getMyScores()`
- `Math.round()` on all score line items; unified button classes

**Journal Day Grouping (#89)**
- `journalLog()` now groups entries under collapsible `.journal-day-group` headers
- Each day shows "Day N — Month Day" with ▼/▶ toggle
- Sub-entries show type labels (Travel, Event, Camp, Settlement)
- Event delegation handles toggle clicks
- Initial "Before the Journey" entry in template.html

**Sim Test Update (#86)**
- Settlement action handling uses action objects (`.id` property) instead of strings
- Enforces one action per settlement visit (removed 2-action loop)
- Added weights for all 15+ new settlement actions
- Added tracking counters for new mechanics

**Mobile Status Bar Polish**
- Tightened 768px/420px/360px breakpoints
- Reduced padding, gap, separator borders
- Hides segment-progress at 360px
- Confirmed `#controls` has `position: sticky; bottom: 0` on mobile

**Test Suite:** 62 pass, 1 fail (pre-existing test bug in repair availability test — not caused by changes)

Files modified: `src/main.js`, `src/systems/engine.js`, `src/ui/renderer.js`, `src/template.html`, `src/style.css`, `tests/simulate-entry.js`

## [v84] — 2026-06-11

### Sprint 3 + 4 Closeout — Settlements, Economy, Visual Unification
- Settlement system finalized: type-specific overlays and actions for HBC, Métis, NWMP, Mission, Trading nodes
- Engine API expanded for settlements and endgame scoring/trade estimates
- Green & parchment period palette standardized and tested across overlays; readability restored
- Fixed text-on-background contrast issues by separating `--clr-ink-on-dark` from `--clr-ink-on-light`
- Unified overlay button hierarchy and removed hardcoded colors in favor of semantic variables
- Verified core travel loop in browser: shop → confirm → travel → settlement overlay → continue

## [v83] — 2026-06-10

### Dice Clarity & Camp Fix
- DC display changed from "DC 12" to "Need 12+" on event choices, camp dice, and outcome text — players now know which direction to roll
- Camp dice now uses per-action DC thresholds from engine (rest 15/8, forage 12/8, hunt 10/6, etc.) instead of hardcoded 10
- Camp dice display shows "Need X+ ✓/✗" instead of raw total
- Camp roll display resets on each camp open (was persisting from previous camp)
- Event choice buttons requiring items are now disabled (opacity 0.45) when player lacks the item

### End Screen / Leaderboard (#70)
- Removed auto-popup of leaderboard after game over (was covering end-screen narrative)
- Added "🏆 View Hall of Fame" button to end-screen overlay instead
- Score breakdown and narrative now always visible before player chooses to view leaderboard

### Party Name (#40)
- Intro text changed from "What is your name?" to "What is your party's name?"
- Placeholder text: "Enter party name..."
- Profanity filter on party name input: common slurs/profanity replaced with asterisks
- Names with no letters default to "Traveller"
- Leaderboard "My Scores" message updated to reference "party name"

### UI Polish
- **#53**: Die restyled as wooden block — added diagonal wood-grain texture via CSS gradient
- **#54**: Added `.event-stamp.success` (green) and `.event-stamp.fail` (red, opposite tilt) CSS classes
- **#56**: Status bar grouped into Journey cluster (Day/Month/Season) + Cart cluster (Weather/MB/Food/Wear/Crew) with brass vertical separator
- **#57**: Weather display changed from emoji ("☀ Clear") to period text ("Clear") in status bar, constants, and renderer
- MB currency symbol changed from "💎 0 MB" to "0 ₥" (mill sign) in status bar

Files modified: `src/main.js`, `src/template.html`, `src/ui/renderer.js`, `src/core/constants.js`

## [v82] — 2026-06-10

### Economy Overhaul — Made Beaver (MB) Currency System

Replaced barter-only trade with a proper currency economy grounded in the historical HBC "Made Beaver" accounting system.

**Core changes:**
- Trade goods (Bison Hides, Beaver Pelts) now convert to **MB credit** at settlements instead of food
- MB credit is per-settlement-type (HBC, Métis, NWMP, Mission) — spend it where you earn it
- New settlement actions: `buy_food` (0.5 MB → 2 food), `buy_repair` (2 MB → −2 wear), `buy_heal` (1 MB → +20 morale), `buy_info` (0.5 MB → trail intel)
- Win condition: reach Edmonton with ≥10 MB value in trade goods (was: has any trade goods)
- Score formula: MB value × 80 (was: trade unit count × 120)
- Settlement visits now allow multiple actions (trade + buy + rest) per visit
- `settlementAction()` no longer clears `pendingSettlement` on non-continue actions

**Starting loadout rebalance:**
- Food: 27 → 23 (increased pressure to trade early)
- Bison Hides: 2 → 4 (more trade goods = more MB potential)
- Beaver Pelts: 2 → 3 (同上)
- Starting MB value: ~8.5 → ~17 (well above 10 MB threshold if managed well)

**UI changes:**
- Status bar: added MB indicator (💎 X.X MB) with color coding (gold if ≥ threshold, red if below)
- Trade panel: shows MB yield per good instead of food yield
- Cart overlay: shows MB value on trade/fur items
- Settlement actions: buy options shown as secondary actions (behind "More actions" toggle)
- Ending text updated: no_trade ending references MB instead of "empty cart"
- Tips updated: all references to "keep trade goods" changed to "manage MB credit"

**Sim results (50 runs):**
- Win rate: 30% (target 25-40% ✓)
- Deaths: starvation 52%, cart_failure 14%, no_trade 4%
- Avg MB at end: 11.8 (winners, need 10 to win ✓)
- no_trade dropped from 46% → 4% ✓

**New constants:** `MB_WIN_THRESHOLD`, `MB_FOOD_COST`, `MB_REPAIR_COST`, `MB_HEAL_COST`, `MB_INFO_COST`

Files modified: `src/core/constants.js`, `src/systems/engine.js`, `src/data/items.js`, `src/data/endings.js`, `src/main.js`, `src/ui/renderer.js`, `src/template.html`, `tests/simulate-entry.js`

### Docs sync pass
- Synced `TODO.md`, `HANDOFF.md`, `ISSUES.md` to current build state
- Corrected duplicate `v70` header in changelog
- Version references updated across handoff docs

## [v81] — 2026-06-10

### Fix — pushOn() was a no-op (mutated getState() copy, not engine state)
- `pushOn()` in `src/main.js` called `game.getState()` and mutated the returned object
- `getState()` returns a copy, so mutations were silently lost — Push On did nothing
- Fix: added `pushOn()` as a proper engine method in `src/systems/engine.js`
- `main.js` `pushOn(game)` now delegates to `game.pushOn()`
- Engine `pushOn()`: -1.5 food, +1 wear, -5 morale, travelDaysWithoutRest++, crew degradation, advance()

### Updated — Headless playtesting harness for v79 mechanics
- `tests/simulate-entry.js` rewritten to resolve camp actions (rest/forage/hunt/repair/scout/dance/pemmican_process/deeprest)
- Added `pickCampAction()` with context-aware weighting (terrain, items, crew state, food)
- Added `pushOn` support via engine method
- Added tracking: pushOnCount, forageCount, huntCount, scoutCount, danceCount, pemmicanCount, deepRestCount, squealCount, sundayRestCount
- Added weather distribution at game end
- Added `currentTerrain` and `travelDaysWithoutRest` to `getState()` return
- New balance analysis: no_trade detection, squeal event tracking, push-on rate, hunt frequency
- **200-run results: 38.5% win rate (target 25-40% ✓)**
  - Deaths: no_trade 40%, starvation 13%, cart_failure 8.5%
  - Avg score: 810 (range 176–1090), median 826
  - 0 triumphant (≥1100) — threshold may need lowering to 900
  - Key issue: 40% reach Edmonton with no trade goods (trade goods too scarce)

Files modified: `src/systems/engine.js`, `src/main.js`, `tests/simulate-entry.js`

## [v80] — 2026-06-10

### Pre-Departure Cart Packing Overlay (Issue #44)
- Enabled pre-departure cart configuration by setting `preDeparture: true` in initial game state
- Full UI already existed in `template.html` (overlay, briefing, category legend, weight display, item list with +/- controls)
- `showPreDeparture(game)` in `src/main.js` fully implemented:
  - Fetches items via `game.getPreDepartureItems()` (14 items with weight, category, max count)
  - Real-time weight calculation with color-coded status (over/at-capacity/under 100kg limit)
  - Per-item +/- buttons to adjust quantities (bounded by max starting count)
  - "Auto-Pack (Balanced)" preset loads ~92.5kg optimized loadout
  - "Confirm Loadout" enabled only when weight ≤ 100kg
  - Calls `game.setPreDepartureCount()` on changes, `game.confirmPreDeparture()` to finalize
- Flow: Intro → click "Begin Journey" → pre-departure overlay → configure cart → confirm → start game
- Category legend explains 5 categories: Food (survival), Repair/Parts (cart wear), Trade Goods (win condition), Shelter/Fuel (cold nights), Medical/Ammo (event prep)

Files modified: `src/systems/engine.js` (preDeparture: true), `dist/app.js`

## [v79] — 2026-06-10

### Camp UI Overhaul — Polishing the Camp Experience
- **Prominent header**: Changed "Make Camp" to `<h1>` with larger Playfair Display font, centered, uppercase, letter-spaced
- **Campfire art panel**: Added `.camp-art` div (80px tall) at top of overlay with layered campfire background (glow, embers, flicker, paper texture)
- **Requirement badges instead of disabled buttons**: All 9 camp actions now visible with orange requirement badges (e.g., "Need 1 food", "Only in woods/river", "Need Ammunition Belt") instead of opaque disabled state — click shows requirement in result area
- **Single bottom button**: Removed separate "Push On" button; consolidated to single "Continue West" primary button
- **"Push On" as camp action**: Added to "Rest & Recovery" group — applies penalties (1.5 food, +1 wear, -5 morale, no recovery) when chosen
- **Renamed groups**: "Recovery" → "Rest & Recovery" (includes Push On), "Trail work" + "Upkeep" → "Camp Duties" (6 actions)
- **Fixed "Women's work" text**: Process Pemmican description changed to "Slice, dry, and render tallow into pemmican."
- **CSS additions**: `.camp-art`, larger `.camp-header`, `.camp-action-btn.has-req` (70% opacity), `.camp-req-badge` (orange warning badge), `.camp-action-label` flex layout

Files modified: `src/main.js`, `src/template.html`, `dist/index.html`, `dist/app.js`

## [v78] — 2026-06-10

### Integration Test — Travel → Camp → Travel Loop (Issue #69)
- Added `tests/integration-camp-loop.test.js` with 16 tests covering the full travel → camp → travel loop:
  - **Camp overlay triggers**: Travel advances state; camp overlay logic verified
  - **makeCamp()**: Increments camps counter, resets travelDaysWithoutRest, recovers crew, boosts morale
  - **Multiple travel → camp cycles**: 10+ cycle loop verified
  - **Push On penalties**: Extra food consumption (+1.5), wear (+1), morale (-5), no crew recovery, travelDaysWithoutRest++
  - **Crew degradation**: rested → tired at 3 days, exhausted at 5 days of Push On
  - **Context filtering availability**:
    - Rest: requires food ≥ 1
    - Forage: river_valley/wooded only (not plains)
    - Hunt: requires Ammunition Belt + open terrain (not wooded)
    - Process Pemmican: requires food ≥ 3
    - Repair: requires wear > 0 + Shaganappi (starting cart has 3)
    - Scout: requires next node exists
    - Dance: always available
    - Deep Rest: requires food ≥ 2
  - **Camp action effects**: Rest recovers crew, actions return dice rolls
  - **Full game completion**: Headless simulation with camp logic reaches game end
- All tests pass with Bun test runner
- Verifies #64, #65, #66 work together as integrated system

Files added: `tests/integration-camp-loop.test.js`

## [v77] — 2026-06-10

### Camp Action Context Filtering (Issue #65)
- Added context-aware availability filtering to camp actions in `showCamp()` (`src/main.js`):
  - **Rest** — requires 1+ food
  - **Forage** — available in river_valley/wooded (not plains)
  - **Hunt** — requires Ammunition Belt + open terrain (plains/river_valley, not wooded)
  - **Process Pemmican** — requires 3+ food
  - **Repair** — requires cart wear > 0 + Shaganappi
  - **Scout** — requires next node exists (not at final destination)
  - **Dance** — always available
  - **Deep Rest** — requires 2+ food
- Disabled actions shown with `.disabled` class (muted colors, not-allowed cursor) + tooltip (`title` attribute) explaining why unavailable
- CSS updated in `src/template.html` for `.camp-action-btn:disabled` and `.camp-action-btn.disabled` with period-appropriate muted styling
- Availability recalculates each time camp overlay opens (state-dependent)

Files modified: `src/main.js`, `src/template.html`, `dist/index.html`, `dist/app.js`

## [v76] — 2026-06-10

### Camp Overlay — Travel Loop Integration & Push On (Issue #66)
- Modified `travelOneDay()` in `src/main.js` to automatically show camp overlay after each travel day (instead of auto-advancing with narrative)
- Added "Push On" button to camp overlay (ghost style) alongside "Continue West" (primary style)
- Implemented `pushOn(game)` function with penalties for skipping camp:
  - +1.5 food consumption
  - +1 cart wear
  - -5 morale
  - Increments `travelDaysWithoutRest` (no crew recovery)
  - Crew state degrades (rested → tired → exhausted at 3/5 days)
- After camp action, "Continue West" button closes overlay; user presses Travel again to continue
- Bootstrap handlers wired for camp-continue (close) and camp-push-on (apply penalties + close)
- Build uses existing `.ctrl-btn.ghost` and `.ctrl-btn.primary` classes

Files modified: `src/main.js`, `src/template.html`, `dist/index.html`, `dist/app.js`

## [v75] — 2026-06-10

### Camp Overlay — Evening Campfire Aesthetic (Issue #64)
- Added campfire evening background to camp overlay via CSS custom properties in `src/ui/theme.js`:
  - `--clr-campfire-glow`: radial gradient from bottom center simulating firelight glow upward
  - `--clr-campfire-embers`: SVG fractal noise texture (base64 data URI) for subtle ember particle field
  - `--clr-campfire-flicker`: three radial gradients simulating warm firelight flicker at varying positions
- Updated `#camp-overlay .overlay-card` in `src/template.html` to layer campfire backgrounds with `background-blend-mode: overlay`
- Added darkening gradient `::before` pseudo-element on overlay card for text readability over firelight
- All camp overlay content elements (header, status pills, action buttons, groups, results, dice display) now use `position: relative; z-index: 1` to sit above the background layers
- Enhanced hover state for camp action buttons: border changes to ink color on hover for sharper period-accurate feedback
- Added transition on camp action buttons for smooth background/border color changes
- Build pipeline uses inline SVG data URIs (same as paper texture) — no external asset files needed

Files modified: `src/ui/theme.js`, `src/template.html`, `dist/index.html`, `dist/app.js`

## [v74] — 2026-06-10

### Phase 2 — Core Systems & Debugging: Testing & Persistence
- **#45**: Added unit tests for calendar (`tests/calendar-prng.test.js`) — 12 tests covering leap years, month lengths, seasons, date advancement
- **#45**: Added unit tests for PRNG (`tests/calendar-prng.test.js`) — 13 tests covering deterministic seeding, distribution, d20 rolls
- **#46**: Added save/load validation with schema versioning in `src/ui/persistence.js`
  - Schema version tracking (current: v1)
  - Legacy save migration support (auto-detects saves without schemaVersion)
  - Full state validation on load (type checks, range checks, required fields)
  - Migration framework for future schema changes
  - Pre-save validation prevents corrupting localStorage
  - 22 tests in `tests/persistence.test.js` covering round-trips, validation, migration, legacy support
- Mock localStorage for Node.js test environment

### Build — Test Suite
- All 47 unit tests pass (25 calendar/PRNG + 22 persistence)
- Build continues to pass with new persistence module

Files modified: `src/ui/persistence.js`, `tests/calendar-prng.test.js`, `tests/persistence.test.js`

## [v73] — 2026-06-10

### Audit P0 — Period-Accurate Sharp-Corner Aesthetic (per 2026-06-09 design audit)
- **#50**: Stripped all `border-radius` and `box-shadow` — every corner is now sharp (0px/none) for period-accurate ledger aesthetic
- **#51**: Desaturated map tiles to grayscale (`filter: grayscale(1) contrast(1.1) brightness(0.9)`) and hid OSM attribution (`.leaflet-control-attribution { display: none }`)
- **#52**: Added paper texture to narrative panel — subtle noise background, repeating ruled lines matching line-height, 4px left ledger margin in accent color
- **#55**: Added mobile breakpoints at 420px (small phones) and landscape orientation (max-height: 500px); ensured 44px minimum touch targets on all interactive elements (buttons, inputs, selects, dice, camp actions, pre-departure controls)

### Build Fix — Template Version Drift
- Fixed `scripts/build.mjs` to use `src/template.html` as source of truth for `dist/index.html` (was preserving stale dist content)

### Touch Target Hardening
- `.pd-minus`, `.pd-plus`: 32→44px
- `.die`: 40/42→44px
- `.choice-btn`, `.camp-action-btn`, `.intro-name-input`, `.lb-sort-select`, `.ctrl-btn`: explicit `min-height: 44px`

Files modified: `src/template.html`, `src/ui/theme.js`, `scripts/build.mjs`, `dist/index.html`, `dist/app.js`

## [v72] — 2026-06-10

### Sprint 1a-i — Theme System Refactor
- Extracted all hardcoded color values from `src/template.html` `<style>` block to `src/ui/theme.js`
- Created `applyTheme(root)` function that sets all CSS custom properties on the root element at bootstrap
- Replaced all hardcoded colors in `src/template.html` with `var()` references
- Updated fonts: Playfair Display (headings) + Crimson Text (body) via CSS custom properties
- Added import and call to `applyTheme()` in `src/main.js` bootstrap
- Cleaned up duplicate `__METIS_ASSETS__` scripts in both `src/template.html` and `dist/index.html`
- Verified build passes and visual output matches pre-refactor state

Files modified: `src/ui/theme.js`, `src/template.html`, `src/main.js`, `dist/index.html`

## [v71] — 2026-06-10

### Fix — Engine API Restoration
Restored missing public API methods on engine return object that were accidentally removed in v70b:
- getNodes, getCurrentNode, getNextNode, totalWeight, getCrew, getPendingEvent, getAvailableActions, isOver, hasWon, getScore, getPreDepartureItems, setPreDepartureCount, confirmPreDeparture, getScoreData

### Docs — Commit Conventions & Engine Documentation
- Added conventional commit message format to AGENTS.md (feat:, fix:, docs:, chore:, balance: types with scope examples)
- Added JSDoc comments to all 29 public engine methods

### Debug — Conditional Debug Panel
- Wired `mountDebugUI(game)` call into bootstrap
- Debug panel now only mounts when URL has `?debug=1`

### Source Fixes
- Fix LACOMBE_BEAR author attribution (Brehaut → Lacombe)
- Add context note for 'half-breed' period term in FONSECA_SUPPLY_CACHE source
- Fix source quote mismatches (plains_wind→LACOMBE_WIND, rain→FONSECA_RAIN)

### Event Text Rewrites (12 events):
- plains_wind: remove 'green sea' + sententious closing
- plains_buffalo_hunt_camp: remove 'world opens below', 'air is thick', 'earth trembles'
- plains_night_camp: remove 'moonlight spills', 'grass to silver', 'trail feels like home'
- plains_hail: remove narrator voice, shorten
- upland_storm_shelter: differentiate 'green sky' from plains_hail
- river_cholera_camp: remove anachronistic 'waterborne bacteria'
- river_mosquito_camp: fix tense switch, remove 'man and beast alike'
- upland_bison_herd: remove 'sea of brown backs', 'earth trembling'

### Ending Rewrites (4 endings, high tier):
- victory: remove 'The West will remember your name'
- starvation: remove 'The Carlton Trail gives nothing for free'
- abandoned: rewrite anaphora, remove mechanical 'morale' language
- winter: remove 'falls soft and silent', 'seeps into' anaphora; also remove 'no outrunning the season' from humble tier

## [v70] — 2026-06-09

### Docs — Women, Children & Family Presence on the Trail
- 4 new sources: CALHOON_PEMM, CALHOON_CART_FORT, IPAC_RAFT, SMALLPOX_1870, SIMPSON_BRIGADE
- 4 new events: plains_cart_fortress, plains_smallpox_trail, river_valley_cart_raft, plains_pemmican_process (camp action)
- New camp action: Process Pemmican (3 food → 5-13+ food + morale, 3 tiers)
- Updated settlement descriptions: Fort Garry (families), St. Norbert (flower beadwork), Batoche (Ottawa promises)
- Travel fragment: dog alongside cart

### Files Modified
src/data/sources/index.js, src/data/events.js, src/engine.js, src/main.js, src/data/nodes.js

**Travel fragments:**
- plains/rested: rewrite all 4 — remove 'green sea', add trail-specific detail

**Camp flavor:**
- forage low: remove 'The land is stingy' personification
- scout low: remove repetitive 'nothing useful'
- dance high: remove 'Laughter echoes', 'Tomorrow feels lighter', 'trail feels like home'
- dance mid: remove 'Morale improves'

**Intro/UI:**
- Rewrite flavor text: shorter, carter's voice, remove 'food doesn't grow on the prairie'
- Add 'On sources' paragraph explaining period-offensive terminology + context notes
- Add `.src-context` CSS for inline source context notes
- Source context rendering in showEvent() and showEnd()

## [v70] — 2026-06-09

### Added — Women, children, and family presence on the trail
New events, sources, and content reflecting the reality of Métis family cart trains:

**New sources (4):**
- CALHOON_PEMM — Victoria Callihoo oral history of women's pemmican labor
- CALHOON_CART_FORT — Cart defensive circle, women/children secured inside
- IPAC_RAFT — Women and children converting carts to river rafts
- SMALLPOX_1870 — 1870 epidemic family accounts (Bruneau, Godin, Chatelain)
- SIMPSON_BRIGADE — Family cart trains: dogs, women, children on the trail

**New events (4):**
- plains_cart_fortress — Brigade forms defensive circle, women/children inside
- plains_smallpox_trail — Disease event with family stakes (1870 epidemic)
- river_valley_cart_raft — Women/children help convert cart to river raft
- plains_pemmican_process (camp action) — Process raw meat into pemmican (3 food in, 5-13+ food out)

**New camp action:**
- Process Pemmican — Available in Trail work group. Requires 3 food, yields variable pemmican + morale

**Travel fragments:**
- plains/rested #4: dog trots alongside the cart (from SIMPSON_BRIGADE source)

**Settlement descriptions updated:**
- Fort Garry: "Families load their carts for the long trail west"
- St. Norbert: "The women here are known for their flower beadwork"
- St. Laurent (Batoche foreshadowing): "Ottawa's surveyors have been making promises they don't keep"

## [v69] — 2026-06-09

### Added — Firebase leaderboard / highscore system (#12)

**Player name:** Text input added to intro overlay. Pre-filled from `localStorage`. Persists across sessions. Defaults to "Traveller" if blank.

**Firebase Firestore:**
- Firestore collection `scores` — open-write, no auth required
- Every game auto-saves a score document with full telemetry: score, day, wear, food, crew, morale, won, endReason, nodes, tradesMade, camps, eventsResolved, weather, cartItems, tradeGoods, distance, seed, date
- Local fallback: if Firestore unreachable, scores saved to `localStorage` and synced on next page load

**Leaderboard overlay (shown after end-game):**
- Two tabs: "Hall of Fame" (top 10 all-time by score) and "My Scores" (last 20 personal runs)
- My Scores tab has a sort dropdown with 8 options: Highest Score, Longest Journey, Most Battered, Leanest Run, Best Trader, Furthest Traveled, Most Eventful, Happiest Crew
- Client-side sorting on already-fetched data — no extra Firestore queries
- Each entry shows: rank, win/loss icon, name, score, date, meta (days or end reason)
- Gold/silver/bronze rank styling for top 3

**Engine changes:**
- Added `game.getScoreData()` — returns all 17 fields for the score document

**New files:** `src/firebase.js` (Firebase init, saveScore, getTopScores, getMyScores, syncLocalScores)
**Modified:** `src/systems/engine.js` (+getScoreData), `src/main.js` (name input, leaderboard UI, event listeners), `src/template.html` (name input + leaderboard overlay HTML/CSS), `package.json` (firebase dep)
**Sim impact:** None — pure post-game display feature

## [v66] — 2026-06-09

### Added — Item-giving events for unobtainable items

6 new events that give beneficial items mid-trail, addressing the gap where medicine, firewood, blankets, spare axes, canvas tarps, and beaver pelts were only available in the starting cart:

- `plains_medicine_herb` (plains): find sage and yarrow in a coulée → Medicine Pouch
- `plains_abandoned_cart` (plains): salvage parts from an abandoned Red River cart → Spare Axle or Shaganappi
- `river_valley_canvas_cache` (river_valley): HBC supply cache beneath a cairn → Canvas Tarp
- `wooded_firewood_gather` (wooded): dead poplar stand in the woods → Firewood Bundle
- `upland_blanket_find` (uplands): abandoned hunter's camp → Blanket
- `river_beaver_trade` (river): beaver ponds along the river → Beaver Pelts (or food from fishing)

All use existing `give` code path in `resolveChoice()` — no engine changes needed.

**7 new source entries:** LACOMBE_HERBS, BREHAUT_ABANDONED_CARTS, FONSECA_HBC_SUPPLY, SCHULTZ_DEADFALL, GOULET_BLANKET, FONSECA_BEAVER

**Sim results (200 sims):** 27.5% win rate (target 25-40% ✓), deaths: cart_failure 27%, starvation 20.5%, no_trade 23.5%

Files: `src/data/events.js`, `src/data/sources/index.js`.

### Added — Weather system (#13)

**Tier 1: Weather as modifier layer on existing mechanics.**

**5 weather states:** clear, overcast, rain, storm, snow — determined by season-aware Markov chain seeded from game state.

**Mechanical effects:**
- Clear: no changes (baseline)
- Overcast: -1 morale/day
- Rain: +25% wear chance, +0.3 food/day, -2 morale/day, +10% event chance, camp morale +10 (was +15)
- Storm: +50% wear chance, +0.5 food/day, -4 morale/day, +15% event chance, camp morale +5 (was +15)
- Snow: +40% wear chance, +0.5 food/day, -3 morale/day, +10% event chance, camp morale +5 (was +15)

**4 new weather events:**
- `plains_thunderstorm` (plains pool): green-black sky, lightning on open prairie
- `plains_windstorm` (plains pool): relentless north wind threatens to tip the cart
- `river_valley_flash_flood` (river_valley pool): three days of rain, river rising fast
- `upland_early_snow` (uplands pool): first storm of season, trail disappears under snow

**6 new source entries:** LACOMBE_STORM, FONSECA_RAIN, SCHULTZ_SNOW, LACOMBE_WIND, BREHAUT_WET_AXE, FONSECA_OVERCAST

**UI changes:**
- Weather indicator in status bar between Season and Segment progress
- Emoji + label display: ☀ Clear / ☁ Overcast / 🌧 Rain / ⛈ Storm / ❄ Snow
- Color-coded by state (gold/green/slate blue/dark red/pale blue-grey)
- Weather-specific travel narrative fragments (4 per weather state per terrain = 64 new fragments)
- Weather fragments take priority over crew-state fragments during non-clear weather

**Engine changes:**
- `advanceWeather()` called at start of `travelOneDay()` — Markov chain transition with season gating
- Weather modifiers applied to food consumption, wear accumulation, morale drift, event chance
- `makeCamp()` morale recovery varies by weather (15/15/10/5/5)
- `getState()` now returns `weather` field
- `pickEventWithChance(chance)` added for weather-modified event probability

**Sim results (200 sims):**
- Win rate: 29% (target 25-40% ✓)
- Deaths: cart_failure 28%, starvation 18.5%, no_trade 24%, timeout 3%
- Avg days survived: 41.67
- Weather contributes to ~10-15% of all deaths as intended

Files: `src/core/constants.js`, `src/systems/engine.js`, `src/data/events.js`, `src/data/sources/index.js`, `src/main.js`, `src/ui/renderer.js`, `src/template.html`, `dist/index.html`.

## [v64] — 2026-06-08

### Documentation — Weather system planning prompt
- Created `docs/weather-system-plan-prompt.md` — comprehensive design brief for next agent
- Defines 3-tier scope (minimal → full → comprehensive), balance requirements, mechanical integration plan
- Includes complete engine API reference, architecture constraints, file change list, verification plan

### Added — Atmospheric travel narrative

- Replaced debug travel text ("Day advances. -1 Food. Crew: rested -> tired.") with immersive atmospheric fragments
- 48 unique fragments across 4 terrains × 3 crew states (plains, river_valley, wooded, uplands × rested/tired/exhausted)
- Fragments selected randomly based on current terrain and crew state
- Mechanical changes (wear, crew) appended only when significant
- Arrival text now shows current node + next node name

### Fixed — Cart unload buttons show item name

- Unload button text: "Unload −X kg" → "Unload [Item Name] (−X kg)"

Files: `src/main.js`.

### Balance — Win rate normalization pass

- `DAILY_FOOD`: 1.2 → 1.35 (+25% consumption pressure)
- Starting food: 30 → 27 (-3 food units)
- Wear accumulation: plains 0.08→0.10, river_valley 0.12→0.15, wooded 0.15→0.20
- Fix `consumesItem` handling in `resolveChoice()` — Medicine Pouch now actually consumed by cholera event (was dead code)
- Lowered triumphant threshold in sim: 1400 → 1100
- Sim results: 35% win rate (target 25-40%), deaths: starvation ~20%, cart failure ~22%, no_trade ~40%

Files: `src/core/constants.js`, `src/systems/engine.js`, `tests/simulate-entry.js`.

## [v62] - 2026-06-08

### Added — Item-giving events for crafting input replenishment

- 4 new events added to the event pools that give crafting input items as rewards:
  - `plains_abandoned_camp` (plains): find 2× Shaganappi at a cached campsite
  - `plains_hbc_cache` (plains): find 1× Bison Hide from an HBC supply cache
  - `wooded_rope_find` (wooded): find 1× Rope (50ft) left beside the trail
  - `river_valley_ammo_trader` (river_valley): trade 3 food for 1× Ammunition Belt
- All use the existing `give` code path in `resolveChoice()` — no engine changes needed
- New source entries: `BREHAUT_ABANDONED`, `FONSECA_SUPPLY_CACHE`, `BREHAUT_AMMO`, `GOULET_HIDE`
- Crafting inputs (Shaganappi, Bison Hide, Rope, Ammunition Belt) are no longer a closed system — players can now acquire them mid-trail

Files: `src/data/events.js`, `src/data/sources/index.js`.

## [v56] - 2026-06-08

### Added — Crafting discoverability hint in settlement UI (#33)

- When a settlement has matching recipes, a hint line now appears below the settlement description:
  - Single recipe: "⚗️ Crafting: Finished Hides — 2×Bison Hide + 1×Shaganappi"
  - Multiple recipes: "⚗️ Crafting available (2 recipes)"
- Hidden when no recipes match the current settlement type
- Styled as small italic text with a subtle top border separator
- Hint element is reused across settlement visits (created once, toggled visible/hidden)

Files: `src/main.js`, `src/template.html`, `dist/index.html`.

## [v55] - 2026-06-08

### Added — Location/node markers on map (#26)

- All 16 trail nodes now shown as colored circle markers on the map
- Color-coded by settlement type: HBC=dark red, Métis=green, NWMP=blue, Mission=gold, Trading=brown, River=blue
- Current node: larger radius (9px), filled with type color, thicker border
- Visited nodes: small gray circles (5px, 0.6 opacity)
- Future nodes: medium circles (6px), type-colored border, light fill
- Hover/tap tooltip shows node name (styled to match game aesthetic)
- Replaced old single next-node marker with full trail markers
- Tooltip CSS: `.node-tooltip` — dark background, uppercase, game font

Files: `src/ui/renderer.js`, `src/template.html`, `dist/index.html`.

## [v54] - 2026-06-08

### Changed — Grouped secondary settlement actions behind collapsible toggle (#35)

- Primary actions (rest, trade, repair, heal) always visible
- Secondary actions (craft) hidden behind "More actions ▶" toggle
- Toggle expands to show secondary actions with "Less ▲" label
- No toggle shown on settlements with no secondary actions (Trading, Mission)
- Extracted `renderSettlementAction()` helper to avoid code duplication between primary/secondary rendering
- Simplified empty-state buttons (no more label+subtitle divs, single text line)
- Removed unused `.settlement-action` wrapper div references

Files: `src/main.js`, `src/template.html`.

## [v53] - 2026-06-08

### Changed — Consolidated action verb style across all panels (#34)

**Pattern:** verb-first label, cost inline in single line. No explanatory subtitles.

| Panel | Before | After |
|-------|--------|-------|
| Travel | "Travel 1 Day" / "Make Camp" | "Travel" / "Camp" |
| Camp | "Rest Up" / "Repair Cart" / "Scout Ahead" / "Dance / Fiddle" | "Rest" / "Repair" / "Scout" / "Dance" |
| Camp cost | "1 food, 0 days" / "1 day, no items" | "1 food" / "1 day" / "free" |
| Settlement | "Rest at Settlement" + prose subtitle | "Rest · 1 day · +2 food · +25 morale" |
| Settlement | "Repair Cart" + prose subtitle | "Repair · −2 wear" |
| Settlement | "Treat Crew" + prose subtitle | "Heal · +20 morale" |
| Settlement | "Crafting" | "Craft" |

- Removed dead `forage`/`recruit`/`rumours` entries from actionLabel/actionSubtitle
- Settlement buttons now render as single text line (no label+subtitle divs)
- Removed unused `settlement-action-label` / `settlement-action-sub` DOM elements
- Removed unused `.settlement-action` wrapper div

Files: `src/template.html`, `src/main.js`.

## [v52] - 2026-06-08

### Changed — Pruned redundant settlement actions (#31)

- Removed `recruit` from HBC and Métis settlements — strictly dominated by `rest` (rest does everything recruit does plus +2 food, +25 morale).
- Removed `forage` from all settlements — camp forage is strictly better (similar/better yields, no day cost).
- Removed `rumours` from all settlements — no mechanical effect (just advanced 1 day with no outcome).
- Removed dead `settlementAction()` handlers for `forage`, `recruit`, `rumours` from engine.

**Settlement actions after pruning:**
- HBC: rest, trade, repair, craft (4 → was 7)
- Métis: rest, craft, trade (3 → was 6)
- Trading: rest, trade (2 → was 4)
- Mission: rest, heal (2 → was 3)
- NWMP: rest, craft, trade (3 → was 4)

Camp actions unchanged — all 7 have clear distinct cost/benefit tradeoffs.

Files: `src/systems/engine.js`.

## [v51] - 2026-06-08

### Fixed — Dice outcome timing (#29 follow-up)
- Pass/fail outcome text was on a hardcoded 500ms timeout, slightly out of sync with the dice-settle CSS animation (450ms).
- Fix: replaced timeout with `animationend` event listener on the die element. Outcome now reveals exactly when the settle animation completes. Includes `revealed`-guard to prevent double-fire from the 500ms fallback timeout.
- File: `src/main.js`.

## [v50] - 2026-06-08

### Fixed — Food showing decimal places in status bar (#30)
- `DAILY_FOOD = 1.2` (balance pass) caused floating-point food values (e.g., 28.6, 27.4).
- Fix: round to 1 decimal after daily consumption; `Math.floor()` on display in both status bar and camp overlay.
- Files: `src/systems/engine.js`, `src/ui/renderer.js`, `src/main.js`.

### Fixed — Pass/fail shown during dice roll animation (#29)
- `renderDicePill()` displayed a "Pass"/"Fail" pill immediately on render, before the dice animation settled.
- Fix: removed the pass/fail pill from `renderDicePill()`. Outcome now only appears in `revealDiceOutcome()` after the settle animation completes (500ms delay).
- File: `src/main.js`.

### Fixed — Gabriel Dumont event at every ferry crossing (#37)
- Two identical Gabriel Dumont events existed: `ferry_gabriel` (river_valley pool) and `river_ferry_dumont` (river pool).
- Fix: removed `river_ferry_dumont` from the river event pool. Dumont now appears only once.
- File: `src/data/events.js`.

### Fixed — Day 1 first travel triggers settlement overlay (#36)
- Arriving at St. Boniface (node 1, type 'mission') immediately triggered `pendingSettlement`, blocking Travel/Camp/Cart/Crew on the very first travel.
- Fix: skip `pendingSettlement` when `S.node <= 1` (first arrival after start). Player gets one clean travel before the first settlement.
- File: `src/systems/engine.js`.

## [v49] - 2026-06-08

### Fixed — Settlement button transparency (secondary/utility actions unreadable)
- `.settlement-action-btn.secondary-action` used `background: var(--clr-bg)` which was too transparent over the settlement overlay.
- `.settlement-action-btn.utility-action` used `background: rgba(255,255,255,0.45)` — nearly invisible.
- Fix: secondary now uses opaque `#d4c9b4` with darker hover `#c4b9a4`; utility uses `rgba(210,200,180,0.92)` with solid hover.
- Applied to both `src/template.html` and `dist/index.html`.

### Fixed — Duplicate stat headings in status bar (#43)
- `renderStatusBar()` in `src/ui/renderer.js` was injecting `<span class="stat-label">` via `innerHTML` for Crew, Food, and Wear — but the HTML template already contains hardcoded `<span class="stat-label">` for each.
- Result: every stat label appeared twice (e.g., "Food Food 30").
- Fix: replaced `innerHTML` with `textContent` + `className` on the existing `stat-value` spans, leaving the template labels untouched.
- Built `dist/app.js` confirms zero `stat-label` re-injection.

## [v48] - 2026-06-08
### Changed — Settlement UI clarity and button hierarchy
- Explicit action labels/subtitles: `Rest at Settlement`, `Repair Cart`, `Treat Crew`, `Reinforce Crew`, `Ask Around`, etc.
- Visual action tiers in settlement overlay:
  - primary: trade / repair / rest / heal
  - secondary: craft / gossip / forage
  - utility: rumours / recruit / other
- Added `.settlement-action-btn` class with primary/secondary/utility variants and 44px min-height touch target enforcement.
- Kept trade/craft disabled/empty states clear and readable so players know why an action is unavailable.

### Docs
- Updated `HANDOFF.md` to reflect settlements polish pass and verified UI states.
- Logged tooling blocker in `ISSUES.md` #42.

## [v47] - 2026-06-07

### Fixed — Camp overlay reopen state (Action panel hidden after first camp)
- `showCamp()` rebuilt action buttons but never reset the panel visibility on subsequent opens, so after one action click the Camp overlay could open with no actions visible on future turns.
- Root cause: `actionsEl.style.display = 'none'` was only set on first click, never cleared before rebuild.
- Fix: `showCamp()` now explicitly sets `actionsEl.style.display = 'grid'` and `actionsEl.style.visibility = 'visible'` before rebuilding buttons.
- Build: `bun scripts/build.mjs` passes; `dist/index.html` at `app.js?v=46`.

### Opened — UX / pruning follow-ups (GitHub issues)
- #35 Reduce action-dense screens by grouping secondary actions
- #34 Audit and consolidate primary/secondary action verbs
- #33 Crafting discoverability in settlement UI
- #32 Balance pass on unforgiving events (medicine pouch)
- #31 Prune redundant settlement/camp actions (e.g. Recruit)

## [v46] - 2026-06-07
## [v44] - 2026-06-07

### Fixed — Pre-departure overlay narrative & category legend (v43→v44)
- Added `predeparture-briefing` narrative block to `#predeparture-overlay` explaining the journey context (Red River → Edmonton, Hudson's Bay Company contract).
- Added `category-legend` with 5 item categories: 🥩 Food (1 food/day), 🛠️ Repair (axles, shaganappi, tools), 🦬 Trade (hides, pelts), ⛺ Shelter (tarp, blankets, firewood), 🫙 Medical (medicine, shot).
- Each category includes concise purpose text to inform player loadout decisions.
- CSS for `.predeparture-briefing`, `.category-legend`, `.cat-item` in `src/template.html`.
- Build: auto-bumped `dist/index.html` to `app.js?v=44` (version drift: `src/template.html` still has no version; build script increments dist only).

### Known Blocking Bug — Overlay sequence (Issue #32)
- `bootstrap()` in `src/main.js` immediately activates `#predeparture-overlay` and deactivates `#intro-overlay` because engine initial state has `preDeparture: true`.
- Player never sees the intro screen with "Begin Journey" button.
- Fix required: `bootstrap()` must show intro first; `#intro-start` click must activate pre-departure; `#pd-confirm` must start game.

## [v43] - 2026-06-07

### Added — Pre-departure cart packing overlay (GitHub issue #15 / Issue #31)
- New `#predeparture-overlay` with full UI: weight tracking (used/100kg), +/- controls per item, Auto-Pack (Balanced), Confirm Loadout (disabled until weight ≤ capacity).
- Engine API: `getPreDepartureItems()`, `setPreDepartureCount(itemId, count)`, `confirmPreDeparture()`.
- `main.js`: `showPreDeparture()` renders overlay, updates weight, handles +/- clicks, auto-pack, confirm.
- Starting items available: Pemmican Rations, Firewood Bundle, Bison Hide, Beaver Pelts, Shaganappi, Axe, Spare Axle, Tarp, Blankets, Medicine, Shot, Trade Goods.
- Cart capacity: 100 kg. Starting preset (~128 kg) forces informed offload decisions.

### Fixed — Crafting exposure & MB removal (v41 work carried forward)
- Crafting now exposed at Métis and NWMP settlements via `availableSettlementActions()` returning `'craft'`.
- MB display removed from cart rows and crafting panel (`mbValue` retained in data for future economy).
- Category tooltips in cart overlay via `getCategoryHint()`.

## [v42] - 2026-06-07

### Fixed — Version sync after build
- Build auto-bumped `dist/index.html` to v42 but `src/template.html` was still at v41.
- Manually synced `src/template.html` to `app.js?v=42` so next build won't double-increment.

### Docs
- Updated `HANDOFF.md` — v41→v42 state, uncommitted working tree noted, known issues updated (HBC craft gap added), version drift noted as partially resolved.
- Updated `TODO.md` — Phase 6 balance pass subtasks marked complete.
- Updated `ISSUES.md` — #5 refreshed with v41/v42 context, #31 confirmed resolved. 
- Identified and documented **gap: HBC crafting recipe unreachable** — `finished_hides` recipe defined for `settlement: 'hbc'` but HBC action list lacks `'craft'`. Player can never access it.

## [v41] - 2026-06-07

### Fixed — Starting cart offload rebalance (Issue #31)

- Reduced starting `Pemmican Rations` count: `20 → 15` (−12.5 kg)
- Reduced `Firewood Bundle` count: `3 → 2` (−6 kg)
- Starting cart total: **~128 kg** (down from 146.5 kg) — still overloaded by 28 kg vs 100 kg capacity, but the first offload is no longer a near-total purge of useful items.
- Added category tooltips in cart overlay via `getCategoryHint()` so players can see what each item type is for before discarding.
- Removed “MB” currency display from crafting-panel recipes and cart item rows. `mbValue` remains in item/recipe data for possible future economy work.
- Exposed `'craft'` as a settlement action at Métis and NWMP settlements via `availableSettlementActions()`.
- Files changed: `src/data/items.js`, `src/main.js`, `src/systems/engine.js`
- Browser verified on Tailscale build: versions synced, no console errors on load.

## [v38] - 2026-06-07

### Balance Pass — Applied recommendations from 200-sim playtest

- **DAILY_FOOD**: 1.0 → 1.2 (tighter food economy, starvation now 11% of games vs 2%)
- **Wear accumulation**: plains 0.12→0.08, river_valley 0.18→0.12, wooded 0.22→0.15 (cart failure down from 24% to 19.5%)
- **Settlement repair**: now always reduces wear by 2 (was 1 without shaganappi)
- **EVENT_CHANCE**: 0.35 → 0.45 (more events per game: 8.5 vs 6.9 avg)
- **Triumphant threshold**: 1400 → 1200 (more achievable high-end ending)

### Balance Pass — Applied recommendations from 200-sim playtest

- Win rate: 66.5% (down from 70.5%)
- Starvation: 11% (up from 2%) — food scarcity now real
- Cart failure: 19.5% (down from 24%) — wear less aggressive
- Avg events/game: 8.5 (up from 6.9) — more content
- Avg final food: 14.4 (down from 20.6) — tighter economy
- 0 wins with food ≤ 0 (was possible before #29 fix)

## [v37] - 2026-06-07

- **Headless simulation harness** — `tests/simulate-entry.js` + `scripts/build-test.mjs`
  - Bundles the real engine via esbuild for Node.js execution
  - Runs N simulations (default 200) with weighted-random player choices
  - Tracks: ending type, score, days, final food/wear/morale, trade goods, action frequencies
  - Outputs aggregate stats: win rate, score distribution, death breakdown, node-by-node death map
  - Balance analysis with actionable recommendations
  - `--json` flag exports full results to `tests/results.json`

### Test Results — 200 Simulations

- **Win rate: 70.5%** — game is too easy (target: 25-40%)
- **Cart failure: 24%** of all games — wear accumulation is the #1 killer
- **Starvation: only 2%** — food economy is too generous
- **Triumphant endings: 0.8%** — 1400 threshold nearly unreachable
- **Timeout (200-day cap): 7%** — state machine loop bug
- **Avg events/game: 6.9** — reasonable but could be higher
- **Avg days survived: 44** — trail takes ~44 days on average

### Bugs Found

- **#29**: Victory condition bypasses starvation check — arriving at Edmonton with food ≤ 0 still shows "victory"
- **#30**: Trade panel shows duplicate "Trade" buttons at settlements

### Docs

- Updated `ISSUES.md` — added #29, #30; expanded #5 with harness details and balance findings
- Updated `TODO.md` — marked Phase 6 testing complete, added balance pass subtasks
- Updated `HANDOFF.md` — v37 state, test results, bug list
- Updated `AGENTS.md` — added pitfall: stale cart reference in offload loops

## [v36] - 2026-06-07

### Added — Rich Endings System (GitHub issue #14)

- **6 ending types** with unique titles, narratives, source quotes, and scoring breakdowns:
  1. **Victory — Triumphant Arrival** (score ≥ 1400): Strong finish, trade goods delivered
  2. **Victory — Humble Arrival** (score < 1400): Barely made it, survived against odds
  3. **Defeat — Starvation** (food ≤ 0): Ran out of food on the trail
  4. **Defeat — Cart Failure** (wear ≥ 5): Axle broke, cart destroyed
  5. **Defeat — Winter's Grasp** (early winter): Snow caught the party before Edmonton
  6. **Defeat — Crew Abandoned** (morale ≤ 0): Crew gave up and refused to continue
- Each ending includes: narrative explanation of what happened and why, thematic source quote with attribution, detailed scoring breakdown (base + bonuses - penalties), and a "how to improve" tip for next playthrough
- New `endReason` field on game state tracks which ending to show (`victory`, `no_trade`, `starvation`, `cart_failure`, `winter`, `abandoned`)
- New source entries: FORT_EDMONTON, PEMMICAN_FAMINE, WINTER_TRAIL, MORALE
- `showEnd()` rewritten with full scoring breakdown UI
- End-overlay HTML updated with source quote element and Score Breakdown header

### Added

- **Morale-based game over** — If crew morale drops to 0, the crew abandons the journey. New ending type "The Crew Has Had Enough".

### Docs

- Updated `HANDOFF.md` — full v36 state, all verified features, known issues, critical code paths, Phase 6 playtesting plan
- Updated `TODO.md` — added Phase 5 (Content & Mechanics) and Phase 6 (Playtesting & Balance), marked #14 and #28 done
- Updated `AGENTS.md` — added 2 new pitfalls: headless testing engine import path, playtesting randomization strategy
- Updated `ISSUES.md` — moved #3, #14, #16, #18, #20, #28 to Resolved; marked #5 as current priority with detailed implementation notes
- GitHub issues closed: #14 (conditional endings), #28 (trim dead features)

## [v35] - 2026-06-07

### Added
- **Squeal event** — When cart wear reaches 4+, there's a 35% chance per travel day of a squeal event. The axle's piercing shriek draws unwanted attention. Player chooses: lash with shaganappi (DC 9, -1 wear, +1 day), push on (morale -5), or night camp for proper repair (DC 11, -1 wear, +1 day). Event repeats if wear stays at 4+ and player ignores it. Source citation from Brehaut's Red River cart research.

### Changed
- `resolveChoice` now handles negative wear values (repair reduces wear, clamped at 0)
- Added `ch.morale` support to event choices (previously only food/crew/wear/time/give/flags/reps)

## [v34] - 2026-06-07

### Cleanup — Trim dead features (GitHub issue #28)
- Removed `factionPref` from all 3 items in `items.js` — field was never read by any code.
- Removed entire squeal system — `squeal` state stat, `squealChance` per terrain, `SQUEAL_THRESHOLDS`/`SQUEAL_LABELS` constants, `squealIndex()` function. Squeal was tracked but never displayed. Replaced with simpler concept: grease action now directly reduces wear by 1 (consumes shaganappi).
- Removed `grease` settlement action — was only there to reset squeal. Shaganappi is now used via the repair action at settlements.
- Removed `EventBus` class from `events.js` — was imported in debug.js but never used.
- Removed `createShell()` from `shell.js` — HTML is in template.js, not generated from JS.
- Removed `Node` class from `schema.js` — typedefs kept, but the runtime class was never instantiated.
- Removed `MAX_CART_KG: 450` from constants — actual capacity is hardcoded 100 in engine.
- Removed `CREW_STATES` from constants — defined but never referenced.
- Removed duplicate `ferry_gabriel` event from `river` terrain pool (kept the `river_valley` version).
- Cleaned up `FALLBACK_EVENTS` / `EVENTS` confusion in engine.js — merged into single `EVENTS` object.
- Net: ~120 lines dead code removed, 2 files gutted.

## [v32] - 2026-06-07

### Fixed
- **Mobile top bar clipped in portrait** (GitHub issue #27) — `#status-bar` used `white-space: nowrap; overflow: hidden` which clipped content on narrow screens. Added `@media (max-width: 768px)` rules: `flex-wrap: wrap`, reduced padding (4px 8px), smaller font (11px), `segment-progress` moves to its own row on top (`flex-basis: 100%; order: -1`). All 7 status items now visible on portrait mobile.

### Fixed
- **Settlement overlay never showed** — `game.getTradeEstimate` was referenced in `showSettlement()` (main.js) but never implemented in the engine. The JS error silently killed the entire render, so `pendingSettlement` was set but the overlay never got `display:block`. Added `getTradeEstimate()`, `tradeItem()`, `craftRecipe()`, and `getAvailableRecipes()` to the engine's public API.
- **Starting cart weight rebalance** — bumped to realistic values: Pemmican 2.5kg×20=50, Spare Axle 15kg, Bison Hide 6kg×3, Canvas Tarp 4kg×2, Firewood 6kg×3, Beaver Pelts 4kg×2. Total: **146.5 kg vs 100 kg capacity** — forces strategic unload decision at game start.

### Docs
- Updated `HANDOFF.md` with full v31 state, verified features, known issues, critical code paths, and next priorities.
- Updated `TODO.md` — checked off all completed items (overload guard, settlement close, trade/craft engine methods, gossip, trade economy, item wiring, event text refactor, source-quote audit). Added Phase 4 (UI/UX Polish) with mobile and map marker items.
- Updated `AGENTS.md` — added 3 new pitfalls: engine API methods must exist before UI calls them, item field is `wt` not `weight`, `generateGossip` tree-shaking risk. Added handoff rule to commit/push all changes.

## [v30] - 2026-06-07

### Fixed
- **Settlement close button stuck travel** — clicking the ✕ button on the settlement overlay only hid the UI but didn't clear `pendingSettlement` in the engine. Travel button then blocked all movement because `pendingSettlement` was still set. Now calls `settlementAction('continue')` + re-renders, same as "Continue West".

## [v29] - 2026-06-07

### Changed
- **Starting cart rebalance (take 2)** — v28 dropped weights to 85/100 kg but that was too generous; player should start forced to choose. Bumped counts and weights: Pemmican 2.5kg, Spare Axle 15kg, Bison Hide 6kg×3, Canvas Tarp 4kg×2, Firewood 6kg×3, Blanket 3kg×2, Beaver Pelts 4kg×2. Starting cart now **146.5/100 kg** — 46.5 kg over capacity. Player must unload before first travel, forcing a meaningful "what do I keep?" decision with real tradeoffs between food, repair, trade goods, and shelter.

## [v28] - 2026-06-07

### Fixed
- **Item weight rebalance** — starting cart was 570/100 kg (absurdly overloaded). Scaled all weights to realistic values. Starting cart now 85/100 kg. (Superseded by v29 — see above.)

## [v27] - 2026-06-07

### Fixed
- **Overload guard now works** — `getState()` was missing `usedWeight` and `capacity` fields, so the guard in `travelOneDay()` never fired. Now returns live `totalWeight(cart)` and `S.capacity`.
- **Added `offloadItem(name)` method** to engine — previously missing, called by `showCart()` unload buttons but didn't exist at runtime.
- Starting cart is 570/100 kg (Pemmican Rations alone are 450 kg). Player must offload before traveling.

## [v25] - 2026-06-06

### Fixed
- **Source-quote mismatch audit** — verified every event's `getSource()` key against the archive; fixed 7 mismatches:
  - `wooded_bee_tree`: `SCHULTZ_BURNT` → `GOULET_BEE_TREE` (bee/honey content)
  - `upland_water_hole`: `SCHULTZ_BURNT` → `SCHULTZ_ALKALI` (alkaline water)
  - `upland_night_frost`: `LACOMBE_HAIL` → `SCHULTZ_FROST` (frost/ice)
  - `river_ice_breakup`: `FONSECA_FORD` → `FONSECA_ICE` (ice breakup)
  - `river_sandbar_trap`: `FONSECA_BANK` → `BREHAUT_SANDBAR` (sandbar)
  - `plains_theft`: `MMF_COMMUNITIES` → `MMF_TRAIL_JUSTICE` (camp justice)
  - `river_cholera_camp`: `HBC_JOURNAL` → `HBC_DISEASE` (waterborne illness)
- Added 7 new source entries: `GOULET_BEE_TREE`, `SCHULTZ_ALKALI`, `SCHULTZ_FROST`, `FONSECA_ICE`, `BREHAUT_SANDBAR`, `MMF_TRAIL_JUSTICE`, `HBC_DISEASE`
- All 55 events now have quote-to-content alignment verified ✓

## Unreleased

### Added
- `docs/GOSSIP_DESIGN.md` — full design document for the gossip mechanic (intel types, generation rules, matching logic, UI rendering, per-node content table, known pitfalls). Written 2026-06-06.
- `docs/TRADE_DESIGN.md` — full design document for trade economy arcs (settlement profiles, trail position arc, recipes, gossip bonus, UI changes). Written 2026-06-06.
- `docs/EVENTS_DESIGN.md` — design document for deeper event text (target counts, new events per terrain, text quality standards, source citation rules). Written 2026-06-06.
- **Event text refactor & deeper content** — all 55 events now use `getSource('KEY')` pattern referencing `src/data/sources/index.js`
  - Expanded thin event text across all terrains (1-2 sentences → 2-4 vivid, sensory sentences with historical flavour)
  - Each event has flavour narrative in `text` + grounding primary-source quote in `source` field
  - Added 18 new source entries (Brehaut, Fonseca, Schultz, Lacombe, MMF, HBC journals, Barkwell, Goulet, Grey Nuns, Blanc)
  - 5 new upland events (3→8), 3 new river valley (11→13), 3 new wooded (7→9), 3 new river (5→9)
  - Built v24, deployed to dist/
  - All 55 events now have proper source citations (no inline sources remaining)
- Fixed `tradeItem(itemName)` — player-selected trade good is now correctly traded (was auto-selecting first match)
- **Trade economy system** — trade yield now varies by settlement type, item category, and trail position
  - `tradeMultiplier()` function: HBC pays 1.3× for furs, Métis pays 1.3× for repair, mission pays 1.2× for ammo, NWMP pays 1.2× for trade/furs
  - Trail arc: early trail (nodes 0–4) furs premium +20%, food cheap −20%; late trail (nodes 9–12) food expensive +30%, repair premium +30%, furs cheap −20%
  - Gossip `trade_hint` bonus: +3 food on next trade at mentioned settlement (consumed on use)
  - Trade UI: per-item yield estimates with ↑/↓ indicators, player chooses which trade good to spend
  - Cart overlay: shows MB value for each item
- **Crafting system** — combine items into higher-value trade goods at settlements
  - 3 recipes: Finished Hides (2 Bison Hide + Tool Kit → 3.5 MB), Travois Kit (Rope + Shaganappi + Blanket → 2.5 MB), Gunpowder Pack (Ammunition Belt + Firewood Bundle → 2.0 MB)
  - Recipes available at specific settlement types (hbc, metis, trading, nwmp)
  - Craft panel in settlement overlay shows inputs/outputs with have/need counts
  - `getAvailableRecipes()`, `craftRecipe()`, `getTradeEstimate()` API methods
- New item categories: Spare Axle/Tool Kit/Rope → `repair`, Ammunition Belt → `ammo` (was `hunting`)

### Fixed
- Cart overlay redesigned: shows weight summary header with overload warning and exact kg to offload, unload buttons show per-item weight savings (e.g. "Unload −40 kg"), auto-closes when weight drops under capacity.
- Overload guard now checks weight BEFORE calling `game.travelOneDay()` — previously the day was consumed even when travel was blocked.
- Build script version bump fixed: single-pass regex increments `?v=N` without double-increment drift.
- Removed dead `download()` CDN fetch function from `scripts/build.mjs`; Leaflet already bundled from `node_modules`.

### Added
- Gossip mechanic — new settlement action at all settlements
  - Costs 1 day, generates trail intel about the next leg
  - Intel displayed in persistent trail-intel panel with freshness indicators (🟢🟡🔴)
  - 50% chance intel includes a DC +2 bonus on matching events
  - Intel expires after 3 days
  - Differentiated from old "Rumours" action (which is now less reliable)
- New event choice fields: `itemBonus`, `consumesItem`, `requiresItem`
- Item integration system: all 12 inventory items now have mechanical purpose
  - **Spare Axle** — Settlement Repair consumes 1 → -3 wear (best repair)
  - **Tool Kit** — Settlement Repair bonus (with Shaganappi → -3 wear, alone → -2)
  - **Firewood Bundle** — Settlement Rest consumes 1 → +10 bonus morale
  - **Blanket** — Settlement Rest consumes 1 → +5 bonus morale
  - **Medicine Pouch** — Settlement Heal requires + consumes it (full heal); without it, heal is weaker (+10 morale vs +20)
  - **Ammunition Belt** — Starts with count 1 (was 0); itemBonus in hunt/bear/trade events (DC -2 to -4)
  - **Canvas Tarp** — itemBonus in rain/hail/storm/mosquito events (DC -4)
  - **Rope (50ft)** — itemBonus in river crossing/cart-righting events (DC -3)
  - **Bison Hide** — river_cart_raft event now checks requiresItem (needs 2 hides) instead of unreachable flag
- New event choice fields: `itemBonus`, `consumesItem`, `requiresItem` — items affect DCs or are consumed
- resolveChoice() handles item checks: requiresItem gates choices, consumesItem auto-succeeds, itemBonus reduces DC
  - `state.capacity`, `state.usedWeight`, `state.credit`, `state.perishable`
  - Item fields: `mbValue`, `perishable`, `factionPref`, `category`

### Fixed
- Camp outcome message now reflects post-rest state (crew/morale/food) instead of stale pre-camp values.

### Changed
- `src/data/items.js` every item carries MB value, perishability, and faction pref with safe defaults.
- `src/systems/engine.js` state init includes new economy fields.
- `src/ui/shell.js` adds `bindSheetToggle(triggerId, sheetId)` reusable toggle helper.
- `src/ui/renderer.js` `renderTally` preserves ledger `.open` state across updates and exposes the Tally event toggle.
- `src/main.js` mounts the debug UI when the query param `?debug=1` is present.
- `src/ui/persistence.js` save/load now stores/validates `version` (schema version 1) with forward-compatible migration and an explicit required-keys guard.

## [v0.5.1] - 2026-06-05

### Added
- Offload flow when cart exceeds weight capacity before travel.
- Crew-exhausted travel gate: Make Camp opens automatically if crew is exhausted.
- Persistent cargo readout in status bar: `<used>/<capacity>`.
- Economy schema defaults and save migration for `credit`, `capacity`, `usedWeight`, `perishable`.

### Fixed
- Intro overlay stays visible on load instead of flashing and disappearing.
- Begin Journey button sticky at bottom of intro card.
- Mobile: action buttons always visible without scrolling (sticky controls bar).
- Mobile: proper viewport height using `100dvh`, narrative compacted to `18vh` max.
- Leaflet CSS/JS bundled locally; no CDN dependency.
- Map tiles styled with sepia/saturate CSS filter for aged/historical appearance.
- Map starts at zoom 9 centered on Fort Garry bounding box.
- Full trail rendered as faint dashed line from start.
- Cart position interpolates between nodes day-by-day with smooth `panTo`.
- Dice click-to-dismiss with outcome text, pass/fail colors, hidden choices, compact mechanical summary.

### Changed
- Live at https://bayarddevries.github.io/metis-trail-v2/
- Build script auto-downloads Leaflet assets.
- Data loading guardrails prevent bubble breaks on missing venue/event shapes.
- Cache-bust managed by build automatically.

### Docs
- ISSUES.md reconciled; DEPLOYMENT.md added.

## [v0.5-playable] - 2026-06-04

### Added
- First fully playable public release via GitHub Pages.
- Day/month/season UI advances in status bar during travel.
- Cart marker icon rendered at 100x48 on map via Leaflet `L.icon`.
- esbuild image file loaders (`.png`, `.jpg`, `.svg`).

### Fixed
- Cross-module map initialization so route tiles render.
- Cart marker aspect ratio corrected (100x48).
