# HANDOFF — Metis Trail V2

## Current State (v36)

- **Build**: `dist/app.js?v=36`, `src/template.html` at `?v=36` (synced)
- **Live**: https://bayarddevries.github.io/metis-trail-v2/
- **Local test**: `http://100.108.183.33:8081/index.html`
- **Branch**: `main`, clean working tree

## Verified Working (v36)

- Overload guard fires: cart shows **146.5 / 100 kg — Overloaded**
- Unload buttons remove items; cart auto-closes when under capacity
- Settlement close (✕) button clears `pendingSettlement` — no more stuck travel
- **Settlement overlays show correctly** at St. Boniface, St. Norbert, St. François Xavier
- Trade panel shows per-item yield estimates with ↑/↓ indicators
- Craft panel shows recipes filtered by settlement type
- Gossip mechanic generates trail intel with freshness indicators (🟢🟡🔴)
- Source-quote rendering in event overlay (`#event-source` div)
- All 55 events verified with `getSource()` key alignment
- 35 source entries in archive
- Full travel chain verified: Fort Garry → St. Boniface → St. Norbert → St. François Xavier
- **Squeal event triggers at wear ≥ 4** (35% chance/day) — axle shriek event with 3 repair/ignore choices, source citation from Brehaut
- **6 ending types** with rich narratives, source quotes, and detailed scoring breakdowns (victory/triumphant, victory/humble, starvation, cart failure, winter, crew abandoned)
- **Morale game over** at 0 — crew abandons the journey
- **Score breakdown** shows: base 1000, trade goods × 120, food bonus × 12, crew bonus, days penalty, wear penalty, final total
- Each ending includes a "how to improve" tip for next playthrough
- **Mobile top bar** wraps into 2 rows on portrait screens (v32 fix)

## Recent Changes (v34–v36)

### v34 — Trim dead code (GitHub issue #28) — CLOSED
- Removed `factionPref` from items, old squeal system (stat-based, hidden), EventBus class, createShell(), Node class, MAX_CART_KG, CREW_STATES, duplicate ferry_gabriel event, FALLBACK_EVENTS/EVENTS confusion
- ~120 lines dead code removed

### v35 — Squeal as wear-triggered event
- Old squeal was hidden accumulation with no display. New: 35% chance per travel day at wear ≥ 4
- Player gets event with 3 choices: lash with shaganappi (DC 9, -1 wear, +1 day), push on (morale -5), night camp repair (DC 11, -1 wear, +1 day)
- `resolveChoice` now handles negative wear (repair reduced, clamped at 0)
- Added `ch.morale` support to event choices

### v36 — Rich endings system (GitHub issue #14) — CLOSED
- 6 ending types: Triumphant (score ≥ 1400), Humble (score < 1400), Starvation (food ≤ 0), Cart Failure (wear ≥ 5), Winter (too late), Crew Abandoned (morale ≤ 0)
- New `src/data/endings.js` file
- `showEnd()` rewritten with full scoring breakdown UI
- New source entries: FORT_EDMONTON, PEMMICAN_FAMINE, WINTER_TRAIL, MORALE
- End-overlay HTML updated with source quote element

## Known Issues

### Build version drift
Build script bumps `?v=N` in `dist/index.html` but NOT in `src/template.html`. After every build, manually sync `src/template.html` to match.

### `generateGossip` possibly tree-shaken
Not grep-able in esbuild bundle but works at runtime. Monitor.

### Cart overlay: no item count in unload buttons
Buttons show "Unload −X kg" but not which item. Minor UX issue.

## Critical Code Paths

### Travel flow
1. `travelOneDay()` in `src/main.js` — overload guard checks `usedWeight > capacity`, auto-opens cart if over
2. `travelOneDay()` in `src/systems/engine.js` — advances day, fires events, checks arrival, sets `pendingSettlement`
3. Travel button returns early if `pendingSettlement` is set (by design)

### Settlement dismissal
- "Continue West" → `settlementAction('continue')` → clears `pendingSettlement` → re-renders
- "✕" close button → same path (fixed in v30, was only hiding DOM before)

### Settlement overlay rendering
- `showSettlement()` in `main.js` calls `game.getTradeEstimate()`, `game.getAvailableRecipes()`, `game.tradeItem()`, `game.craftRecipe()`
- All four methods must exist on the engine's public API — if any are missing, the entire overlay silently fails
- **Always verify settlement overlay appears after any engine API changes**

### Weight system
- Starting cart: **146.5 kg** (overloaded by 46.5 kg vs 100 kg capacity)
- `capacity: 100` in engine state
- `totalWeight(cart)` → `cart.reduce((s, i) => s + i.wt * i.count, 0)`
- Items use `wt` field (NOT `weight`)

### Trade/Craft system
- `tradeMultiplier(settlementType, category, trailPosition)` → multiplier
  - HBC pays 1.3× for furs, Métis pays 1.3× for repair, mission pays 1.2× for ammo, NWMP pays 1.2× for trade/furs
  - Trail arc: early (nodes 0–4) furs +20%, food −20%; late (nodes 9–12) food +30%, repair +30%, furs −20%
- 3 crafting recipes: Finished Hides (HBC), Travois Kit (metis), Gunpowder Pack (NWMP)
- Gossip `trade_hint` bonus: +3 food on next trade at mentioned settlement

### Item system
- 12 items with categories: `furs`, `repair`, `ammo`, `trade`, `food`, `shelter`, `fuel`, `hunting`, `medical`
- Event choice fields: `itemBonus` (DC reduction), `consumesItem` (auto-success + consume), `requiresItem` (gate + consume)
- All 12 items wired into repair/rest/heal/event systems

### Gossip/intel system
- Costs 1 day, generates `trailIntel` entries with `expiresOnDay`
- Intel types: `river_hint`, `nwmp_hint`, `heal_hint`, `trade_hint`, `morale_hint`, `fuel_hint`, `trail_hint`
- 50% chance intel includes DC +2 bonus on matching events
- Rendered in `#trail-intel` div with 🟢🟡🔴 freshness

### Source citation system
- All 55 events use `getSource('KEY')` pattern — never inline source objects
- 35 source entries in `src/data/sources/index.js`
- Quotes rendered in `#event-source` div in event overlay
- All quotes verified for thematic alignment with event content

### Scoring system (currently used only in endings)
- Base: 1000
- Trade goods: count × 120
- Food bonus: count × 12
- Crew condition bonus
- Days penalty: −8/day
- Wear penalty: −40 × wear²
- Threshold: ≥ 1400 = Triumphant, < 1400 = Humble

## Build & Deploy

```bash
cd /home/bayarddevries/metis-trail-v2-repo
bun scripts/build.mjs
# Sync src/template.html version to match dist/index.html
git add -A && git commit -m "feat/fix: ..." && git push
# GitHub Actions auto-deploys to GitHub Pages
```

## Server

```bash
cd /home/bayarddevries/metis-trail-v2-repo/dist
python3 -m http.server 8081 --bind 0.0.0.0
```

## Next Priorities — PHASE 6: Playtesting & Balance

The user wants **two types of testing** (GitHub issue #5):

### 1. Headless Playtesting Harness
- Run 100s of automated game simulations using the real engine (`src/systems/engine.js`)
- No UI needed — call engine methods directly: `travelOneDay()`, `settlementAction()`, event choices
- Goal: find balance issues (is the game too hard/easy?), edge cases (can you get stuck?), and economy exploits
- Suggested approach:
  - Write a test harness in `tests/simulate.js` that imports the engine
  - Run N simulations with randomized player choices
  - Log outcomes: ending type, score, days, death reason, items remaining
  - Aggregate stats: win rate, avg score, most common death, item usage frequencies
- The engine is a pure JS module with no DOM dependency — it can be `require()`/`import()`-ed directly from Node/bun
- Key engine entry point: the factory function in `src/systems/engine.js` that returns `{ getState, setState, travelOneDay, ... }`
- **IMPORTANT**: You cannot import `src/systems/engine.js` directly from bun/node because it imports from relative paths. You'll need to either:
  - Use `bun --conditions=source tests/simulate.js` (if bun supports it), or
  - Create a bunfig.toml with path aliases, or
  - Run the harness inside the bundled dist/app.js context (use esbuild to bundle a test entry point)
- **Simplest path**: Write the harness as an esbuild entry point like `tests/simulate-entry.js` that imports the source modules the same way `src/main.js` does, then `bun scripts/build-test.mjs` to bundle it for Node

### 2. Browser Click-Through Testing
- Non-headless, visual QA of the full user experience
- Use the browser tool (Hermes built-in) to load https://bayarddevries.github.io/metis-trail-v2/ and click through the game
- Verify: overlays appear/disappear correctly, buttons work, flow from intro → travel → events → settlement → endings works end-to-end
- Pay special attention to mobile layout (user tests on real mobile devices)
- **browser_click does NOT reliably trigger addEventListener on mobile** — if user says button doesn't work, it's real. Verify via JS click or real device.

### Suggested First Steps for Next Agent
1. Read this file, TODO.md, AGENTS.md, CHANGELOG.md
2. Read `src/systems/engine.js` to understand the public API for headless testing
3. Build the headless harness first — it's higher value for balance tuning
4. Run 100+ simulations, report aggregate stats
5. Then do browser click-through QA on the live site
6. Document findings in ISSUES.md

## Open GitHub Issues

| # | Title | Priority | Notes |
|---|-------|----------|-------|
| 26 | Node/location markers on map | Medium | Leaflet markers for settlements. Manny Morr's 3 pixel art images (Fort Garry, Fort Edmonton, Fort Ellice) from Google Drive folder `18BIjiLG2cdiTLOuh3lBqMY3x-u7nAIW8` are arrival cards, not map pins — tabled pending decision |
| 25 | Cultural review | Low | External dependency — needs human reviewer |
| 15 | Pre-departure cart packing | Medium | Let players choose starting loadout with budget/space |
| 13 | Weather system | Medium | Daily weather modifiers for events/outcomes/morale/wear |
| 12 | Highscore/leaderboard | Medium | Score tracking by outcome type |
| 10 | Basic icons | Low | Replace basic UI icons with themed artwork |
| 6 | AI writing review | Low | Audit copy for AI-isms |
| 5 | Testing infrastructure | **HIGH** | Headless + browser testing — this is the current priority |

## Closed GitHub Issues (this session)

| # | Title | Version |
|---|-------|---------|
| 28 | Trim dead features | v34 |
| 27 | Mobile top bar clipped | v32 |
| 20 | Gossip benefit | v26 |
| 18 | Deeper event text | v24 |
| 16 | Economy/trade | v26 |
| 14 | Conditional endings | v36 |
| 3 | Research-archive citations | v24 |

## Files Modified (this session)

- `src/systems/engine.js` — added getTradeEstimate, tradeItem, craftRecipe, getAvailableRecipes, endReason, morale game-over, negative wear, ch.morale support
- `src/systems/events.js` — removed EventBus, duplicate ferry_gabriel
- `src/systems/shell.js` — removed createShell()
- `src/systems/schema.js` — removed Node class
- `src/data/constants.js` — removed dead constants
- `src/data/items.js` — removed factionPref
- `src/data/sources/index.js` — added 4 new source entries
- `src/data/endings.js` — NEW, 6 ending types
- `src/ui/main.js` — rewrote showEnd(), removed grease, added ENDINGS import
- `src/template.html` — end-overlay quote element, .end-source CSS, mobile status bar fix
- `CHANGELOG.md` — v31–v36 entries
- `HANDOFF.md` — this file
- `TODO.md` — updated
- `AGENTS.md` — updated with pitfalls
