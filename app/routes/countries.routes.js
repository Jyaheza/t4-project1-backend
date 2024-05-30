module.exports = (app) => {
  const Countries = require("../controllers/countries.controller.js");
  var router = require("express").Router();
  const { authenticateRoute } = require("../authentication/authentication");


  // Create a new Setting for a Stories
  router.post(
    "/countries/",
    [authenticateRoute],
    Countries.create
  );

  //Update a countries with ID
  router.put("/countries/:id", [authenticateRoute], Countries.update);

  //Delete a Setting for stories
  router.delete("/countries/:id", [authenticateRoute], Countries.delete);

  // Retrieve a single countries with id
  router.get("/countries/", Countries.findAll);

  app.use("/storiesapi", router);

}; 