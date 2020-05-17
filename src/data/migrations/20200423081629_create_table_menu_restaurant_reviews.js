exports.up = function (knex) {
  return knex.schema
    .createTable('menus', (tbl) => {
      tbl.increments();
      tbl.string('itemName').unique().notNullable();
      tbl.float('itemPrice');
      tbl.string('itemPicture');
    })
    .createTable('restaurants', (tbl) => {
      tbl.increments();
      tbl.string('name').notNullable();
      tbl.string('address').notNullable();
    })
    .createTable('types', (tbl) => {
      tbl.increments();
      tbl.string('type').unique().notNullable();
    })
    .createTable('restaurant_types', (tbl) => {
      tbl.increments();
      tbl
        .integer('restaurantId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('restaurants')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl
        .integer('typeId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('types')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('ratings', (tbl) => {
      tbl.increments();
      tbl.integer('value').unsigned().unique();
    })
    .createTable('reviews', (tbl) => {
      tbl.increments();
      tbl
        .integer('userId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl
        .integer('restaurantId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('restaurants')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT');
      tbl
        .integer('menuId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('menus')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT');
      tbl
        .integer('ratingId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('ratings')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT');
      tbl.dateTime('dateVisited');
      tbl.string('comment');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('reviews')
    .dropTableIfExists('restaurant_types')
    .dropTableIfExists('restaurants')
    .dropTableIfExists('types')
    .dropTableIfExists('menus')
    .dropTableIfExists('ratings');
};
