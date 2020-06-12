import Joi from '@hapi/joi';
import { joiValidate } from './helpers';

export const validateLoginDetails = async (req, res, next) => {
  try {
    const loginSchema = Joi.object({
      email: Joi.string().email().trim().required(),
      password: Joi.string().trim().required(),
    });
    let error = await joiValidate(loginSchema, req);
    if (error) return res.status(400).json({ error });
    return next();
  } catch (error) {
    return next(error.message);
  }
};
