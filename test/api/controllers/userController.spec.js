import bcrypt from 'bcryptjs';
import supertest from 'supertest';
import db from '../../../src/data/dbConfig';
import { bulkRoles } from '../../data/sample.roles';
import { bulkUsers } from '../../data/sample.users';
import server from '../../../src/api/server';

const app = supertest(server);

jest.mock('bcryptjs');
const SAMPLE_BCRYPT_VALUE = '$209892##348928982080';
bcrypt.hashSync = jest.fn(() => SAMPLE_BCRYPT_VALUE);

describe('userController', () => {
  beforeEach(async () => {
    await db.raw('SET FOREIGN_KEY_CHECKS = 0');
    await db.raw('TRUNCATE users');
    await db.raw('TRUNCATE roles');
    await db.raw('TRUNCATE user_roles');
    await db.raw('SET FOREIGN_KEY_CHECKS = 1');
    await db('roles').insert(bulkRoles);
  });

  describe('registerUser', () => {
    it('returns status 201 for successful registeration', async (done) => {
      const res = await app.post('/api/users/register').send(bulkUsers[0]);
      expect(res.status).toBe(201);
      done();
    });

    it('returns a success message in the response body', async (done) => {
      const res = await app.post('/api/users/register').send(bulkUsers[0]);
      expect(res.body.message).toEqual('registration completed successfully!');
      done();
    });

    it('returns the new user in the response body', async (done) => {
      const res = await app.post('/api/users/register').send(bulkUsers[0]);
      const insertedUser = await db('users')
        .select(['id', 'username', 'email', 'password'])
        .where({ email: bulkUsers[0].email })
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
      const res = await app.post('/api/users/register').send(bulkUsers[0]);
      expect(res.body.newUser).toHaveProperty('roles');
      expect(res.body.newUser.roles[0]).toHaveProperty('role', 'user');
      done();
    });
  });
});
