const express = require("express");
const AnimalTrackerService = require("./animalTracker-service");

const animalTrackerRouter = express.Router();
const jsonParser = express.json();

animalTrackerRouter
  .route("/")
  .get((req, res, next) => {
    AnimalTrackerService.getAllAnimalsTracked(req.app.get("db"))
      .then((animalsTracked) => {
        res.json(animalsTracked);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const newAnimalsTracked = req.body;

    newAnimalsTracked.forEach((animal) => {
      let newAnimalTracked = {};
      newAnimalTracked.animal = animal.animal;
      newAnimalTracked.country = animal.country;
      newAnimalTracked.region = animal.region;
      // TODO add user id
      newAnimalTracked.user_id = animal.user_id;

      for (const [key, value] of Object.entries(newAnimalTracked)) {
        if (value == null) {
          return res
            .status(400)
            .json({ error: { message: `Missing '${key}' in request body` } });
        }
      }
    });

    AnimalTrackerService.insertAnimalsTracked(
      req.app.get("db"),
      newAnimalsTracked
    )
      .then((animal) => {
        res.status(201).json(animal);
      })
      .catch(next);
  })
  .delete(jsonParser, (req, res, next) => {
    for (const item of req.body) {
      let animalInstance = {};
      animalInstance.animal = item.animal;
      animalInstance.region = item.region;
      // TODO add user id
      animalInstance.user_id = item.user_id;

      for (const [key, value] of Object.entries(animalInstance)) {
        if (value == null) {
          return res
            .status(400)
            .json({ error: { message: `Missing '${key}' in request body` } });
        }
      }
    }

    const animalToRemove = req.body;

    AnimalTrackerService.deleteAnimalTracked(
      req.app.get("db"),
      animalToRemove[0].id
    )
      .then((numRowsAffected) => {
        if (!numRowsAffected) {
          res.status(404).json({ error: { message: `Animal doesn't exist` } });
        } else {
          res.status(204).end();
        }
      })
      .catch(next);
  });

animalTrackerRouter.route("/animal/:animal").get((req, res, next) => {
  AnimalTrackerService.getByAnimal(req.app.get("db"), req.params.animal).then(
    (animal) => {
      if (!animal.length) {
        return res
          .status(404)
          .json({ error: { message: `Animal doesn't exist` } });
      }
      res.animal = animal;
      res.json(res.animal);
      next();
    }
  );
});

animalTrackerRouter.route("/region/:region").get((req, res, next) => {
  AnimalTrackerService.getByRegion(req.app.get("db"), req.params.region).then(
    (region) => {
      if (!region.length) {
        return res
          .status(404)
          .json({ error: { message: `Region doesn't exist` } });
      }
      res.region = region;
      res.json(res.region);
      next();
    }
  );
});

// this works, but I don't need it -> delete it?
animalTrackerRouter.route("/:animal_id").get((req, res, next) => {
  AnimalTrackerService.getById(req.app.get("db"), req.params.animal_id).then(
    (entry) => {
      if (!entry) {
        return res
          .status(404)
          .json({ error: { message: `Entry doesn't exist` } });
      }
      res.entry = entry;
      res.json(res.entry);
      next();
    }
  );
});

module.exports = animalTrackerRouter;
