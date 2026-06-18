# V13 UI Overhaul — Handoff

**Date**: 2026-06-18
**Branch**: main
**Server**: `python3 -m http.server 8081` → `http://localhost:8081`
**Build**: `bun scripts/build.mjs`

---

## What's Done

### Session 1: Layout Shell + Bug Fixes ✅
- Status bar: single compact line with Day, Date, Season, Weather, Food (tappable), Wear, Morale, Crew (tappable), Trade
- Settings button (⚙) in status bar opens settings overlay with New Game
- Bottom bar: 2 contextual buttons (Travel West / Make Camp) replacing old 4-button layout
- Journal expanded to 30vh, collapsible to thin header
- Map filter: `grayscale(1) contrast(1.3) brightness(0.7) sepia(0.3)`
- Typography: IM Fell English regular, fallback stack
- Pre-departure: item list renders dynamically, confirm button works via JS click
- Settlement "Risk:" → "Receive:" labels
- "any_fur" → "Any Fur/Pelt" display
- Save schema version 2 migration
- Base `.ctrl-btn` CSS with gold background, dark text, uppercase

### Session 2: Narrative Wiring ✅
- All 14 narrative builders from `journalNarrative.js` wired into `journalLog` calls
- Travel: `buildTravelReflection` — first-person prose with weather/wear/reflection/food
- Events: `buildEventReflection` + `buildEventChoiceEntry` — weather-aware outcomes
- Auto-events: `buildEventAutoEntry` — weather-aware automatic event prose
- Camp: `buildCampReflection` — action-specific prose with diary depth
- Settlement arrival: `buildSettlementArrivalEntry` (first visit) vs `buildSettlementJourneyEntry` (return)
- Settlement actions: `buildSettlementActionEntry` + `buildSettlementReflection`
- Removed dead inline functions (~100 lines)

### Session 3: Mobile Responsive ✅
- Journal: 30vh desktop → 25vh tablet (<768px) → 20vh mobile (<420px)
- Stat-tap affordance: underline cue on desktop, always-visible border on mobile
- `100dvh` → `100svh` with `@supports` fallback
- Mobile Safari `innerHeight` JS fallback for <768px
- Stat labels always visible (8px on <420px)
- Camp continue button onclick handler wired
- Die animation null-guarded

### Session 4: Partial ✅
- Settlement action card text truncation (name/cost/risk)
- `prefers-reduced-motion` media query
- Fixed duplicate `.camp-card-btn:hover` rule
- Fixed journal CSS (settlement card styles were misplaced)

---

## What's Remaining

### Session 4: Polish + Edge Cases
- [ ] **4.3** Overlay stacking edge cases — test Food tap → overload guard double-overlay
- [ ] **4.4** Journal empty state — verify placeholder on Day 1
- [ ] **4.5** Leaderboard overlay — verify with new button layout
- [ ] **4.6** Full integration playtest desktop + mobile

### Session 5: Balance Pass + Content
- [ ] **5.1** Reduce starvation rate (36% → <25%) — needs 1000-sim
- [ ] **5.2** Fix event narrative-mechanics mismatches
- [ ] **5.3** Leave-behind UI for overloaded cart
- [ ] **5.4** Pre/post 1000-sim comparisons
- [ ] **5.5** Update HANDOFF, CHANGELOG, TODO

---

## Key Files

| File | Role |
|------|------|
| `src/template.html` | All HTML + CSS (~2066 lines) |
| `src/main.js` | All JS logic (~2093 lines) |
| `src/ui/journalNarrative.js` | Narrative templates (743 lines) |
| `src/ui/renderer.js` | renderStatusBar, journalLog, initMap, updateMap |
| `src/ui/theme.js` | applyTheme (CSS custom properties) |
| `src/systems/engine.js` | Game engine |
| `src/data/events.js` | Event definitions |
| `src/data/items.js` | Item definitions |
| `src/data/endings.js` | Ending definitions |
| `docs/V13_UI_OVERHAUL.md` | Master plan with checklist |

## Known Issues

1. **Pre-departure confirm button** — browser automation clicks don't trigger handler (z-index/overlay stacking). Real mouse clicks work. JS `.click()` works.
2. **Font loading** — `IM-Fell-Double-Pica.ttf` was corrupt (HTML file). Replaced with real TrueType from Google Fonts. `IM-Fell-English.ttf` is italic variant; `IM-Fell-English-Regular.ttf` added for normal style.
3. **Dead settlement action IDs** — `recruit_crew`, `pay_fines`, etc. still referenced in precondition checks but never fire (filtered by engine).

## How to Continue

1. Start server: `cd dist && python3 -m http.server 8081`
2. Open `http://localhost:8081`
3. Playtest — travel, camp, events, settlements all work
4. Check console for JS errors
5. Pick up Session 4.3 (overlay stacking) or Session 5 (balance)
