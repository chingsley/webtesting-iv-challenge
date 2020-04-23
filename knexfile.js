require('dotenv').config();
const {
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_DB,
  MYSQL_HOST,
  DB_DIALECT,
} = process.env;

console.log(DB_DIALECT);

module.exports = {
  development: {
    client: DB_DIALECT,
    connection: {
      host: MYSQL_HOST,
      user: MYSQL_USERNAME,
      password: MYSQL_PASSWORD,
      database: MYSQL_DB,
    },
    migrations: {
      directory: './src/data/migrations',
    },
    seeds: {
      directory: './src/data/seeds',
    },
    pool: { min: 0, max: 7 },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
