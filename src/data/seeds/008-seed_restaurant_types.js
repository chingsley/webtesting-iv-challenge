exports.seed = function (knex) {
  return knex('restaurant_types').insert([
    { restaurantId: 1, typeId: 1 },
    { restaurantId: 1, typeId: 2 },
    { restaurantId: 2, typeId: 2 },
    { restaurantId: 2, typeId: 3 },
    { restaurantId: 3, typeId: 3 },
    { restaurantId: 3, typeId: 1 },
  ]);
};
