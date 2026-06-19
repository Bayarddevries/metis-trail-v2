# Issues

Use this file to log bugs, blockers, and known gaps during work sessions. Each item should be short, searchable, and include a short reproduction or evidence note.

**Note:** GitHub issues are the source of truth. This file is for local-only items and session notes.

---

## Active (Local Only)

### #43. Settlement overlay doesn't re-render after action
- Opened: 2026-06-17
- Labels: bug, ui
- Summary: Clicking a settlement action button doesn't trigger `window.__METIS_RENDER__()` so UI doesn't update to reflect state changes (food, cart, pendingSettlement cleared). Need to add render call in settlement action handler.

### #44. Template hardcoded `FOOD 30` initial value
- Opened: 2026-06-17
- Labels: cosmetic, ui
- Summary: `src/template.html` line 1838 has hardcoded `30` for food stat. Shows 30 briefly on load before first render updates it to actual value (18).

### #73. Hall of Fame does not load
- Opened: 2026-06-11
- Labels: bug, needs-investigation
- Summary: Opening Hall of Fame results in a blank/failed view. Likely Firebase-dependent path not resolving in current hosted/local environment; needs verification on live Pages build.

### #74. St. Boniface Mission — Duplicate "Heal Crew" settlement actions
- Opened: 2026-06-17
- Labels: bug, settlement
- Summary: Mission settlement shows two "Heal Crew" action cards with identical cost/receive text (1 Medicine Pouch OR 2 Pemmican Rations → rested + 10 Morale). Should collapse to single action with choice modal, or differentiate the options meaningfully.

### #75. Settlement result card flavor text duplicates action card flavor
- Opened: 2026-06-17
- Labels: bug, ui, content
- Summary: After choosing a settlement action, the result card shows the exact same flavor text as the action card. Result should show *outcome* narrative (what happened), not repeat the *offer* narrative.

### #76. St. Norbert Trade Gossip — Duplicate "Continue West" buttons + extra ✕ button
- Opened: 2026-06-17
- Labels: bug, ui, settlement
- Summary: At Métis settlement (St. Norbert), Trade Gossip action shows: (1) "Continue West" as ctrl-btn primary, (2) "Continue West" as settlement-action-card-btn, (3) extra ✕ button as ctrl-btn ghost. Should have single "Continue West" only; ✕ is redundant with main screen New Game.

### #77. "New Game" button visible during active gameplay
- Opened: 2026-06-17
- Labels: bug, ui
- Summary: The "New Game" button in the main controls (bottom panel) is visible during active play. Should only show on end screen or intro, not during travel/camp/settlement.

### #78. Missing Camp button at settlements
- Opened: 2026-06-17
- Labels: bug, ui
- Summary: When at a settlement, bottom controls show Travel, Cart, Crew but NO Camp button. Players need to make camp from settlement without traveling first.

### #79. End screen trade goods discrepancy — "Empty-handed" but has items
- Opened: 2026-06-17
- Labels: bug, scoring
- Summary: Player reached Edmonton with 6 trade goods + ~$600 value, but ending shows "Empty-handed at Edmonton" narrative. `getEndgameScore()` or ending selection logic not detecting trade goods correctly. Need to verify `tradeGoodsCount` calculation and `no_trade` vs `victory` ending selection.

---

## Active (Local Only)

### 43. Playwright click resolution blocked
- Opened: 2026-06-08
- Labels: tooling, qa, blocked
- Summary: Playwright navigation works, but click targeting via button text/ref/@id forms does not resolve. Blocks browser verification of UI changes.
- Workaround: Verify via source inspection and local server checks instead of automated clicks.

### 44. Settlement overlay doesn't re-render after action
- Opened: 2026-06-17
- Labels: bug, ui, settlement
- Summary: Clicking a settlement action button executes the action but doesn't call `window.__METIS_RENDER__()`, so UI stays on action cards instead of showing result + Continue West.
- Fix: Add `window.__METIS_RENDER__()` in settlementAction handler after action executes.

### 45. Template hardcoded FOOD 30
- Opened: 2026-06-17
- Labels: cosmetic, ui
- Summary: `src/template.html` has `<span id="s-food">30</span>` hardcoded. Render updates it post-pre-departure but initial load shows wrong value.
- Fix: Change template to `0` or empty; render sets correct value.

### 46. St. Boniface: Duplicate "Heal Crew" actions
- Opened: 2026-06-17
- Labels: bug, settlement
- Summary: Mission settlement shows two identical "Heal Crew" buttons (one for Medicine Pouch, one for 2 Pemmican). Should be one action with two giveOptions.
- Fix: UI dedupe in `showSettlement()` — group by actionId base, show single button with sub-options modal or combined label.

### 47. Settlement result duplicates action flavor text
- Opened: 2026-06-17
- Labels: bug, ui, settlement
- Summary: After action execution, result card shows the exact same flavor text as the action card. Redundant.
- Fix: Result card shows mechanical effects only (food/wear/morale/item changes) + short narrative, not duplicate flavor.

### 48. St. Norbert: Duplicate Continue West + extra ✕
- Opened: 2026-06-17
- Labels: bug, ui, settlement
- Summary: Settlement overlay shows two "Continue West" buttons (one primary, one ghost) plus an ✕ button. Confusing.
- Fix: One primary "Continue West" button only. Remove ghost/✕ buttons from settlement overlay.

### 49. "New Game" button visible during gameplay
- Opened: 2026-06-17
- Labels: bug, ui
- Summary: "New Game" button in header persists during active gameplay. Should only show on pre-departure/end screens.
- Fix: Hide when `!state.preDeparture && !state.over` in render.

### 50. Missing Camp button at settlements
- Opened: 2026-06-17
- Labels: bug, ui, settlement
- Summary: Settlement overlay has Continue West and ✕ but no Camp button. Player should be able to camp at settlements.
- Fix: Add Camp button to settlement overlay (calls `makeCamp()`).

### 51. End screen: "Empty-handed" despite trade goods
- Opened: 2026-06-17
- Labels: bug, scoring
- Summary: Reached Edmonton with 6 trade goods + $600 but end screen shows "Empty-handed at Edmonton" narrative and base score lists trade goods.
- Fix: Check `getEndgameScore().tradeGoodsCount` calculation — likely not counting furs/hides correctly.

---

## Resolved

### 42. Playwright click resolution blocked (original)
- Status: Open (see Active above)
- Summary: Playwright cannot resolve button text/ref/@id click selectors. Workaround: manual source inspection + local server checks.

### 41. Remove dead code / convention cleanup
- Status: Done (v81)

### 40. Trace invisible render failures after engine changes
- Status: Done (v80)

### 39. More actions toggle empty states
- Status: Done (v67)

### 38. Camp events need dice rolls and more flavor text
- Status: Done (v67)

### 37. Gabriel Dumont cannot be at all ferry crossings
- Status: Done (v50)

### 36. Day 1 first travel resolves to settlement overlay
- Status: Done (v50)

### 35. Reduce action-dense screens by grouping secondary actions
- Status: Done (v54)

### 34. Audit and consolidate primary/secondary action verbs
- Status: Done (v53)

### 33. Crafting discoverability in settlement UI
- Status: Done (v56)

### 32. Overlay sequence broken — pre-departure shows before intro
- Status: Done (v44)

### 31. Prune redundant settlement/camp actions
- Status: Done (v52)

### 30. Food showing in decimal places
- Status: Done (v50)

### 29. Dice timing: pass/fail pill shown before settle
- Status: Done (v50/v51)

### 27. Duplicate texture/dep files
- Status: Done (v69)

### 26. Add location/node markers on map
- Status: Done (v55)

### 25. Cultural/peer review (women/children presence)
- Status: Done (v70)

### 12. Highscore/leaderboard
- Status: Done (v69)

### 13. Weather system
- Status: Done (v65)

---

## External (docs completed 2026-06-09, implementation in progress)

### #25 — Cultural/peer review
- Status: Review doc complete, implementation in progress
- Deliverable: [docs/cultural-review.md](docs/cultural-review.md)
- Implemented in v70: Women/children presence (4 new events, 4 new sources, camp action, settlement descriptions, Batoche foreshadowing, dog reference)
- Remaining: Secondary source reformatting → tracked as GitHub #42

### #6 — AI writing trend review
- Status: Review doc complete, implementation done
- Deliverable: [docs/writing-review.md](docs/writing-review.md)
- Implemented in v70: All 16 rewrite recommendations applied (12 events, 4 endings, travel fragments, camp flavor, intro text, source context UI)

---

## Tracked on GitHub (open)

### #42 — Reformat secondary sources to period voices
- Labels: enhancement
- MMF_COMMUNITIES, CARLTON_TRAIL, NWMP_HISTORY read as Wikipedia; replace with period excerpts or reformat as historical notes

### #43 — Add second half of Carlton Trail nodes
- Labels: enhancement
- Western portion of trail not yet implemented

### #44 — Pre-departure cart packing overlay
- Labels: enhancement
- Player configures starting cart before journey; blocked by overlay sequence bug
- Note: API exists; UI exists; overlay sequence fixed in v44.

### #45 — Unit tests for calendar and PRNG
- Labels: enhancement
- Test date advancement, season changes, PRNG reproducibility

### #46 — Save/load validation and schema version
- Labels: bug
- Add schema version to saves, validate on load, reject/migrate corrupted saves

### #47 — mountDebugUI behind ?debug=1
- Labels: enhancement
- Debug panel should only mount with URL flag

### #48 — Standardize conventional commit messages
- Labels: documentation
- Establish commit message conventions in AGENTS.md

### #49 — Add doc comments to exported engine.js functions
- Labels: documentation
- JSDoc/JS comments on all public engine methods for reliability

### #71 — End-game scores show decimal points
- Labels: bug
- Final score and some end-game scores display with decimal points instead of whole numbers

### #72 — End-game buttons are different sizes
- Labels: bug
- "Play Again" and "View Hall of Fame" buttons on the end-game screen are visually mismatched in size

### #73 — Hall of Fame does not load
- Labels: bug, needs-investigation
- Opening Hall of Fame results in a blank/failed view
- Likely cause: Firebase-dependent path not resolving in the current hosted/local environment; needs verification on the live Pages build

---

## Phase 0.11 Balance Tuning — Local Notes

### Verified in browser (2026-06-17)
- Build passes
- Server runs on :8081
- Pre-departure → game loads with 18 food, starter kit, spare item ✅
- Travel: DAILY_FOOD 0.6 consumed per day ✅
- Arrive at St. Boniface → settlement event → settlement overlay ✅
- Mission actions: heal_crew (Medicine/2 food), rest_blessing (free + blessing), trade_furs_food (1 fur → 4 food) ✅
- Trade executes: food +4, fur removed, tradesMade++, pendingSettlement cleared ✅
- UI minor: overlay doesn't re-render after action, template shows 30 food initially

### Simulation results (1000 runs)
- Win rate: 70.2% (702/1000)
- Triumphant (≥1100): 24%
- Prosperous (1200-1399): 16.4%
- Legendary (1400+): 3.5%
- Humble (<1100): 45%
- Deaths: starvation 29%, timeout 1.7%, cart_failure 0.5%
