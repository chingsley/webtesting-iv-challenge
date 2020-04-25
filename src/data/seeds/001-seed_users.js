const bcrypt = require('bcryptjs');

const hashedPassword = bcrypt.hashSync('stark', 10);

exports.seed = function (knex) {
  return knex('users').insert([
    { username: 'jon', email: 'jon@stark.com', password: hashedPassword },
    { username: 'arya', email: 'arya@stark.com', password: hashedPassword },
    { username: 'sansa', email: 'sansa@stark.com', password: hashedPassword },
  ]);
};
