module.exports = (sequelize, Sequelize) => {
    const Setting = sequelize.define("settings", {
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
    return Setting;
  };
  