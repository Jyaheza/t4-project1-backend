module.exports = (app) => {
    const Story = require("../controllers/story.controller.js");
    const { authenticateRoute } = require("../authentication/authentication");
    var router = require("express").Router();
  
    // Create a new Recipe
    router.post("/stories/", [authenticateRoute], Story.create);
  
    // // Retrieve all Stories for user
    // router.get(
    //   "/stories/user/:storyId",
    //   [authenticateRoute],
    //   Story.findAllForUser
    // );
  
    // Retrieve a single Recipe with id
    router.get("/stories/:storyId", Story.findOne);
  
    // Update a Recipe with id
    router.put("/userId/:storyId", [authenticateRoute], Story.update);
  
    // Delete a story with id
    router.delete("/userId/:storyId", [authenticateRoute], Story.delete);
  
    app.use("/storiesapi", router);
  };