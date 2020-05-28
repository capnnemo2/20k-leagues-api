const express = require("express");
const CertsService = require("./certs-service");

const certsRouter = express.Router();
const jsonParser = express.json();

certsRouter
  .route("/")
  .get((req, res, next) => {
    CertsService.getAllCerts(req.app.get("db"))
      .then((certs) => {
        res.json(certs.map(CertsService.serializeCert));
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

certsRouter
  // if I'm going for user specific certs, does this become '/:user_id/:cert_id' ?
  .route("/:cert_id")
  .all((req, res, next) => {
    CertsService.getById(req.app.get("db"), req.params.cert_id)
      .then((cert) => {
        if (!cert) {
          return res
            .status(404)
            .json({ error: { message: `Cert doesn't exist` } });
        }
        res.cert = cert;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(CertsService.serializeCert(res.cert));
  })
  .delete((req, res, next) => {
    CertsService.deleteCert(req.app.get("db"), req.params.cert_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

// I never need to grab ALL certs
// I need to all the certs for a given user

// certsRouter.route("/:user_id");

module.exports = certsRouter;
