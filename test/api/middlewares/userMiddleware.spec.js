import supertest from 'supertest';
import db from '../../../src/data/dbConfig';
import server from '../../../src/api/server';
import { sampleRoles, sampleUsers } from '../../data/';

const app = supertest(server);

describe('userMiddleware', () => {
  beforeEach(async () => {
    await db.raw('SET FOREIGN_KEY_CHECKS = 0');
    await db.raw('TRUNCATE users');
    await db.raw('TRUNCATE roles');
    await db.raw('SET FOREIGN_KEY_CHECKS = 1');
    await db('roles').insert(sampleRoles);
  });

  describe('validateInputUser', () => {
    it('returns 400 error message for missing field(s)', async (done) => {
      const res = await app
        .post('/api/users/register')
        .send({ email: 'ching@gmail.com' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: 'missing field(s): username and password',
      });
      done();
    });
    it('returns 400 error message for empty field(s)', async (done) => {
      const res = await app
        .post('/api/users/register')
        .send({ email: 'ching@gmail.com', username: '', password: '' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: 'missing field(s): username and password',
      });
      done();
    });

    it('returns 400 error message for invalid email address', async (done) => {
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

    it('returns 400 error message for unique violation of username', async (done) => {
      // await app.post('/api/users/register').send(sampleUsers[0]);
      await db('users').insert(sampleUsers[0]);
      const res = await app
        .post('/api/users/register')
        .send({ ...sampleUsers[1], username: sampleUsers[0].username });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: `${sampleUsers[0].username} has been taken, please choose another username.`,
      });
      done();
    });

    it('returns 400 error message for unique violation of email', async (done) => {
      await db('users').insert(sampleUsers[0]);
      const res = await app
        .post('/api/users/register')
        .send({ ...sampleUsers[1], email: sampleUsers[0].email });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: `${sampleUsers[0].email} has been taken, please choose another email.`,
      });
      done();
    });

    it('returns 400 error if there are unknown fields during POST', async (done) => {
      const res = await app.post('/api/users/register').send({
        emai: 'kc@gmail.com',
        usname: 'kc',
        password: 'testing',
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        'error',
        'unknown field(s): emai, usname'
      );
      done();
    });

    it('returns 400 error if there are unknown fields during PUT', async (done) => {
      const [id] = await db('users').insert(sampleUsers[0]);
      const res = await app.put(`/api/users/${id}`).send({
        emai: 'kc@gmail.com',
        usname: 'kc',
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        'error',
        'unknown field(s): emai, usname'
      );
      done();
    });
  });
});
