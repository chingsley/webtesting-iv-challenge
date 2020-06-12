import express from 'express';
import { loginUser } from '../controllers/authController';
import { validateLoginDetails } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', validateLoginDetails, loginUser);

router.post('/logout', (req, res, next) => {
  res.send('logout user');
});

export default router;
