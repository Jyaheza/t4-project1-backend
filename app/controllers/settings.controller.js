const { where } = require("sequelize");
const db = require("../models");
const Op = db.Sequelize.Op;
const Setting = db.settings;

exports.create = (req, res) => {
    if (req.body.name === undefined) {
        const error = new Error("Name for setting can't be empty!");
        error.statusCode = 400;
        throw error;
    }

    const setting = {
        name: req.body.name
    };

    Setting.create(setting)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while creating the Setting.",
            });
        });
}

exports.findAll = (req, res) => {
    const id = req.query.id;
    var condition = id ? { id: { [Op.like]: `%${id}%`, }, } : null;
  
    Setting.findAll({ where: condition })
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
  
    Setting.destroy({
      where: { id: id },
    })
      .then((number) => {
        if (number == 1) {
          res.send({
            message: "Setting was deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete Setting with id=${id}. Maybe Setting was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Could not delete Setting with id=" + id,
        });
      });
  };