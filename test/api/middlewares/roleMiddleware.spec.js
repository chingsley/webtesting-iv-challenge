import supertest from 'supertest';
import db from '../../../src/data/dbConfig';
import server from '../../../src/api/server';
import { sampleRoles, sampleUsers } from '../../data';
import {
  validateDataTypeUserRoleIds,
  comfrimUserRoleExists,
} from '../../../src/api/middlewares/roleMiddleware';

const app = supertest(server);

describe('roleMiddleware', () => {
  let users, roles;
  beforeEach(async () => {
    await db.raw('SET FOREIGN_KEY_CHECKS = 0');
    await db.raw('TRUNCATE user_roles');
    await db.raw('TRUNCATE users');
    await db.raw('TRUNCATE roles');
    await db.raw('SET FOREIGN_KEY_CHECKS = 1');

    await db('users').insert(sampleUsers);
    await db('roles').insert(sampleRoles);

    users = await db('users');
    roles = await db('roles');
  });

  describe('validateRoleAssignment', () => {
    it('returns 400 error if userId or roleId or both are not provided', async (done) => {
      const res = await app.post('/api/roles').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        'error',
        'userId and roleId must be provided'
      );
      done();
    });

    it('returns 400 error for non-positive integer values of userId or roleId', async (done) => {
      const res = await app
        .post('/api/roles')
        .send({ userId: -1, roleId: 'text' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        'error',
        'userId and roleId must be positive integer values'
      );
      done();
    });

    it('returns 403 error for duplicate role assignment', async (done) => {
      const userId = users[0].id;
      const roleId = roles[0].id;
      await db('user_roles').insert({ userId, roleId });
      const res = await app.post('/api/roles').send({ userId, roleId });
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty(
        'error',
        `${users[0].username} already has the role of ${roles[0].role}`
      );
      done();
    });

    it('returns 400 error if there is no role matching the specified roleId', async (done) => {
      const userId = users[0].id;
      const roleId = roles[roles.length - 1].id * 10000;
      const res = await app.post('/api/roles').send({ userId, roleId });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        'error',
        `no role matches the roleId of ${roleId}`
      );
      done();
    });

    it('returns 400 error if there is no user matching the specified userId', async (done) => {
      const roleId = roles[0].id;
      const userId = users[users.length - 1].id * 10000;
      const res = await app.post('/api/roles').send({ userId, roleId });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        'error',
        `no user matches the userId of ${userId}`
      );
      done();
    });
  });
  describe('validateDataTypeUserRoleIds', () => {
    describe('try', () => {
      it('returns 400 for non-integer data types', async (done) => {
        try {
          const res = await app.delete('/api/roles/stingId/stringId');
          expect(res.status).toBe(400);
          const errorMsg = 'roleId and userId must be positive integer values';
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
          const req = { params: undefined };
          const res = { body: {}, status: jest.fn() };
          const next = jest.fn();
          await validateDataTypeUserRoleIds(req, res, next);
          expect(next).toHaveBeenCalled();
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  describe('comfrimUserRoleExists', () => {
    describe('try', () => {
      it('returns 404 non-existent user_role', async (done) => {
        try {
          const sortedUsers = users.sort((user1, user2) => user2.id - user1.id);
          const highestUserId = sortedUsers[0].id;
          const sortedRoles = roles.sort((role1, role2) => role2.id - role1.id);
          const highestRoleId = sortedRoles[0].id;
          const res = await app.delete(
            `/api/roles/${highestUserId + 1}/${highestRoleId + 1}`
          );
          expect(res.status).toBe(404);
          const errorMsg = 'no such user-role was exists';
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
          const req = { params: undefined };
          const res = { body: {}, status: jest.fn() };
          const next = jest.fn();
          await comfrimUserRoleExists(req, res, next);
          expect(next).toHaveBeenCalled();
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
});
