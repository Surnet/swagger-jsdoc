const request = require('supertest');
const { app, server } = require('./app');
const swaggerSpec = require('./swagger-spec.json');

describe('Example application written in swagger specification (v2)', () => {
  it('should be healthy', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should return the expected specification', async () => {
    const response = await request(app).get('/api-docs.json');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(swaggerSpec);
  });

  afterAll(() => {
    server.close();
  });
});
