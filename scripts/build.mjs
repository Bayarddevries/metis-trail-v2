export async function build() {
  const esbuild = (await import('esbuild')).default;
  const fs = await import('fs');
  const path = await import('path');
  const outDir = path.resolve('dist');

  await fs.promises.mkdir(outDir, { recursive: true });

  const cwd = process.cwd();
  await esbuild.build({
    absWorkingDir: cwd,
    entryPoints: [path.join(cwd, 'src/main.js')],
    bundle: true,
    format: 'esm',
    outfile: path.join(outDir, 'app.js'),
    target: ['es2020'],
  });

  const appCode = await fs.promises.readFile(path.join(outDir, 'app.js'), 'utf8');
  const assetPaths = await findAssets(appCode);

  const assets = [];
  for (const p of assetPaths) {
    const abs = path.resolve(p);
    if (await fs.promises.stat(abs).catch(() => null)) {
      assets.push({ path: abs, name: path.basename(abs) });
    }
  }

  const manifest = JSON.stringify({ assets }, null, 2);

  let html = await fs.promises.readFile(path.join(cwd, 'src/template.html'), 'utf8');
  html = html.replace('</body>', `${manifest ? `<script>window.__METIS_ASSETS__=${manifest};</script>` : ''}\n</body>`);

  await fs.promises.writeFile(path.join(outDir, 'index.html'), html);
  await fs.promises.writeFile(path.join(outDir, 'app.js'), appCode + '\nif (!window.__METIS_BOOTED__) { window.__METIS_BOOTED__ = true; try { bootstrap(); } catch (e) { console.error("Metis boot error:", e); } }');

  await fs.promises.writeFile(path.join(outDir, 'index.html'), html);
  if (manifest) {
    await fs.promises.writeFile(path.join(outDir, 'manifest.json'), manifest);
  }
  return outDir;
}

async function findAssets(code) {
  const matches = new Set();
  const re = /['"]([^'"]*\.(png|jpg|svg|json))['"]/g;
  let m;
  while ((m = re.exec(code))) {
    matches.add(m[1]);
  }
  return Array.from(matches);
}

try {
  await build();
} catch (err) {
  console.error(err);
  process.exit(1);
}
