import express from 'express';
import userRouter from './userRouter';
import authRouter from './authRouter';

const router = express.Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);

export default router;
