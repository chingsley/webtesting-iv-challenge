const moment = require('moment');

exports.seed = function (knex) {
  return knex('reviews').insert([
    {
      userId: 1,
      restaurantId: 1,
      menuId: 1,
      ratingId: 4,
      dateVisited: moment().format(),
      comment: 'Great taste. Needs a bit more spicy.',
    },
    {
      userId: 1,
      restaurantId: 2,
      menuId: 2,
      ratingId: 3,
      dateVisited: moment().format(),
      comment: 'Sweet. I waited for a long time to be served.',
    },
    {
      userId: 2,
      restaurantId: 3,
      menuId: 3,
      ratingId: 5,
      dateVisited: moment().format(),
      comment: 'Awesome. Everything was perfect.',
    },
    {
      userId: 2,
      restaurantId: 2,
      menuId: 1,
      ratingId: 2,
      dateVisited: moment().format(),
      comment: 'Too much salt.',
    },
    {
      userId: 3,
      restaurantId: 1,
      menuId: 3,
      ratingId: 4,
      dateVisited: moment().format(),
      comment: 'Very tasty. I enjoyed it.',
    },
    {
      userId: 3,
      restaurantId: 2,
      menuId: 2,
      ratingId: 3,
      dateVisited: moment().format(),
      comment: 'Ok. But needs more spicy.',
    },
  ]);
};
