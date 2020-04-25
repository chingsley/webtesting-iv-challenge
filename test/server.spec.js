import supertest from 'supertest';
import server from '../src/api/server';

const app = supertest(server);

describe('server', () => {
  describe('GET /', () => {
    test('responds with 200 OK', async (done) => {
      const res = await app.get('/');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ server: 'running...' });
      done();
    });
  });
});
