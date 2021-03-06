import { response400, isPositiveInteger } from '../middlewares/helpers';
import db from '../../data/dbConfig';
import { restart } from 'nodemon';

const validateRoleAssigment = async (req, res, next) => {
  try {
    const { userId, roleId } = req.body;
    // ensure that req.body has both userId and roleId
    if (!userId || !roleId) {
      return response400(res, 'userId and roleId must be provided');
    }

    // ensure validate data types for userId and roleId
    if (
      !Number.isInteger(Number(userId)) ||
      !Number.isInteger(Number(roleId))
    ) {
      return response400(
        res,
        'userId and roleId must be positive integer values'
      );
    }

    if (userId && roleId) {
      const user = await db('users').where({ id: userId }).first();
      const userRole = await db('roles').where({ id: roleId }).first();

      // ensure there is a role in roles table that matches the roleId
      if (!userRole) {
        return response400(res, `no role matches the roleId of ${roleId}`);
      }

      // ensure there is a user in users table that matches the userId
      if (!user) {
        return response400(res, `no user matches the userId of ${userId}`);
      }

      // enforce unique userId-roleId pair in 'user_roles' table
      const userRoleIdPair = await db('user_roles')
        .where({ userId })
        .andWhere({ roleId })
        .first();
      if (userRoleIdPair) {
        const { username } = user;
        const { role } = userRole;
        return res
          .status(403)
          .json({ error: `${username} already has the role of ${role}` });
      }
    }

    next();
  } catch (error) {
    next(error.message);
  }
};

const validateDataTypeUserRoleIds = (req, res, next) => {
  try {
    const { userId, roleId } = req.params;
    if (!isPositiveInteger(userId) || !isPositiveInteger(roleId)) {
      const error = 'roleId and userId must be positive integer values';
      return res.status(400).json({ error });
    }

    return next();
  } catch (error) {
    return next(error.message);
  }
};

const comfrimUserRoleExists = async (req, res, next) => {
  try {
    const { userId, roleId } = req.params;
    const [userRole] = await db('user_roles').where({ userId, roleId });
    if (!userRole) {
      const error = 'no such user-role was exists';
      return res.status(404).json({ error });
    }

    return next();
  } catch (error) {
    return next(error.message);
  }
};

export {
  validateRoleAssigment,
  validateDataTypeUserRoleIds,
  comfrimUserRoleExists,
};
