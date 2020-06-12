import express from 'express';
import db from '../../data/dbConfig';
import { assignRole, deleteRole } from '../controllers/roleController';
import {
  validateRoleAssigment,
  validateDataTypeUserRoleIds,
  comfrimUserRoleExists,
} from '../middlewares/roleMiddleware';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const roles = await db('roles');
  return res.status(200).json({ roles });
});

router.post('/', validateRoleAssigment, assignRole);

router.delete(
  '/:userId/:roleId',
  validateDataTypeUserRoleIds,
  comfrimUserRoleExists,
  deleteRole
);

export default router;
