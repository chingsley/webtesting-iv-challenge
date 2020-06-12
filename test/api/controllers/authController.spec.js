import supertest from 'supertest';
import { resetDB } from '../../helpers';
import server from '../../../src/api/server';
import db from '../../../src/data/dbConfig';
import { sampleUsers } from '../../data';
import { loginUser } from '../../../src/api/controllers/authController';

const app = supertest(server);

describe('authController', () => {
  describe('loginUser', () => {
    describe('try', () => {
      it('successfully loggs in user', async (done) => {
        try {
          await resetDB();
          await db('users').insert(sampleUsers[0]);
          const res = await app.post('/api/auth/login').send({
            email: sampleUsers[0].email,
            password: 'testing',
          });
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('message', 'login successful');
          done();
        } catch (e) {
          done(e);
        }
      });
      it('returns 401 if email is not found', async (done) => {
        try {
          await resetDB();
          // await db('users').insert(sampleUsers[0]);
          const res = await app.post('/api/auth/login').send({
            email: sampleUsers[0].email,
            password: 'testing',
          });
          expect(res.status).toBe(401);
          expect(res.body).toHaveProperty('error', 'invalid email/password');
          done();
        } catch (e) {
          done(e);
        }
      });
      it('returns 401 if password is incorrect', async (done) => {
        try {
          await resetDB();
          await db('users').insert(sampleUsers[0]);
          const res = await app.post('/api/auth/login').send({
            email: sampleUsers[0].email,
            password: 'wrong_password',
          });
          expect(res.status).toBe(401);
          expect(res.body).toHaveProperty('error', 'invalid email/password');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
    describe('catch', () => {
      it('returns 500 errors in the catch block', async (done) => {
        try {
          const req = { body: undefined };
          const res = { body: {} };
          const next = jest.fn();
          await loginUser(req, res, next);
          expect(next).toHaveBeenCalled();
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
});
