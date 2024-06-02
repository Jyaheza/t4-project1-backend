const { where } = require("sequelize");
const db = require("../models");
const Story = db.story;
const Op = db.Sequelize.Op;
const { generateNewStory, generateStoryExtension } = require("../services/story-text-generator-service");

/**
 * Create new story
 * @param {*} req 
 * @param {*} res 
 */
exports.create = async (req, res) => {
  const userId = req.params.userId;
  const storyParams = req.body.storyParams;

  try {
    const storyText = await generateNewStory(userId, storyParams);

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
 * Create additional story chapter from existing story context.
 * @param {*} req 
 * @param {*} res 
 */
exports.extend = async (req, res) => {
  const storyId = parseInt(req.params.storyId);
  const storyParams = req.body.storyParams;
  let userId = "";
  let storyContext = "";

  try {
    const stories = await Story.findAll({ 
      where: {
        [Op.or]: [
          { storyId: storyId },
          { parentId: storyId }
        ]
      },
      order: [["storyId", "ASC"]]
    });

    stories.forEach(story => {
      storyContext += story.story;
    });

    userId = stories[0].userId;

    const storyText = await generateStoryExtension(storyContext, userId, storyParams, storyId);

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

// Retrieve stories from the database where id or parent id is a given story id.
exports.findAll = (req, res) => {
  const storyId = req.params.storyId;

  Story.findAll({ 
    where: {
      [Op.or]: [
        { storyId: storyId },
        { parentId: storyId }
      ]
    },
    order: [["storyId", "ASC"]]
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving stories.",
      });
    });
};

//Find all parent stories for a user id
exports.findAllParentStoriesForUser = (req, res) => {
  Story.findAll({
    where: { userId: req.params.userId, parentId: null},
    order: [["storyId", "ASC"]]
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || "An error occurred while retrieving stories."
    });
  });
};
