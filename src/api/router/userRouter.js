import express from 'express';

import { validateInputUser } from '../middlewares/userMiddleware';
import { registerUser } from '../controllers/userController';

const router = express.Router();

router.post('/register', validateInputUser, registerUser);

export default router;
