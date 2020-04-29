import express from 'express';
import { registerUser } from '../controllers/userController';
import { validateInputUser } from '../middlewares/userMiddleware';

const router = express.Router();

router.post('/register', validateInputUser, registerUser);

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'user list...' });
});

router.get('/:id', (req, res, next) => {
  res.send('get one user successful');
});

router.put('/:id', (req, res, next) => {
  res.status(200).json({ message: 'successful update' });
});

router.delete('/:id', (req, res, next) => {
  res.status(200).json({ message: 'user removed' });
});

export default router;
