import db from '../../data/dbConfig';

const createRole = (newRole) => db('user_roles').insert(newRole);

// export { createRole };
export default db('user_roles');
