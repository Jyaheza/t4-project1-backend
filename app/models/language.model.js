module.exports = (sequelize, Sequelize) => {
    const Language = sequelize.define("language", {
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
    return Language;
  };
  