const express = require("express");
const CertsService = require("./certs-service");

const certsRouter = express.Router();
const jsonParser = express.json();

certsRouter
  .route("/")
  .get((req, res, next) => {
    CertsService.getAllCerts(req.app.get("db"))
      .then((certs) => {
        res.json(certs);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { agency, cert_level, cert_num, cert_date, user_id } = req.body;
    const newCert = { agency, cert_level, cert_num, cert_date, user_id };

    for (const [key, value] of Object.entries(newCert))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    CertsService.insertCert(req.app.get("db"), newCert)
      .then((cert) => {
        res.status(201).json(CertsService.serializeCert(cert));
      })
      .catch(next);
  });

module.exports = certsRouter;
