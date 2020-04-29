import supertest from 'supertest';
import db from '../../../src/data/dbConfig';
import server from '../../../src/api/server';

const app = supertest(server);

describe('userMiddleware', () => {
  beforeEach(async () => {
    await db.raw('SET FOREIGN_KEY_CHECKS = 0');
    await db.raw('TRUNCATE users');
    await db.raw('SET FOREIGN_KEY_CHECKS = 1');
  });

  describe('validateInputUser', () => {
    it('returns error object with status 400 for missing field(s)', async (done) => {
      const res = await app
        .post('/api/users/register')
        .send({ email: 'ching@gmail.com' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: 'missing field(s): username and password',
      });
      done();
    });
    it('returns error object with status 400 for empty field(s)', async (done) => {
      const res = await app
        .post('/api/users/register')
        .send({ email: 'ching@gmail.com', username: '', password: '' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: 'missing field(s): username and password',
      });
      done();
    });

    it('returns error object with status 400 for invalid email address', async (done) => {
      const res = await app.post('/api/users/register').send({
        email: 'mysite@.org.org',
        username: 'chingsley',
        password: 'mua',
      });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: 'You have entered an invalid email address!',
      });
      done();
    });
  });
});
