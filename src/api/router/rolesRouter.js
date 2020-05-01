import express from 'express';
import db from '../../data/dbConfig';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const roles = await db('roles');
  return res.status(200).json({ roles });
});

export default router;
