import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..', 'dist');

const mimes = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };

const server = createServer((req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let rel = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    if (!rel || rel.endsWith('/')) rel += 'index.html';
    const p = path.join(root, rel);
    const ext = path.extname(p);
    const type = mimes[ext] || 'application/octet-stream';
    if (!existsSync(p)) { res.statusCode = 404; res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    res.end(readFileSync(p));
  } catch (e) {
    res.statusCode = 500; res.end('Server error');
  }
});

const port = Number(process.argv[2]) || 4173;
server.listen(port, () => console.log(`preview http://localhost:${port}`));
