import express from 'express';
import db from '../../data/dbConfig';

import {
  validateUserDetails,
  comfirmIdExistsInTable,
  validateIdParam,
} from '../middlewares/userMiddleware';
import { registerUser, updateUser } from '../controllers/userController';

const router = express.Router();

router.post('/register', validateUserDetails, registerUser);
router.put(
  '/:id',
  validateIdParam,
  comfirmIdExistsInTable('users'),
  validateUserDetails,
  updateUser
);
router.get('/', async (req, res, next) => {
  const users = await db('users');
  return res.status(200).json({ users });
});

export default router;
