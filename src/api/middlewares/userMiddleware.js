import {
  isVAlidEmail,
  response400,
  response4xx,
  detectUnknownFields,
  validateRequiredFields,
  validateUniqueField,
  validateIdParam,
} from './helpers';

const validateInputUser = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    let error = null;

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

const validateUserIdParam = async (req, res, next) => {
  const { status, error } = await validateIdParam(req, 'users', 'user');
  if (error) return response4xx(res, status, error);
};

export { validateInputUser, validateUserIdParam };
