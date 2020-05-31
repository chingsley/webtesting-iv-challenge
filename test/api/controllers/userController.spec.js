import supertest from 'supertest';
import db from '../../../src/data/dbConfig';
import { sampleRoles, sampleUsers, SAMPLE_BCRYPT_VALUE } from '../../data';
import server from '../../../src/api/server';
import User from '../../../src/api/models/User';
import { updateUser } from '../../../src/api/controllers/userController';

const app = supertest(server);

describe('userController', () => {
  beforeEach(async () => {
    await db.raw('SET FOREIGN_KEY_CHECKS = 0');
    await db.raw('TRUNCATE users');
    await db.raw('TRUNCATE roles');
    await db.raw('TRUNCATE user_roles');
    await db.raw('SET FOREIGN_KEY_CHECKS = 1');
    await db('roles').insert(sampleRoles);
  });

  describe('registerUser', () => {
    describe('try', () => {
      it('returns status 201 for successful registeration', async (done) => {
        const res = await app.post('/api/users/register').send(sampleUsers[0]);
        expect(res.status).toBe(201);
        done();
      });

      it('returns a success message in the response body', async (done) => {
        const res = await app.post('/api/users/register').send(sampleUsers[0]);
        expect(res.body.message).toEqual(
          'registration completed successfully!'
        );
        done();
      });

      it('returns the new user in the response body', async (done) => {
        const res = await app.post('/api/users/register').send(sampleUsers[0]);
        const insertedUser = await db('users')
          .select(['id', 'username', 'email', 'password'])
          .where({ email: sampleUsers[0].email })
          .first();
        const { user } = res.body;
        expect(user).toHaveProperty('username', insertedUser.username);
        expect(user).toHaveProperty('email', insertedUser.email);
        done();
      });

      it('registers all users with the default role of "user" ', async (done) => {
        const res = await app.post('/api/users/register').send(sampleUsers[0]);
        const { user } = res.body;
        expect(user).toHaveProperty('roles');
        expect(user.roles[0]).toHaveProperty('role', 'user');
        done();
      });
    });
    describe('catch', () => {
      it('returns 500 for errors thrown in the try block', async (done) => {
        try {
          const originalImplementation = User.query;
          User.query = jest.fn().mockImplementation(() => {
            throw new Error('bummer!!!');
          });
          const res = await app
            .post('/api/users/register')
            .send(sampleUsers[1]);
          expect(res.status).toBe(500);
          expect(res.body).toHaveProperty('error', 'bummer!!!');
          User.query = originalImplementation;
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  describe('updateUser', () => {
    describe('try', () => {
      it('returns a success message on successful update', async (done) => {
        const [id] = await db('users').insert(sampleUsers[1]);
        const res = await app
          .put(`/api/users/${id}`)
          .send({ username: 'jonStark' });
        expect(res.body).toHaveProperty('message', 'user updated successfully');
        done();
      });
      it('returns the updated user in the response body', async (done) => {
        const [id] = await db('users').insert(sampleUsers[1]);
        const {
          body: { user },
        } = await app.put(`/api/users/${id}`).send({ username: 'jonStark' });
        expect(user).toHaveProperty('id', id);
        expect(user).toHaveProperty('username', 'jonStark');
        expect(user).toHaveProperty('email', sampleUsers[1].email);
        done();
      });
    });
    describe('catch', () => {
      it('returns 500 for errors thrown in the try block', async (done) => {
        try {
          const req = { params: undefined };
          const res = { body: {}, status: jest.fn() };
          const next = jest.fn();
          await updateUser(req, res, next);
          expect(next).toHaveBeenCalled();
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
});
