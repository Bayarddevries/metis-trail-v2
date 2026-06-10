# Metis Trail V2 — Design Document
> Last updated: 2026-06-10
> Status: PLANNING — do not build until plan is approved

---

## 1. CORE GAME LOOP

1. **Fort Garry** → Start with trade goods, buy supplies at shop
2. **Travel** → Consume 1 food/day, cart wears down, events trigger
3. **Camp** → Forage, hunt, repair, scout, rest, dance
4. **Settlement** → Trade goods for ₥, buy supplies, get intel
5. **Repeat** → Until Edmonton or death
6. **Fort Edmonton** → Endgame scoring

---

## 2. STARTING SHOP (replaces pre-departure overlay)

### Starting Loadout (FIXED — player does NOT choose)
- 4× Bison Hide (trade good, ~1.25 ₥ each = 5 ₥)
- 3× Beaver Pelts (trade good, ~3.0 ₥ each = 9 ₥)
- **Total starting value: ~14 ₥**
- NO food, NO repair supplies, NO ammo, NO medicine, NO tools
- Player is a hunter heading west to sell their haul

### Shop Screen Layout
- Header: "Fort Garry Outfitters — Stock Up Before the Trail"
- Subheader: "You have X ₥ in trade goods to spend"
- Item list: each item shows name, description, price in ₥, [Buy] button
- Running balance at bottom: "₥ remaining: X"
- "Confirm Outfit" button to begin journey

### Shop Prices (moderate — balance can be tuned)
| Item | Price (₥) | Notes |
|---|---|---|
| Pemmican Rations (×5) | 2.5 | Bulk food purchase |
| Spare Axle | 3.0 | Expensive, critical |
| Shaganappi (×3) | 1.5 | Repair material |
| Tool Kit | 2.5 | Enables major repairs |
| Canvas Tarp | 2.0 | Shelter/raft |
| Firewood Bundle (×2) | 1.0 | Cold nights |
| Rope (50ft) | 1.5 | Crossings, repairs |
| Ammunition Belt | 2.0 | Hunting, defense |
| Medicine Pouch | 3.0 | Expensive, critical |
| Blanket (×2) | 2.0 | Winter survival |

### Shop Constraints
- Player cannot buy everything — must prioritize
- Cannot sell trade goods back (already converted to ₥ value)
- Confirm button disabled until player has at least 10 food

---

## 3. NARRATIVE JOURNAL (replaces narrative panel)

### Behavior
- ALWAYS VISIBLE in main game view (not overlay, not toggleable)
- Scrolls top (Day 1) → bottom (most recent)
- Replaces the current `#narrative` div entirely

### Entry Format
```
━━━━━━━━━━━━━━━━━━━━
Day 15 — July 28 — Summer
━━━━━━━━━━━━━━━━━━━━
[Event text...]

→ Chose: "Set a splice with rope and wedges"
→ Rolled 14 — need 12+ — ✓ Success
→ The jury-rig holds. Progress is slow, but the cart is rolling again.
→ Wear +1
```

### Entry Types
- **Travel**: "Traveled west from [Node A] toward [Node B]. [Atmospheric fragment.]"
- **Event**: Full event text + choice + dice result + outcome
- **Camp**: Action taken + dice result + flavor text + effects
- **Settlement**: Arrival + actions taken + results
- **Critical Failures**: Highlighted with ⚠ and red text

### Visual Style
- Cream background (#f5e6c8)
- Aged ink text (#3a2f1f)
- Day headers in tarnished brass (#8b6914)
- Most recent entry auto-expanded
- Older entries collapsed (click header to expand)
- NO ruled lines, NO paper texture
- Scrollbar styled to match

---

## 4. CART OVERLAY (single screen)

### Access
- Cart button in controls → opens overlay
- Accessible anytime (not just when overloaded)

### Layout
```
┌─────────────────────────────────────┐
│ Cart — 87.5 / 100 kg          [✕]  │
├─────────────────────────────────────┤
│ 🥩 Pemmican Rations ×7 (17.5 kg)   │
│ Dried meat and fat. The staple...   │
│ [Unload (−2.5 kg)]                  │
├─────────────────────────────────────┤
│ 🦬 Bison Hide ×4 (24.0 kg)         │
│ Trade value: 1.25 ₥ each           │
│ [Unload (−6.0 kg)]                  │
└─────────────────────────────────────┘
```

### Weight Bar
- Green if under capacity: "Cart — 87.5 / 100 kg"
- Red if over: "⚠ Overloaded — 108 / 100 kg — Offload 8 kg"
- Always visible at top of overlay

### Item Details
- Name, count, total weight
- Description (readable, NO texture behind text)
- Category hint: "Trade goods. Sell at settlements for ₥ credit."
- MB value for trade goods
- Unload button on EVERY item (not just when overloaded)

---

## 5. CAMP ACTION CARDS

### Card Layout
```
┌─────────────────────────────────────┐
│ 🏹 Hunt                             │
│ Cost: 1 Ammunition Belt · 1 day     │
│ Risk: Lose ammo, no pelts on fail   │
│ "The prairie offers game if you     │
│  know where to look."               │
│                          [Do It]    │
└─────────────────────────────────────┘
```

### All 7 Actions + Push On

| Action | Cost | Risk on Failure | Flavor |
|---|---|---|---|
| Rest | 1 food | Crew stays tired | "Sleep under the stars..." |
| Forage | 1 day | Got lost, lose a day | "Search for edible roots..." |
| Hunt | 1 ammo, 1 day | Lose ammo, no pelts | "The prairie offers game..." |
| Repair | 1 shaganappi | Waste materials, wear stays | "Shaganappi binds tight..." |
| Scout | 1 day | Walk into next event blind | "Reconnoiter the trail ahead..." |
| Dance | Free | Morale drops (awkward night) | "Song and dance by firelight..." |
| Deep Rest | 2 food, 2 days | Waste food, minimal gain | "Two days of full recovery..." |
| Push On | 1.5 food, wear/morale | Extra wear, no recovery | "Skip camp. The trail waits." |

### Critical Failures
- Roll 1, or fail by 5+ → extra consequence
- Failed hunt: lose ammo AND morale −2
- Failed repair: waste shaganappi AND wear +1
- Failed scout: next event has no warning
- Failed forage: lose an extra day
- Failed dance: morale −3
- Failed deep rest: waste food, crew still tired

---

## 6. SETTLEMENTS (4 types, automatic arrival)

### Arrival
- Automatic when reaching a settlement node
- Settlement overlay shows immediately
- Player picks an action, then "Continue West" to leave

### HBC Fort
> "The palisade walls rise from the prairie. Company men in dark coats move between warehouses. The flag snaps in the wind."

| Action | Effect |
|---|---|
| Trade Goods → ₥ | Sell trade goods for ₥ credit |
| Buy Supplies | Spend ₥ on food, repair, ammo |
| Rest | Recover crew condition (costs 1 food) |
| Get Intel | Learn about trail ahead (costs 0.5 ₥) |

### Métis Camp
> "Canvas tents in a circle. A fiddle starts up. Children run between the carts. The smell of pemmican and smoke."

| Action | Effect |
|---|---|
| Trade Gossip | Get trail intel for free (maybe inaccurate) |
| Recruit Crew | Add crew member (costs 2 ₥ + 1 food) |
| Dance | Morale +15, costs 1 day |
| Share Food | Give 2 food, gain morale +10 and gossip |

### NWMP Post
> "Red-coated Mounties stand at attention. A Union Jack flies over the stockade. Papers must be shown."

| Action | Effect |
|---|---|
| Pay Fines | Clear any penalties (costs ₥) |
| Get Permits | Required for some trail sections |
| Report Duty | Morale +5, maybe get supplies |
| Buy Ammo | Ammunition at regulated prices |

### Mission
> "A wooden cross rises above the spire. The bell rings across the prairie. Peace here, but the trail calls."

| Action | Effect |
|---|---|
| Heal Crew | Restore crew to rested (free) |
| Rest | Full recovery, 1 day |
| Get Blessing | Morale +20, 1 day |
| Confession | Morale +10, free |

### Price Variation
- HBC Fort: base prices
- Métis Camp: food cheaper, no ammo
- NWMP Post: ammo available, other items expensive
- Mission: healing free, nothing for sale

---

## 7. HUNTING REWORK

### Success → Trade Goods (NOT food)
- Plains: Deer hide (0.75 ₥) or Bison hide (1.25 ₥, rare)
- River: Beaver pelt (3.0 ₥)
- Wooded: Deer hide (0.75 ₥)
- Uplands: Elk hide (1.5 ₥)

### Failure
- Normal fail: lose 1 ammo, no pelts
- Critical fail (roll 1 or fail by 5+): lose 1 ammo, morale −2

### Terrain Dependency
- Can only hunt on: plains, river, wooded, uplands
- Cannot hunt on: (none — all terrain has game)
- Better prey on certain terrains

---

## 8. VISUAL STYLE (unified)

### Color Palette
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
| Warning | #b4842c | Yellow — muted |

### Typography
- Headings: Playfair Display (already loaded)
- Body: Crimson Text (already loaded)
- Monospace: (not needed)
- Max 3 font families

### Components
- **Borders**: 1px solid, NO border-radius, color matches surface
- **Buttons**: flat, ink-on-paper, brass border on hover
- **NO box-shadow anywhere**
- **NO gradient text**
- **NO glassmorphism**
- **NO rounded corners**

### Map
- Full sepia desaturation
- NO modern markers
- NO highway signs
- Trail shown as dotted line
- Settlements as simple circles

---

## 9. ENDGAME (Fort Edmonton)

### Arrival
- Automatic when reaching final node
- Endgame overlay shows

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
| Score | Tier | Narrative |
|---|---|---|
| < 500 | Barely Survived | "You arrived with nothing but your life..." |
| 500–1200 | Solid Profit | "A respectable haul. The Company men nod..." |
| 1200+ | Legendary Haul | "The talk of the fort. Your name will be remembered..." |

### Ending Screen Shows
- Final score with breakdown
- Trade goods delivered
- Crew condition
- Days on trail
- Narrative summary paragraph
- "Play Again" button
- "View Hall of Fame" button

---

## 10. WHAT'S CUT

- ❌ Audio module (removed)
- ❌ Crafting system (no meaningful use — will be re-added later when crafted items have purpose)
- ❌ Pre-departure packing screen (replaced by shop)
- ❌ Paper texture / ruled lines (replaced by clean journal)
- ❌ Redundant cart screens (merged to one)
- ❌ Modern map markers (replaced by period-appropriate)

---

## 11. OPEN QUESTIONS / DECISIONS NEEDED

1. **Win condition**: Currently need 10 ₥ at Edmonton. Change to score-based? Or keep ₥ threshold?
2. **Starting ₥ value**: 14 ₥ from trade goods. Enough? Too much?
3. **Shop prices**: Moderate. Will need playtesting to balance.
4. **Hunt prey table**: Need to define exact prey per terrain with probabilities.
5. **Settlement price variation**: Exact multipliers per location type TBD.
6. **Critical failure threshold**: Fail by 5+ or just roll 1?

---

## 12. FILES THAT NEED CHANGES

| File | Change |
|---|---|
| `src/template.html` | Journal panel, shop screen, settlement overlays, visual style |
| `src/main.js` | Shop logic, journal log, camp cards, cart overlay, critical failures |
| `src/systems/engine.js` | Camp action consequences, hunt rewards, settlement actions |
| `src/data/items.js` | Remove crafting recipes, add hunt prey items |
| `src/data/nodes.js` | Settlement types, terrain for hunting |
| `src/ui/theme.js` | New color palette |
| `src/ui/icons.js` | Keep emoji, ensure consistency |
| `src/ui/haptics.js` | Keep as-is |
| `src/ui/audio.js` | DELETED |
| `src/data/events.js` | Settlement-specific events, hunt events |

---

## 13. SPRINT ORDER

### Sprint 1: Fix & Stabilize
- [x] Kill audio module
- [ ] Fix hunt/repair item check bug (state.cart undefined)
- [ ] Fix #71 decimal scores
- [ ] Fix #72 end button sizes
- [ ] Fix #73 Hall of Fame load
- [ ] Fix lined paper CSS

### Sprint 2: Core Redesign
- [ ] Build starting shop screen
- [ ] Build narrative journal (replace narrative panel)
- [ ] Unify cart overlay (single detailed screen)
- [ ] Redesign camp action cards
- [ ] Add critical failure consequences

### Sprint 3: Settlements & Economy
- [ ] Rework 4 settlement types with distinct actions
- [ ] Add hunting-for-trade-goods events
- [ ] Implement price variation by location
- [ ] Build endgame scoring screen

### Sprint 4: Visual Unification
- [ ] Apply gritty color palette everywhere
- [ ] Unify all overlay styles
- [ ] Redesign status bar
- [ ] Map styling (sepia, no modern markers)
- [ ] Polish all buttons, borders, spacing
