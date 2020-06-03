const express = require("express");
const CertsService = require("./certs-service");
const { requireAuth } = require("../middleware/jwt-auth");

const certsRouter = express.Router();
const jsonParser = express.json();

certsRouter
  .route("/")
  .get((req, res, next) => {
    // do I ever want to get all certs for all users? nope
    // CHANGE CertsService.getAllCerts ---> CertsService.getByUserId
    // which actually means that I don't need this GET endpoint at all
    // I need to create a new route: (/api/certs/)user/:user_id
    // OR
    // keep this one, get all certs and filter client-side...
    CertsService.getAllCerts(req.app.get("db"))
      .then((certs) => {
        res.json(certs.map(CertsService.serializeCert));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
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
  .route("/:cert_id")
  .all(requireAuth)
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
  // do I ever need to get a cert by it's id? or can I get rid of this endpoint?
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

certsRouter.route("/");

module.exports = certsRouter;
