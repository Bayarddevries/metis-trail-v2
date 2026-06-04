# PHASE B4 GOAL PROMPT — NWMP Patrol Encounter

You are implementing Phase B4 of Sprint 2 for the Cart Trail game. Your ONLY job is to add 2 new NWMP encounter events. Nothing else.

## File to Edit
`/home/bayarddevries/.hermes/projects/metis-trail/dist/index.html` (~1661 lines after Phase B3)

## What You Need to Add

### 1. NWMP Patrol Encounter (plains terrain)

Source: NWMP Research Report + Brehaut — Fort Ellice / Qu'Appelle had NWMP detachments. The NWMP patrolled the trail, checked for smuggling, and enforced order. Higher squeal = easier to find you.

Add this as a NEW event in EVENTS.plains array (place it at the end of the plains array, before the closing `]`):

```javascript
{
  id: 'nwmp_patrol',
  text: "Three red-coated riders appear on the ridge ahead, moving toward you across the prairie. North West Mounted Police — their scarlet tunics vivid against the brown grass.\n\nThe Carlton Trail is under their jurisdiction. They patrol regularly between the forts — checking for smuggling, enforcing order, and making sure no one causes trouble on the Queen's road.\n\nThe sergeant raises a hand. You stop.",
  choices: [
    { text: 'Greet them openly and offer to show your goods', dc: null, ok: '', bad: '', always: 'You pull aside your cart canvas and show your trade goods — bison hides and pelts, all legal. The sergeant nods, makes a note in his ledger, and asks about the trail ahead. You exchange news for ten minutes. They ride on. You feel safer knowing they are out here.' },
    { text: 'Be polite but keep your cart closed — you have nothing to hide but value your privacy', dc: 11, ok: 'The sergeant seems satisfied with your answers. He asks if you have seen any trouble on the trail. You have not. He tips his hat and rides on.', bad: "Your reticence annoys the sergeant. He orders a brief search of your cart. They find nothing wrong — but they do find the shaganappi grease and spend twenty minutes asking about your wheel maintenance. You lose the better part of an hour. The squealing of your cart has clearly carried further than you thought.", time: 1 },
    { text: 'Engage them in conversation and try to learn the trail conditions ahead', dc: 12, ok: 'The sergeant is happy to talk. He tells you the Touchwood Hills pass is clear but there has been trouble with mosquitoes near Qu'Appelle. He warns that a brigade ahead lost two mules to alkali water. Useful intelligence.', bad: 'The sergeant is curt. He tells you nothing useful beyond "the trail is the trail." His men glance at your cart but do not stop. They ride on without another word.', crew: 'rested' }
  ]
}
```

IMPORTANT: If the player's squealLevel >= 2, the NWMP should have a higher detection chance. This is already handled by the existing engine — squeal just affects how far sound travels. The event text can reference the squeal:

For the `nwmp_patrol` event text, use this alternative version that references squeal:

```javascript
{
  id: 'nwmp_patrol',
  text: "Three red-coated riders appear on the ridge ahead, moving toward you across the prairie. North West Mounted Police — their scarlet tunics vivid against the brown grass.\n\nThe Carlton Trail is under their jurisdiction. They patrol regularly between the forts — checking for smuggling, enforcing order.\n\nThe sergeant raises a hand. You stop.<span id='nwmp-squeal-hint'></span>",
  choices: [ /* same choices as above */ ]
}
```

### 2. Spy / Informer Encounter (uplands terrain)

Source: Ouimet/Dumont (1885) — "'D'où venez-vous, dit Dumont? — Il n'est pas nécessaire que je vous le dise. — Êtes-vous avec nous? — Je ne veux pas me mettre dans de mauvais draps.'" (Where do you come from? / I don't need to tell you. / Are you with us? / I don't want to get into trouble.)

Add this as a NEW event in EVENTS.uplands array:

```javascript
{
  id: 'spy_encounter',
  text: "A lone rider approaches from the west — hooded, cautious, his horse picking its way along the ridge. He pulls up when he sees you.\n\n\"Where do you come from?\" you call out.\n\n\"It is not necessary that I tell you.\" His eyes are shadowed under the hood.\n\n\"Are you with us?\" you ask. \"Or against us?\"\n\n\"I do not want to get into bad cloths,\" he says — I don't want to get involved. He watches you for a long moment, then turns his horse and rides west without another word.",
  choices: [
    { text: 'Let him go — not your concern', dc: null, ok: '', bad: '', always: 'You watch the rider disappear into the west. You will never know whose side he was on. The prairie keeps its secrets.' },
    { text: 'Follow at a distance (DC 13)', dc: 13, ok: 'You follow the rider for two miles. He meets with two others at a coulee — a brief exchange, then they scatter in three different directions. Spies, certainly. But for whom? You return to your cart with more questions than answers.', bad: 'The rider spots you following. He doubles back, demands to know why you are trailing him. You make an excuse — looking for lost cattle — but he is not fooled. He rides off warning you not to follow. The rest of the day you feel watched.', crew: 'tired', time: 1 },
    { text: 'Shout after him — demand he identify himself', dc: 10, ok: 'You shout. The rider stops, turns, and studies you. After a long pause, he says: \"I am no one. And you should mind your own business, voyageur.\" He rides on. But you noticed — his horse was fresh. He had not been riding long.', bad: 'The rider spurs his horse and vanishes over the ridge. Your shouting echoes across the empty hills. The crew looks at you like you have lost your mind. Perhaps you have.' }
  ]
}
```

## Steps to Implement

1. Read the file at `/home/bayarddevries/.hermes/projects/metis-trail/dist/index.html`
2. Find the EVENTS.plains array. Add the `nwmp_patrol` event at the end (before the closing `]` of the plains array).
3. Find the EVENTS.uplands array. Add the `spy_encounter` event at the end (before the closing `]` of the uplands array).
4. Write the file.
5. Deploy:
   ```bash
   cd /home/bayarddevries/.hermes/projects/metis-trail
   git add dist/
   git commit -m "Phase B4: NWMP patrol + spy encounter events"
   git subtree split --prefix dist -b gh-pages
   git push origin gh-pages --force
   ```

## Rules
- ONLY add the 2 new events. Do NOT modify any existing events, game logic, CSS, or HTML.
- Each event goes at the END of its terrain array.
- Preserve exact JavaScript syntax.

## Report
After deploying, report:
1. Which events were added and where
2. Line count change
3. Deploy status
