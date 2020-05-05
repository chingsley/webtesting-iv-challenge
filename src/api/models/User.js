import { Model } from 'objection';
import db from '../../data/dbConfig';

Model.knex(db);

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    const Role = require('./Role');
    // const UserRole = require('./UserRole');
    return {
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'users.id',
          through: {
            from: 'user_roles.userId',
            to: 'user_roles.roleId',
          },
          to: 'roles.id',
        },
      },
    };
  }
}

export default User;

// const findAll = () => db('users');
// const findById = (id) => db('users').where({ id }).first();
// const findByField = (field) => db('users').where(field).first();
// const add = (newUser) => db('users').insert(newUser);
// const edit = (id, changes) => db('users').where({ id }).update(changes);
// const remove = (id) => db('users').where({ id }).del();

// export { findAll, findById, add, edit, remove, findByField };
