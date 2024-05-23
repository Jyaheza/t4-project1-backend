module.exports = (sequelize, Sequelize) => {
    const Language = sequelize.define("language", {
      storyId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
    return Language;
  };
  