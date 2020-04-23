exports.seed = function (knex) {
  return knex('roles').insert([
    { role: 'super admin' },
    { role: 'admin' },
    { role: 'user' },
  ]);
};
