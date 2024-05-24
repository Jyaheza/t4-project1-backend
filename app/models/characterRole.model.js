module.exports = (sequelize, Sequelize) => {
    const characterRole = sequelize.define("characterRole", {
      storyId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
    return characterRole;
  };