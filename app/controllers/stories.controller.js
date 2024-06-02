const { where } = require("sequelize");
const db = require("../models");
const Story = db.story;
const User = db.user;
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
        res.status(404).send({
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
        res.status(404).send({
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