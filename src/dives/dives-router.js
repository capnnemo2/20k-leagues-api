const express = require("express");
const DivesService = require("./dives-service");

const divesRouter = express.Router();

divesRouter.route("/").get((req, res, next) => {
  DivesService.getAllDives(req.app.get("db"))
    .then((dives) => {
      res.json(dives);
    })
    .catch(next);
});

module.exports = divesRouter;
