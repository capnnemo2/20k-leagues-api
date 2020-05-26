const express = require("express");
const AnimalsService = require("./animals-service");

const animalsRouter = express.Router();

animalsRouter.route("/").get((req, res, next) => {
  AnimalsService.getAllAnimals(req.app.get("db"))
    .then((animals) => {
      res.json(animals);
    })
    .catch(next);
});

// animalsRouter.route("/:animal_id").get((req, res, next) => {
//   AnimalsService.getAnimalById(req.app.get("db"), req.params.animal_id)
//     .then((animal) => {
//       if (!animal) {
//         return res
//           .status(404)
//           .json({ error: { message: `Animal doesn't exist` } });
//       }
//       res.animal = animal;
//       next();
//     })
//     .catch(next)
//     .then(res.json());
// });

animalsRouter
  .route("/:animal_id")
  .all((req, res, next) => {
    AnimalsService.getAnimalById(req.app.get("db"), req.params.animal_id).then(
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
    res.json(res.animal);
  });

module.exports = animalsRouter;
