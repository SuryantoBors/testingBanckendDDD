require("dotenv").config();
const Sequelize = require("sequelize");
//required package
// const fs = require("fs");
// const path = require("path");

//name of this file
// const basename = path.basename(__filename);

//current development environment
const env = process.env.NODE_ENV || "development";
//get environment config from config file that fit to current environment
const config = require("./config")[env].databases;
const db = {};

//establish connection to db
const sequelize = new Sequelize(
  config.MYSQL.database,
  config.MYSQL.user,
  config.MYSQL.password,
  {
    host: config.MYSQL.host,
    port: config.MYSQL.post,
    dialect: "mysql",
  },
);

// gak ngerti
// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (
//       file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
//     );
//   })
//   .forEach((file) => {
//     const model = sequelize["import"](path.join(__dirname, file));
//     db[model.name] = model;
//   });

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//mysql model

//user related
db.user = require("../src/users/user.model")(sequelize, Sequelize);
db.userProfile = require("../src/users/userProfile.model")(
  sequelize,
  Sequelize,
);

module.exports = db;
