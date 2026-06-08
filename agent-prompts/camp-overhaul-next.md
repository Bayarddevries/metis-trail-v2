# Scoped Implementation Prompt — Camp Overhaul (engineControl.wasm)

## Context
This prompt continues the trade/craft/economy redesign. Prior docs: `docs/phase0-camp-overlay-plan.md`, `docs/camp-overhaul-design.md`, `docs/economy-redesign-plan.md`.

## Current state
- `src/systems/engine.js` now has `campAction()` with 7 activities: rest, forage, hunt, repair, scout, dance, deeprest.
- `src/template.html` has camp overlay CSS and HTML.
- `src/main.js` wires Camp button to `showCamp()` with action buttons and result readout.
- Build passes: `bun scripts/build.mjs` exits 0.

## Tasks

### 1. Fix disconnect between camp UI and engine
**Root issue:** `showCamp()` reads `state.cart?.some(...)` to enable/disable Hunt/Repair buttons. Engine `getState()` does **not** currently expose the cart. That means `state.cart` is undefined and both Hunt and Repair are always shown as enabled regardless of inventory.

**Fix options (pick one):**
- A: Add `cart` field to `engine.js` `getState()` so UI can inspect it directly.
- B: Add dedicated engine methods `hasItem(name, minCount)` and call those from UI.
- C: Always show all actions, and let `campAction()` return the error string on invalid action. UI shows error in result div.

**Preferred:** C — simplest, keeps engine API minimal. Just remove the `disabled` checks from Hunt/Repair and let the engine guard.

### 2. Fix result display joining
In `showCamp()` result rendering:
```js
resEl.textContent = (result?.effects || []).join('\\n');
```
This joins with literal `\n` escape, not newlines. Fix to:
```js
resEl.textContent = (result?.effects || []).join('\n');
```

### 3. Add cost line to scout/dance UI labels
Scout and Dance show "no cost" even though:
- Scout advances 1 day and consumes no items.
- Dance advances **0** days (no cost, no time).

Make the cost labels explicit:
- Scout: "1 day, no items"
- Dance: "no day, no items"

This helps players understand the time tradeoff.

### 4. Don't auto-open camp overlay on game start
Currently `showCamp()` doesn't auto-open, but verify `render()` or `bootstrap()` aren't triggering it. If they are, add guard: only open camp on explicit Camp button click.

### 5. Verify behavior in browser
- Open `dist/index.html` in browser.
- Click Camp → verify overlay opens with day/food/wear/morale/crew pills.
- Click each action: verify result text appears, day advances for appropriate actions, food/morale/wear change correctly.
- Verify Camp overlay closes with ✕ and Continue West.
- Verify Camp button is disabled/unavailable when in settlement or event.

## Files to touch
- `src/main.js`: fix `\\n`, update cost labels, ensure no auto-open.
- `src/systems/engine.js`: no changes needed (guard via preferred option C).

## Deliverable
Working camp overlay with all 7 actions functional and results readable.
