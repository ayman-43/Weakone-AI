// Minimal static server for the site. Correct MIME types matter:
// module JS, fonts, wasm and video break silently if served as octet-stream.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.argv[2]) || 8099;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.wasm': 'application/wasm',
  '.buf': 'application/octet-stream',
  '.bin': 'application/octet-stream',
  '.riv': 'application/octet-stream',
  '.pdf': 'application/pdf',
};

http
  .createServer((req, res) => {
    let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (rel === '/' || rel.endsWith('/')) rel += 'index.html';
    const abs = path.join(ROOT, rel);
    if (!abs.startsWith(ROOT)) {
      res.writeHead(403).end('forbidden');
      return;
    }
    // extensionless routes: /services -> services/index.html (or services.html)
    const candidates = path.extname(abs)
      ? [abs]
      : [abs, path.join(abs, 'index.html'), abs + '.html'];
    const pick = candidates.find((c) => {
      try {
        return fs.statSync(c).isFile();
      } catch {
        return false;
      }
    });
    fs.readFile(pick || abs, (err, buf) => {
      if (err) {
        console.log('404', rel);
        res.writeHead(404, { 'Content-Type': 'text/plain' }).end('not found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(pick || abs).toLowerCase()] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
        // no-store, not no-cache: browsers were serving stale JS chunks after edits,
        // which made the page hydrate with old copy long after the files changed
        'Cache-Control': 'no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      });
      res.end(buf);
    });
  })
  .listen(PORT, () => console.log(`Week One AI serving on http://localhost:${PORT}`));
