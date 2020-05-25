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

module.exports = animalsRouter;
