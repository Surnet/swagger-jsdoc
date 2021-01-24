import { readFile } from 'fs/promises';
import request from 'supertest';
import { app, server } from './app.js';

const swaggerSpec = JSON.parse(
  await readFile(new URL('./swagger-spec.json', import.meta.url))
);

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
