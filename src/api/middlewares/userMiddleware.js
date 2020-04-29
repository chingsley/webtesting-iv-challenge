import { listItems, isVAlidEmail } from './helpers';

const validateInputUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  const requiredFields = ['username', 'email', 'password'];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `missing field(s): ${listItems(missingFields)}`,
    });
  }
  if (!isVAlidEmail(email)) {
    return res.status(400).json({
      error: 'You have entered an invalid email address!',
    });
  }
  return next();
};

export { validateInputUser };
