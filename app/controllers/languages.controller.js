const { where } = require("sequelize");
const db = require("../models");
const Op = db.Sequelize.Op;
const Language = db.languages;

// Insert a new language into the database 
exports.create = (req, res) => {
  if (req.body.name === undefined) {
    const error = new Error("Name for language can't be empty!");
    error.statusCode = 400;
    throw error;
  }

  const language = {
    name: req.body.name
  };

  Language.create(language)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Language.",
      });
    });
}

// See all languages in the database
exports.findAll = (req, res) => {
  const id = req.query.id;
  var condition = id ? { id: { [Op.like]: `%${id}%`, }, } : null;

  Language.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving language.",
      });
    });
};

// Remove a language from the database
exports.delete = (req, res) => {
  const id = req.params.id;

  Language.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Language was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete language with id=${id}. Maybe Setting was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete language with id=" + id,
      });
    });
};

// Update a language by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Language.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Language was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update language with id = ${id}. Maybe language was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating language with id =" + id,
      });
    });
};