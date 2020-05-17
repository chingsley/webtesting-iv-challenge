import supertest from 'supertest';
import server from '../../../src/api/server';
import { sampleRoles, sampleUsers } from '../../data';
import db from '../../../src/data/dbConfig';

const app = supertest(server);

describe.skip('userRouter', () => {
  beforeEach(async () => {
    await db.raw('SET FOREIGN_KEY_CHECKS = 0');
    await db.raw('TRUNCATE users');
    await db.raw('TRUNCATE roles');
    await db.raw('SET FOREIGN_KEY_CHECKS = 1');
    await db('roles').insert(sampleRoles);
  });

  describe('POST /api/users/register', () => {
    it('responds with 201 for successful registration', async (done) => {
      const res = await app.post('/api/users/register').send(singleUser2);
      expect(res.status).toBe(201);
      done();
    });
  });

  describe('PUT /api/users/:id', () => {
    it('responds with 200 OK, for successful profile update', async (done) => {
      const [id] = await db('users').insert(sampleUsers[0]);
      const res = await app.put(`/api/users/${id}`).send({ name: 'jon snow' });
      expect(res.status).toBe(200);
      done();
    });
  });

  describe.skip('GET /api/users', () => {
    it('responds with 200 OK for successful get', async (done) => {
      const res = await app.get('/api/users');
      expect(res.status).toBe(200);
      done();
    });
  });

  describe.skip('GET /api/users/:id', () => {
    it('responds with 200 OK for successful get', async (done) => {
      const res = await app.get('/api/users/1');
      expect(res.status).toBe(200);
      done();
    });
  });

  describe.skip('DELETE /api/users/:id', () => {
    it('responds with 200 OK for successful user account delete', async (done) => {
      const res = await app.delete('/api/users/1').send(singleUser2);
      expect(res.status).toBe(200);
      done();
    });
  });
});
