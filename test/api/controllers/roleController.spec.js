import supertest from 'supertest';
import db from '../../../src/data/dbConfig';
import { sampleRoles, sampleUsers } from '../../data';
import server from '../../../src/api/server';

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
    [userId] = await db('users').insert(sampleUsers[0]);
  });

  describe('assignRole', () => {
    it('successfully assigns the specified role to the speicified user', async (done) => {
      const res = await app.post('/api/roles').send({ userId, roleId });
      expect(res.body).toHaveProperty(
        'message',
        'role assignment is successful'
      );
      const { user } = res.body;
      const arrUserRolesIds = user.roles.map((role) => role.id);
      expect(arrUserRolesIds.includes(roleId)).toBe(true);
      expect(user.id).toEqual(userId);

      done();
    });
  });
});
