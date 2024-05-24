module.exports = (sequelize, Sequelize) => {
    const Country = sequelize.define("country", {
      id: {
        type: DataTypes.INTEGER,
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
  