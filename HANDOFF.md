# HANDOFF — Metis Trail V2

**Last updated:** 2026-06-10 by OWL
**Version:** v82
**Server:** http://100.108.183.33:5173/ (python3 -m http.server in dist/)
**Branch:** main, clean tree, pushed to origin

---

## Session Summary (2026-06-10, Evening)

### v82 — Docs sync pass (no content changes)
- Updated `TODO.md`: mark completed items with version refs; eliminated double-listed "leaderboard" and "debug narrative" entries; fixed duplicate “v70” heading noise.
- Updated `HANDOFF.md` for consistency with current build state.
- Earlier in session: added v82 v81/v80/v79/v78/v77/v76/v75/v74/v73/v72/v71/v70+ changelog/Handoff entries.

### v81 — pushOn Fix + Playtesting Harness Update
- **Bug fix:** `pushOn()` in main.js was a no-op — mutated getState() copy, not engine state
  - Added `pushOn()` as proper engine method: -1.5 food, +1 wear, -5 morale, travelDaysWithoutRest++, crew degradation, advance()
  - main.js `pushOn(game)` now delegates to `game.pushOn()`
- **Sim update:** `tests/simulate-entry.js` rewritten for v79 mechanics
  - Camp action resolution: rest/forage/hunt/repair/scout/dance/pemmican_process/deeprest
  - Context-aware camp action weighting (terrain, items, crew state, food)
  - pushOn support via engine method
  - New tracking: pushOn, forage, hunt, scout, dance, pemmican, deepRest, squeal, sundayRest
  - Weather distribution at game end
  - `getState()` now includes `currentTerrain` and `travelDaysWithoutRest`
- **200-run sim results: 38.5% win rate (target 25-40% ✓)**
  - Deaths: no_trade 40%, starvation 13%, cart_failure 8.5%
  - Avg score: 810 (range 176–1090), median 826
  - 0 triumphant (≥1100) — threshold may need lowering to 900
  - Key issue: 40% reach Edmonton with no trade goods (trade goods too scarce)
- Files: `src/systems/engine.js`, `src/main.js`, `tests/simulate-entry.js`, `CHANGELOG.md`

### v80 — Pre-Departure Cart Packing Overlay (Issue #44)
- Restored 14 missing public API methods on engine return object (accidentally removed in v70b)
- Docs: conventional commit message format in AGENTS.md; JSDoc comments on all public engine methods
- Debug panel wired into bootstrap; only mounts on `?debug=1`
- Files: `src/systems/engine.js`, `src/main.js`

### v70 — Women, children, and family presence on the trail (#25)
- 4 new events, 5 new sources, new camp action (Process Pemmican)
- Updated settlement descriptions and travel fragments
- Based on research from Callihoo oral history, IPAC, Simpson's “Narrative”, KnowHistory scrip records

### v69 — Firebase leaderboard / highscore system (#12)
- Player name input, Firestore `scores` collection, Hall of Fame + My Scores tabs
- 8 sort options, local fallback
- Engine: `game.getScoreData()`

### v65 — Weather system (#13)
- 5-state weather (clear/overcast/rain/storm/snow) via season-aware Markov chain
- 4 new weather events, 6 new source entries, 64 weather-specific travel fragments
- Sim: 29% win rate

### v63 — Win rate normalization balance pass
- DAILY_FOOD 1.2→1.35, starting food 30→27
- Wear accumulation increased on all terrains
- consumesItem bug fixed (Medicine Pouch consumed by cholera)
- Sim: 35% win rate

### v62 — Crafting input replenishment
- 4 new item-giving events (Shaganappi, Bison Hide, Rope, Ammunition Belt mid-trail)

---
## Build & Serve

```bash
# Rebuild
cd /home/bayarddevries/metis-trail-v2-repo
bun scripts/build.mjs

# Serve (port 5173, not 8080 which is qBittorrent)
cd dist && python3 -m http.server 5173

# Verify
http://100.108.183.33:5173/
```

**Note:** Build script bumps `?v=N` in `dist/index.html` and `src/template.html`. Verify version parity after builds.

---
## Open Issues (GitHub / Local)

### Bugs
- **#42** — 3 secondary sources read as Wikipedia summaries (MMF_COMMUNITIES, CARLTON_TRAIL, NWMP_HISTORY) — text cleanup pending

### Content
- **#43** — Second half of Carlton Trail nodes not yet implemented
- **#10** — Icons for events/map (awaiting art from external agent)

### Enhancements
- **scout/guide hire** — moral choices anchored to event history (unstarted)

---
## Known Pitfalls (from AGENTS.md)

- **Map init timing:** Always call `initMap()` during `bootstrap()`, not deferred.
- **Port 8080:** qBittorrent uses it. Serve dev on 5173.
- **Browser verification:** Playwright click is broken on mobile; use JS click or real device.
- **Build version drift:** Template is source of truth; manually sync versions after builds.
- **Engine API:** Every method called from `main.js` MUST exist on engine's return object or the render function silently dies.
- **Item field name:** Items use `wt` for weight, not `weight`.
- **`pendingSettlement` blocks travel:** Both "Continue West" and "✕" must call `settlementAction('continue')`.
- **Stale cart reference:** Never cache `game.getCart()` during offload loops.
- **Template CSS vs dist CSS:** The build script preserves `dist/index.html` as the base; CSS must be patched directly into `dist/index.html` after templ changes.
- **Build command:** Use `bun scripts/build.mjs`; npm is broken in this environment.

---
## Project Structure

```
metis-trail-v2-repo/
├── src/
│   ├── main.js              # Entry point, UI bindings, event handlers
│   ├── template.html        # HTML template with inline CSS
│   ├── ui/
│   │   ├── renderer.js      # renderStatusBar, renderNarrative, map init
│   │   ├── persistence.js   # Save/load
│   │   ├── theme.js         # Theme application
│   │   ├── shell.js         # Shell UI
│   │   └── debug.js         # Debug panel
│   ├── systems/
│   │   ├── engine.js        # Core game engine (state, travel, events, items)
│   │   ├── events.js        # Event picking, resolution
│   │   ├── travel.js        # Travel helpers
│   │   └── scoring.js       # Score calculation
│   ├── core/
│   │   ├── constants.js     # DAILY_FOOD, MAX_WEAR, etc.
│   │   ├── calendar.js      # Day/month/season advancement
│   │   ├── schema.js        # State schema
│   │   └── seed.js          # Initial state seeding
│   └── data/
│       ├── events.js        # EVENT_POOLS (by terrain), pickEventForTerrain
│       ├── items.js         # 12 item definitions (field name: `wt`)
│       ├── nodes.js         # Trail nodes with lat/lon/type/terrain
│       └── sources/index.js # primary + secondary source entries
├── dist/                    # Built output (bun scripts/build.mjs)
│   ├── index.html           # Generated from template
│   ├── app.js               # Bundled JS
│   └── leaflet.{js,css}     # Bundled Leaflet
├── scripts/
│   ├── build.mjs            # esbuild + version bump + asset manifest
│   └── build-test.mjs       # Test harness build
├── tests/
│   ├── simulate-entry.js    # Headless playtesting (200 sims)
│   └── simulate-entry.sh    # Runner script
├── docs/                    # Design docs, interface reports
├── art/                     # Pixel art assets (cart marker, etc.)
├── ISSUES.md                # Local issue tracking (may be stale vs GitHub)
├── TODO.md                  # Full task breakdown by phase
├── CHANGELOG.md             # Version history
└── HANDOFF.md               # This file
```

---
## Next Session Priorities

1. **Trail expansion** — second half Carlton Trail nodes (#43)
2. **Source cleanup** — secondary sources to period voice / historical notes (#42)
3. **Scout/guide mechanic** — hireable guide with moral branching