import express from 'express';
// import { registerUser } from '../controllers/userController';
// import { validateInputUser } from '../middlewares/userMiddleware';
import User from '../models/User';

const router = express.Router();

// router.post('/register', validateInputUser, registerUser);

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'user list...' });
});

router.get('/:id', async (req, res, next) => {
  let user = await User.query()
    .where('username', 'like', '%jon%')
    // .where({ id: req.params.id })
    .withGraphFetched('[roles]');

  // console.log(JSON.stringify(user, null, 2));
  res.status(200).json(user);
});

router.put('/:id', (req, res, next) => {
  res.status(200).json({ message: 'successful update' });
});

router.delete('/:id', (req, res, next) => {
  res.status(200).json({ message: 'user removed' });
});

export default router;
