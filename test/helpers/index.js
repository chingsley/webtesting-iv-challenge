import db from '../../src/data/dbConfig';

export const resetDB = async () => {
  await db.raw('SET FOREIGN_KEY_CHECKS = 0');
  await db.raw('TRUNCATE users');
  await db.raw('TRUNCATE roles');
  await db.raw('TRUNCATE user_roles');
  await db.raw('SET FOREIGN_KEY_CHECKS = 1');
};
