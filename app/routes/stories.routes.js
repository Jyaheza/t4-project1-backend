<<<<<<< HEAD
  module.exports = (app) => {
    const Story = require("../controllers/stories.controller.js");
    const { authenticateRoute } = require("../authentication/authentication");
    var router = require("express").Router();
  
    // Create a new Story
    router.post("/stories/:userId", Story.create);

    router.post("/stories/extend/:storyId", Story.extend);

    router.get(`/stories/:userId`, Story.findAllParentStoriesForUser);
  
    app.use("/storiesapi", router);
  };
  
=======
module.exports = (app) => {
  const Story = require("../controllers/stories.controller.js");
  const { authenticateRoute } = require("../authentication/authentication");
  var router = require("express").Router();

  // Create a new Story
  router.post("/stories/:userId", Story.create);

  // // Extension of a story
  // router.post("/stories/extend/:storyId", Story.extend);

  // Retrieve all Stories for user
  router.get(
    "/stories/:userId",
    Story.findAll
  );

  // TODO Update story with ID

  app.use("/storiesapi", router);
};
