import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();
const BUILDVER = '3';

export async function build() {
  const outDir = path.join(cwd, 'dist');
  await fs.mkdir(outDir, { recursive: true });

  await esbuild.build({
    absWorkingDir: cwd,
    entryPoints: [path.join(cwd, 'src/main.js')],
    bundle: true,
    format: 'esm',
    outfile: path.join(outDir, `app.v${BUILDVER}.js`),
    target: 'es2020',
  });

  // Load template and rewrite bundle reference, preserving leading spaces.
  const templateRel = path.join(cwd, 'src/template.html');
  let html = await fs.readFile(templateRel, 'utf8');
  html = html.replace(
    /(<script\s+src=")app\.v\d+\.js(")/g,
    `$1app.v${BUILDVER}.js$2`
  );

  // Inject asset manifest, if any.
  const appCode = await fs.readFile(path.join(outDir, `app.v${BUILDVER}.js`), 'utf8');
  const assetPaths = [...appCode.matchAll(/(?<=["'])([^"']+\.(png|jpg|svg|json))(?=["'])/g)].map((m) => m[1]);
  const unique = [...new Set(assetPaths)];
  const assets = [];
  for (const p of unique) {
    const abs = path.join(cwd, p);
    await fs.stat(abs).then(
      (s) => assets.push({ path: abs, name: path.basename(abs) }),
      () => undefined
    );
  }
  const manifest = JSON.stringify({ assets }, null, 2);
  html = html.replace('</body>', `${manifest ? '<script>window.__METIS_ASSETS__=' + manifest + ';</script>' : ''}\n</body>`);

  await fs.writeFile(path.join(outDir, 'index.html'), html);

  // Self-boot stamp only (bundle filename already set in template context).
  const stamp = `\nif (!window.__METIS_BOOTED__) { window.__METIS_BOOTED__ = true; try { bootstrap(); } catch (e) { console.error("Metis boot error:", e); } }`;
  await fs.writeFile(path.join(outDir, `app.v${BUILDVER}.js`), appCode + stamp);

  if (assets.length) {
    await fs.writeFile(path.join(outDir, 'manifest.json'), manifest);
  }
  return outDir;
}

try {
  await build();
} catch (err) {
  console.error(err);
  process.exit(1);
}
