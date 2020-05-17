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
      next(error.message);
    });
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const changes = req.body;
    const numOfUpdatedRecord = await db('users').where({ id }).update(changes);
    if (numOfUpdatedRecord > 0) {
      const user = await db('users').where({ id }).first();
      return res.status(200).json({
        message: 'user updated successfully',
        user,
      });
    } else {
      return res.status(500).json({
        error: 'no records updated',
      });
    }
  } catch (error) {
    next(error.message);
  }
};

export { registerUser, updateUser };
