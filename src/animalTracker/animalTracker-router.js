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
    const { animal, country, region } = req.body;
    const newAnimalTracked = { animal, country, region };

    for (const [key, value] of Object.entries(newAnimalTracked)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing '${key}' in request body` } });
      }
    }

    AnimalTrackerService.insertAnimalTracked(
      req.app.get("db"),
      newAnimalTracked
    )
      .then((animal) => {
        res.status(201).json(animal);
      })
      .catch(next);
  })
  .delete(jsonParser, (req, res, next) => {
    const { animal, region } = req.body;
    const animalInstance = { animal, region };

    for (const [key, value] of Object.entries(animalInstance)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing '${key}' in request body` } });
      }
    }

    AnimalTrackerService.updateAnimalsTracked(req.app.get("db"), animal, region)
      .then((numRowsAffected) => {
        if (!numRowsAffected) {
          res.status(404).json({ error: { message: "Animal doesn't exist" } });
        } else {
          res.status(204).end();
        }
      })
      .catch(next);
  });

animalTrackerRouter.route("/animal/:animal").get((req, res, next) => {
  AnimalTrackerService.getByAnimal(req.app.get("db"), req.params.animal).then(
    (animal) => {
      console.log({ animal });
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

// this works, but I don't need it
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
