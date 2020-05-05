import { Model } from 'objection';
import db from '../../data/dbConfig';

Model.knex(db);

class Role extends Model {
  static get tableName() {
    return 'roles';
  }

  static get relationMappings() {
    const User = require('./User');
    // const UserRole = require('./UserRole');
    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'roles.id',
          through: {
            from: 'user_roles.roleId',
            to: 'user_roles.userId',
          },
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = Role;

// import db from '../../data/dbConfig';

// const findAll = () => db('roles');
// const findById = (id) => db('roles').where({ id }).first();
// const findByField = (field) => db('roles').where(field).first();
// const add = (newRole) => db('roles').insert(newRole);
// const edit = (id, changes) => db('roles').where({ id }).update(changes);
// const remove = (id) => db('roles').where({ id }).del();

// // export { findAll, findById, add, edit, remove, findByField };
// export default db('roles');
