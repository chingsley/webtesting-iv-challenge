import { Model } from 'objection';
import db from '../../data/dbConfig';

Model.knex(db);

class UserRole extends Model {
  static get tableName() {
    return 'user_roles';
  }

  static get relationMappings() {
    const User = require('./User');
    const Role = require('./Role');
    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: 'user_roles.userId',
          to: 'users.id',
        },
      },
      roles: {
        relation: Model.HasManyRelation,
        modelClass: Role,
        join: {
          from: 'user_roles.roleId',
          to: 'roles.id',
        },
      },
    };
  }
}

export default UserRole;

// const createRole = (newRole) => db('user_roles').insert(newRole);

// // export { createRole };
// export default db('user_roles');
