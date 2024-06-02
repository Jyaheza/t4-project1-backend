module.exports = (app) => {
  const Characters = require("../controllers/characters.controller.js");
  var router = require("express").Router();
  const { authenticateRoute } = require("../authentication/authentication");


  // Create a new Setting for a Stories
  router.post(
    "/characters/",
    [authenticateRoute],
    Characters.create
  );

  //Update a countries with ID
  router.put("/characters/:id", [authenticateRoute], Characters.update);

  //Delete a Setting for stories
  router.delete("/characters/:id", [authenticateRoute], Characters.delete);

  // Retrieve a single characters with id
  router.get("/characters/", Characters.findAll);

  app.use("/storiesapi", router);

}; 