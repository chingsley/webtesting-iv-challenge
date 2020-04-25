import db from '../../data/dbConfig';

const getAll = () => db('users');

export { getAll };
