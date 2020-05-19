import express from 'express';
import userRouter from './userRouter';
import rolesRouter from './rolesRouter';
import restaurantRouter from './restaurantRouter';

const router = express.Router();

router.use('/users', userRouter);
router.use('/restaurants', restaurantRouter);
router.use('/roles', rolesRouter);

export default router;
