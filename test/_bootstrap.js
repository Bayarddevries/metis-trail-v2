
const fs = require('fs');
const vm = require('vm');
const engineCode = fs.readFileSync('/home/bayarddevries/.hermes/projects/metis-trail/test/cart-trail-engine.js', 'utf-8');
const sandbox = {
  console, Math, JSON, Array, Object, String, Number, Date, RegExp, Error,
  parseInt, parseFloat, NaN, Infinity
};
const context = vm.createContext(sandbox);
vm.runInContext(engineCode, context);
const createGame = context.createGame;

// Read commands from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  const lines = input.trim().split('\n');
  const results = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const cmd = JSON.parse(line);
    try {
      if (cmd.action === 'run') {
        const game = createGame(cmd.seed || null);
        const turns = [];
        let safety = 0;
        while (!game.isOver() && safety < 300) {
          safety++;
          const avail = game.getAvailableActions();
          let choice;
          if (avail.type === 'travel') {
            if (cmd.strategy === 'conservative' && (game.stateSummary().crew !== 'rested' || game.stateSummary().food <= 4)) {
              choice = 'camp';
              game.makeCamp();
            } else {
              choice = 'travel';
              game.travelOneDay();
            }
          } else if (avail.type === 'settlement') {
            if (cmd.strategy === 'conservative') {
              const s = game.stateSummary();
              if (s.wear >= 2 && avail.actions.includes('repair')) choice = 'repair';
              else if (s.crew !== 'rested' && avail.actions.includes('rest')) choice = 'rest';
              else if (avail.actions.includes('trade') && s.food <= 6) choice = 'trade';
              else choice = 'continue';
            } else {
              choice = avail.actions[0] || 'continue';
            }
            game.settlementAction(choice);
          } else if (avail.type === 'event') {
            const ev = game.getPendingEvent();
            if (ev) {
              // Strategy: pick safest option (lowest DC or no DC)
              let bestIdx = 0;
              let bestScore = 999;
              ev.choices.forEach((ch, i) => {
                const score = ch.dc === null ? 0 : ch.dc;
                if (score < bestScore) { bestScore = score; bestIdx = i; }
              });
              choice = bestIdx;
              game.chooseEventChoice(bestIdx);
            }
          }
          turns.push({ a: avail.type, c: choice });
        }
        const s = game.stateSummary();
        results.push({
          won: game.hasWon(),
          over: game.isOver(),
          days: s.day,
          turns: safety,
          score: game.getScore(),
          food: s.food,
          wear: s.wear,
          crew: s.crew,
          node: s.node,
          location: s.location,
          reason: !game.hasWon() && game.isOver()
            ? (s.food <= 0 ? 'starvation' : s.wear >= 4 ? 'breakdown' : s.month >= 11 ? 'winter' : 'unknown')
            : null
        });
      }
    } catch(e) {
      results.push({ error: e.message, stack: e.stack });
    }
  }
  console.log(JSON.stringify(results));
});
