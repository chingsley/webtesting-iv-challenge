import express from 'express';

const router = express.Router();

router.post('/login', (req, res, next) => {
  res.send('login user');
});

router.post('/logout', (req, res, next) => {
  res.send('logout user');
});

export default router;
