exports.seed = function (knex) {
  return knex('users').insert([
    { username: 'jon', email: 'jon@stark.com' },
    { username: 'arya', email: 'arya@stark.com' },
    { username: 'sansa', email: 'sansa@stark.com' },
  ]);
};
