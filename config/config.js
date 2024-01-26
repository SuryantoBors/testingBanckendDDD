require("dotenv").config();

const config = {
  development: {
    databases: {
      MYSQL: {
        database: process.env.MYSQL_DB,
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PWD,
      },
    },
  },
};

module.exports = config;
