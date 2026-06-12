import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();

console.log('[build] cwd=', cwd);

async function download(url, dest) {
  console.log(`[build] fetching ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
}

export async function build() {
  const appRel = 'app.js';
  const outDir = path.join(cwd, 'dist');
  await fs.mkdir(outDir, { recursive: true });

  const appPath = path.join(outDir, appRel);

  await fs.copyFile(
    path.join(cwd, 'node_modules/leaflet/dist/leaflet.css'),
    path.join(outDir, 'leaflet.css')
  );
  await fs.copyFile(
    path.join(cwd, 'node_modules/leaflet/dist/leaflet.js'),
    path.join(outDir, 'leaflet.js')
  );

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
    outputFiles: result.outputFiles?.map((o) => o.path),
  });

  // Auto-bump cache-bust version on each build
  const templatePath = path.join(cwd, 'src', 'template.html');
  const indexPath = path.join(outDir, 'index.html');
  let templateHtml = (await fs.readFile(templatePath, 'utf8')) || '';
  // Use src template as source of truth for dist
  let indexHtml = templateHtml;

  const bumpVersion = (html) => {
    const versionMatch = html.match(/app\.js\?v=(\d+)/);
    if (versionMatch) {
      const nextVer = String(Number(versionMatch[1]) + 1);
      return html.replace(/app\.js\?v=\d+/, `app.js?v=${nextVer}`);
    }
    return html.replace(/(<script\s+type="module"\s+src=")app\.js(")/, '$1app.js?v=1$2');
  };

  templateHtml = bumpVersion(templateHtml);
  indexHtml = bumpVersion(indexHtml);

  const appCode = await fs.readFile(appPath, 'utf8');


  const assetPaths = [...appCode.matchAll(/(?<=[\"'])([^\"']+\.(png|jpg|svg|json))(?=["'])/g)].map((m) => m[1]);
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
  indexHtml = indexHtml.replace(
    '</body>',
    `${manifest ? '<script>window.__METIS_ASSETS__=' + manifest + ';</script>' : ''}\n</body>`
  );
  templateHtml = templateHtml.replace(
    '</body>',
    `${manifest ? '<script>window.__METIS_ASSETS__=' + manifest + ';</script>' : ''}\n</body>`
  );

  await fs.writeFile(indexPath, indexHtml);
  // NOTE: Do NOT write templateHtml back to src/template.html — it's the source of truth.
  // Only dist/index.html gets the manifest injection.

  const stamp = `\nif (!window.__METIS_BOOTED__) { window.__METIS_BOOTED__ = true; try { bootstrap(); } catch (e) { console.error("Metis boot error:", e); } }`;
  await fs.writeFile(appPath, appCode + stamp);

  if (assets.length) {
    await fs.writeFile(path.join(outDir, 'manifest.json'), manifest);
  }
  // Copy art assets referenced in CSS
  const artSrc = path.join(cwd, 'art', 'campfire.png');
  const artDst = path.join(outDir, 'campfire.png');
  try { await fs.copyFile(artSrc, artDst); } catch(_) {}
  return outDir;
}

try {
  await build();
} catch (err) {
  console.error(err);
  process.exit(1);
}
