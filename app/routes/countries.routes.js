module.exports = (app) => {
    const Countries = require("../controllers/countries.controller.js");
    var router = require("express").Router();

// Create a new Setting for a Stories
router.post(
    "/countries/",
    Countries.create
  );

  //Delete a Setting for stories
  router.delete("/countries/:id", Countries.delete);

  // Retrieve a single countries with id
  router.get("/countries/", Countries.findAll);

  app.use("/storiesapi", router);
    
}; 