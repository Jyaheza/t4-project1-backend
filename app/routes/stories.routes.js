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
  