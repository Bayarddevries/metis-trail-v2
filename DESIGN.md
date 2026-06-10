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

### Sprint 2: Core Redesign — PARTIAL
- [x] Build starting shop screen
- [x] Build narrative journal (basic — travel logging only)
- [x] Unify cart overlay
- [ ] Redesign camp action cards + critical failures
- [ ] Add event/camp/settlement journal logging

### Sprint 3: Settlements & Economy — TODO
- [ ] Rework 4 settlement types with distinct actions
- [ ] Add hunting-for-trade-goods events
- [ ] Implement price variation by location
- [ ] Build endgame scoring screen

### Sprint 4: Visual Unification — TODO
- [ ] Apply gritty color palette everywhere
- [ ] Unify all overlay styles
- [ ] Redesign status bar
- [ ] Map styling (sepia, no modern markers)
- [ ] Polish all buttons, borders, spacing

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
