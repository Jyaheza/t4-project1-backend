const { where } = require("sequelize");
const db = require("../models");
const Story = db.story;
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
      res.status(500).send({
        message: "An error occurred while returning the story.",
      });
    }

  } catch (error) {
    console.error(`Creating story for user ${userId} with params ${storyParams} encountered error ${error}`);
    res.status(500).send({
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
      res.status(500).send({
        message: "An error occurred while returning the extended story.",
      });
    }
  } catch (error) {
    console.error(`Extending story for user ${userId} with params ${storyParams} encountered error ${error}`);
    res.status(500).send({
      message: "An error occurred while extending the story.",
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

  Story.findAll({ where: condition, order: [["name", "ASC"]] })
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
