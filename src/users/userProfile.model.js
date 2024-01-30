const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const UserProfile = sequelize.define("user-profile", {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: false,
    },
    userId: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    firstname: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
  });
  // UserProfile.sync({ force: true });
  return UserProfile;
};
