const express = require("express");
const SpecialtiesService = require("./specialties-service");

const specialtiesRouter = express.Router();

specialtiesRouter.route("/").get((req, res, next) => {
  SpecialtiesService.getAllSpecialties(req.app.get("db"))
    .then((specs) => {
      res.json(specs);
    })
    .catch(next);
});

module.exports = specialtiesRouter;
