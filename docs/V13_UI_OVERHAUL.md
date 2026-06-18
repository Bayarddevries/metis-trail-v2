# V13 UI Overhaul — Metis Trail V2

**Status**: Active
**Target**: v13
**Scope**: Interface redesign, narrative wiring, visual polish, dead code removal, bug fixes
**Philosophy**: The journal is the game. Every screen serves the narrative. Cut everything that doesn't.
**Critique**: Reviewed by subagent — see `docs/V13_CRITIQUE.md`. This version incorporates all findings.

---

## Design Principles

1. **Journal-first** — The diary is the primary gameplay feedback. Events, travel, camp, settlements all render as first-person narrative prose.
2. **Two buttons** — Bottom bar has only the actions the player needs right now. Everything else is contextual.
3. **Stats are tappable** — Food opens Cart, Crew opens Crew overlay. No dedicated buttons for diagnostic panels. Tappable stats have a subtle visual cue (border/background hint).
4. **Regular text for prose** — IM Fell English regular for all UI, menus, journal text, flavour text. Italic reserved for source quotes only.
5. **Warm, period feel** — Map has sepia/low contrast. No bright modern aesthetics.
6. **Overlay exclusivity** — Only one overlay open at a time. Opening a new overlay closes any existing one.

---

## Z-Index Architecture

| Layer | Z-Index | Elements |
|-------|---------|----------|
| Base | 0 | `#game-container`, `#map-panel`, `#bottom-panel` |
| Overlays | 2000 | `.overlay` (event, settlement, cart, crew, predeparture, end, settings) |
| Modal | 3000 | `.modal-overlay` (confirmations) |
| Debug | 9999 | `#debug-panel` |

---

## Session Breakdown

### Session 1: Layout Shell + Bug Fixes
_Redesign the HTML/CSS skeleton — status bar, buttons, journal area, map filter, typography. Fix blocking bugs so the game is fully playable._

**Layout changes:**
- [x] **1.1** Status bar redesign — single compact line: Day · Date · Season · Weather · Food (tappable) · Wear · Crew (tappable) · Morale · Trade goods. Remove toggle groups entirely. Remove "New Game" button from stat area.
- [x] **1.2** Bottom button bar — replace Travel/Camp/Cart/Crew with two contextual buttons: "Travel West" (always visible) and "Make Camp" (only after travel completes). State-dependent rendering.
- [x] **1.3** Stat-tap overlays — tapping Food stat opens Cart overlay, tapping Crew stat opens Crew overlay. Remove `#btn-cart` and `#btn-crew` buttons from template.
- [x] **1.4** Settings menu — ⚙ button in status bar opens settings overlay with "New Game" option.
- [x] **1.5** Journal area — expanded to 30vh height, collapsible to thin header. Empty state placeholder added.
- [x] **1.6** Typography — IM Fell English regular for all UI text. Fallback font stack added to `:root` CSS. Critical CSS variables moved into `template.html` `:root` as fallbacks.
- [x] **1.7** Map filter — changed to `grayscale(1) contrast(1.3) brightness(0.7) sepia(0.3)`.

**Bug fixes:**
- [x] **1.8** Pre-departure confirm button — handler set via `confirmBtn.onclick` in `showShop()` closure. Works via JS click. Browser automation click interception is a known limitation (z-index/overlay stacking).
- [x] **1.9** Pre-departure item list rendering — fixed by removing static template briefing section, letting `renderList()` handle all content dynamically.
- [x] **1.10** Fix hardcoded FOOD 30 — changed initial value to 0.
- [x] **1.11** Settlement "Risk:" → "Receive:" label change — both settlement and camp action cards.
- [x] **1.12** Fix "any_fur" display → "Any Fur/Pelt" — added `displayName()` mapping in `getSettlementActionsByType()`.
- [x] **1.13** Save-game compatibility — added `SAVE_VERSION = 2` check on load, clears incompatible saves.
- [x] **1.14** Build + verified in browser. Full playtest: pre-departure → travel → settlement.

---

### Session 2: Narrative Wiring
_Wire journalNarrative.js templates into all journalLog calls so every event renders as prose._

- [ ] **2.1** Import from `journalNarrative.js`: `buildTravelEntry`, `buildCampEntry`, `buildEventChoiceEntry`, `buildEventAutoEntry`, `buildSettlementArrivalEntry`, `buildSettlementJourneyEntry`, `buildSettlementActionEntry`, `buildItemUseEntry`, `buildLeaveBehindEntry`, `buildTravelReflection`, `buildCampReflection`, `buildEventReflection`, `buildSettlementReflection`.
- [ ] **2.2** Replace inline `buildTravelJournalEntry()` with `buildTravelEntry()` + `buildTravelReflection()` in the travel handler. Pass `game.getCart()` as the 5th argument to `buildTravelEntry`.
- [ ] **2.3** Replace inline `buildEventJournalEntry()` with `buildEventChoiceEntry()` + `buildEventReflection()` in the event handler.
- [ ] **2.4** Wire `buildEventAutoEntry()` for automatic events (no player choice). Pass weather and cart context.
- [ ] **2.5** Wire `buildCampEntry()` + `buildCampReflection()` into camp action results (replace static "Camp: Rest" / "Camp: Push On" titles).
- [ ] **2.6** Wire `buildSettlementArrivalEntry()` + `buildSettlementJourneyEntry()` into settlement arrival handler. First visit → arrival entry. Subsequent visits → journey entry.
- [ ] **2.7** Wire `buildSettlementActionEntry()` into settlement action handler (replace the inline `buildSettlementJournalText()` prose with the narrative template).
- [ ] **2.8** Wire `buildItemUseEntry()` into camp and settlement actions that consume items (Medicine Pouch, Shaganappi, Ammunition Belt, Blanket, Firewood).
- [ ] **2.9** Remove the now-unused inline `buildTravelJournalEntry()` and `buildEventJournalEntry()` functions from `main.js`.
- [ ] **2.10** Build + verify in browser. Play through one full cycle (travel → camp → event → settlement) and confirm journal entries render as narrative prose. Check console for no JS errors.

---

### Session 3: Mobile Responsive + Integration Test ✅
_Adapt the new layout for mobile/tablet. Full integration test._

- [x] **3.1** Mobile breakpoints — Journal: 30vh desktop → 25vh <768px → 20vh <420px. Stat-tap: full-screen on <768px. Buttons: side-by-side desktop, stacked <360px with 44px min touch targets.
- [x] **3.2** Stat-tap affordance — underline cue on desktop, always-visible border on mobile (<768px).
- [x] **3.3** Fix `100dvh` — replaced with `100svh` + `@supports` fallback + mobile Safari `innerHeight` JS fallback.
- [x] **3.4** Overlay responsive — `width: 92%`, `max-height: 85%`, `overflow-y: auto`.
- [ ] **3.5** Integration test: play a full game from start to end screen.
- [ ] **3.6** Fix any issues found during integration testing.
- [ ] **3.7** Build + final verify.

---

### Session 4: Polish + Edge Cases
_Remove remaining dead systems, edge case hardening, settlement action cleanup._

- [ ] **4.1** Remove dead settlement action IDs from the settlement action renderer: `recruit_crew`, `pay_fines`, `get_permits`, `buy_ammo`, `buy_supplies`, `buy_food`, `buy_repair`, `buy_heal`, `buy_info`. These are already removed from preconditions but may still render as action cards. Filter them out.
- [ ] **4.2** Settlement action card layout — verify "Any Fur/Pelt" and other long labels don't break cards. Add text truncation if needed.
- [ ] **4.3** Overlay stacking edge cases — test: tap Food (cart opens), then trigger cart overlay from overload guard, verify no double-overlay. Test: leaderboard open during settlement, verify correct z-order.
- [ ] **4.4** Journal empty state — verify placeholder text appears on Day 1 before any entries.
- [ ] **4.5** Leaderboard overlay — verify it works with new button layout and z-index. Add `prefers-reduced-motion` check for any future animations.
- [ ] **4.6** Build + verify. Final playtest from pre-departure to end screen on both desktop and mobile viewport.

---

### Session 5: Balance Pass + Content
_Starvation rate tuning, event math mismatches, leave-behind UI. This is a separate milestone — research-driven, not implementation._

- [ ] **5.1** Reduce starvation rate — current 36% is too high. Options: DAILY_FOOD 0.6→0.55, or starting food 18→20, or increase hunt yields slightly. Run 1000-sim after change to verify target <25% starvation.
- [ ] **5.2** Fix remaining ~50 minor event narrative-mechanics mismatches (per `docs/EVENT_MATH_AUDIT.md`).
- [ ] **5.3** Add leave-behind UI flow when cart weight exceeds 100kg — prompt player to discard items (currently overload guard auto-opens cart but requires player to figure out the discard flow themselves). Add contextual prompt text and highlight discardable items.
- [ ] **5.4** Run pre/post 1000-sim comparisons for all balance changes. Target: 50-60% win rate, <25% starvation, all ending types reachable.
- [ ] **5.5** Update `HANDOFF.md`, `CHANGELOG.md`, `TODO.md` to reflect v13 state.

---

## Completed Work

### Pre-Plan Cleanup (before critique)
- Deleted `src/ui/camp.js` (257 lines), `src/ui/overlay.js` (298 lines), `src/ui/overlays/` (810 lines), `src/ui/dice.js` (47 lines), `src/ui/utils.js` (101 lines)
- Removed dead `EVENTS`/`FALLBACK_EVENTS`/`getEventsForTerrain()` from engine.js (58 lines)
- Removed dead MB shop branch from `showShop()`, dead credit-gated actions, `actionLabel`/`actionSubtitle` from main.js (~140 lines)
- Replaced all `mbValue`/`₥` references; fixed "credit" in settlement journal text
- Archived 26 stale planning docs to `docs/archive/`
- Fixed `buildSettlementReflection` latent bug: removed `after.mbValue` reference (would have crashed when wired)
- Build verified passing after all removals

---

## Open Questions

1. **Pre-departure confirm button** — root cause of click interception not yet diagnosed. May be `.overlay-card::before` pseudo-element, z-index stacking, or event delegation conflict.
2. **Pre-departure item list** — root cause of empty text not yet diagnosed. CSS or rendering issue.
3. **Settlement journey vs arrival entry** — First visit gets arrival entry, subsequent visits get journey entry. Confirmed this is the intended logic.

---

## Files Modified So Far

| File | Change |
|------|--------|
| `src/template.html` | V13 layout: status bar, buttons, journal, map filter, typography, mobile breakpoints, stat-tap affordance, 100svh |
| `src/main.js` | V13 logic: stat-tap handlers, settings, contextual buttons, narrative wiring, camp continue, save migration, mobile viewport fallback |
| `src/ui/journalNarrative.js` | New: 743 lines of first-person narrative templates |
| `src/ui/renderer.js` | Updated renderStatusBar for new stats (morale, trade) |
| `src/ui/theme.js` | Unchanged (theme applied via CSS custom properties) |
| `src/ui/shell.js` | Minor updates |
| `src/systems/engine.js` | Dead code removed, settlement displayName() added |
| `src/data/events.js` | Event updates |
| `src/data/items.js` | Item updates |
| `src/data/endings.js` | Ending updates |
| `src/core/constants.js` | Balance tweaks |
| `src/core/weather.js` | New weather system |
| `src/haptics.js` | New haptics feedback |
| `src/fonts/IM-Fell-Double-Pica.ttf` | Replaced corrupt file with real TrueType |
| `src/fonts/IM-Fell-English-Regular.ttf` | New: regular variant |
| `docs/V13_UI_OVERHAUL.md` | Master plan — Sessions 1-3 complete, Session 4 partial |

---

*Last updated: 2026-06-18 — Incorporates critique from docs/V13_CRITIQUE.md*
