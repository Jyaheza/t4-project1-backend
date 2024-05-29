module.exports = (app) => {
    const Settings = require("../controllers/settings.controller.js");
    var router = require("express").Router();

// Create a new Setting for a Stories
router.post(
    "/settings/",
    Settings.create
  );

  //Delete a Setting for stories
  router.delete("/settings/:id", Settings.delete);

  // Retrieve a single settings with id
  router.get("/settings/", Settings.findAll);

  app.use("/storiesapi", router);
    
}; 