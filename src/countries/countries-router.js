const express = require("express");
const CountriesService = require("./countries-service");

const countriesRouter = express.Router();

countriesRouter.route("/").get((req, res, next) => {
  CountriesService.getAllCountries(req.app.get("db"))
    .then((countries) => {
      res.json(countries);
    })
    .catch(next);
});

module.exports = countriesRouter;
