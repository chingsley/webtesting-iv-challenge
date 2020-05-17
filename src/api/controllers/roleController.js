import db from '../../data/dbConfig';
import User from '../models/User';

const assignRole = async (req, res, next) => {
  const { userId, roleId } = req.body;
  let user;
  try {
    await db('user_roles').insert({ userId, roleId });
    user = await User.query().findById(userId).withGraphFetched('[roles]');
    return res.status(201).json({
      message: 'role assignment is successful',
      user,
    });
  } catch (err) {
    next(err.message);
  }
};

const deleteRole = async (req, res, next) => {
  console.log(req.params);
  try {
    const { userId, roleId } = req.params;
    const delRes = await db('user_roles').where({ userId, roleId }).del();
    res.status(200).json({ message: 'role successfully removed.' });
  } catch (err) {
    next(err.message);
  }
};

export { assignRole, deleteRole };
