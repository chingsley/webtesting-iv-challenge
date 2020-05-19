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
        error: 'username and password must have a value and cannot be null',
      });
      done();
    });
    it('returns 400 error message for empty or null field(s)', async (done) => {
      const res = await app
        .post('/api/users/register')
        .send({ email: 'ching@gmail.com', username: '', password: null });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: 'username and password must have a value and cannot be null',
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

    it('returns 409 error message for unique violation of username during POST', async (done) => {
      await db('users').insert(sampleUsers[0]);
      const res = await app
        .post('/api/users/register')
        .send({ ...sampleUsers[1], username: sampleUsers[0].username });
      expect(res.status).toBe(409);
      expect(res.body).toEqual({
        error: `a record with username ${sampleUsers[0].username} already exists. Duplicate value is not allowed for username`,
      });
      done();
    });

    it('returns 409 error for unique violation of username during PUT', async (done) => {
      await db('users').insert(sampleUsers[0]);
      const res = await app
        .put('/api/users/register')
        .send({ username: sampleUsers[0].username });
      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty(
        'error',
        `a record with username ${sampleUsers[0].username} already exists. Duplicate value is not allowed for username`
      );
      done();
    });

    it('returns 409 error message for unique violation of email during POST', async (done) => {
      await db('users').insert(sampleUsers[0]);
      const res = await app
        .post('/api/users/register')
        .send({ ...sampleUsers[1], email: sampleUsers[0].email });
      expect(res.status).toBe(409);
      expect(res.body).toEqual({
        error: `a record with email ${sampleUsers[0].email} already exists. Duplicate value is not allowed for email`,
      });
      done();
    });

    it('returns 409 error for unique violation of email during PUT', async (done) => {
      await db('users').insert(sampleUsers[0]);
      const res = await app
        .put('/api/users/register')
        .send({ email: sampleUsers[0].email });
      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty(
        'error',
        `a record with email ${sampleUsers[0].email} already exists. Duplicate value is not allowed for email`
      );
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
