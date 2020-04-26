import supertest from 'supertest';
import server from '../src/api/server';

const app = supertest(server);

describe('server', () => {
  it('responds with 200 OK for GET /', async (done) => {
    const res = await app.get('/');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ server: 'running...' });
    done();
  });
  it('returns 404 for unknown endpoints', async (done) => {
    const res = await app.get('/unknown_route');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'unknown endpoint' });
    done();
  });
});
