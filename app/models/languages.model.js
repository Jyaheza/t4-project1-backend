module.exports = (sequelize, Sequelize) => {
  const Language = sequelize.define("languages", {
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
  return Language;
};
