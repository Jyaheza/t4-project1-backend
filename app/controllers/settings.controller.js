const { where } = require("sequelize");
const db = require("../models");
const Op = db.Sequelize.Op;
const Setting = db.settings;

// Insert a new setting into the database
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
          res.status(404).send({
                message:
                    err.message ||
                    "Some error occurred while creating the Setting.",
            });
        });
}

// View all settings in the database
exports.findAll = (req, res) => {
    const id = req.query.id;
    var condition = id ? { id: { [Op.like]: `%${id}%`, }, } : null;
  
    Setting.findAll({ where: condition })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(404).send({
          message: err.message || "Some error occurred while retrieving settings.",
        });
      });
  };

  // Remove a setting from the database
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
          res.status(404).send({
            message: `Cannot delete Setting with id=${id}. Maybe Setting was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(404).send({
          message: err.message || "Could not delete Setting with id=" + id,
        });
      });
  };

  // Update a setting by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Setting.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Setting was updated successfully.",
        });
      } else {
        res.status(404).send({
          message: `Cannot update setting with id = ${id}. Maybe setting was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(404).send({
        message: err.message || "Error updating setting with id =" + id,
      });
    });
};