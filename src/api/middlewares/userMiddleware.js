import db from '../../data/dbConfig';
import {
  isVAlidEmail,
  response400,
  response4xx,
  detectUnknownFields,
  validateRequiredFields,
  validateUniqueField,
  isPositiveInteger,
} from './helpers';

const validateUserDetails = async (req, res, next) => {
  // console.log(req, 'res = ', res, 'next = ', next);
  try {
    const { username, email, password } = req.body;
    let error = null;

    if (password && req.method === 'PUT') {
      return res.status(400).json({
        error:
          'invalid parameter password; please use the password reset endpont',
      });
    }

    error = detectUnknownFields(req, ['username', 'email', 'password']);
    if (error) return response400(res, error);

    error = validateRequiredFields(req, ['username', 'email', 'password']);
    if (error) return response400(res, error);

    if (email && !isVAlidEmail(email)) {
      return response400(res, 'You have entered an invalid email address!');
    }

    if (username) {
      error = await validateUniqueField(req, 'users', 'username');
      if (error) return response4xx(res, 409, error);
    }

    if (email) {
      error = await validateUniqueField(req, 'users', 'email');
      if (error) return response4xx(res, 409, error);
    }

    return next();
  } catch (error) {
    return next(error.message);
  }
};

const validateIdParam = (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isPositiveInteger(id)) {
      const error = `'${id}' is not a valid user id`;
      return res.status(400).json({ error });
    }

    return next();
  } catch (error) {
    return next(error.message);
  }
};

const comfirmIdExistsInTable = (tableName) => async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await db(tableName).where({ id }).first();
    if (!record) {
      const error = `id ${id} not found for any ${tableName}`;
      return res.status(404).json({ error });
    }

    return next();
  } catch (error) {
    return next(error.message);
  }
};

export { validateUserDetails, comfirmIdExistsInTable, validateIdParam };
