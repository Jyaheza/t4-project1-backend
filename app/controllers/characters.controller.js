const { where } = require("sequelize");
const db = require("../models");
const Op = db.Sequelize.Op;
const Characters = db.characters;

// Create a new character
exports.create = (req, res) => {
  if (req.body.name === undefined) {
    const error = new Error("Name for character can't be empty!");
    error.statusCode = 400;
    throw error;
  }

  const character = {
    name: req.body.name
  };

  Characters.create(character)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(404).send({
        message:
          err.message ||
          "Some error occurred while creating the character.",
      });
    });
}

// Find all characters in the database
exports.findAll = (req, res) => {
  const id = req.query.id;
  var condition = id ? { id: { [Op.like]: `%${id}%`, }, } : null;

  Characters.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(404).send({
        message: err.message || "Some error occurred while retrieving character.",
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Characters.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "characters was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete characters with id=${id}. Maybe characters was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(404).send({
        message: err.message || "Could not delete characters with id=" + id,
      });
    });
};

// Update a character by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Characters.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Character was updated successfully.",
        });
      } else {
        res.status(404).send({
          message: `Cannot update character with id = ${id}. Maybe character was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(404).send({
        message: err.message || "Error updating character with id =" + id,
      });
    });
};