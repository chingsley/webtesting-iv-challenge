import bcrypt from 'bcryptjs';
import User from '../models/User';
import jwtConfig from '../security/jwtConfig';

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [user] = await User.query()
      .where('email', email)
      .withGraphFetched('[roles]');

    if (!user) {
      return res.status(401).json({ error: 'invalid email/password' });
    }
    const isCorrectPassword = bcrypt.compareSync(password, user.password);
    if (isCorrectPassword) {
      const token = jwtConfig.generateToken({
        userId: user.id,
        username: user.username,
        roles: user.roles.map(({ role }) => role),
      });
      return res.status(200).json({
        message: 'login successful',
        data: { user: { ...user, password: undefined }, token },
      });
    } else {
      return res.status(401).json({ error: 'invalid email/password' });
    }
  } catch (error) {
    return next(error.message);
  }
};
