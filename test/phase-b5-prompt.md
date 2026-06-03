# PHASE B5 GOAL PROMPT — Settlement Type Expansion

You are implementing Phase B5 (FINAL Phase B task) of Sprint 2 for the Cart Trail game. Your ONLY job is to expand settlement actions and add settlement-specific flavor text. Nothing else.

## File to Edit
`/home/bayarddevries/.hermes/projects/metis-trail/dist/index.html` (~1681 lines)

## What You Need to Change

### 1. Expand Settlement Actions

Update the `getSettlementActions()` function (around line 1129) to add new actions per type:

```javascript
function getSettlementActions(n) {
    const a = [];
    if (n.type === 'hbc') a.push('grease', 'trade', 'repair', 'rest', 'rumours');
    else if (n.type === 'metis') a.push('grease', 'trade', 'rest', 'forage');
    else if (n.type === 'trading') a.push('grease', 'trade', 'rest', 'rumours');
    else if (n.type === 'mission') a.push('grease', 'rest', 'heal', 'theology');
    else if (n.type === 'nwmp') a.push('grease', 'trade', 'rest', 'inspect');
    a.push('continue');
    return a;
}
```

### 2. Add New Action Handlers in settlementAction()

In the `settlementAction()` function (around line 1052), add handlers for the new actions. Add these after the existing `trade` handler (after line 1098) and before the closing `}` of the function:

```javascript
    if (action === 'forage') {
      const foodFound = Math.floor(rand() * 4) + 1; // 1-4 food
      S.food += foodFound;
      S.day++; advanceMonth();
      say(`You forage the settlement edges — wild berries, roots, whatever grows this close to the river. +${foodFound} Food. A day well spent.`);
    }
    if (action === 'rumours') {
      const rumours = [
        "A traveller mentions good grazing near the next water crossing. The horses ahead found sweet grass.",
        "You hear that the Touchwood Hills pass is muddy but passable. The brigade ahead lost time but not supplies.",
        "Someone mentions NWMP at the next fort are checking every cart. Best to have your goods in order.",
        "A trader warns: alkaline water in the next stretch. Fill your barrel before you reach it."
      ];
      const r = rumours[Math.floor(rand() * rumours.length)];
      say(`You spend an hour trading stories and news with the other travellers. "${r}"`);
    }
    if (action === 'theology') {
      say("The man of science is here again — dividing his time between Paul's Epistles and the compound microscope. You sit through a theology lecture that touches on grace, geology, and the nature of moss. Your morals are mended, if not your trousers.");
    }
    if (action === 'inspect') {
      const hasTrade = cart.some(i => i.type === 'trade' && i.count > 0);
      if (hasTrade) {
        say("The NWMP sergeant inspects your cart with professional thoroughness. He notes your trade goods, checks for contraband, and finds everything in order. He stamps your travel papers and wishes you a safe journey. You feel oddly protected.");
      } else {
        say("The NWMP sergeant inspects your cart. He finds nothing but supplies and tools. He seems almost disappointed. 'No trade goods?' he asks. You shake your head. He waves you through.");
      }
    }
```

### 3. Add New Button Labels

In the `presentSettlement()` function (around line 1494), update the labels object to include the new actions. Find:

```javascript
const labels = {
    grease: '🛢 Grease Wheels (1 shaganappi)', trade: '🛒 Trade', repair: '🔧 Repair Cart', rest: '🏕 Rest', heal: '💊 Seek Healing', continue: '🚩 Continue West'
};
```

Replace with:

```javascript
const labels = {
    grease: '🛢 Grease Wheels (1 shaganappi)', trade: '🛒 Trade', repair: '🔧 Repair Cart', rest: '🏕 Rest', heal: '💊 Seek Healing',
    forage: '🌿 Forage the Settlement Edges', rumours: '👂 Gather Rumours', theology: '⛪ Theology & Science', inspect: '⭐ NWMP Inspection',
    continue: '🚩 Continue West'
};
```

### 4. Add Settlement-Specific Flavor Text (Optional but Recommended)

For 3 specific settlements, add unique flavor text that appears when the settlement is visited. This is done by checking the settlement name in `presentSettlement()` and adding a special narrative line.

After the `presentSettlement()` function sets `document.getElementById('settlement-desc').textContent = node.desc;` (around line 1488), add:

```javascript
    // Settlement-specific flavor text
    const special = {
      "Fort Qu'Appelle": "\n\nThe NWMP post sits on a bluff above the river. Red-coated sentries watch the trail in both directions. The customs officer has seen everything — and forgotten nothing.",
      "St. Boniface": "\n\nThe Grey Nuns are already walking toward your cart with soup and bandages. They do not ask if you are Catholic. They do not ask if you are well. They simply begin to help.",
      "Batoche": "\n\nThe church bell rings across the valley as you approach. Children run alongside the cart. Someone is cooking bannock over an open fire. This is not just a settlement — it is a home."
    };
    if (special[node.name]) {
      document.getElementById('settlement-desc').textContent += special[node.name];
    }
```

## Steps

1. Read the file fully
2. Update `getSettlementActions()` — add new actions per type
3. Add new action handlers in `settlementAction()`
4. Update labels in `presentSettlement()`
5. Add settlement-specific flavor text in `presentSettlement()`
6. Write the file
7. Deploy:
   ```bash
   cd /home/bayarddevries/.hermes/projects/metis-trail
   git add dist/
   git commit -m "Phase B5: Settlement expansion (forage, rumours, theology, inspect)"
   git subtree split --prefix dist -b gh-pages
   git push origin gh-pages --force
   ```

## Constraints
- ONLY modify: getSettlementActions(), settlementAction(), presentSettlement()
- Do NOT touch any events, other game logic, CSS, or HTML structure
- All new text must be source-grounded (Marbot, Ross, NWMP Report as noted)

## Report
After deploying: what was changed, line count, deploy status, any issues.
