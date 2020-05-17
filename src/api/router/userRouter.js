import express from 'express';
import db from '../../data/dbConfig';

import { validateInputUser } from '../middlewares/userMiddleware';
import { registerUser, updateUser } from '../controllers/userController';

const router = express.Router();

router.post('/register', validateInputUser, registerUser);
router.put('/:id', validateInputUser, updateUser);
router.get('/', async (req, res, next) => {
  const users = await db('users');
  return res.status(200).json({ users });
});

export default router;
