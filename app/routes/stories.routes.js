module.exports = (app) => {
  const Story = require("../controllers/stories.controller.js");
  const { authenticateRoute } = require("../authentication/authentication");
  var router = require("express").Router();

  // Create a new Story
  router.post("/stories/:userId", [authenticateRoute], Story.create);

  // // Extension of a story
  router.post("/stories/extend/:storyId", [authenticateRoute], Story.extend);

  router.get(`/stories/:userId`, Story.findAllParentStoriesForUser);

  router.get(`/stories/read/:storyId`, Story.findAll);

  // Story to find all parent stories for a user.
  router.get(`/stories/:userId`, Story.findAllParentStoriesForUser);

  // Retrieve all Stories for user
  router.get(
    "/users/:userId/stories/",
    Story.findAllForUser
  );

  // Update a users story with new id
  router.put("/users/:userId/stories/:storyId", [authenticateRoute], Story.update);

  // Delete an story with story id
  router.delete("/users/:userId/stories/:storyId", [authenticateRoute], Story.delete);

  // Search for a story for a specific user
  router.get("/users/:userId/stories/:storyId", Story.findOneForUser);

  app.use("/storiesapi", router);
};
