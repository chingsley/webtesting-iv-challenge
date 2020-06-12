const bcrypt = require('bcryptjs');

const hashedPassword = bcrypt.hashSync(
  'testing',
  Number(process.env.BCRYPT_SALT_VALUE)
);

exports.seed = function (knex) {
  return knex('users').insert([
    { username: 'jon', email: 'jon@stark.com', password: hashedPassword },
    { username: 'arya', email: 'arya@stark.com', password: hashedPassword },
    { username: 'sansa', email: 'sansa@stark.com', password: hashedPassword },
  ]);
};
