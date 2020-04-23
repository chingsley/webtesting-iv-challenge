exports.seed = function (knex) {
  return knex('memberships').insert([
    { followedId: 1, followerId: 2 },
    { followedId: 1, followerId: 3 },
    { followedId: 2, followerId: 1 },
    { followedId: 2, followerId: 3 },
    { followedId: 3, followerId: 1 },
    { followedId: 3, followerId: 2 },
  ]);
};
