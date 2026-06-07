import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();

const args = process.argv.slice(2);
const simCount = args.find(a => !a.startsWith('--')) || '200';
const jsonOut = args.includes('--json');

console.log(`[build-test] Bundling test harness...`);

const outfile = path.join(cwd, 'dist', 'test-simulate.js');

await esbuild.build({
  absWorkingDir: cwd,
  entryPoints: [path.join(cwd, 'tests/simulate-entry.js')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile,
  target: 'node18',
  minify: false,
  keepNames: true,
});

console.log(`[build-test] Bundle written to ${outfile}`);
console.log(`[build-test] Running ${simCount} simulations...\n`);

const runArgs = [simCount];
if (jsonOut) runArgs.push('--json');

try {
  execFileSync('node', [outfile, ...runArgs], { stdio: 'inherit', cwd });
} catch (e) {
  process.exit(e.status || 1);
}
