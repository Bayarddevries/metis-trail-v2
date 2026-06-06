# Changelog

All notable changes are documented here. Format loosely follows Keep a Changelog.

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
