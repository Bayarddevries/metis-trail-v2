import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();

console.log('[build] cwd=', cwd);

export async function build() {
  const appRel = 'app.js';
  const outDir = path.join(cwd, 'dist');
  await fs.mkdir(outDir, { recursive: true });

  const appPath = path.join(outDir, appRel);

  const result = await esbuild.build({
    absWorkingDir: cwd,
    entryPoints: [path.join(cwd, 'src/main.js')],
    bundle: true,
    format: 'esm',
    outfile: appPath,
    target: 'es2020',
    minify: false,
    keepNames: true,
    loader: {
      '.png': 'file',
      '.jpg': 'file',
      '.svg': 'file',
    },
    publicPath: '',
  });
  console.log('[build] esbuild done', {
    outputFiles: result.outputFiles?.map(o => o.path),
  });

  const appCode = await fs.readFile(appPath, 'utf8');

  const templatePath = path.join(cwd, 'src', 'template.html');
  const indexPath = path.join(outDir, 'index.html');
  let html = (await fs.readFile(templatePath, 'utf8')) || '';

  html = html.replace(
    /(<script\s+type="module"\s+src=")app\.js(\?v=\d+)?(")/g,
    `$1${appRel}$3`
  );

  // Auto-bump cache-bust version on each build
  const versionMatch = html.match(/app\.js\?v=(\d+)/);
  if (versionMatch) {
    const nextVer = String(Number(versionMatch[1]) + 1);
    html = html.replace(/app\.js\?v=\d+/, `app.js?v=${nextVer}`);
  }

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
  html = html.replace(
    '</body>',
    `${manifest ? '<script>window.__METIS_ASSETS__=' + manifest + ';</script>' : ''}\n</body>`
  );

  await fs.writeFile(indexPath, html);

  const stamp = `\nif (!window.__METIS_BOOTED__) { window.__METIS_BOOTED__ = true; try { bootstrap(); } catch (e) { console.error("Metis boot error:", e); } }`;
  await fs.writeFile(appPath, appCode + stamp);

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
