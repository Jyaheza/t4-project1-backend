  module.exports = (app) => {
    const Story = require("../controllers/story.controller.js");
    const { authenticateRoute } = require("../authentication/authentication");
    var router = require("express").Router();
  
    // Create a new Story
    router.post("/stories/:userId", Story.create);
  
    // Retrieve a single Story with id
    router.get("/stories/:storyId", Story.findOne);
  
    // Update a Story with id
    router.put("/userId/:storyId", [authenticateRoute], Story.update);
  
    // Delete a Story with id
    router.delete("/userId/:storyId", [authenticateRoute], Story.delete);
  
    app.use("/storiesapi", router);
  };
  