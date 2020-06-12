import supertest from 'supertest';
import db from '../../../src/data/dbConfig';
import server from '../../../src/api/server';
import { sampleRoles, sampleUsers } from '../../data/';
import {
  validateIdParam,
  validateUserDetails,
  comfirmIdExistsInTable,
} from '../../../src/api/middlewares/userMiddleware';
const app = supertest(server);

describe('userMiddleware', () => {
  beforeEach(async () => {
    await db.raw('SET FOREIGN_KEY_CHECKS = 0');
    await db.raw('TRUNCATE users');
    await db.raw('TRUNCATE roles');
    await db.raw('SET FOREIGN_KEY_CHECKS = 1');
    await db('roles').insert(sampleRoles);
  });

  describe('validateUserDetails', () => {
    describe('try', () => {
      it('returns 400 error message for missing field(s)', async (done) => {
        try {
          const res = await app
            .post('/api/users/register')
            .send({ email: 'ching@gmail.com' });
          expect(res.status).toBe(400);
          expect(res.body).toEqual({
            error: 'username and password must have a value and cannot be null',
          });
          done();
        } catch (e) {
          done(e);
        }
      });
      it('returns 400 error message for empty or null field(s)', async (done) => {
        try {
          const res = await app
            .post('/api/users/register')
            .send({ email: 'ching@gmail.com', username: '', password: null });
          expect(res.status).toBe(400);
          expect(res.body).toEqual({
            error: 'username and password must have a value and cannot be null',
          });
          done();
        } catch (e) {
          done(e);
        }
      });

      it('returns 400 error message for invalid email address', async (done) => {
        try {
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
        } catch (e) {
          done(e);
        }
      });

      it('returns 409 error message for unique violation of username during POST', async (done) => {
        try {
          await db('users').insert(sampleUsers[0]);
          const res = await app
            .post('/api/users/register')
            .send({ ...sampleUsers[1], username: sampleUsers[0].username });
          expect(res.status).toBe(409);
          expect(res.body).toEqual({
            error: `a record with username ${sampleUsers[0].username} already exists. Duplicate value is not allowed for username`,
          });
          done();
        } catch (e) {
          done(e);
        }
      });

      it('returns 409 error for unique violation of username during PUT', async (done) => {
        try {
          const [user1, user2] = sampleUsers;
          await db('users').insert(user1);
          const [user2Id] = await db('users').insert(user2);
          const res = await app
            .put(`/api/users/${user2Id}`)
            .send({ username: user1.username });
          expect(res.status).toBe(409);
          expect(res.body).toHaveProperty(
            'error',
            `a record with username ${sampleUsers[0].username} already exists. Duplicate value is not allowed for username`
          );
          done();
        } catch (e) {
          done(e);
        }
      });

      it('returns 409 error message for unique violation of email during POST', async (done) => {
        try {
          await db('users').insert(sampleUsers[0]);
          const res = await app
            .post('/api/users/register')
            .send({ ...sampleUsers[1], email: sampleUsers[0].email });
          expect(res.status).toBe(409);
          expect(res.body).toEqual({
            error: `a record with email ${sampleUsers[0].email} already exists. Duplicate value is not allowed for email`,
          });
          done();
        } catch (e) {
          done(e);
        }
      });

      it('returns 409 error for unique violation of email during PUT', async (done) => {
        try {
          const [user1, user2] = sampleUsers;
          await db('users').insert(user1);
          const [user2Id] = await db('users').insert(user2);
          const res = await app
            .put(`/api/users/${user2Id}`)
            .send({ email: user1.email });
          expect(res.status).toBe(409);
          expect(res.body).toHaveProperty(
            'error',
            `a record with email ${sampleUsers[0].email} already exists. Duplicate value is not allowed for email`
          );
          done();
        } catch (e) {
          done(e);
        }
      });

      it('returns 400 error if there are unknown fields during POST', async (done) => {
        try {
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
        } catch (e) {
          done(e);
        }
      });

      it('returns 400 error if there are unknown fields during PUT', async (done) => {
        try {
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
        } catch (e) {
          done(e);
        }
      });
      it('returns 400 if password included in user update', async (done) => {
        try {
          const [id] = await db('users').insert(sampleUsers[0]);
          const res = await app.put(`/api/users/${id}`).send({
            email: 'kc@gmail.com',
            username: 'kc',
            password: 'slfjo2092090',
          });
          const errorMsg =
            'invalid parameter password; please use the password reset endpont';
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty('error', errorMsg);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
    describe('catch', () => {
      it('returns 500 for errors caught in the try block', async (done) => {
        try {
          const req = { body: undefined };
          const res = { body: {}, status: jest.fn() };
          const next = jest.fn();
          await validateUserDetails(req, res, next);
          expect(next).toHaveBeenCalled();
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  describe('validateIdParam', () => {
    describe('try', () => {
      it('returns 400 error for non integer data types', async (done) => {
        try {
          const res = await app
            .put('/api/users/xxxx')
            .send({ username: 'king' });
          expect(res.status).toBe(400);
          const errorMsg = "'xxxx' is not a valid user id";
          expect(res.body).toHaveProperty('error', errorMsg);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
    describe('catch', () => {
      it('returns 500 for errors thrown in the try block', async (done) => {
        try {
          const res = { body: {}, status: jest.fn() };
          const req = { params: undefined };
          const next = jest.fn();
          await validateIdParam(res, req, next);
          expect(next).toHaveBeenCalled();
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  describe('comfirmIdExistsInTable', () => {
    describe('try', () => {
      it('returns 400 error for non integer data types', async (done) => {
        try {
          const [id] = await db('users').insert(sampleUsers[1]);
          const res = await app
            .put(`/api/users/${id * 10}`)
            .send({ username: 'king' });
          expect(res.status).toBe(404);
          const errorMsg = 'id 10 not found for any users';
          expect(res.body).toHaveProperty('error', errorMsg);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
    describe('catch', () => {
      it('returns 500 for errors thrown in the try block', async (done) => {
        try {
          const res = { body: {}, status: jest.fn() };
          const req = { params: undefined };
          const next = jest.fn();
          await comfirmIdExistsInTable('users')(res, req, next);
          expect(next).toHaveBeenCalled();
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
});
