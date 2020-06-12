import express from 'express';
import { addNewRestaurant } from '../controllers/restaurantController';

const router = express.Router();

router.post('/', addNewRestaurant);

export default router;
