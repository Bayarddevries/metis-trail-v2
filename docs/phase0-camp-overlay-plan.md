# Phase 0: Camp Overlay Implementation Plan

## Scope
Replace the single-purpose "Make Camp" with a camp action panel that makes mid-trail days feel like meaningful decisions.

## Engine API additions
- `campAction(type)` — executes one camp activity, advances time, returns result
  - `type`: `rest`, `forage`, `hunt`, `repair`, `scout`, `dance`
  - Each costs 1 day, some consume items/ammo
  - Returns array of result strings shown in narrative panel

### Activity rules (textured to the era)
- **Rest** (1 food): morale +15, wear -1, crew rested
- **Forage** (no cost): d20 + crewMod vs DC 8. Success: food 4-9. 10%: +1 low-tier item (Firewood Bundle, Dried Fruit, Rope)
- **Hunt** (1 Ammunition Belt): d20 + crewMod vs DC 10. Success: food 6-14. 15%: +1 trade good (Bison Hide, Beaver Pelts). 5% misfire (no food).
- **Repair** (1 Shaganappi): wear -2. If Spare Axle present: wear -3 (consumes Shaganappi only, not axle).
- **Scout** (no cost): d20 + crewMod vs DC 12. Success: reveal next node terrain + 1 event hint. Fail: "Saw nothing / turned back."
- **Dance** (no cost): morale +8, morale +5 if crew tired, morale +12 if crew rested. No food cost. Represents Red River jig / fiddle circles.

### Time/cost model
- 1 action = 1 day
- Player cannot stay in one place indefinitely — winter still catches them
- Camp overlay closes after action; player must click Camp again for another action next day

---

## UI changes
- `src/template.html`: New `#camp-overlay` with header, status readout, action buttons, result area
- `src/main.js`: New `showCamp()`, `hideCamp()` functions
- Camp action buttons: icon + name + cost line (e.g., "Hunt — costs 1 Ammunition Belt")
- Result display shows mechanical effects + flavor text

---

## Overlay flow
1. Player clicks **Camp** button
2. Camp overlay opens with current crew state, food, wear
3. Player picks one action
4. Engine advances 1 day and resolves
5. Result shown inline; overlay stays open
6. Player clicks **Continue West** to close and travel, or another action to camp again next turn

---

## Files to modify
- `src/systems/engine.js` — add `campAction()` method
- `src/main.js` — add `showCamp()`, wire Camp button
- `src/template.html` — add camp overlay markup

---

## Verification
- Each action resolves correctly with flavor text
- Hunt consumes Ammunition Belt
- Repair consumes Shaganappi
- Dance raises morale without food cost
- Scout reveals next node info
- Forage/Hunt can yield items (no items introduced yet, but engine should support `give`)
- Camp overlay close/reopen works cleanly with travel flow

---

## Out of scope for Phase 0
- Event item drops (Phase 1)
- Trade menu expansion (Phase 2)
- Crafting at camp (Phase 3)
- Audio/sound design

---

## Design decisions locked
- No cooking action
- No excessive camping penalty (winter/food already provide soft limit)
- Cannot camp multiple days in one location without closing overlay and clicking Camp again
