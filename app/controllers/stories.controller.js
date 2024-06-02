const { where } = require("sequelize");
const db = require("../models");
const Story = db.story;
const User = db.user;
const Op = db.Sequelize.Op;
const { startCohereChat, extendStory } = require('../services/cohere-client-service');

/**
 * Create new story
 * @param {*} req 
 * @param {*} res 
 */
exports.create = async (req, res) => {
  const userId = req.params.userId;
  const storyParams = req.body.storyParams;

  try {
    // Call the LLM service to generate the story text
    const preamble = 'You are a writer of children\'s stories';
    let parametersText = '';

    let chatInputMessage = 'Please write me a 5 paragraph childrens bedtime story. ';

    if (storyParams.length !== 0) {
      storyParams.forEach(parameter => {
        parametersText += `${parameter.key}: ${parameter.value}, `;
      });
    }

    if (parametersText !== '') {
      chatInputMessage += ` Please use the following parameters to help build the content of the story. ${parametersText}`;
    }

    chatInputMessage += ` End the story extension in a way that leaves the plot open for continuation. 
    Do not say explicitaly that there will be another chapter, but rather build the plot in a 
    way that allows space for more story to be generated. Do not use phrases like "The End...for now." OR "To be continued..."`;

    const storyText = await startCohereChat(preamble, chatInputMessage);

    const story = {
      userId: userId,
      story: storyText,
      parentId: null,
      createdAt: new Date(),
      updatedAt: null,
    };

    await Story.create(story);

    try {
      res.send(storyText);
    } catch (error) {
      console.error(`Response with story for user ${userId} with params ${storyParams} encountered error ${error}`);
      res.status(404).send({
        message: "An error occurred while returning the story.",
      });
    }

  } catch (error) {
    console.error(`Creating story for user ${userId} with params ${storyParams} encountered error ${error}`);
    res.status(404).send({
      message: "An error occurred while creating the story.",
    });
  }
};

/**
 * Create additional story record from existing story context.
 * @param {*} req 
 * @param {*} res 
 */
exports.extend = async (req, res) => {
  const storyId = parseInt(req.params.storyId);
  const storyParams = req.body.storyParams;

  try {

    const parentStory = await Story.findByPk(storyId);

    const userId = parentStory.userId;
    const storyContext = parentStory.story;

    // Call the LLM service to generate the story text
    const preamble = 'You are a writer of children\'s stories, who wants to extend an already written story with an engaging new entry.';
    let parametersText = '';
    let chatInputMessage = `Please generate a 5 paragraph extension of the following childrens bedtime story. 
    Please maintain plot continuity from provided story, even if there are new parameters that will be added with the extension 
    to the story. Here is the existing story: ${storyContext}`;

    if (storyParams.length !== 0) {
      storyParams.forEach(parameter => {
        parametersText += `${parameter.key}: ${parameter.value}, `;
      });
    }

    if (parametersText !== '') {
      chatInputMessage += `Now, please also use the following parameters to help build the content of the story extension. ${parametersText}`;
    }

    chatInputMessage += ` End the story extension in a way that leaves the plot open for continuation. 
    Do not say explicitaly that there will be another chapter, but rather build the plot in a 
    way that allows space for more story to be generated. Do not use phrases like "The End...for now." OR "To be continued..."`;

    const storyText = await startCohereChat(preamble, chatInputMessage);

    const story = {
      userId: userId,
      story: storyText,
      parentId: parentStory.storyId,
      createdAt: new Date(),
      updatedAt: null,
    };

    await Story.create(story);

    try {
      res.send(storyText);
    } catch (error) {
      console.error(`Response with story for user ${userId} with params ${storyParams} encountered error ${error}`);
      res.status(404).send({
        message: "An error occurred while returning the extended story.",
      });
    }
  } catch (error) {
    console.error(`Extending story for user ${userId} with params ${storyParams} encountered error ${error}`);
    res.status(404).send({
      message: "An error occurred while extending the story.",
    });
  }
};

// Retrieve all stories from the database.
exports.findAllForUser = (req, res) => {
  const userId = req.params.userId;
  var condition = userId
    ? {
      userId: {
        [Op.like]: `%${userId}%`,
      },
    }
    : null;

  Story.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(404).send({
        message:
          err.message || "Some error occurred while retrieving stories.",
      });
    });
};

exports.findAllParentStoriesForUser = (req, res) => {
  Story.findAll({
    where: { userId: req.params.userId, parentId: null },
    order: [["createdAt", "ASC"]]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(404).send({
        message: err.message || "An error occurred while retrieving stories."
      });
    });
};

exports.findAllParentStoriesForUser = (req, res) => {
  Story.findAll({
    where: { userId: req.params.userId, parentId: null },
    order: [["createdAt", "ASC"]]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(404).send({
        message: err.message || "An error occurred while retrieving stories."
      });
    });
};

// Retrieve all stories from the database for the user
exports.findOneForUser = (req, res) => {
  const storyId = req.params.storyId;
  const userId = req.params.userId;

  Story.findAll({ where: {userId: userId, storyId: storyId} })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(404).send({
        message:
          err.message || "An error occurred while retrieving stories.",
      });
    });
};

// Delete a story with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.storyId;

  Story.destroy({
    where: { storyId: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Story was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Story with id=${id}. Maybe Story was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(404).send({
        message: err.message || "Could not delete story with id=" + id,
      });
    });
};

// Update a Story by the id in the request
exports.update = (req, res) => {
  const id = req.params.storyId;

  Story.update(req.body, {
    where: { storyId: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Story was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Story with id = ${id}. Maybe story was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(404).send({
        message: err.message || "Error updating story with id =" + id,
      });
    });
};