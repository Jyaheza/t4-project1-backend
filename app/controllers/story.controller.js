const { where } = require("sequelize");
const db = require("../models");
const Story = db.story;
const Op = db.Sequelize.Op;

// Retrieve all stories from the database.
exports.findAll = (req, res) => {
    const storyId = req.query.storyId;
    var condition = storyId
    ? {
        id: {
            [Op.like]: `%${storyId}%`,
        },
    }
    : null;

    Story.findAll({where: condition, order: [["name", "ASC"]]})
    .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving stories.",
        });
      });
};