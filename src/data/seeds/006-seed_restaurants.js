exports.seed = function (knex) {
  return knex('restaurants').insert([
    { name: 'Madonna', address: '21 crescent Lekki' },
    { name: 'The Place', address: 'Victoria Island' },
    { name: 'Mr Biggs', address: 'Ikeja, Lagos' },
  ]);
};
