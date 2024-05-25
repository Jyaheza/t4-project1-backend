/**
 * This is the new index.js
 * Named as a copy as i will be referencing the original index.js
 * before i remove it completely
 */

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
db.user.hasMany(
  db.story,
  { as: "story" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.story.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

/**
 * Below is going to be the properties of the story with the language, country, setting, and character role.
 * In this case, the primary object will be the story, and the language, country, setting, and character roles
 * will be the secondary object.
 * Although each story can have the same properties, ultimately, the one language etc will belong to the one story.
 * 
 * story - (english, fantasy)
 * story2 - (French, magical | future)
 */

/**
 * story | language
 */
db.story.hasMany(
  db.language,
  { as: "language" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.language.belongsTo(
  db.story,
  { as: "story" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

/**
 * story | country
 */
db.story.hasMany(
  db.country,
  { as: "country" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.country.belongsTo(
  db.story,
  { as: "story" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

/**
 * story | setting
 */
db.story.hasMany(
  db.setting,
  { as: "setting" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.setting.belongsTo(
  db.story,
  { as: "story" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

/**
 * story | character role
 */

db.story.hasMany(
  db.characterRole,
  { as: "character_role" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.characterRole.belongsTo(
  db.story,
  { as: "story" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);


module.exports = db;
