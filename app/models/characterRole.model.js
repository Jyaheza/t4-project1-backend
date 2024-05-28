module.exports = (sequelize, Sequelize) => {
    const characterRole = sequelize.define("characterRole", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
    return characterRole;
  };