exports.up = function (knex) {
  return knex.schema
    .createTable('users', (tbl) => {
      tbl.increments();
      tbl.string('username').unique().notNullable();
      tbl.string('email').unique().notNullable();
      tbl.string('password').notNullable();
      tbl.timestamp('createdAt').defaultTo(knex.fn.now());
      tbl.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
    .createTable('roles', (tbl) => {
      tbl.increments();
      tbl.string('role').unique().notNullable();
    })
    .createTable('user_roles', (tbl) => {
      tbl.increments();
      tbl.unique(['userId', 'roleId']);
      tbl
        .integer('userId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl
        .integer('roleId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('roles')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('memberships', (tbl) => {
      tbl.increments();
      tbl
        .integer('followedId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl
        .integer('followerId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('user_roles')
    .dropTableIfExists('memberships')
    .dropTableIfExists('users')
    .dropTableIfExists('roles');
};
