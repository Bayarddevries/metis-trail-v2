# Trade / Craft / Economy Redesign Plan

## Current diagnosis
- Inventory is static after starting cart. No event grants items post-launch.
- Trade is one-way: 1 trade good → food. Never expands options.
- Crafting has 3 recipes, gated by settlement type, consuming scarce inputs for opaque outputs.
- No currency, no shop, no loot — no "keep or drop" tension.
- Result: cart management is a one-time puzzle at the start, then irrelevant.

## Target state
Inventory is a **living decision space**. Players acquire, convert, specialize, and manage load throughout the trail. Trade/craft create meaningful permutations without adding a wallet UI.

## Guiding constraints
- No abstract currency (gold/silver).
- Food, wear, morale, and reputation remain the core survival track.
- Reputation can gate access but is not spendable as primary currency.
- All changes are additive: no existing event/settlement flow is removed, only extended.

---

## Phase 1: Event Loot Layer (unblock acquisition)

### Goal
Give players a steady trickle of new items via events so inventory management matters mid-run.

### Data changes
- `src/data/items.js`: Add **1 new common item** (e.g., `Dried Fruit` — food type, 1 kg, count 1, perishable, low trade value).
- `src/data/events.js`: Add `give` entries to **10 existing events** (low-chance, contextual).
  - Bear event → Ammunition Belt
  - Prairie fire → Canvas Tarp (salvaged)
  - Windfall/campsite → Firewood Bundle or Rope
  - HBC clerk rescue → Pemmican Rations
  - Buffalo hunt → Bison Hide or Beaver Pelts
  - Prairie fire → loss (already modeled); add opposite: camp smoke event → Dried Fruit found
  - River crossing → Rope (50ft)
- `src/data/events.js`: Add `give` to at least **1 plains + 1 river_valley + 1 wooded** event per terrain.

### Engine changes
- `src/systems/engine.js`: `resolveChoice()` already handles `ch.give`. No change needed — field is implemented but unused.
- `src/systems/engine.js`: Add `getRecentGains()` helper (returns items gained in last 3 days) so UI can surface "You found X" in travel log.

### UI changes
- `src/main.js`: In `buildEventChoiceOutcome()`, already shows `+X Item` if `give` fires (via effects array). Verify it renders.
- `src/ui/renderer.js`: Add a small "Acquisitions" line in `renderTravelLinesView` when recent gains exist.

### Verification
- Run event simulation with seeded randomization; confirm ~15–20% of events yield items.
- Verify starting cart weight still under 100 kg.

### Effort / Risk
- Small / Low

---

## Phase 2: Expanded Trade Menus (settlement-based buy/sell)

### Goal
Replace the single "Trade" button with context-aware buy/sell panels. Food remains convertible, but items can also be exchanged.

### Data changes
- `src/data/nodes.js`: Add `shop` object to each settlement type defining buy/sell availability.
  - HBC forts: buy [Spare Axle, Shaganappi, Canvas Tarp, Pemmican]; sell [Bison Hide, Beaver Pelts, Finished Hides]
  - NWMP posts: buy [Ammunition Belt, Rope]; sell [Gunpowder Pack, Blanket]
  - Métis parishes/trading: buy [Firewood, Pemmican, Dried Fruit]; sell [finished goods]
  - Missions: buy [Medicine Pouch, Blanket]; sell [food only]
  - Trading posts: full barter, best prices
- `src/data/items.js`: Add price tags (food cost or rep cost) or compute dynamically from `mbValue`.

### Engine changes
- `src/systems/engine.js`:
  - Add `getShop(nodeType)` → returns buy/sell lists with prices in food units.
  - Add `buyItem(itemName)` → deducts food, adds item.
  - Add `sellItem(itemName)` → removes item, adds food.
  - Modify `tradeItem()` to remain as a fast "sell trade good" shortcut, but settlement UI uses new buy/sell.

### UI changes
- `src/main.js`: Rewrite the `trade` branch in `showSettlement()`:
  - Collapsible tabs: "Buy" / "Sell"
  - Each row shows item icon, name, count in cart, price, action button.
  - Disabled state if insufficient food (buy) or insufficient count (sell).
  - Tooltip showing why disabled.
- Keep `trade` action in `settlementAction()` for backward compat; UI will bypass it.

### Verification
- At each node type, verify correct panels appear.
- Edge: sell last unit of trade good, verify food gain and cart weight drop.
- Edge: insufficient food, verify disabled buy buttons.

### Effort / Risk
- Medium / Low

---

## Phase 3: Recipe Expansion (crafting with purpose)

### Goal
Grow craft table from 3 to ~8 recipes with clear roles: upgrade, conversion, situational, cross-faction.

### Data changes
Add recipes to `engine.js` `getAvailableRecipes()`:

**Upgrade recipes (all settlements):**
- `greased_axle`: Shaganappi ×1 → applied instantly, reduces next wear event by 2.
- `reinforced_wheel`: Spare Axle ×1 + Shaganappi ×2 → reduces wear chance -2% for 3 days.

**Conversion recipes (type-specific):**
- `finished_hides`: Bison Hide ×2 + Shaganappi ×1 → Finished Hides (trade value 3.5)
- `pemmican_brick`: Pemmican ×3 + Dried Fruit ×1 → Pemmican Brick (trade value 2.0, perishable false)
- `gunpowder_pack`: Ammunition Belt ×1 + Tool Kit ×1 → Gunpowder Pack (trade value 4.0, nwmp only)

**Situational recipes (consumed on use, not stored):**
- `raft`: Canvas Tarp ×1 + Rope ×1 → one-time river crossing bonus (auto-success, no wear)
- `signal_fire`: Firewood ×1 + Pemmican ×1 → next event DC -2 (one encounter)

**Cross-faction (rep gated):**
- `metis_bannock`: Pemmican ×1 + Dried Fruit ×1 → +10 morale, requires `metis` rep ≥ 2

### Engine changes
- `craftRecipe()`: Support `consumedOnUse` flag. Situational recipes add to `S.flags` or `S.trailIntel` rather than cart.
- Upgrade recipes modify `S` directly (e.g., `S.wearResistance = 3`).
- Add `getCraftingTiers()` helper so UI can group recipes.

### UI changes
- `src/main.js`: In craft panel, group recipes by tier with subtle dividers.
- Upgrades show effect inline: "Reduces wear chance 3 days."
- Situational show "One-time use" badge.
- Cross-faction show rep requirement or hide if insufficient.

### Verification
- Craft each recipe type; verify cart state, S flags, and travel outcomes.
- Verify situational recipes don’t bloat inventory.
- Verify rep-gated recipes appear/disappear correctly.

### Effort / Risk
- Medium / Medium

---

## Implementation order
1. Phase 1 (loot) — unblock the core loop.
2. Phase 2 (trade) — give players agency to manage acquired goods.
3. Phase 3 (craft) — deepen specialization once acquisition/trade are stable.

## Files touched per phase
| Phase | Files |
|-------|-------|
| 1 | `src/data/items.js`, `src/data/events.js`, `src/systems/engine.js`, `src/ui/renderer.js`, `src/main.js` |
| 2 | `src/data/nodes.js`, `src/data/items.js`, `src/systems/engine.js`, `src/main.js` |
| 3 | `src/systems/engine.js`, `src/main.js` |

## Rollback safety
- Each phase changes only additive data and new engine methods.
- Existing save compatibility: `getState()` shape unchanged; new fields default to safe values.
- Phase 2 trade UI can fall back to legacy single "Trade" button if `shop` missing.

---

## Questions before we start
1. **Items**: Should we keep all current starter items, or prune any that feel vestigial?
2. **Food economy**: Should food remain infinite via trade, or should high-level food sources become scarcer?
3. **Rep spend**: Do you want reputation to be a spendable currency at high rep, or only a gate?
4. **Phase scope**: Start with Phase 1 only, or run all three phases in sequence?
5. **Time horizon**: Is this a weekend task, or a longer multi-session thread?
