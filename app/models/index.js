const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

/**
 * All of the models being sequelized down below
 */

db.user = require("./user.model.js")(sequelize, Sequelize);
db.story = require("./stories.model.js")(sequelize, Sequelize);
db.characterRole = require("./characterRole.model.js")(sequelize, Sequelize);
db.country = require("./country.model.js")(sequelize, Sequelize);
db.language = require("./language.model.js")(sequelize, Sequelize);
db.setting = require("./setting.model.js")(sequelize, Sequelize);
db.session = require("./session.model.js")(sequelize, Sequelize);


/**
 * foreign key relations below
 */

/**
 *  the user in the database can have many stories. but the one story belongs to the one user.
 * The secondary object (story) belongs to one user. but the primary object (user) can have multiple stories
 * ON DELETE CASCADE is used to specify that when a row is deleted from the parent table,
 *  all rows in the child table that reference the deleted row should also be deleted.
 *  This is useful for maintaining the integrity of the database.
 */

// foreign key for user and story
db.user.hasMany(
  db.story,
  { as: "story" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.story.belongsTo(
  db.user,
  { as: "users" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for user and session
db.user.hasMany(
  db.session,
  { as: "session" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.session.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

module.exports = db;
