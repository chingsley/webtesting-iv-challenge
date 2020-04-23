exports.seed = function (knex) {
  return knex('menus').insert([
    {
      itemName: 'fish sauce pie',
      itemPrice: 2000.0,
      itemPicture:
        'https://images.unsplash.com/photo-1432139555190-58524dae6a55?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    },
    {
      itemName: 'Sharwarma',
      itemPrice: 1200.0,
      itemPicture:
        'https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    },
    {
      itemName: 'Pizza',
      itemPrice: 2500.0,
      itemPicture:
        'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    },
  ]);
};
