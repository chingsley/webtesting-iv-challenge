import bcrypt from 'bcryptjs';
import User from '../models/User';
import db from '../../data/dbConfig';

const registerUser = async (req, res, next) => {
  const { username, email } = req.body;
  // try {
  const user = req.body;
  const hashedPassword = bcrypt.hashSync(user.password, 12);
  user.password = hashedPassword;

  const trx = await db.transaction();
  trx('users')
    .insert(user, 'id')
    .then(async (ids) => {
      const { id: roleId } = await db('roles').where({ role: 'user' }).first();
      await trx('user_roles').insert({ userId: ids[0], roleId });
      await trx.commit();
      const [newUser] = await User.query()
        .where('id', ids[0])
        .withGraphFetched('roles');
      return res.status(201).json({
        message: 'registration completed successfully!',
        newUser,
      });
    })
    .catch((error) => {
      trx.rollback();
      console.log(error);
      next(error.message);
    });
};

export { registerUser };
