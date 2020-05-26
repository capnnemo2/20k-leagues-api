const express = require("express");
const CertsService = require("./certs-service");

const certsRouter = express.Router();

certsRouter.route("/").get((req, res, next) => {
  CertsService.getAllCerts(req.app.get("db"))
    .then((certs) => {
      res.json(certs);
    })
    .catch(next);
});

module.exports = certsRouter;
