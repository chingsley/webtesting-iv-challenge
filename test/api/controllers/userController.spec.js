import supertest from 'supertest';
import db from '../../../src/data/dbConfig';
import { sampleRoles, sampleUsers, SAMPLE_BCRYPT_VALUE } from '../../data';
import server from '../../../src/api/server';

// import bcrypt from 'bcryptjs';
// jest.mock('bcryptjs');
// const SAMPLE_BCRYPT_VALUE = '$209892##348928982080';
// bcrypt.hashSync = jest.fn(() => SAMPLE_BCRYPT_VALUE);

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
    it('returns status 201 for successful registeration', async (done) => {
      const res = await app.post('/api/users/register').send(sampleUsers[0]);
      expect(res.status).toBe(201);
      done();
    });

    it('returns a success message in the response body', async (done) => {
      const res = await app.post('/api/users/register').send(sampleUsers[0]);
      expect(res.body.message).toEqual('registration completed successfully!');
      done();
    });

    it('returns the new user in the response body', async (done) => {
      const res = await app.post('/api/users/register').send(sampleUsers[0]);
      const insertedUser = await db('users')
        .select(['id', 'username', 'email', 'password'])
        .where({ email: sampleUsers[0].email })
        .first();
      expect(res.body.newUser).toHaveProperty(
        'username',
        insertedUser.username
      );
      expect(res.body.newUser).toHaveProperty('email', insertedUser.email);
      expect(res.body.newUser).toHaveProperty('password', SAMPLE_BCRYPT_VALUE);
      done();
    });

    it('registers all users with the default role of "user" ', async (done) => {
      const res = await app.post('/api/users/register').send(sampleUsers[0]);
      expect(res.body.newUser).toHaveProperty('roles');
      expect(res.body.newUser.roles[0]).toHaveProperty('role', 'user');
      done();
    });
  });

  describe('updateUser', () => {
    it('returns a success message on successful update', async (done) => {
      const [id] = await db('users').insert(sampleUsers[0]);
      const res = await app
        .put(`/api/users/${id}`)
        .send({ username: 'jonStark' });
      expect(res.body).toHaveProperty('message', 'user updated successfully');
      done();
    });
  });

  describe('updateUser', () => {
    it('returns the updated user in the response body', async (done) => {
      const [id] = await db('users').insert(sampleUsers[0]);
      const {
        body: { user },
      } = await app.put(`/api/users/${id}`).send({ username: 'jonStark' });
      expect(user).toHaveProperty('id', id);
      expect(user).toHaveProperty('username', 'jonStark');
      expect(user).toHaveProperty('email', sampleUsers[0].email);
      done();
    });
  });
});
