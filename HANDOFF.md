# HANDOFF — Metis Trail V2

**Version:** v10
**Last updated:** 2026-06-11 (night)
**Current branch:** main (build deploys to gh-pages)
**Live URL:** https://bayarddevries.github.io/metis-trail-v2/

---

## 🚀 Next Agent — Start Here

**All code changes are committed and pushed until noted otherwise**

### Immediate priorities (in order):

1. **Fix regression bugs:** #91 camp overlay scroll, #95 store competing scroll regions, #94 store contrast, #93 settlement outcome contrast, #92 end-screen score contrast/zeros
2. **Docs:** HANDOFF/CHANGELOG kept current; HANDOFF updated after each bug fix
3. **Then pick from open issues:**
   - #42 Reformat secondary sources to period voices
   - #40 Party name instead of user name
   - #25 Full cultural review of project and story elements
   - #6 Review content for AI writing trends

### Build & test commands:
```bash
cd /home/bayarddevries/metis-trail-v2-repo
npm test            # vitest
npm run build       # esbuild into dist/
python3 -m http.server 8081 --directory dist  # local test server
# Open http://100.108.183.33:5173 or http://localhost:8081
```

### Critical pitfalls to avoid:
- **Never use `write_file` on `src/template.html`** — use `patch` for targeted edits only
- **Always run build + verify in browser before pushing** — CI deploys from `dist/`
- **Engine API: add method to engine.js before calling from main.js** — missing method silently kills render functions
- **`performedAction` flag must reset** when leaving settlement or all buttons stay disabled on next visit
- **Settlement undefined variable references** — any new sub-button handler must have all variables in scope. An undefined reference silently kills the entire click handler (lesson from #73 root cause)

---

## 1. What Just Happened
- **#79 Settlement actions broken:** Rewrote `showSettlement()`. Root cause: `beforeJournal` undefined variable in trade sub-button handler caused silent JS error. Settlement action cards now match camp card style (icon/name/cost/risk/flavor in grid). Added `settlement-roll-display` and `settlement-result` overlay areas for dice animation + flavor text + Continue West.
- **#70 End screen all zeros:** `getEndgameScore()` returned empty `{}` for losses → NaN. Fixed with `safeNum()` helper (`Number.isFinite()`), optional chaining, `Math.round()` on all score lines.
- **#80 Blessing roll buff:** `blessingDays` counter in state, decremented in `travelOneDay()`, +1 to all dice rolls via `totalMod` when >0. ✝ indicator in status bar.
- **#81 One action per visit:** `performedAction` flag disables all buttons after first click in both camp and settlement.

### Phase B — UI/UX Polish
- **#83 Scrolling consolidation:** 100dvh, sticky status bar/bottom panel, removed inner shop scroll, overflow:hidden on html/body.
- **#75 Shop clarity:** Trade goods section with ₥ value, green Buy / red Remove buttons, swapped order.
- **#81 Camp Push On auto-close:** After Push On, camp overlay closes automatically (no redundant Continue West). Journal logged immediately.
- **Roll label/total visibility:** Changed from `--clr-ink-on-dark` to `--clr-ink-on-light` for readable contrast on gold pill background.

### Phase C — Journal & Content Polish
- **#89 Journal day grouping:** Entries grouped under collapsible day headers ("Day N — Month Day" with ▼/▶ toggle). Type labels on sub-entries.
- **#88/#90 Settlement gossip flavor text:** 5 unique settlement-type voices (hbc, metis, mission, nwmp, trading) with intel text from `trailIntel` passed through `getState()`.
- **#79 Settlement result in-place:** Result card replaces action cards with flavor text + effects + Continue West (no modal).
- **#86 Sim test updated:** Action objects with `.id`, one-action-per-visit enforced, weights for 15+ new settlement actions.
- **Mobile status bar:** Tightened 768/420/360px breakpoints, hides segment-progress at 360px.

---

## 2. Sprint Status

| Sprint | Scope | Status |
|--------|-------|--------|
| 1 | Fix & Stabilize | ✅ Complete |
| 2 | Core Redesign | ✅ Complete |
| 3 | Settlements & Economy | ✅ Complete |
| 4 | Visual Unification | ✅ Complete |
| 5 | Consolidation & Overhaul | ✅ Complete |
| 6/7 | Gameplay Polish (Phases A+B+C) | ✅ Complete |
| 8 | Content Expansion & Polish | ⬜ Not started |

---

## 3. Open Issues (Remaining)

| # | Title | Labels |
|---|-------|--------|
| #73 | Hall of Fame does not load | bug |
| #63 | Audit Response Sprint Plan — P0/P1/P2/P3 issues from design audit | documentation |
| #62 | P3 — Add recommended action highlight in settlement UI | enhancement |
| #60 | P2 — Create Web Audio ambient engine | enhancement |
| #59 | P1 — Create haptics module (partially done — module exists, wiring incomplete) | enhancement |
| #42 | Reformat secondary sources from Wikipedia-style to period voices | enhancement |
| #40 | Party name instead of user name | enhancement |
| #25 | Full cultural review of the project and story elements | |
| #6 | Review content for AI writing trends | |

---

## 4. Known Issues & Pitfalls

- **Sim test:** Some tests use old settlement action patterns. Weights updated but full coverage not verified. 62/63 pass (1 pre-existing repair availability failure).
- **Settlement action `beforeJournal` pitfall:** If adding new settlement action sub-buttons, ensure all variables are defined in scope. An undefined reference silently kills the entire click handler — no overlay appears, no error shown.
- **Score display:** `safeNum()` is defensive but doesn't fix root cause if `getEndgameScore()` returns unexpected structure. Always verify engine returns full breakdown for both win and loss.
- **Engine API methods must exist before UI calls them:** A missing method causes a JS error that silently kills the entire render function. See AGENTS.md.
- **`performedAction` flag:** Must be reset when leaving settlement (`settlementAction('continue')`). If flag persists, next settlement visit will have all buttons disabled.

---

## 5. File Map

| File | Role |
|------|------|
| `src/main.js` | Bootstrap, UI handlers, showSettlement/camp/event/shop/end overlays |
| `src/systems/engine.js` | Core game state, travel, settlement actions, scoring, blessings |
| `src/ui/renderer.js` | Status bar, journal (day-grouped), map rendering |
| `src/template.html` | HTML structure + CSS (100dvh, sticky bars, mobile breakpoints) |
| `src/ui/theme.js` | CSS custom properties for all color tokens |
| `tests/simulate-entry.js` | Headless playtesting harness (50-run sims) |
| `docs/audit-metis-trail-v2.html` | Design audit report with v10 addendum |

---

## 6. How to Test

```bash
cd /home/bayard_devries/projects/metis-trail-v2
bun scripts/build.mjs
python3 -m http.server 8080 --directory dist
# Open http://localhost:8080
```

**Test checklist (verify in browser):**
1. Start game → pre-departure → confirm loadout
2. Travel to first settlement (St. Boniface) → click a settlement action → verify dice roll display → result card with flavor text → Continue West
3. Travel → Make Camp → click an action → verify dice → result → Continue West
4. In camp: click Push On → verify overlay auto-closes (no Continue West button)
5. Check journal panel: entries grouped under day headers, collapsible
6. Play to end → verify score breakdown shows real numbers (not all 0s)
7. Check roll label/total text is readable (dark text on gold pill)

**Debug shortcuts** (add `?debug=1` to URL):
- `window.__METIS_DEBUG__.travel()` — travel one day
- `window.__METIS_DEBUG__.camp()` — make camp
- `window.__METIS_DEBUG__.reroll('seed')` — restart with seed

---

## 7. What to Prioritize Next

**Bug fix first:**
- #73 Hall of Fame does not load — only remaining bug

**From audit (remaining P2/P3):**
- #60 Web Audio ambient engine
- #62 Settlement "recommended action" highlight
- #42 Secondary source reformat to period voices

**Content expansion:**
- Settlement-specific events from primary sources
- Seasonal event variation
- Gossip → Event connections (medium-term)
