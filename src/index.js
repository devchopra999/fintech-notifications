require('dotenv').config();
const express = require('express');
const { sequelize } = require('./db');
require('./models/notification');
const notificationRoutes = require('./routes/notifications');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    console.log(`[fintech-notifications] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - startedAt}ms)`);
  });
  next();
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'fintech-notifications' }));

app.get('/health/ready', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ready' });
  } catch (err) {
    res.status(503).json({ status: 'not-ready', error: err.message });
  }
});

app.use('/', notificationRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: err.message } });
});

const port = process.env.PORT || 4004;

async function start() {
  console.log('fintech-notifications starting up');
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(port, () => console.log(`fintech-notifications listening on :${port}`));
}

start().catch((err) => {
  console.error('failed to start fintech-notifications', err);
  process.exit(1);
});
