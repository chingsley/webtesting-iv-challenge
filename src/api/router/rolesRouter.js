import express from 'express';
import db from '../../data/dbConfig';
import { createRole } from '../models/UserRole';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const roles = await db('roles');
  return res.status(200).json({ roles });
});

router.post('/assign_role', (req, res, next) => {
  createRole(req.body)
    .then((result) => {
      console.log(result);
      res.status(201).json({ message: 'role created.' });
    })
    .catch((err) => {
      if (err.message.match(/duplicate entry/i)) {
        return res.status(400).json({
          error: 'the specified user already has that role',
        });
      }
      res.status(500).json({ error: err.message });
    });
});

export default router;
