import supertest from 'supertest';
import db from '../../../src/data/dbConfig';
import User from '../../../src/api/models/User';
import { sampleRoles, sampleUsers } from '../../data';
import server from '../../../src/api/server';
import { deleteRole } from '../../../src/api/controllers/roleController';

const app = supertest(server);

describe('roleController', () => {
  let userId, roleId;
  beforeEach(async () => {
    await db.raw('SET FOREIGN_KEY_CHECKS = 0');
    await db.raw('TRUNCATE users');
    await db.raw('TRUNCATE roles');
    await db.raw('TRUNCATE user_roles');
    await db.raw('SET FOREIGN_KEY_CHECKS = 1');
    [roleId] = await db('roles').insert(sampleRoles[0]);
    [userId] = await db('users').insert(sampleUsers[1]);
  });

  describe('assignRole', () => {
    describe('try', () => {
      it('successfully assigns the specified role to the speicified user', async (done) => {
        const res = await app.post('/api/roles').send({ userId, roleId });
        const { user, message } = res.body;
        const responseMsg = 'role assignment is successful';
        expect(message).toEqual(responseMsg);
        const arrUserRolesIds = user.roles.map((role) => role.id);
        expect(arrUserRolesIds.includes(roleId)).toBe(true);
        expect(user.id).toEqual(userId);

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
          const res = await app.post('/api/roles').send({ userId, roleId });
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
  describe('deleteRole', () => {
    describe('try', () => {
      it('successfully deletes a user-role association from the user_roles table', async (done) => {
        try {
          await app.post('/api/roles').send({ userId, roleId });
          let userRole = await db('user_roles').where({ userId, roleId }); // e.g where userId=1 annd roleId=2
          expect(userRole.length).toEqual(1);
          const res = await app.delete(`/api/roles/${userId}/${roleId}`);
          userRole = await db('user_roles').where({ userId, roleId });
          expect(userRole.length).toEqual(0);
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
          await deleteRole(req, res, next);
          expect(next).toHaveBeenCalled();
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
});
