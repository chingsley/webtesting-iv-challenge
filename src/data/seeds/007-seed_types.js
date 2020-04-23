exports.seed = function (knex) {
  return knex('types').insert([
    { type: 'fast food' },
    { type: 'italian' },
    { type: 'mexican' },
  ]);
};
