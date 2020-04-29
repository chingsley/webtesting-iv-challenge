import { add } from '../models/User';
import bcrypt from 'bcryptjs';

const registerUser = async (req, res, next) => {
  try {
    const user = req.body;
    const hashedPassword = bcrypt.hashSync(user.password, 12);
    user.password = hashedPassword;
    const [id] = await add(user);
    return res.status(201).json({
      message: 'user successfully registered.',
      userId: id,
    });
  } catch (err) {
    return next(err.message);
  }
};

export { registerUser };
