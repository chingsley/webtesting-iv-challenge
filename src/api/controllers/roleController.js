import db from '../../data/dbConfig';
import User from '../models/User';

const assignRole = async (req, res, next) => {
  try {
    const { userId, roleId } = req.body;
    await db('user_roles').insert({ userId, roleId });
    const { id, username, email, roles } = await User.query()
      .findById(userId)
      .withGraphFetched('[roles]');
    return res.status(201).json({
      message: 'role assignment is successful',
      user: { id, username, email, roles },
    });
  } catch (err) {
    next(err.message);
  }
};

const deleteRole = async (req, res, next) => {
  console.log(req.params);
  try {
    const { userId, roleId } = req.params;
    await db('user_roles').where({ userId, roleId }).del();
    res.status(200).json({ message: 'role successfully removed.' });
  } catch (error) {
    next(error.message);
  }
};

export { assignRole, deleteRole };
