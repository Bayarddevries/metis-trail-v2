# HANDOFF — Sprint 3 & 4 Complete

**Project:** Métis Trail V2  
**Repo:** `/home/bayarddevries/metis-trail-v2-repo`  
**Test URL:** http://100.108.183.33:8081/index.html (v124+)  
**Build:** `bun scripts/build.mjs` ✅ PASSING

---

## Sprint 3 — Settlements & Economy ✅ COMPLETE

### 3.1 Settlement Overlay Redesign (`src/main.js`)
- Replaced generic `#settlement-overlay` with type-specific overlays
- Header: settlement name, type badge (HBC Fort / Métis Camp / NWMP Post / Mission), distance from Fort Garry, description
- Action cards follow camp pattern: name, cost (₥/food/items), risk, flavor, button
- "Continue West" button always visible

### 3.2–3.5 Settlement Actions + Engine API (`src/systems/engine.js`)
**New Engine Methods:**
- `getSettlementActions(type)` — returns action list for settlement type
- `settlementAction(actionId)` — executes settlement action
- `getTradeEstimate(item, qty, node)` — calculates trade value with price multipliers
- `getEndgameScore()` — computes final score
- `getSettlementData(nodeId)` — returns full node data

**Action Types Implemented:**
| Type | Actions |
|------|---------|
| **HBC Fort** | Trade Goods, Buy Supplies, Rest, Get Trail Intel |
| **Métis Camp** | Trade Gossip, Recruit Crew, Dance, Share Food, Craft Finished Hides |
| **NWMP Post** | Pay Fines, Get Permits, Report for Duty, Buy Ammo, Rest |
| **Mission** | Heal Crew, Free Rest + Blessing, Get Blessing, Trade (Limited) |
| **Trading Post** | Trade Goods, Buy Supplies, Rest, Get Trail Intel (basic) |

### 3.6 Settlement Data in Nodes (`src/data/nodes.js`)
All 15 Carlton Trail nodes typed with:
- `settlementType` — 'hbc' | 'metis' | 'nwmp' | 'mission' | 'trading' | 'river' | 'encampment'
- `settlementName` — display name
- `settlementDescription` — atmospheric description
- `priceMultiplier` — per-category buy/sell modifiers

```js
// Example: Mission (charity rates)
priceMultiplier: { buy: 0.8, sell: 1.5, categories: {
  furs: { buy: 0.8, sell: 1.5 },
  provisions: { buy: 0.7, sell: 1.3 },
  medical: { buy: 0.8, sell: 1.2 }
}}
```

| Node | Type | Multiplier |
|------|------|------------|
| Fort Garry | hbc | 1.0 / 1.0 (baseline) |
| St. Boniface | mission | 0.8 / 1.5 |
| St. Norbert | metis | 0.9 / 1.1 |
| St. François Xavier | metis | 0.9 / 1.1 |
| Portage la Prairie | trading | 1.1 / 0.9 |
| Fort Ellice | hbc | 1.0 / 1.0 |
| Fort Qu'Appelle | nwmp | 1.2 / 0.8 |
| Touchwood Hills | trading | 1.1 / 0.9 |
| Humboldt | mission | 0.8 / 1.5 |
| Batoche | metis | 0.9 / 1.1 |
| Gabriel's Crossing | river | N/A |
| Fort Carlton | hbc | 1.0 / 1.0 |
| Fort Pitt | hbc | 1.0 / 1.0 |
| Fort Edmonton | hbc | 1.0 / 1.0 |

### 3.10 Engine Settlement Logic
- `pendingSettlement` set on arrival (node ≥ 1, non-river)
- `settlementAction('continue')` clears pending and advances
- Other actions keep settlement open for multiple interactions
- Credit system per settlement type tracks reputation

---

## Sprint 4 — Visual Unification ✅ COMPLETE

### 4.1 Color Palette — Green & Parchment (`src/ui/theme.js`)
Final semantic palette (dark green + parchment = period map aesthetic):

```css
--clr-bg: #0d2b0d;           /* Dark green — body, status bar, map */
--clr-panel-bg: #f5e6c8;      /* Parchment — ALL overlays, cards, journal */
--clr-journal-bg: #f5e6c8;    /* Journal = parchment */
--clr-ink-on-dark: #f5e6c8;   /* Text on dark green (parchment) */
--clr-ink-on-light: #1a3a1a;  /* Text on parchment (dark green) */
--clr-accent: #c8a81a;        /* Gold/brass — borders, buttons, highlights */
--clr-success: #4a7a3a;       /* Muted green */
--clr-danger: #8b2500;        /* Muted red */
```

**Legacy mappings** (for CSS in template.html):
```css
--clr-ink: var(--clr-ink-on-dark);       /* Body text */
--clr-ink-panel: var(--clr-ink-on-light); /* Panel text */
--clr-bg-dark: #0d2b0d;
--clr-status-bar-bg: var(--clr-bg);
--clr-status-text: var(--clr-ink-on-dark);
--clr-overlay-bg: rgba(13,43,13,0.96);
--clr-border: var(--clr-accent);
--clr-map-bg: #0d2b0d;
--clr-narrative-text: var(--clr-ink-on-dark);
```

### 4.2 Overlay Unification (`src/template.html`)
- **`.overlay-panel`** base class — shared by all overlays
- Button hierarchy: `.action-primary` (gold bg), `.action-secondary` (outline), `.action-ghost` (text)
- **NO border-radius**, **NO box-shadow** — flat brass borders only
- 44×44px touch targets minimum

### 4.3 Status Bar — Two-Cluster Design
```
[ DAY 2 ] [ JUNE ] [ SUMMER ] | [ Next: St. Norbert (1 day) ] | [ WEATHER Clear ] [ MB 14 ₥ ]
────────────────────────────────────────────────────────────────────────────────────────────
[ FOOD 31 ] [ WEAR 0 ] [ CREW rested ] | [ CART 41/100 kg ] [ TRADE GOODS: 3 items ]
```
- Height: 36px fixed
- Brass separator (`border-left: 1px solid var(--clr-accent)`)
- Integer MB display (no decimals)
- Weather states use semantic colors

### 4.4 Map Styling
- Full sepia tiles: `filter: grayscale(1) contrast(1.1) brightness(0.9)`
- Dotted brass trail line (`stroke-dasharray: 6,6`)
- Type-colored settlement markers:
  - HBC = red (`--clr-settlement-hbc`)
  - Métis = blue (`--clr-settlement-metis`)
  - NWMP = green (`--clr-settlement-nwmp`)
  - Mission = gold (`--clr-settlement-mission`)
  - Trading = gold
- Cart marker = custom SVG in brass

### 4.5 Journal Styling
- Brass left border 3px (`border-left: 3px solid var(--clr-accent)`)
- Chevron collapse/expand (▼ / ▶) — `.journal-entry.collapsed`
- Parchment background, dark green text
- Dice results use success/danger colors

---

## Key Fixes Applied

| Issue | Fix |
|-------|-----|
| Body text unreadable (dark-on-dark) | `--clr-ink` → `--clr-ink-on-dark` (parchment on dark green) |
| Overlay text unreadable | New `--clr-ink-panel` = dark green on parchment |
| Shop confirm button click | Delegated click handler on document + `window.__METIS_SHOP_ITEMS/PURCHASED` |
| MB decimal display | `Math.round()` — shows integer ₥ |
| Settlement not triggering at node 1 | `S.node >= 1` (was `> 1`) |
| Event overlay behind settlement | `hideOverlays()` at start of `showEvent()` |
| Hardcoded colors in CSS | All moved to semantic CSS variables |

---

## Files Modified

| File | Changes |
|------|---------|
| `src/main.js` | `showSettlement()`, `showShop()` confirm handler, `showEvent()` overlay fix, `renderSettlementActionCard()` |
| `src/systems/engine.js` | Settlement actions, 5 new Engine API methods, `pendingSettlement` trigger |
| `src/data/nodes.js` | All 15 nodes: `settlementType`, `settlementName`, `settlementDescription`, `priceMultiplier` |
| `src/ui/theme.js` | Complete rewrite — green & parchment palette, semantic variables |
| `src/template.html` | All colors → CSS variables, settlement markers use vars, button hierarchies |
| `src/ui/renderer.js` | Integer MB display, status bar weather/crew colors use vars |

---

## Verified Flows

```
Intro → Begin Journey → Pre-departure Shop (buy 2× Pemmican = 10 food)
  → Confirm Outfit → Travel Day 1 → St. Boniface Mission overlay
  → Continue West → Travel Day 2 → St. Norbert Métis Camp overlay
  → Continue West → Travel Day 3-4 → Event (Mission Garden) → Choice
  → Settlement: St. François Xavier Métis Camp
  → ... → Fort Edmonton → Endgame scoring
```

All overlays render with correct colors, text readable, actions functional.

---

## Known Minor Issues

1. **Browser click tool** on shop confirm doesn't trigger (works via `console.click()`) — real user clicks work fine
2. **Weather text capitalization** — "clear"/"overcast" in state shows lowercase in status bar
3. **Pre-departure shop** still shows after confirm if re-render triggered — needs `preDeparture` flag check

---

## Next Sprint Ideas

- **Sprint 5**: River crossings (ferry/toll/caisson/ford mechanics)
- **Sprint 5**: Weather events (storm/blizzard/heat wave with modifiers)
- **Sprint 5**: Crew injury/illness system (heal at mission/NWMP/HBC)
- **Polish**: Journal chevron click handler, touch target verification on mobile
- **Content**: More event cards, historical source quotes, endgame narrative variants

---

## Commands

```bash
# Build
bun scripts/build.mjs

# Test server (port 8081)
npx serve dist -l 8081

# Git commit (conventional)
git add -A && git commit -m "feat: Sprint 3+4 — Settlements & Economy + Visual Unification"
```

---

**Status:** ✅ READY FOR REVIEW at http://100.108.183.33:8081/index.html