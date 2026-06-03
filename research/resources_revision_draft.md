---
tags:
  - system
  - core-mechanic
  - inventory
---

# Resources

## Inventory System

This system has been superseded by the [[Cart & Inventory System]], which uses a Resident Evil–style tetris grid for all cargo. See that document for grid sizes, item dimensions, stack limits, cart wear mechanics, and repair procedures.

## Resource Types

### Consumables  
*Deplete daily or per use.*

| Resource | Grid Size | Stack Max | Depletion | Notes |
|----------|-----------|-----------|-----------|-------|
| Pemmican Rations | 1×2 | 5 | 1 per day per person | Core food supply. Without it, Survival checks to hunt |
| Water | — | — | N/A | Only tracked in drought/winter conditions |
| Ammunition | 1×1 | 20 | Per shot | For hunting and defence |
| Firewood | 1×2 | 3 | Per night | More needed in winter. Scavenge in timber, buy on open prairie |
| Medicine | 1×1 | 10 | Per use | Treats wounds, disease. Craft or trade |
| Tobacco | 1×1 | 1 | Per use | Morale item. Sharing tobacco is a Diplomacy bonus |

### Equipment  
*Persistent — can be damaged.*

| Resource | Grid Size | Stack Max | Notes |
|----------|-----------|-----------|-------|
| Spare Axle | 2×4 | 1 | Breaks on bad terrain. 4–5 recommended per long trip |
| Shaganappi (rawhide) | 1×2 | 3 | Repair material. Can substitute for nails, bolts, rope |
| Bison Hide Tarps | 2×3 | 1 | Waterproofing for cart‑raft conversion and shelter |
| Tools (axe, auger, drawknife) | 1×2 | 1 | Essential for Craft checks. Losing these = no repairs |
| Trade Goods | varies | varies | Valued in Made Beaver. See [[Trade & Economy]] |
| Blankets | 1×1 | 1 each | Winter survival. Without blanket in cold, frostbite risk |

### Animals  
*Animals do not take grid space; they are tracked separately per cart.*

| Animal | Notes |
|--------|-------|
| Ox | Slow, strong, reliable. Needs grazing. Dies = lose cart capacity (8×6 grid) |
| Horse | Fast, fragile. Needs grain supplement (Horse Feed, 1×2) in winter. Dies = lose speed |
| Bison Runner | Special: only available if starting with hunt scenario. Fastest, wildest |

---

## Supply Depletion Rules

- **Food:** consumed every day automatically. If 0, party must Hunt (Survival check DC 14+) or Starve.
- **Starvation:** 1 day without food = Fatigue +2, disadvantage on all checks. 3+ days = Health damage (1 step per day).
- **Ammunition:** each hunt or combat encounter costs 1–3 rounds.
- **Axles:** roll d6 on rough terrain or river crossing — 1 = axle snaps. Replace or cart is immobile (see [[Cart & Inventory System]] for region‑based wear and repair procedures).

## Cart Damage

Cart wear and damage are handled by the [[Cart & Inventory System]] (region‑based wear, tetris‑grid capacity loss, and repair mechanics). Do not use the Sound / Worn / Broken condition levels from the old system; refer to the new system for Minor wear, Major breakdown, and Catastrophic results.

---

**Related Systems:** [[Travel & Day Cycle]] · [[Dice & Combat]] · [[Trade & Economy]] · [[Made Beaver System]] · [[Health & Morale]] · [[Cart & Inventory System]]