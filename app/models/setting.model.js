module.exports = (sequelize, Sequelize) => {
    const Setting = sequelize.define("setting", {
      storyId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
    return Setting;
  };
  