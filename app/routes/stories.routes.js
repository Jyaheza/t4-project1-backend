  module.exports = (app) => {
    const Story = require("../controllers/story.controller.js");
    const { authenticateRoute } = require("../authentication/authentication");
    var router = require("express").Router();
  
    // Create a new Story
    router.post("/stories/:userId", Story.create);

    app.use("/storiesapi", router);
  };
  