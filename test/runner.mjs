
import { createGame } from './engine.mjs';
const game = createGame(42);
game.travelOneDay();
const s = game.stateSummary();
console.log(JSON.stringify({ day: s.day, food: s.food, wear: s.wear, crew: s.crew, node: s.node }));
