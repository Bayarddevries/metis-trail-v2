# Camp Overhaul + Richer Scoring Design

## Camp redesign vision
Replace the monolithic "Make Camp" with a **camp action panel**. Camp becomes a meaningful daily decision, not just "click to rest."

### Camp overlay concept
- Triggered by **Camp** button (replaces Make Camp)
- Header: "Camp — Day X at [Node Name]" + crew/food/wear/morale readout
- One action per camp (costs 1 day), or "Rest" as default:
  - **Rest** (1 food): crew rested, morale +15, wear -1
  - **Forage** (no cost): roll d20+mod vs DC 8 → food 4-9. 10% chance +1 low-tier item.
  - **Hunt** (1 Ammo Belt): roll vs DC 10 → food 6-14. 15% chance +1 trade good. 5% chance misfire (no food).
  - **Repair** (1 Shaganappi): wear -2. If Spare Axle used: wear -3.
  - **Craft** (1 day): same recipes as settlements. Natural 20 = extra output.
  - **Scout Ahead** (no cost): roll vs DC 12 → bonus intel on next node (terrain/event hint) or weather warning.
  - **Deep Rest** (2 days, 2 food): morale +30, wear -2, crew deeply rested.
- "Continue West" closes overlay without action (wastes the day? No — closes camp, user can click Travel 1 Day).

### What stays
- Auto-rest every 7 days remains, but weaker: only morale +8, wear -0. Camp becomes the proper rest choice.
- Engine’s `makeCamp()` becomes the backend for the default Rest action. New activities call new engine API: `campAction(type)`.

### Example flow
Day 1: Click Travel → plains event → +1 Rope gained.
Day 2: Crew tired. Click Camp → choose **Repair** (use Shaganappi, wear -2).
Day 3: Click Travel → river segment.
Day 4: Food low. Click Camp → choose **Hunt** (spend Ammo Belt, roll 17 vs DC 10 → +10 food, nothing else).
Day 5: Click Travel → river crossing event.

---

## Richer scoring proposal

### Current formula
```
score = 1000
+ tradeUnits * 120
+ min(food,25) * 12
+ crewBonus (30/10/0)
- days * 8
- wear² * 40
- noRestPenalty
```

### Proposed formula
```
score = 500
+ sum(item.count * item.mbValue * destinationMult) * 100
  (destinationMult: 1.0 at start, 1.5 at Edmonton — encourages carrying value forward)
+ craftedPremium: craftedGoodsTotal * 130  (crafted items are 1.3x value)
+ diversityBonus: +100 if ≥3 distinct trade types
+ efficiency: +10/day under 42, -12/day over 42
+ condition: morale*2 + (4-wear)*25
+ campingWisdom: +6 per camp if morale > 60, -12 per camp if morale < 30
+ reputation: sum of all reps * 8
```

### What this rewards
- **Freight value** (not just count) — a Beaver Pelt is worth more than a strip of leather
- **Crafting** — makes the expanded recipe table meaningful for score
- **Diversity** — mixed cargo beats single-item hoarding
- **Choice quality** — well-timed camps and balanced wear/morale
- **Relationships** — rep with factions opens doors and adds points

---

## Integration with economy plan

| Phase | Camp change | Economy change |
|-------|-------------|----------------|
| 1 (loot) | Add Hunt as camp activity | Events start giving items via `give` |
| 2 (trade) | No camp change | Buy/sell menus at settlements |
| 3 (craft) | Craft as camp activity (mirrors settlement) | Expand recipe table to ~8 |

So camp doesn’t need to wait — it unlocks with Phase 1 items. Hunt and Forage give the game an acquisition loop immediately. Craft comes in Phase 3.

---

## Open choices
1. **Activities list**: should we add **Cook** (spend pemmican for morale + food efficiency) or keep the list above?
2. **Camp fatigue**: should excessive camping become a soft penalty (days = winter risk), or is that already handled by the season clock?
3. **Scoring style**: the formula above is transparent but crunchy. Would you prefer a simpler "Freight + Condition" score with verbal tier badges instead?
4. **Build scope**: implement the **camp overlay + Hunt + Forage + Scout** now (Phase 0), then do Phases 1-3? Or keep the original three-phase order?
