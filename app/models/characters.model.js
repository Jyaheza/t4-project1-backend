module.exports = (sequelize, Sequelize) => {
    const Characters = sequelize.define("characters", {
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
    return Characters;
  };