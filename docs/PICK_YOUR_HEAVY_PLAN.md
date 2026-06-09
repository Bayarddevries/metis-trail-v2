# Pick Your Heavy — Pre-Departure Cart Packing Plan

**Sprint:** v43  
**Issue:** #15 — Allow users to spend starting money to pack their original cart  
**Target:** Replace blind 28 kg forced offload with informed "Pick Your Heavy" strategic choice

---

## Problem Statement

Current flow (v42):
1. Game boots → intro overlay shows "Welcome to the Métis Trail. Click Begin Journey to start."
2. Player clicks "Begin Journey" → intro hides → `render()` called
3. Player sees overloaded cart (128/100 kg) → must click cart button → unload items blindly
4. No context on item utility → players discard high-value items (Beaver Pelts, Spare Axle) not knowing their worth

**Goal:** Insert a pre-departure packing screen between intro dismissal and first render that:
- Shows all 12 starting items with weights, categories, and utility hints
- Enforces 100 kg capacity limit
- Lets player adjust counts (0 to max) per item
- Shows real-time weight total and "kg over/under" indicator
- "Confirm Loadout" button only enabled when ≤ 100 kg
- Teaches item categories via `getCategoryHint()` tooltips

---

## Technical Design

### New State Field
Add to engine state (in `createGame`):
```javascript
state.preDeparture = true  // true until player confirms loadout
```

### New Engine Methods
Add to engine public API (in `createGame` return object):
- `getPreDepartureItems()` → returns `{ name, wt, maxCount, currentCount, category, desc, icon, mbValue }[]`
- `setPreDepartureCount(itemName, newCount)` → validates 0 ≤ newCount ≤ maxCount, updates internal cart
- `confirmPreDeparture()` → sets `preDeparture = false`, returns final cart for game start

### UI Flow

**1. New Overlay in `src/template.html`**
```html
<div class="overlay" id="predeparture-overlay">
  <div class="overlay-card" style="max-width: 520px;">
    <h2>Pack Your Cart</h2>
    <p class="predeparture-subtitle">Fort Garry Outfitters — 100 kg capacity</p>
    
    <div id="predeparture-weight" class="predeparture-weight">
      <span id="pd-weight-current">128</span> / 100 kg 
      <span id="pd-weight-status" class="over">28 kg over</span>
    </div>
    
    <div id="predeparture-list"></div>
    
    <div class="predeparture-actions">
      <button id="pd-confirm" class="ctrl-btn" disabled>Confirm Loadout</button>
      <button id="pd-auto" class="ctrl-btn" style="background:var(--clr-muted)">Auto-Pack (Balanced)</button>
    </div>
  </div>
</div>
```

**2. Item Row Template (per item)**
```html
<div class="pd-row" data-item="Pemmican Rations">
  <div class="pd-item-info">
    <span class="pd-icon">🥩</span>
    <span class="pd-name">Pemmican Rations</span>
    <span class="pd-category-hint">Restores food when needed.</span>
  </div>
  <div class="pd-controls">
    <button class="pd-minus" data-item="Pemmican Rations">−</button>
    <span class="pd-count">15</span>
    <button class="pd-plus" data-item="Pemmican Rations">+</button>
    <span class="pd-weight">37.5 kg</span>
  </div>
</div>
```

**3. Weight Bar States**
- Over capacity: red text, "X kg over", Confirm disabled
- At capacity: amber text, "At capacity", Confirm enabled
- Under capacity: green text, "X kg spare", Confirm enabled

**4. Auto-Pack Button**
Preset balanced loadout (example):
- Pemmican: 10 (25 kg) — food for ~20 days at 1.2/day
- Spare Axle: 1 (15 kg) — essential repair
- Shaganappi: 3 (9 kg) — repair material
- Tool Kit: 1 (8 kg) — major repairs
- Bison Hide: 2 (12 kg) — trade goods
- Canvas Tarp: 1 (4 kg) — shelter
- Firewood: 1 (6 kg) — cold nights
- Rope: 1 (3 kg) — crossings/repair
- Ammunition: 1 (2 kg) — hunting/defence
- Medicine: 1 (1.5 kg) — healing
- Blanket: 1 (3 kg) — winter survival
- Beaver Pelts: 1 (4 kg) — high-value trade
**Total: 92.5 kg** (7.5 kg spare buffer)

---

## Integration Points

### `src/main.js` — `bootstrap()`
1. After `mount()` and `initMap()`, **before** showing intro overlay:
   - Check `game.getState().preDeparture`
   - If true: show pre-departure overlay instead of intro overlay
   - Bind pre-departure controls
2. On "Confirm Loadout" click:
   - Call `game.confirmPreDeparture()`
   - Hide pre-departure overlay
   - Call `window.__METIS_RENDER__()` → normal game starts

### `src/systems/engine.js` — `createGame()`
1. Initialize `state.preDeparture = true`
2. Starting cart counts from `items.js` are **maximums** (not actual starting counts)
3. Actual starting counts = player's confirmed choices
4. Add three public methods to returned API object

### `src/template.html`
- Add pre-departure overlay HTML (before cart-overlay)
- Version bump to `app.js?v=43`

---

## Category Hints (Reuse Existing)
```javascript
// Already in main.js as getCategoryHint()
provisions: 'Restores food when needed.'
repair: 'Reduces cart wear at settlements.'
parts: 'Used for cart repair and crafting.'
furs: 'Trade value: high at Edmonton.'
shelter: 'Survival aid; shelters crew from weather.'
fuel: 'Required for cold nights and some recipes.'
hunting: 'Event bonuses and ammunition support.'
medical: 'Restores crew condition when injured or ill.'
tool: 'Enables repair and advanced crafting.'
ammo: 'Hunting and defensive event bonuses.'
```

---

## Acceptance Criteria

- [ ] Pre-departure overlay appears **instead of** intro overlay on fresh game
- [ ] All 12 items listed with icon, name, category hint, current count, weight
- [ ] +/- buttons adjust count (0 to max from items.js)
- [ ] Weight bar updates in real time (current / 100 kg, over/under status)
- [ ] "Confirm Loadout" disabled when > 100 kg, enabled when ≤ 100 kg
- [ ] "Auto-Pack" loads balanced preset (92.5 kg)
- [ ] Confirming calls `game.confirmPreDeparture()`, hides overlay, starts game
- [ ] Saved games (loadGame) skip pre-departure (preDeparture = false)
- [ ] Build v43, local server verified at `http://100.108.183.33:8081/`
- [ ] No console errors, mobile layout works

---

## Files to Modify

1. `src/systems/engine.js` — add preDeparture state + 3 public methods
2. `src/main.js` — bootstrap integration, pre-departure UI logic, event bindings
3. `src/template.html` — pre-departure overlay HTML, version bump to v43
4. `src/ui/renderer.js` — ensure render() respects preDeparture state (no map/cart/crew until confirmed)
5. `src/ui/persistence.js` — save/load preDeparture flag

---

## Testing Checklist

- [ ] Fresh game → pre-departure shows → adjust items → confirm → game starts with chosen loadout
- [ ] Over 100 kg → confirm disabled → reduce items → confirm enabled
- [ ] Auto-pack → 92.5 kg → confirm enabled
- [ ] Load saved game → skips pre-departure → normal game
- [ ] Mobile: overlay fits, buttons touchable, weight bar readable
- [ ] Cart weight at game start matches confirmed loadout exactly