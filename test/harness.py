#!/usr/bin/env python3
"""
Cart Trail — Headless Test Harness (Python)

Runs the game engine in subprocess via a minimal JS bootstrapper that
avoids the Node segfault by loading the engine in chunks.

Usage:
  python3 harness.py                    # single game
  python3 harness.py --batch 100        # batch run with stats
  python3 harness.py --batch 100 --sweep  # parameter sweep
  python3 harness.py --json             # JSON output
"""

import subprocess, json, sys, os, argparse, random, statistics
from collections import Counter
from pathlib import Path

ENGINE_PATH = Path(__file__).parent / 'cart-trail-engine.js'
TEST_DIR = Path(__file__).parent

# ── Minimal JS bootstrapper that loads engine safely ─────────────
# Uses readFile + Function constructor to avoid eval() segfault
BOOTSTRAPPER = r"""
const fs = require('fs');
const vm = require('vm');
const engineCode = fs.readFileSync(ENGINE_PATH, 'utf-8');
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
"""

def run_games_batch(commands, engine_path):
    """Run multiple game commands via a single Node.js subprocess."""
    # Write bootstrapper to temp file
    bootstrap = BOOTSTRAPPER.replace('ENGINE_PATH', f"'{engine_path}'")
    bootstrap_path = TEST_DIR / '_bootstrap.js'
    bootstrap_path.write_text(bootstrap)

    # Feed commands as JSON lines
    input_data = '\n'.join(json.dumps(cmd) for cmd in commands) + '\n'

    try:
        result = subprocess.run(
            ['node', '--max-old-space-size=4096', str(bootstrap_path)],
            input=input_data,
            capture_output=True, text=True,
            timeout=60,
            cwd=str(TEST_DIR)
        )
        if result.returncode != 0:
            # Node segfault — fall back to subprocess-per-game
            if 'Trace/breakpoint' in result.stderr or 'trap' in result.stderr:
                raise RuntimeError('NODE_SEGFAULT')
            raise RuntimeError(f"Node error: {result.stderr[:200]}")

        return json.loads(result.stdout.strip())
    except (json.JSONDecodeError, RuntimeError):
        raise

def run_single_game_fallback(seed, strategy):
    """Fallback: run one game at a time with error handling."""
    bootstrap = BOOTSTRAPPER.replace('ENGINE_PATH', f"'{ENGINE_PATH}'")
    bootstrap_path = TEST_DIR / '_bootstrap.js'
    bootstrap_path.write_text(bootstrap)

    input_data = json.dumps({'action': 'run', 'seed': seed, 'strategy': strategy}) + '\n'

    try:
        result = subprocess.run(
            ['node', '--max-old-space-size=4096', str(bootstrap_path)],
            input=input_data,
            capture_output=True, text=True,
            timeout=15,
            cwd=str(TEST_DIR)
        )

        if result.returncode != 0:
            return {'error': f'node exit {result.returncode}', 'stderr': result.stderr[:100]}

        data = json.loads(result.stdout.strip())
        return data[0] if data else {'error': 'no data'}
    except Exception as e:
        return {'error': str(e)}


def compute_stats(results):
    """Compute aggregate statistics from batch results."""
    valid = [r for r in results if 'error' not in r]
    errors = [r for r in results if 'error' in r]
    wins = [r for r in valid if r.get('won')]
    losses = [r for r in valid if not r.get('won')]

    if not valid:
        return {'error': 'no valid results', 'errors': len(errors)}

    reasons = Counter(r.get('reason') for r in losses)
    win_rate = len(wins) / len(valid) * 100
    avg_days = statistics.mean(r['days'] for r in valid)
    avg_turns = statistics.mean(r['turns'] for r in valid)
    avg_score = statistics.mean(r['score'] for r in wins) if wins else 0
    avg_node = statistics.mean(r['node'] for r in valid)

    return {
        'total': len(results),
        'valid': len(valid),
        'errors': len(errors),
        'wins': len(wins),
        'losses': len(losses),
        'win_rate': f"{win_rate:.1f}%",
        'avg_days': round(avg_days, 1),
        'avg_turns': round(avg_turns, 1),
        'avg_score': round(avg_score),
        'avg_node': round(avg_node, 1),
        'node_max': max(r['node'] for r in valid),
        'failure_reasons': dict(reasons),
        'days_range': [min(r['days'] for r in valid), max(r['days'] for r in valid)],
    }


def sweep():
    """Run parameter sweep across strategies."""
    strategies = ['conservative', 'balanced']
    # Test with starting food variations by using different seeds
    print("\n═══ Parameter Sweep ═══\n")
    print(f"{'Strategy':<15} {'Games':>6} {'Win%':>7} {'Avg Days':>9} {'Avg Score':>10} {'Avg Node':>9} {'Failures'}")
    print("-" * 80)

    for strat in strategies:
        results = []
        for i in range(50):
            r = run_single_game_fallback(random.randint(1, 999999), strat)
            results.append(r)

        stats = compute_stats(results)
        print(f"{strat:<15} {stats['valid']:>6} {stats['win_rate']:>7} {stats['avg_days']:>9} {stats['avg_score']:>10} {stats['avg_node']:>9} {json.dumps(stats['failure_reasons'])}")


def main():
    parser = argparse.ArgumentParser(description='Cart Trail Headless Test Harness')
    parser.add_argument('--batch', type=int, default=0, help='Run N games')
    parser.add_argument('--seed', type=int, help='Starting seed')
    parser.add_argument('--strategy', default='conservative', help='Strategy name')
    parser.add_argument('--json', action='store_true', help='Output JSON')
    parser.add_argument('--sweep', action='store_true', help='Run parameter sweep')
    args = parser.parse_args()

    if args.sweep:
        sweep()
        return

    if args.batch > 0:
        # Batch mode — try batch first, fall back to individual
        commands = [
            {'action': 'run', 'seed': (args.seed or random.randint(1, 999999)) + i, 'strategy': args.strategy}
            for i in range(args.batch)
        ]

        try:
            results = run_games_batch(commands, str(ENGINE_PATH))
        except (RuntimeError, subprocess.TimeoutExpired):
            # Node segfault fallback — run one at a time
            print(f"⚠ Node batch failed, running {args.batch} individual games...", file=sys.stderr)
            results = []
            for i, cmd in enumerate(commands):
                r = run_single_game_fallback(cmd['seed'], cmd['strategy'])
                results.append(r)
                if (i + 1) % 10 == 0:
                    print(f"  ... {i+1}/{args.batch}", file=sys.stderr)
            print("", file=sys.stderr)

        stats = compute_stats(results)

        if args.json:
            print(json.dumps({'stats': stats, 'results': results}, indent=2))
        else:
            print(f"\n═══ Batch Run: {stats['total']} games ({args.strategy}) ═══\n")
            print(f"Win rate:     {stats['win_rate']} ({stats['wins']}W / {stats['losses']}L)")
            print(f"Avg days:     {stats['avg_days']}  (range: {stats['days_range']})")
            print(f"Avg turns:    {stats['avg_turns']}")
            print(f"Avg score:    {stats['avg_score']} (wins only)")
            print(f"Avg node:     {stats['avg_node']} / 14 (max: {stats['node_max']})")
            print(f"Failures:     {json.dumps(stats['failure_reasons'])}")
            if stats.get('errors', 0) > 0:
                print(f"Errors:       {stats['errors']}")
            print("")

            # Sample games
            print("── Sample games ──")
            sample_indices = [0, len(results)//2, -1]
            for i, idx in enumerate(sample_indices):
                r = results[idx]
                status = 'WIN' if r.get('won') else 'LOSS'
                print(f"  [{i+1}] {status} | Day {r.get('days','?')} | {r.get('location','?')} | Score: {r.get('score','?')} | {r.get('reason','') or ''}")
    else:
        # Single game
        seed = args.seed or random.randint(1, 999999)
        result = run_single_game_fallback(seed, args.strategy)

        if args.json:
            print(json.dumps(result, indent=2))
        else:
            print(f"\n═══ Single Game (seed={seed}, {args.strategy}) ═══\n")
            if 'error' in result:
                print(f"ERROR: {result['error']}")
                if result.get('stderr'):
                    print(f"  stderr: {result['stderr']}")
            else:
                print(f"Result:       {'✅ WIN' if result.get('won') else '❌ LOSS'}")
                print(f"Days:         {result.get('days')}")
                print(f"Turns:        {result.get('turns')}")
                print(f"Score:        {result.get('score')}")
                print(f"Location:     {result.get('location')} (node {result.get('node')}/14)")
                print(f"Food:         {result.get('food')} | Wear: {result.get('wear')} | Crew: {result.get('crew')}")
                if result.get('reason'): print(f"Failed by:    {result.get('reason')}")


if __name__ == '__main__':
    main()
