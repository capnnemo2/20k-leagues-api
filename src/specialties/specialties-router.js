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

specialtiesRouter
  .route("/:spec_id")
  .all((req, res, next) => {
    SpecialtiesService.getSpecById(req.app.get("db"), req.params.spec_id).then(
      (spec) => {
        if (!spec) {
          return res
            .status(404)
            .json({ error: { message: `Specialty doesn't exist` } });
        }
        res.spec = spec;
        next();
      }
    );
  })
  .get((req, res, next) => {
    res.json(res.spec);
  });

module.exports = specialtiesRouter;
