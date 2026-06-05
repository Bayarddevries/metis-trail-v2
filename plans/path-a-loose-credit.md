# Path A — Loose Credit Implementation Plan

## Core rule
Your “Tally” is **not one number**. It is a per-faction ledger:
- `credit.hbc` — what you owe the Company
- `credit.metis` — what you owe free traders
- `credit.nwmp` — what you owe the Mounties
- `credit.mission` — what you owe mission stores

Settlements only show the faction they belong to. You never see all tabs at once unless you’re at a multi-faction post.

## Historical behavior per faction

**HBC posts** (Fort Garry, Fort à la Corne, Fort Paskoya, Fort Edmonton)
- Extend credit: you can buy food/medicine/shaganappi on tab
- Selling goods *reduces* your tab (payment applied automatically)
- Reputation raises your credit limit and reduces the deduction rate
- At Edmonton: remaining tab is deducted from your final MB settlement

**Métis posts** (St. Boniface, St. Norbert, Batoche)
- Strict barter: no credit. You must bring pemmican/meat to trade
- They overpay for furs and hides (15–20% premium)
- They underpay for manufactured goods ( blankets, shot)
- Reputation with Métis improves prices but never opens credit

**Mission posts** (St. Boniface mission, others)
- Small credit only (max 3 MB). Mostly moral support, food, medicine
- Gossip is the primary action

**NWMP posts** ( Carlton Crossing)
- No credit. Strict cash-in-hand: pemmican or hides only
- Low prices, but you gain reputation which helps at HBC posts

## UI changes

### Status bar (new layout)
```
Food 18 | Crew Rested | 78 kg | Tally +2.4 MB
```
Tapping the Tally number expands a compact ledger:
```
HBC    +2.4 MB
Métis   0.0 MB
NWMP    0.0 MB
Mission 0.0 MB
```
Lean: one number, one tap to expand. No icons cluttering the travel view.

### Settlement overlay (changes)
- HBC: shows “Tab” balance prominently; buy buttons show “+0.8 MB to tab”
- Métis: shows “No credit — barter only”; buy buttons are disabled unless you have pemmican
- NWMP: shows “Cash only”

### Edmonton settlement (new screen)
Arriving at Fort Edmonton triggers a final settlement:
1. Your remaining cargo is tallied at destination premium prices
2. Your open tabs (HBC especially) are deducted
3. Your net MB is your final score component
4. Ending title is calculated from net MB + wear + time

## Engine changes

### New state shape
```js
credit: {
  hbc: 0,      // positive = you owe them (they extended credit)
  metis: 0,
  nwmp: 0,
  mission: 0
}
```

### New settlement action: `settleTab`
Only available at Edmonton. Deducts all credits and adds cargo value.

### Market logic
```js
function marketPrice(node, itemKey, action) {
  const base = NODE_MARKET[node.id][itemKey];
  const rep = S.reputation[node.faction] || 0;
  const creditEffect = action === 'buy' && node.creditEnabled 
    ? (rep * 0.1)  // better rep = better credit terms
    : 0;
  return base + creditEffect;
}
```

### Modified `settlementAction`
- `trade` becomes `buyItem(itemKey)` or `sellItem(itemKey)`
- HBC: buy creates `credit.hbc += cost`; sell creates `credit.hbc -= value`
- Métis: buy requires `cart.pemmican.count >= cost` or `cart.hides.count >= 1`
- NWMP: same as Métis but harsher prices

### Modified `availableSettlementActions`
Returns different action sets:
- HBC: rest, trade, repair, grease, forage, recruit (credit enabled)
- Métis: rest, trade (barter), gossip, recruit (no credit)
- Mission: rest, heal, gossip
- NWMP: rest, trade (cash), rumours

## Data changes

### `src/data/nodes.js`
Each node gets:
```js
market: {
  pemmican: { buy: 4, sell: 2 },    // MB cost to buy / value to sell
  bisonHide: { buy: 3, sell: 1 },
  beaverPelt: { buy: 8, sell: 5 },
  shaganappi: { buy: 1, sell: 0 },
  medicine: { buy: 3, sell: 1 },
  blanket: { buy: 4, sell: 2 }
},
credit: true/false,     // HBC true, Métis false, NWMP false
creditLimit: 6,         // max tab you can run (HBC higher with rep)
```

### `src/data/items.js`
Each trade good gets `mbValue` (used only at final settlement):
```js
{ name: 'Bison Hide', mbValue: 1.25, ... }
{ name: 'Beaver Pelt', mbValue: 3.00, ... }
{ name: 'Pemmican', mbValue: 0.40, ... }
```

## Phased execution

### Phase 0: Schema + ledger state (backward compat)
- Add `credit` object to engine state, default all zeros
- Add `mbValue` to items, default 0 for non-trade goods
- Add `market` field to nodes, default empty object
- Update persistence to round-trip new fields

### Phase 1: Status bar Tally + expandable ledger
- Status bar always shows `Tally` (net of all credits)
- Tap expands/collapses per-faction breakdown
- No gameplay effect yet, just read-only

### Phase 2: Market tables + faction behavior
- Nodes serve market prices from data
- HBC buy adds credit, sell subtracts credit
- Métis/NWMP buy requires pemmican pmf count
- Settlement overlay shows faction-appropriate warnings

### Phase 3: Edmonton settlement + ending rewrite
- Final cargo tallied at destination premium
- Credits deducted
- Net MB added to score
- Endings branch on net MB tiers

### Phase 4: Reputation modifier on credit limit
- HBC credit limit = 6 + (rep * 1)
- If you exceed limit, buy buttons disabled
- Métis prices improved by rep but never credit-enabled

## Rollback safety
- Phase 0: safe (defaults)
- Phase 1: safe (UI only)
- Phase 2: risky (settlement UI change, but save compat kept)
- Phase 3: safe (only triggers at game end)
- Phase 4: safe (behind existing rep system)

## What the player feels
- **Opening**: same offload screen, now with “Starting Tally: +4.0 MB (HBC credit)”
- **Travel**: same d20 events, but market buttons change behavior based on node type
- **Mid-run**: you’re tracking one Tally number but it’s actually a web of faction debts
- **End**: Edmonton feels like a real reckoning — “You arrive with 12.8 MB net”

## Files touched
- `src/systems/engine.js` — state, settlementAction, availableSettlementActions, calcScore
- `src/data/nodes.js` — market tables, credit flags
- `src/data/items.js` — mbValue field
- `src/main.js` — market UI, Tally display
- `src/ui/renderer.js` — status bar Tally, expandable ledger
- `src/data/events.js` — mostly unaffected
- `src/ui/persistence.js` — schema migration for credit/mbValue/market
