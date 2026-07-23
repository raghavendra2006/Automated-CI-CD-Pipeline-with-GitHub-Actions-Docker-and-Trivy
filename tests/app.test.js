// Verify API routes using Supertest
const request = require('supertest');
const app = require('../src/app');

describe('API Endpoints', () => {
  it('should return a healthy status on /health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'UP');
  });

  it('should return data array on /api/data', async () => {
    const res = await request(app).get('/api/data');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toEqual(['item1', 'item2']);
  });

  it('should return version info on /api/version', async () => {
    const res = await request(app).get('/api/version');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('version', '1.0.0');
    expect(res.body).toHaveProperty('name', 'ci-cd-pipeline-app');
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown');
    expect(res.statusCode).toEqual(404);
  });
});
