module.exports = (app) => {
  const Languages = require("../controllers/languages.controller.js");
  var router = require("express").Router();
  const { authenticateRoute } = require("../authentication/authentication");

  // Create a new Setting for a Stories
  router.post(
    "/languages/",
    [authenticateRoute],
    Languages.create
  );

  //Update a language with ID
  router.put("/languages/:id", [authenticateRoute], Languages.update);

  //Delete a Setting for stories
  router.delete("/languages/:id", [authenticateRoute], Languages.delete);

  // Retrieve a single characters with id
  router.get("/languages/", Languages.findAll);

  app.use("/storiesapi", router);

}; 