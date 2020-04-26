import db from '../../data/dbConfig';

const findAll = () => db('users');
const findById = (id) => db('users').where({ id }).first();
const add = (newUser) => db('users').insert(newUser);
const edit = (id, changes) => db('users').where({ id }).update(changes);
const remove = (id) => db('users').where({ id }).del();

export { findAll, findById, add, edit, remove };
