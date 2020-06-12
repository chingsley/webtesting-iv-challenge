import express from 'express';
import userRouter from './userRouter';
import authrouter from './authRouter';
import rolesRouter from './rolesRouter';
import restaurantRouter from './restaurantRouter';

const router = express.Router();

router.use('/auth', authrouter);
router.use('/users', userRouter);
router.use('/roles', rolesRouter);
router.use('/restaurants', restaurantRouter);

export default router;
