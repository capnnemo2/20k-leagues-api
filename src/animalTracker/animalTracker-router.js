const express = require("express");
const AnimalTrackerService = require("./animalTracker-service");

const animalTrackerRouter = express.Router();

animalTrackerRouter.route("/").get((req, res, next) => {
  AnimalTrackerService.getAllAnimalsTracked(req.app.get("db"))
    .then((animalsTracked) => {
      res.json(animalsTracked);
    })
    .catch(next);
});

module.exports = animalTrackerRouter;
