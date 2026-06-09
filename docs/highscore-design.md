# Highscore / Leaderboard System — Design Doc

## Goal
Add a Firebase-backed leaderboard that stores every game result, shows top 10 all-time scores, and shows personal play history. Player name collected at game start (intro overlay). Works offline-first — local fallback if Firebase unreachable.

## Architecture

### Firebase
- **Firestore** (not Realtime DB) — better querying for top-N leaderboard
- **Open-write rules** — anyone can post scores, no auth required for writes
- All data stored in a single `scores` collection

### Player Name
- Added to intro overlay: text input field below the tutorial text, above "Begin Journey"
- Name stored in `localStorage` key `metisPlayerName`, persists across sessions
- Used in narrative text in future (separate feature)
- If blank, defaults to "Traveller"

### Score Document Fields (all stored)
```js
{
  name: string,           // player-entered name
  score: number,          // final score from calcScore()
  day: number,            // days on trail
  wear: number,           // final cart wear
  food: number,           // final food remaining
  crew: string,           // final crew state
  morale: number,         // final morale
  won: boolean,           // victory or defeat
  endReason: string,      // 'victory', 'starvation', 'cart_failure', 'abandoned', 'no_trade'
  nodes: number,          // furthest node index reached
  tradesMade: number,     // number of trades executed
  camps: number,          // number of camps made
  eventsResolved: number, // events encountered
  weather: string,        // weather at game end
  cartItems: number,      // remaining item count
  tradeGoods: number,     // trade goods remaining
  distance: number,       // nodes traveled
  date: timestamp,        // Firestore serverTimestamp
  seed: number            // game seed for reproducibility
}
```

### Firestore Security Rules
```
match /scores/{doc} {
  allow read: if true;
  allow create: if request.resource.data.score is number
                && request.resource.data.score >= 0
                && request.resource.data.name is string;
}
```

### Leaderboard Display
Two tabs in end-game overlay:
1. **Hall of Fame** — top 10 scores (query: `orderBy('score', 'desc').limit(10)`). Always sorted by score descending.
2. **My Scores** — last 20 scores matching localStorage `metisPlayerName` (query: `where('name', '==', name).orderBy('date', 'desc').limit(20)`). Client-side sortable via dropdown.

Each entry shows: name, score, date, won/lost icon, days, endReason

#### My Scores Sort Options
A `<select>` dropdown above the personal scores list. Client-side sort (no extra Firestore queries):

| Label | Field | Direction | Flavor |
|---|---|---|---|
| Highest Score | `score` | desc | Classic |
| Longest Journey | `day` | desc | "Most days survived" |
| Most Battered | `wear` | desc | "Battered but survived" |
| Leanest Run | `food` | asc | "Most resourceful" |
| Best Trader | `tradesMade` | desc | "Most trades" |
| Furthest Traveled | `nodes` | desc | "Most ground covered" |
| Most Eventful | `eventsResolved` | desc | "Most events" |
| Happiest Crew | `morale` | desc | "Best morale at end" |

Default: Highest Score. Sorting is instant — just reorders the already-fetched array.

### Offline Handling
- Firebase SDK handles offline writes natively (queued locally, syncs when online)
- **Local fallback**: if Firestore unavailable after 5s timeout, scores saved to `localStorage` key `metisLocalScores` (array of score objects)
- On next page load, check `metisLocalScores` for unsynced entries and push to Firestore

## Files Changed

| File | Change |
|---|---|
| `package.json` | Add `firebase` dependency |
| `src/firebase.js` | Firebase init, Firestore export, saveScore(), getTopScores(), getMyScores() |
| `src/systems/engine.js` | Add `getScoreData()` method — returns all score fields for Firebase |
| `src/main.js` | Intro overlay: add name input + localStorage read. End overlay: add leaderboard tabs |
| `src/template.html` | Leaderboard overlay HTML + CSS. Name input in intro overlay |
| `CHANGELOG.md` | v69 entry |
| `HANDOFF.md` | Session summary |
| `TODO.md` | Mark #12 done |
| `ISSUES.md` | Close #12 |
| `AGENTS.md` | Add pitfall if needed |

## New Engine API Methods

| Method | Returns | Purpose |
|---|---|---|
| `game.getScoreData()` | Object with all score fields (score, day, wear, food, crew, morale, won, endReason, nodes, tradesMade, camps, eventsResolved, weather, cartItems, tradeGoods, distance, seed) | Called by main.js to build score document for Firebase |

## Intro Overlay Changes
- Add `<input>` field with placeholder "Enter your name, traveller..."
- Pre-fill from `localStorage.metisPlayerName` if exists
- On "Begin Journey" click, save to `localStorage`
- Styled to match existing intro aesthetic

## End Overlay Changes
- Below score breakdown, add leaderboard section with two tabs
- Tab 1: "Hall of Fame" — top 10
- Tab 2: "My Scores" — personal history
- Loading spinner while fetching from Firebase
- Error state: "Leaderboard unavailable — playing offline"
- Score auto-saved on game end (no user action required)

## Build Impact
- Firebase modular SDK v9+ — tree-shakeable, only imports firestore + core
- Bundle size: ~90KB gzipped (Firestore SDK)
- Firebase config values hardcoded (public config — this is standard for Firebase web apps)
- No env vars needed — config is public by design

## Verification
1. Build succeeds with `bun scripts/build.mjs`
2. Intro overlay shows name input
3. Name persists in localStorage across reloads
4. End game → score saved to Firestore (check console for doc ID)
5. Leaderboard tab shows top 10
6. My Scores tab shows personal history
7. 200-run sim still works (no engine changes that affect gameplay)

## Win Rate Impact
None — this is a post-game display feature. No gameplay changes.
