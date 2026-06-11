# HANDOFF — Metis Trail V2

**Version:** v138
**Last updated:** 2026-06-11 (morning)
**Current branch:** main (build deploys to gh-pages)

---

## 1. What Just Happened

Agent ran a legibility pass after Sprint 3+4. Two files changed:
- `src/ui/theme.js` — brightened all color values: `--clr-ink-on-dark`, `--clr-accent`, `--clr-success`, `--clr-danger`, `--clr-muted`, `--clr-source-text`, `--clr-choice-cost`, settlement colors, weather colors. Added missing `--clr-ink-light` (was undefined → black text on dark bg) and `--clr-ink-dark` (was undefined). Reduced overlay opacity from 0.96 to 0.92.
- `src/template.html` — status bar now uses `--clr-ink-on-dark` (was `--clr-ink-light` which was undefined), journal text uses `--clr-ink-on-light` (was `--clr-ink-dark` which was undefined), `.ctrl-btn` now has explicit gold bg + dark text + border (was relying on browser defaults → white bg clash), `.ctrl-btn.secondary` and `.ctrl-btn.ghost` classes added for bottom buttons, all hardcoded hex colors replaced with theme variables, `--clr-choice-cost` used for choice/camp costs instead of `--clr-muted`, `.settlement-action-sub` uses `--clr-ink-on-dark` instead of `--clr-btn-text` with opacity hack.
- Version synced: `src/template.html` bumped from `?v=136` to `?v=138` to match dist.

User tested and reports: "still lots to fix but its a bit better and working." Verified build serves at `http://100.108.183.33:8081/index.html`.

---

## 2. Open Issues (New This Session)

- **#74** `[ui]` Light-on-light text causing eye strain — contrast still insufficient (P0)
- **#75** `[ux]` Shop Buy and Remove buttons counterintuitive (P1)
- **#76** `[bug]` Rest unavailable at some settlements (P1)
- **#77** `[bug]` Player does not start with trade goods — no hides/pelts to deliver (P0)

---

## 3. Pre-Existing Open Issues to Keep in Mind

- **#73** Hall of Fame does not load
- **#72** End-game screen buttons different sizes
- **#71** Final score displayed with decimal points
- **#70** High score menu pops up and erases end-game details
- **#68** Weather system — data model, per-node generation, effect table
- **#67** Campfire background image — build pipeline + camp overlay
- **#58** Show DC on choice buttons and disable buttons for missing items
- **#55** Mobile breakpoints (768px + 420px + landscape) — touch targets 44px

---

## 4. Known Bugs & Pitfalls (Discovered This Session)

### Shop confirm broken (P0)
`window.__METIS_SHOP_PURCHASED` is never set by the shop renderer. When the player clicks "Confirm Outfit", the handler reads `window.__METIS_SHOP_PURCHASED` and `window.__METIS_SHOP_ITEMS`, both are `undefined`. Result: the button does nothing (confirm is not disabled, but the handler exits early because the object is undefined). The overlay stays open. Workaround for testing: close overlay manually, use `game.confirmPreDeparture()` + `__METIS_RENDER__()` from debug console.

**To fix:** Find where the shop item list is rendered (in main.js around line 1229+). Set `window.__METIS_SHOP_PURCHASED` and `window.__METIS_SHOP_ITEMS` during render so the confirm handler can read them.

### Starting trade goods missing (P0)
Player should start with 4× Bison Hide + 3× Beaver Pelt (per DESIGN.md §3). Currently starts with nothing. Likely related to shop confirm bug — trade goods may be added during confirm flow but it never executes.

**To fix:** Verify `game` initialization includes trade goods, or that `showShop()` / Bootstrap adds them before the shop opens.

### Rest missing at settlements (P1)
`availableSettlementActions()` does not return `'rest'` for all settlement types. Audit each settlement type: metis, nwmp, mission, trading, hbc. Every non-HBC settlement should offer Rest.

### Light-on-light text (P0)
Even after the legibility pass, several combinations remain too close in value:
- Parchment panel (`#f5e6c8`) with muted text (`#9a8a6a`) — contrast ratio ≈ 1.8:1
- Source/hint text (`--clr-source-text: #a09070`) on cream panels
- Camp overlay text over the campfire gradient (gradient may wash out text)

**To fix:** Use darker values for ALL text on light backgrounds (target 4.5:1 minimum). Source text should be at least `#6b5740` on cream. Hints/briefing should be `#5a4a35`.

---

## 5. How to Test

```bash
cd /home/bayarddevries/metis-trail-v2-repo
bun scripts/build.mjs
python3 -m http.server 8081 --directory dist
# Open http://100.108.183.33:8081/index.html
```

**Debug shortcuts** (add `?debug=1` to URL):
- `window.__METIS_DEBUG__.travel()` — travel one day
- `window.__METIS_DEBUG__.camp()` — make camp
- `window.__METIS_DEBUG__.reroll('seed')` — restart with seed
- Read state: `window.__METIS_DEBUG__.state`, `.__METIS_DEBUG__.cart`

**Note:** The intro + shop overlay blocks direct playtesting. With the shop bug, you need to either fix it or use the console to bypass it:
```js
document.getElementById('predeparture-overlay')?.classList.remove('active');
window._metisGame.confirmPreDeparture();
window.__METIS_RENDER__();
```

---

## 6. What to Prioritize Next

1. **Fix shop confirm + starting trade goods** — these are P0 blockers for the core loop
2. **Contrast audit pass #2** — the light-on-light problem needs darker text, not lighter backgrounds
3. **Rest at settlements** — audit `availableSettlementActions()` for every settlement type
4. **Shop UX redesign** — Buy/Remove clarity, show trade goods in list

---

## 7. Repo Reference

- Repo path: `/home/bayarddevries/metis-trail-v2-repo`
- Test server: `http://100.108.183.33:8081/index.html`
- DESIGN.md: source of truth for mechanics and starting loadout
- AGENTS.md: commit conventions, known pitfalls, first actions
