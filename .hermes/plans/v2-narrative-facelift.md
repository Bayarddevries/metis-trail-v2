# Metis Trail V2 — Narrative Facelift Implementation Plan

**Target:** v2.0 release  
**Focus:** Narrative journal, economy simplification, memoir export, bug fixes (#92-95), accessibility baseline  
**Philosophy:** Polish & prune — fewer, deeper systems; literary diary replaces mechanical log

---

## 1. NARRATIVE JOURNAL SYSTEM (Core Feature)

### 1.1 User Experience
- **Journal panel** (bottom panel) becomes **"Diary"** — single continuous scroll
- **Today's entry** pinned at bottom (most recent day), scroll up for previous days
- **First-person voice** — "I hired the scout", "We shared rubaboo"
- **One entry per day** — generated at day rollover (end of turn processing)
- **Entry structure:**
  - Date/location header
  - Opening (weather, terrain mood)
  - Event narrative (if event occurred: choice + outcome in prose)
  - Camp narrative (camp action flavor or "made camp without incident")
  - Crew pulse (morale/state as prose)
  - Compact stat line (food, wear, morale, crew)

### 1.2 Architecture

```
src/
  narrative/
    index.js              # Public API: generateDailyEntry(state, logs)
    templates/
      opening.js          # Template functions (JS template literals)
      event_success.js
      event_failure.js
      camp_rest.js
      camp_forage.js
      camp_hunt.js
      camp_repair.js
      camp_scout.js
      camp_dance.js
      camp_push_on.js
      camp_none.js
      crew_pulse.js
      closing_stats.js
    vocabulary/
      weather.js          # { clear: [...], rain: [...], storm: [...] }
      terrain.js          # { plains: [...], river_valley: [...], wooded: [...] }
      crew_mood.js        # { high: [...], mid: [...], low: [...] }
      time_of_day.js      # { dawn: [...], midday: [...], dusk: [...], night: [...] }
    compiler.js           # buildContext(state, logs) + render(template, ctx)
```

**Template format (JS template literals):**
```js
// templates/opening.js
export function opening(ctx) {
  const terrainDesc = pick(ctx.vocab.terrain[ctx.terrain]);
  const weatherDesc = pick(ctx.vocab.weather[ctx.weather]);
  return `${ctx.date} — Day ${ctx.day} — ${ctx.region}\n\nThe ${weatherDesc} ${ctx.season} lay heavy on the ${terrainDesc}.`;
}
```

**Context object passed to templates:**
```js
{
  day, date, month, season, year,
  node, nodeName, region, terrain, weather,
  event: { type, choiceText, outcome, flavor, rollTotal, dc, critical },
  camp: { type, flavor, effects, rollTotal, dc, critical },
  morale, crew, crewState, food, wear, credit, furs,
  vocab: { weather, terrain, crew_mood, time_of_day }
}
```

### 1.3 Integration Points
- **Engine** (`engine.js`): At day rollover (`advanceDay` or `processTurn`), call `generateDailyEntry()` with accumulated logs, append to `state.journalEntries[]`
- **Renderer** (`renderer.js`): Replace `renderJournal()` with `renderDiary()` — single scroll container, today's entry at bottom
- **Main** (`main.js`): Journal UI event handlers (scroll, expand/collapse not needed — continuous prose)

### 1.4 Data Migration
- `state.journal` (array of mechanical log objects) → deprecated
- `state.journalEntries` (array of rendered HTML strings) — new
- On load: if old journal exists, convert on first day rollover (one-time)

---

## 2. ECONOMY SIMPLIFICATION

### 2.1 Currency Model (Two Track)
| Currency | Earned At | Spent At | Purpose |
|----------|-----------|----------|---------|
| `hbcCredit` | Sell furs/hides at HBC posts | Buy supplies at HBC posts | Company credit line |
| `metisTrust` | Help Métis, share meals, trade fairly | Unlock Métis camp inventory, horses, pemmican recipes | Reputation/gating |

**Removed:** General `credit`, `reputation` object (hbc/metis/nwmp/cree keys)

### 2.2 Item Tags (`src/data/items.js`)
```js
{
  name: 'Bison Hide',
  type: 'tradeGood',        // NEW: tradeGood | supply | tool | medicine | luxury
  weight: 10,
  value: 15,                // Base value for scoring only
  hbcPrice: 12,             // HBC buys at
  metisTrade: { gives: 'Pemmican', rate: 2 }, // 2 hides → 10 pemmican
}
```

### 2.3 Settlement UI — Unified "Post" Screen
**Single overlay** (`#settlement-overlay`) with tabs:
- **Trade** — Two columns: *My Cargo* / *Their Stores* — drag item row → converts at fixed ratio
- **News** — Rumors, trail conditions, prices at next posts (scout action feeds this)
- **Rest** — Pay food/credit for morale/crew recovery (replaces camp at settlement)
- **Outfit** — Only at Fort Garry (pre-departure) — starting gear selection

**Trade interaction:**
- Drag `Bison Hide` from left → drops on `Pemmican` right → "Convert 2 hides → 10 pemmican?" confirm
- No prices shown, only ratios. HBC shows credit amounts. Métis shows direct goods.
- Weight updates live. Over-capacity warning.

### 2.4 Settlement Types & Inventories
```js
// src/data/settlements.js (NEW)
export const SETTLEMENTS = {
  'fort_garry': { type: 'hbc', inventory: [...], services: ['outfit', 'trade', 'news'] },
  'st_boniface': { type: 'metis', inventory: [...], services: ['trade', 'news', 'rest'] },
  'fort_elice': { type: 'hbc', inventory: [...], services: ['trade', 'news'] },
  'batoche': { type: 'metis', inventory: [...], services: ['trade', 'news', 'rest', 'horses'] },
  'fort_carlton': { type: 'hbc', inventory: [...], services: ['trade', 'news', 'nwmp_duty'] },
  'fort_edmonton': { type: 'hbc', inventory: [...], services: ['trade', 'final_score'] },
  // Missions, NWMP posts as minimal nodes
};
```

### 2.5 Scoring Adjustment
- Final score = `fursDelivered * 10 + hbcCredit + metisTrust * 50 + crewBonus + cartHealthBonus - dayPenalty`
- Trade goods delivered to Edmonton count; converted goods (pemmican eaten) don't
- `calculateScore()` in `scoring.js` updated accordingly

---

## 3. MEMOIR EXPORT (Shareable Artifact)

### 3.1 Export Formats
1. **Styled HTML** — `blob:...` download, includes:
   - Title page: Caravan name, dates, ending
   - Map trace (SVG polyline of nodes visited)
   - Daily diary entries (full prose)
   - Final stats + score breakdown
   - Ending narrative + source quote
   - CSS embedded (self-contained file)
2. **Plain text** — fallback, same content no styling
3. **Share URL** — `https://metistrail.ca/?seed=abc123&choices=[...]&ending=victory` — reconstructs run on load

### 3.2 Implementation
```
src/
  export/
    index.js              # exportJourney(state, format) → { html, text, shareUrl }
    htmlTemplate.js       # Full HTML document with embedded CSS
    mapTrace.js           # Generate SVG path from state.visitedNodes[]
    shareEncoder.js       # encodeRun(state) / decodeRun(queryString)
```

**Share URL payload (compressed):**
```js
{
  s: 'abc123',           // seed
  c: [[day, node, choiceId, outcome], ...],  // choice log
  e: 'victory',          // ending
  d: 47,                 // days
  sc: 2340               // score
}
```

### 3.3 UI
- **End screen**: "Share Journey" button next to "Play Again"
- Click → modal: [Download HTML] [Download Text] [Copy Share Link]
- Share link opens game with `?run=...` — shows "Replay This Journey" mode (read-only diary)

---

## 4. BUG FIXES (#92-95)

### #92 — End Screen: Score Calculation + Contrast
- **Score**: In `showEnd()`, call `calculateScore(state)` before render, populate `#end-stats` with breakdown rows
- **Contrast**: `#end-overlay .end-card` background = `var(--clr-card-bg)`, text = `var(--clr-ink-panel)`, accent rows use `var(--clr-accent)` — verify in both light/dark mode

### #93 — Settlement Outcome Contrast
- Settlement result cards use `.camp-card` pattern — ensure `color: var(--clr-ink-panel)` on name, `var(--clr-accent)` on cost, `var(--clr-danger)` on risk, `var(--clr-muted)` on flavor

### #94 — Store Briefing Contrast
- `#predeparture-overlay .predeparture-briefing` — text color `var(--clr-ink-panel)`, hint `var(--clr-source-text)`, balance `var(--clr-accent)`

### #95 — Store Dual Scroll
- Merge `#predeparture-list` and `.predeparture-briefing` into single scrollable `.overlay-card` content area
- Briefing at top, list below, no nested scroll

---

## 5. ACCESSIBILITY BASELINE

| Requirement | Implementation |
|-------------|----------------|
| Focus management | Overlay open → trap focus in `.overlay-card`, first button focused; Esc closes |
| Keyboard navigation | All interactive elements reachable via Tab; Enter/Space activates |
| ARIA live regions | Dice rolls, narrative updates, stat changes → `aria-live="polite"` |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables dice spin, cart interpolation, transitions |
| High contrast mode | Separate CSS variant `--clr-ink-high`, `--clr-bg-high` — toggle in settings |
| Screen reader labels | `aria-label` on stat pills, camp cards, settlement tabs |

---

## 6. TECHNICAL REFACTORING (Enable Above)

### 6.1 Module Split (`src/`)
```
main.js (2183 lines) → 
  main.js (bootstrap, ~200 lines)
  overlays/
    end.js
    settlement.js      # Unified post screen
    camp.js
    event.js
    intro.js
    predeparture.js
  core/
    state.js           # GameState class, serialization
    scoring.js         # Updated calculateScore()
    journal.js         # Diary rendering
    input.js           # Keyboard/focus management
  narrative/
    index.js           # generateDailyEntry()
    compiler.js
    templates/*.js
    vocabulary/*.js
  export/
    index.js
    htmlTemplate.js
    mapTrace.js
    shareEncoder.js
```

### 6.2 Data-Driven Events
- `src/data/events/` — directory of JSON files per pool (`plains.json`, `river_valley.json`, `wooded.json`)
- `src/data/events/index.js` — loader, validation schema
- Engine imports pooled events at startup — no code changes for content edits

### 6.3 Build Fix (`scripts/build.mjs`)
- Copy `src/assets/` → `dist/assets/` preserving structure
- CSS `url()` paths resolve correctly in dist
- Inject build hash into `app.js?v=HASH` for cache busting

---

## 7. IMPLEMENTATION SEQUENCE

| Phase | Tasks | Deliverable |
|-------|-------|-------------|
| **0. Foundation** | Module split (main.js → overlays/core), build fix, Vitest setup | Clean architecture, tests pass |
| **1. Narrative Engine** | Vocabulary, templates, compiler, `generateDailyEntry()`, integrate at day rollover | Daily prose entry generates |
| **2. Diary UI** | Replace journal renderer with diary scroll, today-pinned, stat line | Journal panel shows literary diary |
| **3. Economy Simplify** | Two-currency model, item tags, settlement data, unified post screen (tabs, drag-convert) | Trading feels like conversion, not shopping |
| **4. Memoir Export** | HTML template, map trace SVG, share encoder, end-screen modal | "Share Journey" works end-to-end |
| **5. Bug Fixes** | #92 score+contrast, #93 settlement contrast, #94 store contrast, #95 single scroll | All 4 bugs verified fixed |
| **6. Accessibility** | Focus trap, ARIA live, reduced motion, high contrast CSS, keyboard audit | Passes basic a11y checklist |
| **7. Polish** | Playtest full run, fix regressions, update CHANGELOG/HANDOFF | v2.0 release candidate |

**Estimated effort:** 3-4 weeks focused work (sequential, no parallel tracks)

---

## 8. OPEN DECISIONS — **RESOLVED**

| # | Decision | Resolution | Rationale |
|---|----------|------------|-----------|
| 1 | Template authoring | **JS template literals** (ES modules) | Zero deps, full JS power, tree-shakeable, direct editing |
| 2 | Diary persistence | **Store context objects, re-render on load** | Smaller saves, template improvements apply retroactively |
| 3 | Share URL compression | **Custom bit-packing** (zero deps) | Predictable size, no dependencies, schema control |
| 4 | Build/CSS extraction | **Leave inline for v2.0** | Simplest, cache-busted via `?v=HASH` |
| 5 | Hunt events | **Audit + tune existing `campAction('hunt')` first** | May make dedicated hunt events unnecessary |
| 6 | Testing strategy | **Vitest + headless engine test (Phase 0), Playwright (Phase 2+)** | Unit + integration coverage, zero-browser CI for core logic |

---

## 9. DEFERRED TO POST-v2.0 (Explicit)

| Item | Original Ref | Rationale |
|------|--------------|-----------|
| Horse/oxen system | §8 #4 | New state, UI, balance — scope expansion |
| Camp upgrades (drying rack, tool kit, fiddle, lean-to) | §8 #5 | Progression tracking, build UI — feature expansion |
| Data-driven events JSON migration | §6.2 | Infra only, no player-facing value for v2.0 |

---

## 10. MISSING ITEMS ADDED TO PLAN

| # | Item | Phase | Details |
|---|------|-------|---------|
| 1 | **Save schema v2 migration** | 0 | `SAVE_SCHEMA_VERSION = 2` in `constants.js`; `migrateState()` in `persistence.js` handles: `journal[] → journalEntries[]` (context objects), `credit.hbc → hbcCredit`, `reputation.metis → metisTrust`, add `visitedNodes[]` array |
| 2 | **Share URL bit-packing spec** | 4 | `shareEncoder.js`: 18 bits/choice (day:7, node:6, choice:4, outcome:1), LZ-string fallback if >2KB, max 50 choices ≈ 113 bytes |
| 3 | **`visitedNodes[]` tracking** | 1 | Push `{nodeId, day, segmentProgress}` in `travelOneDay()` on node arrival; used for memoir map trace SVG |
| 4 | **Narrative compiler error boundary** | 1 | Wrap `generateDailyEntry()` in try/catch → fallback mechanical entry (`\"Day X — Camp made. Food: Y. Wear: Z.\"`) so game never soft-locks |

---

## 11. PHASE 0 — FOUNDATION (Updated Tasks)

| Task | Description | Verification |
|------|-------------|--------------|
| **0.1** | **EngineAPI contract** — Add JSDoc `@typedef {Object} EngineAPI` in `systems/engine.js` listing every method `main.js` calls (`getState`, `advanceDay`, `campAction`, `settlementAction`, `travelOneDay`, `getEndgameScore`, `save`, `load`, `newGame`, etc.) | `grep -r "game\." src/main.js` → 0 unresolved calls after split |
| **0.2** | **Save schema v2** — `SAVE_SCHEMA_VERSION = 2`, `migrateState(v1) → v2` in `persistence.js` | Load v1 save → auto-migrates, no console errors, `state.journalEntries[]` populated |
| **0.3** | **Module split scaffold** — Create `overlays/` + `core/` dirs, move code incrementally (one overlay at a time), update imports | `bun run build` → `dist/index.html` loads, full playthrough works |
| **0.4** | **Extend `getState()`** — Add `lastEvent`, `lastCampAction`, `lastSettlementAction` with full result objects; add `visitedNodes[]` | Narrative compiler context complete (Phase 1) |
| **0.5** | **Vitest setup** — `bun add -D vitest @vitest/coverage-v8`; config for `src/systems/**/*.test.js`; headless engine test: `new Engine()` → `advanceDay()` × 10 → assert `state.visitedNodes.length > 0` | `bun test` passes; coverage > 60% on `engine.js`, `scoring.js` |
| **0.6** | **Build verification** — `bun run build` → `dist/` loads on `http://localhost:8081` (Tailscale), no console errors | Manual smoke test: start game, travel 3 days, camp, reach settlement |

---

## 12. UPDATED IMPLEMENTATION SEQUENCE

| Phase | Tasks | Deliverable |
|-------|-------|-------------|
| **0. Foundation** | EngineAPI, save migration v2, module split scaffold, getState() extensions, Vitest + headless test, build verification | Clean architecture, tests pass, full playthrough works |
| **1. Narrative Engine** | Vocabulary, templates, compiler, `generateDailyEntry()`, integrate at day rollover, error boundary, `visitedNodes[]` tracking | Daily prose entry generates, no soft-locks |
| **2. Diary UI** | Replace journal renderer with diary scroll (today pinned at bottom), stat line | Journal panel shows literary diary |
| **3. Economy Simplify** | Two-currency model (`hbcCredit`, `metisTrust`), item tags, settlement data, unified post screen (tabs, drag-convert) | Trading feels like conversion |
| **4. Memoir Export** | HTML template, map trace SVG, share encoder (bit-packing), end-screen modal | "Share Journey" works end-to-end |
| **5. Bug Fixes** | #92 score+contrast, #93 settlement contrast, #94 store contrast, #95 single scroll | All 4 bugs verified fixed on live playtest |
| **6. Accessibility** | Focus trap, ARIA live, reduced motion, high contrast CSS, keyboard audit | Passes basic a11y checklist |
| **7. Polish** | Playtest full run, fix regressions, update CHANGELOG/HANDOFF | v2.0 release candidate |

---

## 9. ROLLBACK CRITERIA
If any phase breaks core loop (travel → event → camp → settlement → next day):
- Revert to last working commit
- Isolate failing module
- Fix before proceeding

---

## 10. SUCCESS METRICS (v2.0)
- Full playthrough generates coherent diary (no "[object Object]" or missing data)
- Economy: player converts trade goods → survives → delivers remainder (no hoarding)
- Memoir export opens in browser, looks styled, share link reconstructs run
- #92-95 verified fixed on live playtest (Tailscale 100.108.183.33:8081)
- Zero console errors, zero accessibility violations (axe-core baseline)