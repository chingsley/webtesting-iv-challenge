import express from 'express';
import userRouter from './userRouter';
// import authRouter from './authRouter';
// import rolesRouter from './rolesRouter';

const router = express.Router();

router.use('/users', userRouter);
// router.use('/auth', authRouter);
// router.use('/roles', rolesRouter);

export default router;
