module.exports = (app) => {
  const Settings = require("../controllers/settings.controller.js");
  var router = require("express").Router();
  const { authenticateRoute } = require("../authentication/authentication");

  // Create a new Setting for a Stories
  router.post(
    "/settings/",
    [authenticateRoute],
    Settings.create
  );

  //Update a setting with ID
  router.put("/settings/:id", [authenticateRoute], Settings.update);

  //Delete a Setting for stories
  router.delete("/settings/:id", [authenticateRoute], Settings.delete);

  // Retrieve a single settings with id
  router.get("/settings", Settings.findAll);

  app.use("/storiesapi", router);

}; 