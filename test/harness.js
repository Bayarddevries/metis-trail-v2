#!/usr/bin/env node
/**
 * Cart Trail — Headless Test Harness
 * 
 * Usage:
 *   node harness.js                    # run 1 game, print result
 *   node harness.js --batch 100        # run 100 games, print stats
 *   node harness.js --batch 100 --seed 42  # deterministic batch
 *   node harness.js --sweep           # parameter sweep for balance tuning
 *   node harness.js --json            # output JSON (for piping)
 * 
 * Strategies:
 *   always-travel    — always travel, never camp
 *   rest-when-tired  — rest at settlements when crew is tired
 *   conservative     — camp every 3 days, rest at every settlement
 *   random           — random choices
 */

const fs = require('fs');
const path = require('path');

// ── Load engine ──────────────────────────────────────────────────
const enginePath = path.join(__dirname, 'cart-trail-engine.js');
const engineCode = fs.readFileSync(enginePath, 'utf-8');

// Execute engine code in a sandbox that exposes createGame
const sandbox = { console, Math, JSON, Array, Object, String, Number, Date, RegExp, Error };
const vm = require('vm');
const context = vm.createContext(sandbox);
vm.runInContext(engineCode, context);

const createGame = sandbox.createGame;

// ── Strategies ────────────────────────────────────────────────────
const STRATEGIES = {
  'always-travel': (game) => {
    const actions = game.getAvailableActions();
    if (actions.type === 'travel') return 'travel';
    if (actions.type === 'settlement') return 'continue';
    if (actions.type === 'event') return 0; // first choice
  },
  'rest-when-tired': (game) => {
    const actions = game.getAvailableActions();
    if (actions.type === 'travel') {
      const s = game.stateSummary();
      if (s.crew === 'tired' || s.crew === 'exhausted') return 'camp';
      return 'travel';
    }
    if (actions.type === 'settlement') {
      const s = game.stateSummary();
      if (s.crew !== 'rested') return 'rest';
      if (s.wear >= 2) return 'repair';
      return 'continue';
    }
    if (actions.type === 'event') return 0;
  },
  'conservative': (game) => {
    const actions = game.getAvailableActions();
    if (actions.type === 'travel') {
      const s = game.stateSummary();
      if (s.crew !== 'rested') return 'camp';
      if (s.food <= 5) return 'camp';
      return 'travel';
    }
    if (actions.type === 'settlement') {
      const s = game.stateSummary();
      if (s.wear >= 2) return 'repair';
      if (s.crew !== 'rested') return 'rest';
      return 'continue';
    }
    if (actions.type === 'event') {
      // Pick the safer option (lower DC or no-DC)
      const ev = game.getPendingEvent();
      let bestIdx = 0;
      let bestScore = Infinity;
      ev.choices.forEach((ch, i) => {
        const score = ch.dc === null ? 0 : ch.dc;
        if (score < bestScore) { bestScore = score; bestIdx = i; }
      });
      return bestIdx;
    }
  },
  'random': (game) => {
    const actions = game.getAvailableActions();
    if (actions.type === 'travel') return Math.random() < 0.8 ? 'travel' : 'camp';
    if (actions.type === 'settlement') {
      const idx = Math.floor(Math.random() * actions.actions.length);
      return actions.actions[idx];
    }
    if (actions.type === 'event') {
      const ev = game.getPendingEvent();
      return Math.floor(Math.random() * ev.choices.length);
    }
  }
};

// ── Run a single game ─────────────────────────────────────────────
function runGame(seed, strategyName) {
  const strategy = STRATEGIES[strategyName] || STRATEGIES['rest-when-tired'];
  const game = createGame(seed);
  const log = [];
  let turns = 0;
  const maxTurns = 200; // safety limit

  while (!game.isOver() && turns < maxTurns) {
    turns++;
    const action = strategy(game);
    const actions = game.getAvailableActions();

    if (actions.type === 'travel') {
      if (action === 'camp') {
        game.makeCamp();
        log.push({ turn: turns, action: 'camp' });
      } else {
        game.travelOneDay();
        log.push({ turn: turns, action: 'travel' });
      }
    } else if (actions.type === 'settlement') {
      game.settlementAction(action);
      log.push({ turn: turns, action: 'settlement', choice: action });
    } else if (actions.type === 'event') {
      const result = game.chooseEventChoice(action);
      log.push({ turn: turns, action: 'event', choice: action, result: result?.[0]?.result?.success });
    }
  }

  const summary = game.stateSummary();
  return {
    seed,
    strategy: strategyName,
    won: game.hasWon(),
    over: game.isOver(),
    turns,
    days: summary.day,
    score: game.getScore(),
    food: summary.food,
    wear: summary.wear,
    crew: summary.crew,
    node: summary.node,
    totalNodes: summary.totalNodes,
    location: summary.location,
    failureReason: !game.hasWon() && game.isOver()
      ? (summary.food <= 0 ? 'starvation' : summary.wear >= 4 ? 'cart_breakdown' : summary.month >= 11 ? 'winter' : 'unknown')
      : null,
    log: log.slice(-10) // last 10 turns for debugging
  };
}

// ── Batch run ─────────────────────────────────────────────────────
function batchRun(count, strategy, seed) {
  const results = [];
  for (let i = 0; i < count; i++) {
    const s = seed !== undefined ? seed + i : undefined;
    results.push(runGame(s, strategy));
  }
  return results;
}

// ── Stats ─────────────────────────────────────────────────────────
function computeStats(results) {
  const wins = results.filter(r => r.won);
  const losses = results.filter(r => !r.won);
  const avgDays = results.reduce((s, r) => s + r.days, 0) / results.length;
  const avgScore = wins.length > 0 ? wins.reduce((s, r) => s + r.score, 0) / wins.length : 0;
  const avgTurns = results.reduce((s, r) => s + r.turns, 0) / results.length;

  const failureReasons = {};
  losses.forEach(r => {
    const reason = r.failureReason || 'unknown';
    failureReasons[reason] = (failureReasons[reason] || 0) + 1;
  });

  const avgNode = results.reduce((s, r) => s + r.node, 0) / results.length;

  return {
    total: results.length,
    wins: wins.length,
    losses: losses.length,
    winRate: (wins.length / results.length * 100).toFixed(1) + '%',
    avgDays: avgDays.toFixed(1),
    avgScore: avgScore.toFixed(0),
    avgTurns: avgTurns.toFixed(1),
    avgNode: avgNode.toFixed(1),
    failureReasons
  };
}

// ── Parameter sweep ───────────────────────────────────────────────
function sweep() {
  console.log('\n═══ Parameter Sweep ═══\n');
  const strategies = Object.keys(STRATEGIES);
  const counts = [50];

  for (const strat of strategies) {
    for (const count of counts) {
      const results = batchRun(count, strat);
      const stats = computeStats(results);
      console.log(`Strategy: ${strat}`);
      console.log(`  Win rate: ${stats.winRate} (${stats.wins}/${stats.total})`);
      console.log(`  Avg days: ${stats.avgDays} | Avg turns: ${stats.avgTurns}`);
      console.log(`  Avg score (wins): ${stats.avgScore}`);
      console.log(`  Avg node reached: ${stats.avgNode}`);
      console.log(`  Failures: ${JSON.stringify(stats.failureReasons)}`);
      console.log('');
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────
function main() {
  const args = process.argv.slice(2);
  const getArg = (name) => {
    const idx = args.indexOf(name);
    return idx >= 0 ? args[idx + 1] : undefined;
  };

  if (args.includes('--sweep')) {
    sweep();
    return;
  }

  const batchCount = parseInt(getArg('--batch')) || 0;
  const seed = getArg('--seed') ? parseInt(getArg('--seed')) : undefined;
  const strategy = getArg('--strategy') || 'rest-when-tired';
  const json = args.includes('--json');

  if (batchCount > 0) {
    const results = batchRun(batchCount, strategy, seed);
    const stats = computeStats(results);

    if (json) {
      console.log(JSON.stringify({ stats, results }, null, 2));
    } else {
      console.log(`\n═══ Batch Run: ${batchCount} games (${strategy}) ═══\n`);
      console.log(`Win rate:     ${stats.winRate} (${stats.wins} wins, ${stats.losses} losses)`);
      console.log(`Avg days:     ${stats.avgDays}`);
      console.log(`Avg turns:    ${stats.avgTurns}`);
      console.log(`Avg score:    ${stats.avgScore} (wins only)`);
      console.log(`Avg node:     ${stats.avgNode} / 14`);
      console.log(`Failures:     ${JSON.stringify(stats.failureReasons)}`);
      console.log('');

      // Show a few sample games
      console.log('── Sample games ──');
      const samples = [results[0], results[Math.floor(results.length / 2)], results[results.length - 1]];
      samples.forEach((r, i) => {
        console.log(`  [${i + 1}] ${r.won ? 'WIN' : 'LOSS'} | Day ${r.days} | ${r.location} | Score: ${r.score} | ${r.failureReason || ''}`);
      });
    }
  } else {
    // Single game
    const result = runGame(seed, strategy);
    if (json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(`\n═══ Single Game (${strategy}) ═══\n`);
      console.log(`Result:       ${result.won ? '✅ WIN' : '❌ LOSS'}`);
      console.log(`Days:         ${result.days}`);
      console.log(`Turns:        ${result.turns}`);
      console.log(`Score:        ${result.score}`);
      console.log(`Final loc:    ${result.location} (node ${result.node}/${result.totalNodes})`);
      console.log(`Food:         ${result.food} | Wear: ${result.wear} | Crew: ${result.crew}`);
      if (result.failureReason) console.log(`Failed by:    ${result.failureReason}`);
      console.log(`\n── Last 10 turns ──`);
      result.log.forEach(l => {
        console.log(`  Turn ${l.turn}: ${l.action}${l.choice ? ' → ' + l.choice : ''}${l.result !== undefined ? ' (' + (l.result ? 'ok' : 'fail') + ')' : ''}`);
      });
    }
  }
}

main();
