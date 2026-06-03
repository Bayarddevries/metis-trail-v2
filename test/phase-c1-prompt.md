# PHASE C1 GOAL PROMPT — Buffalo Hunt Multi-Step Event Chain

You are implementing Phase C1 of Sprint 2 for the Cart Trail game. This is the largest single feature — a multi-step Buffalo Hunt event chain. Read this entire prompt before starting.

## File to Edit
`/home/bayarddevries/.hermes/projects/metis-trail/dist/index.html` (~1719 lines)

## Source Material

Ross (1856) — The 1840 spring buffalo hunt:
- "On June 15, 1840, the carts emerged from all parts of the Settlement... The picturesque procession stretched some five or six miles... There were sixteen hundred and thirty persons and twelve hundred and ten Red River carts in this expedition."
- "First a council for the nomination of officers was held which included: ten captains, each with ten soldiers under his command; ten guides and a chaplain."
- "There was a camp flag which regulated the making and breaking of camp... During the march the flag was flying and while it was up, the guide was the chief of the expedition and everyone was subject to his orders."
- "The rules... no hunting on the Sabbath day, no straying from the camp... Penalties for infraction: 1st offense — saddle and bridle cut up; 2nd — coat cut up; 3rd — flogging. Theft — name called 3x in center of camp + 'thief'."
- "A total of 1,089,000 pounds of meat were obtained on this hunt."

## Design

The Buffalo Hunt is a SPECIAL event that triggers at a specific point on the trail (between nodes, on plains terrain). It's a multi-step chain with 4 stages:

1. **The Council** — Player arrives at the gathering point. A council is held. Player chooses their role.
2. **The March** — The brigade sets out. Player manages the journey.
3. **The Hunt** — The actual hunt. Player makes choices that affect the yield.
4. **The Return** — Journey back with the meat. Risk of spoilage, theft, accidents.

Each stage is a separate event. The chain is tracked via a new state field `buffaloHuntStage`.

## Implementation

### Step 1: Add buffalo hunt state

In the game state object S (around line 1000), add:

```javascript
const S = {
    day: 1, month: 6, season: 'summer', crew: 'rested',
    food: 30, wear: 0, squealLevel: 0, node: 0, segmentDay: 0, travelDaysWithoutRest: 0,
    over: false, won: false, pendingEvent: null, pendingSettlement: null, pendingSundayRest: false,
    score: 0, camps: 0, eventsResolved: 0, tradesMade: 0,
    buffaloHuntStage: 0, // 0 = not started, 1 = council done, 2 = march done, 3 = hunt done, 4 = complete
    buffaloHuntRole: null, // 'captain', 'hunter', 'guide', 'soldier'
    buffaloHuntYield: 0
};
```

### Step 2: Add the 4 buffalo hunt events

Add these to the EVENTS.plains array (at the end, before the closing `]`):

#### Event 1: The Council (triggers when buffaloHuntStage === 0)

```javascript
{
  id: 'buffalo_hunt_council',
  text: "The prairie ahead is dark with carts. From every direction — the Settlement, the river lots, the missions — they have come. Red River carts by the hundreds, maybe a thousand, stretching five or six miles across the grass.\n\nThis is the great spring hunt. The council fire burns at the center. Ten captains will be chosen, each with ten soldiers. Ten guides. A chaplain. A camp flag to regulate the march.\n\nThe rules are strict: no hunting on the Sabbath. No straying from camp. Theft means your name called three times in the center of the camp, with the word 'thief' after it. First offense — your saddle and bridle cut up. Second — your coat. Third — the lash.\n\nThe chief of the expedition calls for volunteers.",
  choices: [
    { text: 'Volunteer as a Hunter — you will ride with the hunting party', dc: null, ok: '', bad: '', always: 'You step forward as a hunter. The captain nods. You will ride with the hunting party when the herd is found. Your skill with the rifle will matter.', setRole: 'hunter' },
    { text: 'Volunteer as a Soldier — you will guard the camp and maintain order', dc: null, ok: '', bad: '', always: 'You step forward as a soldier. Ten soldiers under each captain, keeping order, guarding the camp, enforcing the rules. It is not glory, but it is necessary.', setRole: 'soldier' },
    { text: 'Volunteer as a Guide — you know the prairie and the buffalo trails', dc: 12, ok: 'The council accepts you as a guide. You will ride ahead, reading the grass and the wind, finding the herds. When the flag flies, you will be chief of the expedition.', bad: 'The council has enough guides. They thank you and ask you to serve as a soldier instead. You accept.', setRole: 'guide' }
  ]
}
```

#### Event 2: The March (triggers when buffaloHuntStage === 1)

```javascript
{
  id: 'buffalo_hunt_march',
  text: "June 15th. The procession moves west.\n\nThe carts stretch five or six miles — a picturesque army of wood and hide. The camp flag flies. When it rises, the guide is chief. When it lowers, the captains govern the camp.\n\nYou are <ROLE_TEXT>. The prairie opens before you. The scouts ride ahead. Somewhere beyond the horizon, the buffalo wait.",
  choices: [
    { text: 'Keep the pace steady — the herd will come', dc: null, ok: '', bad: '', always: 'The march continues. Days pass. The carts creak. The oxen plod. The flag flies and lowers, flies and lowers. The rhythm of the hunt settles into your bones.', advanceHunt: 2 },
    { text: 'Push ahead with the scouts — find the herd faster (DC 13)', dc: 13, ok: 'You ride ahead with the scouts. On the third day, you see them — a dark mass on the northern horizon. Thousands. The signal fire is lit. The hunt is close.', bad: 'You ride ahead but find nothing. The scouts were right — the herd has moved further west. You return to the column empty-handed. The march continues.', advanceHunt: 2, time: 1 }
  ]
}
```

#### Event 3: The Hunt (triggers when buffaloHuntStage === 2)

```javascript
{
  id: 'buffalo_hunt_chase',
  text: "The herd is here. Thousands of buffalo, maybe tens of thousands, darkening the prairie to the north.\n\nThe signal fires have been lit. The hunters mount. The rules are clear: no firing until the charge begins. No straying. The Sabbath is sacred — if the hunt falls on Sunday, the guns stay silent.\n\nThe chief gives the signal. The hunters surge forward.",
  choices: [
    { text: 'Ride hard into the herd — maximum yield, maximum risk (DC 12)', dc: 12, ok: 'You ride into the thundering mass. The buffalo part around you. Your rifle cracks again and again. Three cows go down. The meat will feed the camp for days. When the hunt ends, you are covered in dust and blood and grinning.', bad: 'Too close. A bull turns and charges. Your horse shies. You fire wild, miss, and barely escape under the belly of a cow. The hunt continues without you. You return to camp with nothing but a story and a bruised shoulder.', huntYield: 'high' },
    { text: 'Hunt the edges — safer, steady yield (DC 10)', dc: 10, ok: 'You work the edges of the herd, picking your shots. Two cows and a young bull. Not the most meat, but clean kills, no waste. The butchers will be pleased.', bad: 'The edge of the herd is chaos — other hunters, straying animals, dust. You fire twice and miss both times. The herd moves on. You return with nothing.', huntYield: 'medium' },
    { text: 'Guard the camp — let the hunters hunt, keep order (DC 9)', dc: 9, ok: 'You hold the camp. A soldier tries to sneak out for an early shot — you stop him. A dispute over a stray horse — you settle it. The hunt returns successful, and the camp is orderly. The captains nod their approval.', bad: 'A fight breaks out over hunting territory. You try to intervene and take a fist to the jaw. The captains sort it out. You spend the rest of the day nursing your pride.', huntYield: 'low' }
  ]
}
```

#### Event 4: The Return (triggers when buffaloHuntStage === 3)

```javascript
{
  id: 'buffalo_hunt_return',
  text: "The hunt is over. The meat is cut, dried, packed onto the carts. A total of 1,089,000 pounds — enough to feed the Settlement for months.\n\nBut the meat is heavy. The carts groan. The journey back is slower than the journey out. And the meat will spoil if you delay.\n\nThe captains call for order. The flag rises. The return march begins.",
  choices: [
    { text: 'Push hard — get the meat home before it spoils (DC 11)', dc: 11, ok: 'You drive the column hard. The carts creak and groan but hold. The meat is hung to dry at every camp. By the time you reach the Settlement, the pemmican is packed and the carts are full. You have never seen so much food.', bad: 'A wheel breaks under the weight. A cart overturns. Meat spills across the prairie. You salvage what you can, but the loss is felt. The column slows. The heat is unforgiving.', huntComplete: 'partial' },
    { text: 'Steady pace — preserve the carts, accept some loss', dc: null, ok: '', bad: '', always: 'You keep a steady pace. The carts hold. Some meat is lost to the heat — you cannot stop it all — but the carts arrive intact. The Settlement will eat well this winter.', huntComplete: 'full' }
  ]
}
```

### Step 3: Add buffalo hunt state tracking to resolveChoice()

In the `resolveChoice()` function (around line 1128), after the existing effect handlers, add:

```javascript
    if (ch.setRole) { S.buffaloHuntRole = ch.setRole; }
    if (ch.advanceHunt) { S.buffaloHuntStage = ch.advanceHunt; }
    if (ch.huntYield) {
      const yieldAmount = { high: 50, medium: 30, low: 15 };
      S.buffaloHuntYield = yieldAmount[ch.huntYield] || 20;
      S.food += S.buffaloHuntYield;
    }
    if (ch.huntComplete) {
      S.buffaloHuntStage = 4;
      if (ch.huntComplete === 'partial') {
        S.food -= 10; // some spoilage
        say("The return journey costs you. Some meat spoils in the heat. But most arrives intact.");
      }
    }
```

### Step 4: Add buffaloHuntRole text replacement

In the `presentEvent()` function (around line 1370), add a text replacement so `<ROLE_TEXT>` in event text is replaced with the player's role:

```javascript
    // Replace role placeholder in buffalo hunt events
    if (ev.id.startsWith('buffalo_hunt') && S.buffaloHuntRole) {
      const roleText = { hunter: 'a hunter — you will ride with the hunting party', soldier: 'a soldier — you guard the camp and maintain order', guide: 'a guide — you read the prairie and find the herds' };
      ev.text = ev.text.replace('<ROLE_TEXT>', roleText[S.buffaloHuntRole] || 'a member of the brigade');
    }
```

### Step 5: Make buffalo hunt events exclusive

In the `pickEvent()` function (around line 1140), add logic so buffalo hunt events only trigger at the right stage. Find the function and add at the top:

```javascript
function pickEvent() {
    // Buffalo hunt chain: only trigger at the right stage
    if (S.buffaloHuntStage > 0 && S.buffaloHuntStage < 4) {
      const huntEvent = getEventsForTerrain(NODES[S.node].terrain).find(e => e.id === 'buffalo_hunt_' + ['council','march','chase','return'][S.buffaloHuntStage - 1]);
      if (huntEvent && NODES[S.node].terrain === 'plains') return huntEvent;
    }
    // Normal event selection
    if (rand() > 0.35) return null;
    const pool = getEventsForTerrain(NODES[S.node].terrain);
    return pool[Math.floor(rand() * pool.length)];
}
```

## Steps to Implement

1. Read the file fully
2. Add `buffaloHuntStage`, `buffaloHuntRole`, `buffaloHuntYield` to state S
3. Add the 4 buffalo hunt events to EVENTS.plains
4. Add buffalo hunt effect handlers to resolveChoice()
5. Add role text replacement in presentEvent()
6. Update pickEvent() for buffalo hunt chain logic
7. Write the file
8. Deploy

## Deploy
```bash
cd /home/bayarddevries/.hermes/projects/metis-trail
git add dist/
git commit -m "Phase C1: Buffalo Hunt multi-step event chain"
git subtree split --prefix dist -b gh-pages
git push origin gh-pages --force
```

## Constraints
- ONLY add buffalo hunt features. Do NOT modify other events or game logic.
- The buffalo hunt is a plains-only event chain
- 4 stages: council → march → chase → return
- Player chooses a role at the council that affects flavor text
- Food yield: high=50, medium=30, low=15

## Report
What was added, line count, deploy status, any issues.
