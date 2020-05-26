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
// need a POST endpoint here

animalTrackerRouter
  .route("/:animal")
  .all((req, res, next) => {
    AnimalTrackerService.getByAnimal(req.app.get("db"), req.params.animal).then(
      (animal) => {
        if (!animal) {
          return res
            .status(404)
            .json({ error: { message: `Animal doesn't exist` } });
        }
        res.animal = animal;

        next();
      }
    );
  })
  .get((req, res, next) => {
    console.log(req.params.animal);
    res.json(res.animal);
  });

module.exports = animalTrackerRouter;
