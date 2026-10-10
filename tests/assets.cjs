// Memeriksa pemuatan HTTP lokal; tidak menguji decoding/render browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname,'..');
const prefix = '/Augmented_Reality_UTSnicole/';
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const assets = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m => m[1]).filter(x => !/^https?:/.test(x));
const server = http.createServer((req,res) => {
  const relative = decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(prefix.length);
  const file = path.resolve(root,relative || 'index.html');
  if (!req.url.startsWith(prefix) || !file.startsWith(root + path.sep) || !fs.existsSync(file)) {
    res.writeHead(404); return res.end();
  }
  res.setHeader('Content-Type',file.endsWith('.jpg') ? 'image/jpeg' : file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html');
  res.end(fs.readFileSync(file));
});
(async () => {
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  try {
    const base = `http://127.0.0.1:${server.address().port}${prefix}`;
    for (const asset of ['',...assets]) {
      const response = await fetch(new URL(asset,base));
      assert.equal(response.status,200,asset);
      const body = Buffer.from(await response.arrayBuffer());
      assert.deepEqual(body,fs.readFileSync(path.join(root,asset || 'index.html')));
      if (asset.endsWith('.jpg')) {
        assert.match(response.headers.get('content-type'),/image\/jpeg/);
        assert.equal(body.readUInt16BE(0),0xffd8,'Bukan JPEG: ' + asset);
      }
      console.log('HTTP 200, byte sesuai:',asset || 'index.html');
    }
  } finally { server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
