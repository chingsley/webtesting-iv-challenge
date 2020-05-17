// // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// let user = await User.query()
//   .where('username', 'like', '%jon%')
//   // .where({ id: req.params.id })
//   .withGraphFetched('[roles]');

// // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// router.get('/', async (req, res, next) => {
//   const users = await User.query();
//   res.status(200).json(users);
// });

// router.get('/:id', async (req, res, next) => {
//   const user = await User.query().findById(1).withGraphFetched('[roles]');

//   // console.log(JSON.stringify(user, null, 2));
//   res.status(200).json(user);
// });

// router.put('/:id', (req, res, next) => {
//   res.status(200).json({ message: 'successful update' });
// });

// router.delete('/:id', (req, res, next) => {
//   res.status(200).json({ message: 'user removed' });
// });

// // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// {
//   "username": "chingsley",
//   "email": "kc@gmail.com",
//   "password": "testing",
//   "roles": [
//     {
//       "role": "admin"
//     },{
//       "role": "user"
//     }]
// }

// // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// let uname = new RegExp(username, 'g');
// if (err.message.match('uplicate') && err.message.match(uname)) {
//   return res.status(400).json({
//     error: `${username} has been taken, please choose another username.`,
//   });
// }

import bcrypt from 'bcryptjs';
import knex from 'knex';
import User from '../models/User';
import db from '../../data/dbConfig';

const registerUser = async (req, res, next) => {
  const { username, email } = req.body;
  try {
    const user = req.body;
    const hashedPassword = bcrypt.hashSync(user.password, 12);
    user.password = hashedPassword;

    // const newUser = await User.query().insertGraph(user);
    const trx = await db.transaction();
    const ids = await trx('users').insert(user, 'id');
    console.log('ids = ', ids);
    const { id: roleId } = await db('roles').where({ role: 'user' }).first();
    console.log('roleId = ', roleId);
    const res2 = await trx('user_roles').insert({ userId: ids[0], roleId });
    console.log('res2 = ', res2);
    console.log('trx.isCompleted() = ', trx.isCompleted()); // false
    trx.commit();
    console.log('trx.isCompleted() = ', trx.isCompleted()); // true
    const newUser = await db('users').where({ id: ids[0] }).first();
    return res
      .status(201)
      .json({ message: 'registration completed successfully!', newUser });
    // if (trx.isCompleted()) {
    //   return res
    //     .status(201)
    //     .json({ message: 'registration completed successfully!', newUser });
    // } else {
    //   return res
    //     .status(500)
    //     .json({ error: 'registration failed; internal server error.' });
    // }
  } catch (err) {
    return next(err.message);
  }
};

// // >>>>>>>>>>>>>>>>>>>>>>>>>> KNEX QUERY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// db('notifications')
// .whereNotIn('id', subquery1)
// .andWhere(function() {
// this.whereIn('user_id', subquery2)
// .orWhereIn('event_type', subquery2_with_join)
// .orWhereIn('category_type', subquery3)
// })
// .toString()
//select * from "notifications" where "id" not in (subquery1) and ("user_id" in (subquery2) or "event_type" in (subquery2_with_join) or "category_type" in (subquery3))
