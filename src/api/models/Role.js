import db from '../../data/dbConfig';

const findAll = () => db('roles');
const findById = (id) => db('roles').where({ id }).first();
const findByField = (field) => db('roles').where(field).first();
const add = (newRole) => db('roles').insert(newRole);
const edit = (id, changes) => db('roles').where({ id }).update(changes);
const remove = (id) => db('roles').where({ id }).del();

export { findAll, findById, add, edit, remove, findByField };
