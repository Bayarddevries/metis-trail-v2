# HANDOFF — Metis Trail V2

**Last updated:** 2026-06-08 by OWL
**Version:** v62 (dist), template synced for next build
**Server:** http://100.108.183.33:5173/ (python3 -m http.server in dist/)
**Branch:** main, clean tree, pushed to origin

---

## Session Summary (2026-06-08)

### v62 — Item-giving events for crafting input replenishment
- 4 new events that give crafting input items as rewards, making crafting a renewable system:
  - `plains_abandoned_camp`: find 2× Shaganappi at a cached campsite (plains pool)
  - `plains_hbc_cache`: find 1× Bison Hide from an HBC supply cache (plains pool)
  - `wooded_rope_find`: find 1× Rope (50ft) left beside the trail (wooded pool)
  - `river_valley_ammo_trader`: trade 3 food for 1× Ammunition Belt (river_valley pool)
- All use existing `give` code path in `resolveChoice()` — no engine changes
- New source entries: `BREHAUT_ABANDONED`, `FONSECA_SUPPLY_CACHE`, `BREHAUT_AMMO`, `GOULET_HIDE`
- Files: `src/data/events.js`, `src/data/sources/index.js`

### v61 — Crafting discoverability hint (#33)
- `.settlement-action-btn.secondary-action`: `var(--clr-bg)` → opaque `#d4c9b4`
- `.settlement-action-btn.utility-action`: `rgba(255,255,255,0.45)` → `rgba(210,200,180,0.92)`
- Duplicate stat headings (#43): replaced `innerHTML` with `textContent` + `className` on stat-value spans in `renderStatusBar()`. Template labels are now the sole label source.
- Files: `src/template.html`, `src/ui/renderer.js`, `dist/index.html`

### v50 — 4 low-hanging bug fixes (#29, #30, #36, #37)
- **#30 (food decimals):** `DAILY_FOOD = 1.2` caused float values. Fixed with `Math.round(...*10)/10` after subtraction, `Math.floor()` on display in status bar and camp overlay. Files: `src/systems/engine.js`, `src/ui/renderer.js`, `src/main.js`
- **#29 (dice timing):** Pass/fail pill removed from `renderDicePill()`. Outcome only appears in `revealDiceOutcome()` after dice settle. File: `src/main.js`
- **#37 (Gabriel Dumont duplicate):** Removed `river_ferry_dumont` from river event pool. `ferry_gabriel` (river_valley pool) remains as the single Dumont event. File: `src/data/events.js`
- **#36 (first travel settlement):** Skip `pendingSettlement` when `S.node <= 1`. Player gets one clean travel before first settlement. File: `src/systems/engine.js`

### v56 — Crafting discoverability hint (#33)
- Hint line below settlement description when recipes are available
- Single recipe: shows name + inputs; multiple: shows count
- Hidden when no recipes match; styled subtle (small italic, muted color)
- Files: `src/main.js`, `src/template.html`, `dist/index.html`

### v55 — Added location/node markers on map (#26)
- All 16 trail nodes shown as colored circle markers
- Color-coded by settlement type (HBC=red, Métis=green, NWMP=blue, Mission=gold, Trading=brown, River=blue)
- Current node: larger (9px), filled; visited: small gray (5px); future: medium (6px)
- Tooltips on hover/tap show node name
- Files: `src/ui/renderer.js`, `src/template.html`, `dist/index.html`

### v54 — Grouped secondary settlement actions (#35)
- Primary actions always visible; secondary (craft) behind "More actions ▶" toggle
- Toggle text: "More actions ▶" / "Less ▲"
- No toggle on settlements with no secondary actions
- Extracted `renderSettlementAction()` helper, simplified empty-state buttons
- Files: `src/main.js`, `src/template.html`

### v53 — Consolidated action verb style (#34)
- Single pattern across all panels: verb-first label, cost inline, single line
- Travel: "Travel 1 Day" → "Travel", "Make Camp" → "Camp"
- Camp: "Rest Up" → "Rest", "Repair Cart" → "Repair", "Scout Ahead" → "Scout", "Dance / Fiddle" → "Dance"
- Camp costs: "1 food, 0 days" → "1 food", "1 day, no items" → "1 day", "0 days, no items" → "free"
- Settlement: label+subtitle divs → single text line with cost appended
- Removed dead actionLabel entries (forage, recruit, rumours, gossip, reinforce)
- Removed unused `.settlement-action` wrapper and label/subtitle divs
- Files: `src/template.html`, `src/main.js`

### v52 — Prune redundant settlement actions (#31)
- Removed `recruit` (dominated by `rest`), `forage` (camp version better), `rumours` (no mechanical effect) from all settlement types.
- Removed dead `settlementAction()` handlers for pruned actions.
- Settlement action counts: HBC 4, Métis 3, Trading 2, Mission 2, NWMP 3.
- Camp actions unchanged — all 7 have clear distinct tradeoffs.
- Files: `src/systems/engine.js`

### v51 — Dice outcome animation sync (#29 follow-up)
- Replaced hardcoded 500ms timeout with `animationend` event on die element. Outcome reveals exactly when `dice-settle` CSS animation (450ms) completes. Includes `revealed`-guard + fallback timeout.
- File: `src/main.js`

---

## Build & Serve

```bash
# Rebuild
cd /home/bayarddevries/metis-trail-v2-repo
bun scripts/build.mjs

# Serve (port 5173, not 8080 which is qBittorrent)
cd dist && python3 -m http.server 5173

# Verify
curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:5173/
```

**Note:** Build script bumps `?v=N` in both `dist/index.html` and `src/template.html`. After every build, verify `src/template.html` matches or the next build will double-increment.

---

## Open Issues (GitHub)

### Bugs
- **#32** — Balance pass on unforgiving events (medicine pouch) — p2
- **(local #32)** — Overlay sequence: pre-departure shows before intro (was local ISSUES.md #32, may overlap with original fix in bootstrap)

### Enhancements (prioritized)
- **#15** — Pre-departure cart packing (exists in code, blocked by overlay sequence)
- **#13** — Weather system
- **#12** — Highscore/leaderboard
- **#10** — Basic icons

### Resolved (2026-06-08)
- ** crafting inputs closed-system gap** — v62. Added 4 item-giving events so players can acquire Shaganappi, Bison Hide, Rope, Ammunition Belt mid-trail. Crafting is now a renewable system.
- **#33** — Crafting discoverability in settlement UI — v61. Hint line below desc when recipes available.
- **#26** — Add location/node markers on map — v55. Color-coded by settlement type, tooltips show names.
- **#35** — Reduce action-dense screens by grouping secondary actions — v54. Primary actions always visible; craft behind "More actions ▶" toggle.
- **#34** — Audit and consolidate action verbs — v53.
- **#31** — Prune redundant settlement/camp actions — v52.

### External (no code)
- **#25** — Cultural/peer review
- **#6** — AI writing trend review
- **(local #42)** — Playwright tooling blocker (can't browser-verify clicks)

---

## TODO.md Status

### Phase 1 — Foundation
- [x] All core items done
- [ ] Standardize conventional commit messages
- [ ] Add doc comments to exported `engine.js` functions

### Phase 2 — Core Systems
- [x] All event/system items done
- [ ] `mountDebugUI` behind `?debug=1`
- [ ] Unit tests for calendar and PRNG
- [ ] Save/load validation + schema version

### Phase 3/5 — Content & Mechanics
- [x] Items, crafting, trade, endings all done
- [ ] Add second half of Carlton Trail nodes
- [ ] Weather system
- [ ] Pre-departure cart packing (blocked by overlay sequence bug)

### Phase 4 — UI/UX Polish
- [x] Mobile bar, button hierarchy, camp grouping, settlement polish done
- [ ] Location/node markers on map (#26)
- [ ] Basic icons (#10)

### Phase 7 — Cart UX & Crafting
- [x] Cart weight, category tooltips, pre-departure overlay done
- [x] Crafting inputs replenishable via events (v62 — 4 item-giving events)
- [ ] Remove duplicate "Trade" action button in settlement UI

### Phase 8 — Win Rate Normalization
- [x] Balance baseline accepted
- [ ] Win rate 66.5% vs 25-40% target — weather/food tuning options remain
- [ ] Replace travel debug narrative with atmospheric fragments
- [ ] Cart unload buttons show item name

---

## Known Pitfalls (from AGENTS.md)

- **Map init timing:** Always call `initMap()` during `bootstrap()`, not deferred.
- **Port 8080:** qBittorrent uses it. Serve dev on 5173.
- **Browser verification:** Playwright click is broken on mobile; use JS click or real device.
- **Build version drift:** Template is source of truth; sync after every build.
- **Engine API:** Every method called from `main.js` MUST exist on engine's return object or the render function silently dies.
- **Item field name:** Items use `wt` for weight, not `weight`.
- **`pendingSettlement` blocks travel:** Both "Continue West" and "✕" must call `settlementAction('continue')`.
- **Stale cart reference:** Never cache `game.getCart()` during offload loops — `offloadItem()` mutates internally.
- **Template CSS vs dist CSS:** The build script reads from existing `dist/index.html` (not `src/template.html`) for the base. CSS changes in `src/template.html` must also be patched into `dist/index.html` directly.

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
│       └── sources/index.js # 35+ primary source entries
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
