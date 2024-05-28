const { where } = require("sequelize");
const db = require("../models");
const Story = db.story;
const Op = db.Sequelize.Op;
const { startCohereChat } = require('../services/cohere-client-service');

exports.create = async (req, res) => {
  try {
    const userId = req.params.userId;
    const storyParams = req.body.storyParams;

    // Call the LLM service to generate the story text
    const storyText = await startCohereChat(storyParams);

    //TODO - save storyText to dB here before sending in the response.
    try {
      res.send(storyText);
    } catch (error) {
      console.error(`Response with story for user ${userId} with params ${storyParams} encountered error ${error}`);
      res.status(500).send({
        message: "An error occurred while returning the story.",
      });
    }

  } catch (error) {
    console.error(`When creating story for user ${userId} with params ${storyParams} encountered error ${error}`);
    res.status(500).send({
      message: "An error occurred while creating the story.",
    });
  }
};

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
