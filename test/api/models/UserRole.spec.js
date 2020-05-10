import { createRole } from '../../../src/api/models/UserRole';
import { bulkUsers } from '../../data/sample.users';
import { bulkRoles } from '../../data/sample.roles';
import db from '../../../src/data/dbConfig';

describe.skip('UserRole model', () => {
  beforeEach(async () => {
    await db.raw('SET FOREIGN_KEY_CHECKS = 0');
    await db('user_roles').truncate();
    await db('roles').truncate();
    await db('users').truncate();
    await db.raw('SET FOREIGN_KEY_CHECKS = 1');
  });
  describe('createRole', () => {
    it('successfully creates user roles', async (done) => {
      await db('users').insert(bulkUsers);
      await db('roles').insert(bulkRoles);
      await createRole({ userId: 1, roleId: 1 });
      const userRole = await db('user_roles').where({ id: 1 }).first();
      expect(userRole).toEqual({ id: 1, userId: 1, roleId: 1 });
      done();
    });
  });
});
