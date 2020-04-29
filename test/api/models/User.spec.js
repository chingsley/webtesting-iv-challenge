import {
  findAll,
  findById,
  findByField,
  add,
  edit,
  remove,
} from '../../../src/api/models/User';
import db from '../../../src/data/dbConfig';
import {
  bulkUsers,
  singleUser,
  SAMPLE_BCRYPT_VALUE,
} from '../../data/sample.users';

describe('User model', () => {
  beforeEach(async () => {
    await db.raw('SET FOREIGN_KEY_CHECKS = 0');
    // await db.raw('TRUNCATE users');
    await db('users').truncate();
    await db.raw('SET FOREIGN_KEY_CHECKS = 1');
  });

  describe('findAll', () => {
    it('returns all users in the db', async (done) => {
      await db('users').insert(bulkUsers);
      const users = await findAll();
      const [jon, arya, sansa] = users;
      // console.log(jon);
      expect(users).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            username: 'jon',
            email: 'jon@stark.com',
            password: SAMPLE_BCRYPT_VALUE,
          }),
          expect.objectContaining({
            id: 3,
            username: 'sansa',
            email: 'sansa@stark.com',
            password: SAMPLE_BCRYPT_VALUE,
          }),
          expect.objectContaining({
            id: 2,
            username: 'arya',
            email: 'arya@stark.com',
            password: SAMPLE_BCRYPT_VALUE,
          }),
        ])
      );
      done();
    });
  });

  describe('findById', () => {
    it('returns the user with the marching id', async (done) => {
      await db('users').insert(bulkUsers);
      const user = await findById(1);
      // expect(user.id).toBe(1);
      expect(user).toEqual(expect.objectContaining({ id: 1 }));
      done();
    });
  });

  describe('findById', () => {
    it('returns the user with the marching field value', async (done) => {
      await db('users').insert(bulkUsers);
      const user = await findByField({ email: 'jon@stark.com' });
      expect(user).toEqual(
        expect.objectContaining({
          email: 'jon@stark.com',
        })
      );
      done();
    });
  });

  describe('add', () => {
    it('adds a new user to the db', async (done) => {
      const [id] = await add(singleUser);
      const newUser = await db('users').where({ id }).first();
      expect(newUser).toEqual(
        expect.objectContaining({
          username: 'mua',
          email: 'muagua@gmail.com',
          password: SAMPLE_BCRYPT_VALUE,
        })
      );
      done();
    });

    it('adds bulk users to the db', async (done) => {
      const [id] = await add(bulkUsers);
      const newlyCreatedUsers = await db('users');
      expect(newlyCreatedUsers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            username: 'jon',
            email: 'jon@stark.com',
            password: SAMPLE_BCRYPT_VALUE,
          }),
          expect.objectContaining({
            id: 2,
            username: 'arya',
            email: 'arya@stark.com',
            password: SAMPLE_BCRYPT_VALUE,
          }),
          expect.objectContaining({
            id: 3,
            username: 'sansa',
            email: 'sansa@stark.com',
            password: SAMPLE_BCRYPT_VALUE,
          }),
        ])
      );
      done();
    });
  });

  describe('edit', () => {
    it('updates the user that matches the specified id', async (done) => {
      await db('users').insert(bulkUsers);
      await edit(2, { username: 'Arya Stark' });
      const editedUser = await db('users').where({ id: 2 }).first();
      expect(editedUser).toEqual(
        expect.objectContaining({ id: 2, username: 'Arya Stark' })
      );
      done();
    });
  });

  describe('remove', () => {
    it('removes from the db the user that matches the specifed id', async (done) => {
      await db('users').insert(bulkUsers);
      await remove(2);
      const arya = await db('users').where({ id: 2 }).first();
      expect(arya).toBe(undefined);
      done();
    });
  });
});
