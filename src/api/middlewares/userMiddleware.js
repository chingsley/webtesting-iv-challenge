import {
  listItems,
  isVAlidEmail,
  response400,
  isDuplicateEmail,
  isDuplicateUsername,
} from './helpers';

const validateInputUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const requiredFields = ['username', 'email', 'password'];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return response400(res, `missing field(s): ${listItems(missingFields)}`);
    }
    if (!isVAlidEmail(email)) {
      return response400(res, 'You have entered an invalid email address!');
    }

    if (await isDuplicateUsername(username)) {
      return response400(
        res,
        `${username} has been taken, please choose another username.`
      );
    }

    if (await isDuplicateEmail(email)) {
      return response400(
        res,
        `${email} has been taken, please choose another email.`
      );
    }

    return next();
  } catch (error) {
    return next(erro.message);
  }
};

export { validateInputUser };
