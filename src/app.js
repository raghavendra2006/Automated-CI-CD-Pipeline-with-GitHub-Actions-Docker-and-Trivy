// Setup Express app without starting the server (useful for testing)
const express = require('express');
const helmet = require('helmet');
const app = express();

// Security: Set HTTP response headers to protect against common attacks
app.use(helmet());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Service is healthy' });
});

app.get('/api/data', (req, res) => {
  res.status(200).json({ data: ['item1', 'item2'] });
});

app.get('/api/version', (req, res) => {
  res.status(200).json({ version: '1.0.0', name: 'ci-cd-pipeline-app' });
});

// Global error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
