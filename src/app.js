// Setup Express app without starting the server (useful for testing)
const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Service is healthy' });
});

app.get('/api/data', (req, res) => {
  res.status(200).json({ data: ['item1', 'item2'] });
});

module.exports = app;
