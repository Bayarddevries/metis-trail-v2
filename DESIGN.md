# Metis Trail V2 — Design Document
> Last updated: 2026-06-10
> Status: IN PROGRESS — Sprint 2 partially complete

---

## 1. CORE GAME LOOP

1. **Fort Garry** → Start with trade goods only, buy supplies at shop
2. **Travel** → Consume 1 food/day, cart wears down, events trigger
3. **Camp** → Forage, hunt, repair, scout, rest, dance
4. **Settlement** → Trade goods for ₥, buy supplies, get intel
5. **Repeat** → Until Edmonton or death
6. **Fort Edmonton** → Endgame scoring

---

## 2. COMPLETED WORK

### v83 — Dice Clarity & UI Polish
- DC display: "DC 12" → "Need 12+" everywhere
- Camp dice: per-action DC thresholds, reset on reopen
- End-screen: no auto-popup, "View Hall of Fame" button
- Party name + profanity filter
- Status bar: Journey + Cart clusters with brass separator
- Weather: emoji → text
- Die: wooden block CSS
- Ink-stamp: success/fail CSS
- MB symbol: 💎 → ₥ (mill sign)

### v84 — Haptics, Sources, Icons
- Haptics module created and wired
- Audio module created then DELETED (too fragile, browser compatibility issues)
- Secondary sources rewritten as period voices
- SVG icons attempted, reverted to emoji (SVG too small at 24x24)

### v85 — Bug Fixes
- Audio module fully removed
- Cart overlay: always shows unload buttons, detailed descriptions
- Category hints: more informative ("1 food/day keeps the crew alive...")
- Lined paper simplified (clean cream background, no ruled lines)
- Hunt/repair item check fixed (was using undefined state.cart)

### v86-v87 — Shop Screen
- Starting loadout: trade goods only (4 Bison Hides + 3 Beaver Pelts = ~14 ₥)
- Shop screen replaces pre-departure packing
- Buy supplies with ₥, remove items to get ₥ back
- Balance display updates in real-time
- Food count display
- Confirm button requires 10+ food
- Rich shop text (outfitter's briefing, hints)
- Dotted overlay background removed

### v88 — Journal & Settlement Fixes
- Narrative panel replaced with accumulating journal log
- Journal entries: day/date header, event text, dice results, outcomes
- Most recent entry expanded, older ones collapsed
- Settlement rest fixed (costs 1 food, doesn't advance day)

---

## 3. STARTING SHOP (COMPLETE)

### Starting Loadout (FIXED)
- 4× Bison Hide (trade good, ~1.25 ₥ each = 5 ₥)
- 3× Beaver Pelts (trade good, ~3.0 ₥ each = 9 ₥)
- **Total starting value: ~14 ₥**
- NO food, NO repair supplies, NO ammo, NO medicine, NO tools

### Shop Prices
| Item | Price (₥) | Notes |
|---|---|---|
| Pemmican Rations (×5) | 2.5 | Bulk food, 5 rations per pack |
| Spare Axle | 3.0 | Expensive, critical |
| Shaganappi (×3) | 1.5 | Repair material |
| Tool Kit | 2.5 | Enables major repairs |
| Canvas Tarp | 2.0 | Shelter/raft |
| Firewood Bundle (×2) | 1.0 | Cold nights |
| Rope (50ft) | 1.5 | Crossings, repairs |
| Ammunition Belt | 2.0 | Hunting, defense |
| Medicine Pouch | 3.0 | Expensive, critical |
| Blanket (×2) | 2.0 | Winter survival |

### Shop Features
- Balance display (₥ remaining)
- Food count display
- Buy and Remove buttons
- Weight tracking with trade goods included
- Confirm disabled until 10+ food
- Status message explaining requirements

---

## 4. NARRATIVE JOURNAL (COMPLETE)

### Behavior
- ALWAYS VISIBLE in main game view (replaces old narrative panel)
- Scrolls top (Day 1) → bottom (most recent)
- Each entry: day/date header, event text, dice results, outcomes
- Most recent entry auto-expanded, older ones collapsed (click to expand)

### Entry Format
```
━━━━━━━━━━━━━━━━━━━━
Day 15 — July 28
━━━━━━━━━━━━━━━━━━━━
Traveled west from Fort Garry toward White Horse Plains.
Wear +1
```

### Entry Types Implemented
- **Travel**: Shows "Traveled west from [Node A] toward [Node B]." + wear changes

### Entry Types TODO
- **Event**: Full event text + choice + dice result + outcome
- **Camp**: Action taken + dice result + flavor text + effects
- **Settlement**: Arrival + actions taken + results

---

## 5. CART OVERLAY (COMPLETE)

### Features
- Accessible via Cart button anytime
- Shows all items with: name, count, weight, description, category hint
- Unload button on every item (not just when overloaded)
- Weight bar at top: green if under capacity, red if over
- MB value shown for trade goods

---

## 6. SETTLEMENTS (PARTIAL)

### Current State
- 4 settlement types: hbc, metis, trading, mission
- Actions: rest, trade, buy_food, buy_repair, buy_heal, buy_info, craft
- Rest costs 1 food, sets crew to rested, +15 morale

### TODO per DESIGN.md
- **HBC Fort**: Trade goods → ₥, Buy supplies, Rest, Get trail intel
- **Métis Camp**: Trade gossip, Recruit crew, Dance (morale), Share food
- **NWMP Post**: Pay fines, Get permits, Report for duty, Buy ammo
- **Mission**: Heal crew, Rest, Get blessing (morale)
- Price variation by location

---

## 7. CAMP ACTIONS (PARTIAL)

### Current State
- 7 actions + push_on
- All have flavor text pools (high/mid/low tiers)
- Dice rolls with per-action DC thresholds
- Missing mid-tier entries for hunt and repair (FIXED)

### TODO
- Redesign as cards showing: name, cost, risk, flavor text, button
- Critical failures (roll 1): extra consequences
  - Failed hunt: lose ammo + morale −2
  - Failed repair: waste shaganappi + wear +1
  - Failed scout: next event has no warning
  - Failed forage: lose an extra day
  - Failed dance: morale −3

---

## 8. HUNTING REWORK (TODO)

### Current State
- Hunt gives food directly on success

### TODO per DESIGN.md
- Hunt success → trade goods (pelts/hides) added to cart, NOT food
- Different prey by terrain: deer (plains), beaver (river), elk (uplands)
- Failed hunt: lose 1 ammo, no pelts
- Critical fail: lose ammo AND morale −2

---

## 9. VISUAL STYLE (TODO)

### Target Palette
| Role | Hex | Usage |
|---|---|---|
| Dark bg | #1a1208 | Main background, status bar |
| Panel bg | #2a1f10 | Overlays, cards |
| Journal bg | #f5e6c8 | Narrative journal |
| Ink (dark) | #3a2f1f | Text on cream |
| Ink (light) | #c4b69a | Text on dark |
| Accent | #8b6914 | Brass — headers, borders, highlights |
| Success | #4a7a3a | Green — muted, period |
| Danger | #8b2500 | Red — muted, period |

### Component Rules
- Borders: 1px solid, NO border-radius, color matches surface
- Buttons: flat, ink-on-paper, brass border on hover
- NO box-shadow anywhere
- NO gradient text
- NO glassmorphism
- NO rounded corners
- NO dotted/noise textures

### Map
- Full sepia desaturation
- NO modern markers, NO highway signs
- Trail shown as dotted line
- Settlements as simple circles

---

## 10. ENDGAME (TODO)

### Scoring
| Factor | Points |
|---|---|
| Base | 500 |
| ₥ value × 80 | Variable |
| Food bonus (×12) | Max 300 |
| Crew condition | Rested: +30, Tired: +10, Exhausted: 0 |
| Days penalty (×−8) | Variable |
| Wear penalty (×−40) | Variable |

### Ending Tiers
| Score | Tier |
|---|---|
| < 500 | Barely Survived |
| 500–1200 | Solid Profit |
| 1200+ | Legendary Haul |

---

## 11. FILES THAT NEED CHANGES

| File | Status | What's Left |
|---|---|---|
| `src/template.html` | Partial | Camp cards, settlement overlays, visual style |
| `src/main.js` | Partial | Camp cards, critical failures, event journal logging, settlement rework |
| `src/systems/engine.js` | Partial | Hunt rewards, settlement actions, critical failures |
| `src/data/items.js` | Done | — |
| `src/data/nodes.js` | TODO | Settlement types, terrain for hunting |
| `src/ui/theme.js` | TODO | New color palette |
| `src/ui/renderer.js` | Partial | Journal logging for events/camp/settlements |
| `src/ui/haptics.js` | Done | — |
| `src/ui/audio.js` | DELETED | — |
| `src/ui/icons.js` | Done | — |
| `src/data/events.js` | TODO | Settlement-specific events, hunt events |

---

## 12. SPRINT ORDER

### Sprint 1: Fix & Stabilize ✅ COMPLETE
- [x] Kill audio module
- [x] Fix hunt/repair item check
- [x] Fix #71 decimal scores
- [x] Fix #72 end button sizes
- [x] Fix #73 HoF load
- [x] Fix lined paper CSS

### Sprint 2: Core Redesign ✅ COMPLETE
- [x] Build starting shop screen
- [x] Build narrative journal (basic — travel logging only)
- [x] Unify cart overlay
- [x] Redesign camp action cards + critical failures
- [x] Add event/camp/settlement journal logging
- [x] Hunt gives trade goods (pelts/hides) not food

### Sprint 3: Settlements & Economy
**Goal:** 4 distinct settlement types with unique actions, hunting events, price variation, endgame scoring.

#### 3.1 Settlement Overlay Redesign (`src/main.js`, `src/template.html`)
- [ ] Replace generic settlement overlay with type-specific overlays
- [ ] Each settlement type shows unique action set with period-appropriate labels
- [ ] Action cards show cost (₥/food/items), risk, flavor text — same card pattern as camp
- [ ] Settlement header: name, type badge, distance from Fort Garry, description
- [ ] Continue West button always visible (dismisses pendingSettlement)

#### 3.2 HBC Fort Actions (`src/systems/engine.js`, `src/data/nodes.js`)
- [ ] **Trade Goods → ₥**: Primary function, best rates for pelts/hides
- [ ] **Buy Supplies**: Full shop inventory (pemmican, axle, shaganappi, tools, tarp, firewood, rope, ammo, medicine, blankets)
- [ ] **Rest**: 1 food → crew rested +15 morale (costs 1 day implicitly via travel loop)
- [ ] **Get Trail Intel**: 1 ₥ → reveals next 2 node events/gossip (sets gossip in engine)
- [ ] Price multiplier: 1.0x (base rates)

#### 3.3 Métis Camp Actions
- [ ] **Trade Gossip**: Free, reveals 1 gossip entry (more personal/relational)
- [ ] **Recruit Crew**: 2 ₥ + 1 food → +1 crew member (max 6)
- [ ] **Dance (Morale)**: 1 food → morale +10, no day advance
- [ ] **Share Food**: Give 2+ food → morale +5 per food, builds relationship
- [ ] **Craft Finished Hides**: 3 raw hides + 1 shaganappi → 1 finished_hide (worth 2× ₥)
- [ ] Price multiplier: 0.9x for buying, 1.1x for selling trade goods

#### 3.4 NWMP Post Actions
- [ ] **Pay Fines**: If `state.fines > 0`, pay ₥ to clear
- [ ] **Get Permits**: 2 ₥ → `state.hasPermit = true` (required for certain river crossings)
- [ ] **Report for Duty**: 1 day → ₥ reward (scales with distance traveled), morale -5
- [ ] **Buy Ammo**: 1.5 ₥ per Ammunition Belt (cheaper than HBC)
- [ ] **Rest**: 1 food → crew rested (no morale bonus)
- [ ] Price multiplier: 1.2x for supplies, 0.8x for ammo

#### 3.5 Mission Actions
- [ ] **Heal Crew**: 1 medicine pouch OR 2 ₥ → all injury/illness cleared, morale +10
- [ ] **Rest**: Free → crew rested, morale +15 (blessing)
- [ ] **Get Blessing**: 1 food → morale +10, next event DC -1
- [ ] **Trade**: Limited — only buys pemmican (0.5 ₥ each), sells blankets (1.5 ₥)
- [ ] Price multiplier: 0.8x for buying, 1.5x for selling (charity rates)

#### 3.6 Settlement Data (`src/data/nodes.js`)
- [ ] Add `settlementType` to each node: 'hbc' | 'metis' | 'nwmp' | 'mission'
- [ ] Add `settlementName`, `settlementDescription` per node
- [ ] Add `priceMultiplier` object per settlement: `{buy: 1.0, sell: 1.0, categories: {...}}`
- [ ] Define which settlements exist at which nodes (Carlton Trail: Fort Garry=HBC, St. François Xavier=Métis, Fort Ellice=HBC, Fort Pelly=HBC, Fort Carlton=HBC/NWMP, Fort Battleford=NWMP, Fort Edmonton=HBC)

#### 3.7 Hunting Events (`src/data/events.js`)
- [ ] Create terrain-specific hunt events triggered by `campAction('hunt')`
- [ ] **Plains (Bison)**: 60% success, DC 12. Success → 1-2 Bison Hide (1.25 ₥ each). Fail: lose 1 ammo. Crit fail: +morale -2
- [ ] **River Valley (Beaver)**: 50% success, DC 14. Success → 1 Beaver Pelt (3.0 ₥). Fail: lose 1 ammo. Crit fail: +morale -2
- [ ] **Uplands (Elk)**: 45% success, DC 15. Success → 1 Elk Hide (2.5 ₥). Fail: lose 1 ammo. Crit fail: +morale -2
- [ ] **Wooded (Deer)**: 55% success, DC 13. Success → 1 Deer Hide (1.8 ₥). Fail: lose 1 ammo. Crit fail: +morale -2
- [ ] Events use `getSource()` for historical quotes
- [ ] Critical failure (roll 1) flagged in journal with ⚠

#### 3.8 Price Variation by Location
- [ ] Base prices in `src/data/items.js` (shop prices)
- [ ] Settlement multiplier applied in `getTradeEstimate()` / `tradeItem()`
- [ ] Category multipliers: food ×1.0, repair ×1.0, medical ×1.0, tools ×1.0, shelter ×1.0, trade_goods ×varies
- [ ] Trail position modifier: further west = higher buy prices (scarcity), lower sell prices (market saturation)
- [ ] Formula: `finalPrice = basePrice * settlementMultiplier * categoryMultiplier * (1 + distanceFactor * 0.15)`

#### 3.9 Endgame Scoring Screen (`src/main.js`, `src/template.html`)
- [ ] Triggered on reaching Fort Edmonton node
- [ ] Shows: Base (500), ₥ Value ×80, Food Bonus (×12 per unit, max 300), Crew Condition (Rested +30, Tired +10, Exhausted 0), Days Penalty (−8/day), Wear Penalty (−40 per wear)
- [ ] Tier display: <500 "Barely Survived", 500-1200 "Solid Profit", 1200+ "Legendary Haul"
- [ ] Narrative ending text per tier with source quote
- [ ] "View Hall of Fame" button (no auto-popup)
- [ ] Party name submitted with score

#### 3.10 Engine API Additions (`src/systems/engine.js`)
- [ ] `getSettlementActions(settlementType)` → returns action list with metadata
- [ ] `settlementAction(type, params)` → handles all settlement actions, returns result
- [ ] `getTradeEstimate(itemId, quantity, settlementType)` → buy/sell price preview
- [ ] `getEndgameScore()` → returns breakdown object
- [ ] `getSettlementData(nodeId)` → returns settlement config for current node

### Sprint 4: Visual Unification
**Goal:** Apply gritty period-accurate aesthetic everywhere, unify all overlay styles.

#### 4.1 Color Palette Application (`src/ui/theme.js`, `src/template.html`)
- [ ] Define CSS custom properties in `:root` (migrated from template.html inline styles)
- [ ] Dark bg #1a1208 → body, status bar, overlays
- [ ] Panel bg #2a1f10 → all overlay backgrounds
- [ ] Journal bg #f5e6c8 → #journal only
- [ ] Ink dark #3a2f1f → text on cream
- [ ] Ink light #c4b69a → text on dark
- [ ] Accent brass #8b6914 → borders, headers, highlights
- [ ] Success #4a7a3a → success states
- [ ] Danger #8b2500 → failure/warning states
- [ ] Apply via `applyTheme()` at bootstrap (already exists, extend it)

#### 4.2 Overlay Style Unification (`src/template.html`)
- [ ] All overlays: #camp-overlay, #settlement-overlay, #shop-overlay, #cart-overlay, #event-overlay, #ending-overlay, #predeparture-overlay
- [ ] Shared base class `.overlay-panel` with:
  - background: var(--clr-panel-bg)
  - border: 2px solid var(--clr-accent)
  - NO border-radius, NO box-shadow
  - padding: 16px
  - max-width: 90vw, max-height: 85vh
  - overflow: auto
- [ ] Header: brass border-bottom, heading font, uppercase, letter-spacing
- [ ] Close button: top-right, 44×44px touch target, brass border on hover
- [ ] Button hierarchy: `.action-primary` (brass bg, dark ink), `.action-secondary` (transparent, brass border), `.action-ghost` (text only, brass on hover)
- [ ] All buttons: min-height 44px, flat, NO rounded corners

#### 4.3 Status Bar Redesign (`src/ui/renderer.js`, `src/template.html`)
- [ ] Two clusters: Journey (Day, Date, Segment, Weather, Morale) | Cart (Weight, Capacity, ₥, Food)
- [ ] Brass vertical separator between clusters
- [ ] Compact: 32px height, 12px font
- [ ] Color-coded values: food-low red, wear-high amber, morale tiers
- [ ] Segment progress: "Fort Garry → White Horse Plains (12 km)"

#### 4.4 Map Styling (`src/ui/renderer.js`, `src/template.html`)
- [ ] Full sepia: grayscale(1) contrast(1.1) brightness(0.9) on tile pane
- [ ] Trail: dotted line #8b6914, 2px, via L.polyline
- [ ] Settlements: simple circles, brass stroke, type-colored fill (HBC=red, Métis=blue, NWMP=green, Mission=gold)
- [ ] Cart marker: custom SVG icon (cart silhouette), brass stroke
- [ ] NO modern markers, NO highway signs, NO attribution control
- [ ] Node tooltips: uppercase, heading font, brass bg, dark ink

#### 4.5 Button & Component Polish (`src/template.html`)
- [ ] Primary: background #8b6914, color #1a1208, border none, hover: brightness 1.1
- [ ] Secondary: background transparent, color #8b6914, border 1px solid #8b6914, hover: bg #8b6914, color #1a1208
- [ ] Ghost: background transparent, color #c4b69a, border none, hover: color #8b6914
- [ ] Disabled: opacity 0.4, cursor not-allowed
- [ ] Focus visible: brass outline 2px, offset 2px
- [ ] Touch targets: min 44×44px (already in .action-* classes)

#### 4.6 Journal Polish
- [ ] Entry header: brass left border 3px, uppercase heading font
- [ ] Collapsed: only header visible, chevron indicator (▼/▶)
- [ ] Expanded: text, dice, mechanical all visible
- [ ] Dice line: brass color, small heading font, pass=green, fail=red
- [ ] Mechanical: muted ink, small, italic

#### 4.7 Dice & Ink-Stamp Consistency
- [ ] Wooden die block: 48×48px, grain texture, brass pips
- [ ] Roll animation: settle over 1.2s, slight rotation variance
- [ ] Result stamp: "✓ SUCCESS" / "✗ FAILURE" in ink-stamp style (rotated slightly, brass ink)
- [ ] Critical fail: red danger color, ⚠ icon, "CRITICAL FAILURE" stamp

### Sprint 5: Content & Historical Depth (Future)
- [ ] Audit all 55 events for source coverage gaps
- [ ] Add missing events: smallpox/epidemic, HBC officer encounters, buffalo hunt scenes, river ferry crossings
- [ ] Expand women/children presence (currently 4 events)
- [ ] French-language dialogue options
- [ ] Gossip trail mechanic at settlements
- [ ] Seasonal event variation (June vs October)
- [ ] Prairie-specific events for western trail
- [ ] Second half of Carlton Trail nodes with citations

---

## 13. KNOWN ISSUES

- Cart shows empty on returning players (old save data) — clear localStorage to fix
- Settlement rest button works but UI doesn't clearly show what it does
- Camp action cards still use old grouped layout, not card-based design
- Journal only logs travel, not events/camp/settlements yet
- Audio 404 in browser cache — users must hard refresh (Ctrl+Shift+R)

---

## 14. OPEN QUESTIONS

1. **Win condition**: Currently need 10 ₥ at Edmonton. Keep or change to score-based?
2. **Starting ₥ value**: 14 ₥ from trade goods. Enough? Too much?
3. **Hunt prey table**: Exact prey per terrain with probabilities TBD
4. **Settlement price variation**: Exact multipliers per location type TBD
