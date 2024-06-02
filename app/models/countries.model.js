module.exports = (sequelize, Sequelize) => {
    const Country = sequelize.define("countries", {
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
    return Country;
  };
  