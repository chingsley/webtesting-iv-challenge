import {
  findAll,
  findById,
  findByField,
  add,
  edit,
  remove,
} from '../../../src/api/models/Role';
import db from '../../../src/data/dbConfig';
import { bulkRoles, singleUserRole } from '../../data/sample.roles';

describe.skip('Role model', () => {
  beforeEach(async () => {
    await db.raw('SET FOREIGN_KEY_CHECKS = 0');
    await db('users').truncate(); // delete all users to avoid foreign key restriction when trying to delete a role
    await db('roles').truncate();
    await db.raw('SET FOREIGN_KEY_CHECKS = 1');
  });

  describe('findAll', () => {
    it('returns arrray of all available roles', async (done) => {
      await db('roles').insert(bulkRoles);
      const roles = await findAll();
      expect(roles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            role: 'super admin',
          }),
          expect.objectContaining({
            role: 'admin',
          }),
          expect.objectContaining({
            role: 'user',
          }),
        ])
      );
      done();
    });
  });

  describe('findById', () => {
    it('returns the specified role', async (done) => {
      await db('roles').insert(bulkRoles);
      const role = await findById(1);
      expect(role).toEqual({
        id: 1,
        role: 'super admin',
      });
      done();
    });
  });

  describe('findByField', () => {
    it('returns the roled matching the specified field object', async (done) => {
      await db('roles').insert(bulkRoles);
      const role = await findByField({ role: 'admin' });
      expect(role).toEqual({
        id: 2,
        role: 'admin',
      });
      done();
    });
  });

  describe('add', () => {
    it('adds roles to the roles table', async (done) => {
      await add(bulkRoles);
      const roles = await db('roles');
      expect(roles.length).toBe(bulkRoles.length);
      done();
    });
  });

  describe('edit', () => {
    it('edits the role whose id is specified', async (done) => {
      await db('roles').insert(bulkRoles);
      await edit(1, { role: 'super user' });
      const { role } = await db('roles').where({ id: 1 }).first();
      expect(role).toBe('super user');
      done();
    });
  });

  describe('remove', () => {
    it('removes the role whose id is specified', async (done) => {
      await db('roles').insert(bulkRoles);
      await db.raw('SET FOREIGN_KEY_CHECKS = 0');
      await remove(1);
      const role = await db('roles').where({ id: 1 }).first();
      expect(role).toBe(undefined);
      await db.raw('SET FOREIGN_KEY_CHECKS = 1');
      done();
    });
  });
});
