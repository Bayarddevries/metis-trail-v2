# Dice, Events & Source-Rich Location Plan

## 1) Dice Roll Visual Treatment
**Goal:** rolls feel like ledger entries, not HUD widgets.

- **Spot:** inside the event overlay, directly under the classification stamp / brass-rule line, before the choice buttons.
- **Treatment:**
  - Single pill/box with 2px ink border
  - Left: d20 glyph (large, Playfair Display)
  - Centre: target DC in smaller caps
  - Right: pass/fail word in either success green or fail rust
  - Use CSS custom properties for colours so we can shift the palette later
  - No animation beyond a short hard fade-in; no bobbing dice
- **Data hook:** `renderer.js` already exposes `#event-roll-display`. We just need to style it and ensure it toggles `display:none/block` from `src/main.js` based on `res.roll !== null && res.dc !== null`.

## 2) Missing Events (gaps)
Current pools: plains (11), river_valley (7), wooded (3), uplands (2), river (3)

**Priority gaps:**
- Mosquitoes / biting flies: referenced in style-options but not wired into `river_valley` / `wooded`. Add 1–2 variants.
- Cart breakdown / axle break: referenced in branches but not as standalone events.
- Weather: heavy rain, hail, sudden frost.
- Wildlife: bear at camp, badger near food stores, rattlesnake on the trail (southern stretches).
- Indigenous / Métis encounter depth: add gentle, shippable cross-cultural events beyond the current 1–2 variants.
- Supply / theft: food bag torn by wolf, small theft at a bustling camp.

**Target:** 8–12 new events across `plains`, `river_valley`, `wooded`, `uplands`.

## 3) Source Enrichment (locations + events)
Right now only some events carry `source.{quote,author,work}`.

**Rules:**
- Every event must have a one-line pull-quote + attribution when possible.
- Every `NODES` entry should get a historical note (1–2 sentences) in its `desc` field, sourced from primary journals/letters where available.
- If we can’t find a primary source, mark the field `unsourced` and queue for research rather than inventing.

**Priority sources:**
- Schultz, *The Old Crow Wing Trail* (MHS Transactions)
- Fonseca, *On the St. Paul Trail in the Sixties*
- Brehaut, *The Red River Cart and Trails*
- Barkwell / Dumont family accounts
- Father Lacombe missionary journals

## 4) Ordered Next Steps
1. Wire up the dice pill CSS and `showEvent` toggle
2. Add 10 new events (mosquitoes, weather, wildlife, breakdowns, trade)
3. Backfill `desc` notes on `NODES` with sourced snippets
4. Rebuild and visually sanity-check on live site
