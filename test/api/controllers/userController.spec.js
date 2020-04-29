import supertest from 'supertest';
import db from '../../../src/data/dbConfig';
import server from '../../../src/api/server';
import { findByField } from '../../../src/api/models/User';

const app = supertest(server);

describe('userController', () => {
  beforeEach(async () => {
    await db.raw('SET FOREIGN_KEY_CHECKS = 0');
    await db.raw('TRUNCATE users');
    await db.raw('SET FOREIGN_KEY_CHECKS = 1');
  });

  describe('registerUser', () => {
    it('returns status 201 for successful registeration', async (done) => {
      const res = await app.post('/api/users/register').send({
        email: 'ching@gmail.com',
        username: 'chingsley',
        password: 'mua',
      });
      expect(res.status).toBe(201);
      done();
    });

    it('returns a response obj with success message and the id of the added user', async (done) => {
      const res = await app.post('/api/users/register').send({
        email: 'ching@gmail.com',
        username: 'chingsley',
        password: 'mua',
      });
      const insertedUser = await findByField({ email: 'ching@gmail.com' });
      expect(res.body).toEqual({
        message: 'user successfully registered.',
        userId: insertedUser.id,
      });
      done();
    });
  });
});
