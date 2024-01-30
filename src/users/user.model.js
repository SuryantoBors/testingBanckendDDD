const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: false,
    },
    email: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Must be a valid email address",
        },
      },
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: Sequelize.DataTypes.STRING(25),
      allowNull: true,
    },
  });
  // User.sync({ force: true });
  return User;
};
