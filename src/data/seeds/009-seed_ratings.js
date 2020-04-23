exports.seed = function (knex) {
  return knex('ratings').insert([
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
  ]);
};
