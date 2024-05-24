module.exports = (sequelize, Sequelize) => {
    const Country = sequelize.define("country", {
      storyId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
    return Country;
  };
  