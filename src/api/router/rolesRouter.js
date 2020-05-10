import express from 'express';
import db from '../../data/dbConfig';
import UserRole from '../models/UserRole';
import User from '../models/User';
import { restart } from 'nodemon';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const roles = await db('roles');
  return res.status(200).json({ roles });
});

router.post('/assign_role', async (req, res, next) => {
  const { username, role } = req.body;
  try {
    console.log('', username, role);
    const userId = (await db('users').where({ username }).first()).id;
    const roleId = (await db('roles').where({ role }).first()).id;
    console.log('\n\n', roleId);
    await db('user_roles').insert({ roleId, userId });
    const user = await User.query()
      .findById(userId)
      .withGraphFetched('[roles]');

    return res.status(201).json({ user });
  } catch (err) {
    if (err.message.match(/duplicate entry/i)) {
      return res.status(400).json({
        error: `${username} already has the role of ${role}`,
      });
    }
    next(err.message);
  }
});

router.delete('/:userId/:roleId', async (req, res, next) => {
  console.log(req.params);
  try {
    const { userId, roleId } = req.params;
    const delRes = await db('user_roles').where({ userId, roleId }).del();
    res.status(200).json({ message: 'role successfully removed.' });
  } catch (err) {
    next(err.message);
  }
});

export default router;
