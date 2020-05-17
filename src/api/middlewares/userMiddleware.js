import { listItems, isVAlidEmail, response400 } from './helpers';

import db from '../../data/dbConfig';

const validateInputUser = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const columnNames = ['username', 'email', 'password'];
    const unknownFields = Object.keys(req.body).filter(
      (key) => !columnNames.includes(key)
    );
    if (unknownFields.length > 0) {
      return res.status(400).json({
        error: `unknown field(s): ${unknownFields.join(', ')}`,
      });
    }
    const requiredFields = ['username', 'email', 'password'];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0 && req.method === 'POST') {
      return response400(res, `missing field(s): ${listItems(missingFields)}`);
    }
    if (email && !isVAlidEmail(email)) {
      return response400(res, 'You have entered an invalid email address!');
    }

    if (username) {
      const user = await db('users').where({ username }).first();
      if (user && user.id !== req.params.id) {
        return response400(
          res,
          `${username} has been taken, please choose another username.`
        );
      }
    }

    if (email) {
      const user = await db('users').where({ email }).first();
      if (user && user.id !== req.params.id) {
        return response400(
          res,
          `${email} has been taken, please choose another email.`
        );
      }
    }

    return next();
  } catch (error) {
    return next(error.message);
  }
};

export { validateInputUser };
