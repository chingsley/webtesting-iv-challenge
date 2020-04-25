import { getAll } from '../../src/api/models/User';
import db from '../../src/data/dbConfig';
import bcrypt from 'bcryptjs';

describe('geAll', () => {
  beforeEach(async () => {
    await db.raw('SET FOREIGN_KEY_CHECKS = 0');
    // await db.raw('TRUNCATE users');
    await db('users').truncate();
    await db.raw('SET FOREIGN_KEY_CHECKS = 1');
  });
  it('returns all users in the db', async (done) => {
    await db('users').insert([
      {
        username: 'jon',
        email: 'jon@stark.com',
        password: bcrypt.hashSync('stark'),
      },
      {
        username: 'arya',
        email: 'arya@stark.com',
        password: bcrypt.hashSync('stark'),
      },
      {
        username: 'sansa',
        email: 'sansa@stark.com',
        password: bcrypt.hashSync('stark'),
      },
    ]);
    const users = await getAll();
    expect(users.length).toBe(3);
    // console.log(users);
    done();
  });
});
