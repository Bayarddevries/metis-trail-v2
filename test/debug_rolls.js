
const fs = require('fs');
const code = fs.readFileSync('/home/bayarddevries/.hermes/projects/metis-trail/cart-trail-engine.js', 'utf-8');
const sandbox = {};
const script = new Function('sandbox', code + '; return { createGame, travelOneDay, makeCamp, settlementAction, chooseEventChoice, stateSummary, isOver, hasWon, getScore, getAvailableActions, getPendingEvent };');
const G = new Function(code)();
const game = G.createGame(42);
const avail = G.getAvailableActions();
console.log(JSON.stringify({ ok: true, state: G.stateSummary(), avail: avail.type }));
