const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { createApp } = require('./index');

test('health endpoint returns status ok', async () => {
  const app = createApp();
  const server = app.listen(0);
  const { port } = server.address();

  const data = await new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}/health`, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });

  assert.strictEqual(data.status, 'ok');
  server.close();
});
