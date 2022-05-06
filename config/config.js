const fs = require('fs');

module.exports = {
  development: {
    username: process.env.POSTGRES_USER,
    // username: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    // password: 'root',
    database: process.env.POSTGRES_DB,
    // database: 'wheels',
    host: process.env.POSTGRES_HOST,
    // host: 'localhost',
    port: process.env.POSTGRES_PORT,
    // port: 5432,
    dialect: 'postgres',
  },
};
