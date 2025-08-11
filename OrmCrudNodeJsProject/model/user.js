const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("user", {
    firstName: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    }
  });

  return User; 
};
