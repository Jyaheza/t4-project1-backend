module.exports = (app) => {
    const Story = require("../controllers/stories.controller.js");
    var router = require("express").Router();
  
    // Create a new Story
    router.post("/stories/:userId", Story.create);
  
    app.use("/storiesapi", router);
  };
  