const { where } = require("sequelize");
const db = require("../models");
const Op = db.Sequelize.Op;
const Country = db.countries;

exports.create = (req, res) => {
    if (req.body.name === undefined) {
        const error = new Error("Name for Country can't be empty!");
        error.statusCode = 400;
        throw error;
    }

    const country = {
        name: req.body.name
    };

    Country.create(country)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while creating the Country.",
            });
        });
}

exports.findAll = (req, res) => {
    const id = req.query.id;
    var condition = id ? { id: { [Op.like]: `%${id}%`, }, } : null;
  
    Country.findAll({ where: condition })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving countries.",
        });
      });
  };

  exports.delete = (req, res) => {
    const id = req.params.id;
  
    Country.destroy({
      where: { id: id },
    })
      .then((number) => {
        if (number == 1) {
          res.send({
            message: "Country was deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete Country with id=${id}. Maybe Country was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Could not delete Country with id=" + id,
        });
      });
  };