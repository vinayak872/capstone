const express = require('express');

function createApp() {
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello from CLOUD-05! Version 1');
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  createApp().listen(PORT, () => console.log(`Running on port ${PORT}`));
}

module.exports = { createApp };
