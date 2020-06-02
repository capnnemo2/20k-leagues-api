const express = require("express");
const DivesService = require("./dives-service");

const divesRouter = express.Router();
const jsonParser = express.json();

divesRouter
  .route("/")
  .get((req, res, next) => {
    // do I ever need to get all the dives for all the users? nope, don't think so
    // therefore, I can scrap this endpoint
    // but need to create a new one: (/api/dives)/user/:user_id
    // this will fetch only the dives for a given user
    DivesService.getAllDives(req.app.get("db"))
      .then((dives) => {
        res.json(dives.map(DivesService.serializeDive));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      dive_date,
      country,
      region,
      dive_site,
      max_depth,
      duration,
      water_temp,
      dive_shop,
      guide,
      buddy,
      viz,
      dive_type,
      drift_dive,
      night_dive,
      description,
      animals_spotted,
      rating,
      user_id,
    } = req.body;
    const newDive = { user_id, dive_date, country, region, dive_site, rating };

    for (const [key, value] of Object.entries(newDive)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing '${key}' in request body` } });
      }
    }

    newDive.max_depth = max_depth;
    newDive.duration = duration;
    newDive.water_temp = water_temp;
    newDive.dive_shop = dive_shop;
    newDive.guide = guide;
    newDive.buddy = buddy;
    newDive.viz = viz;
    newDive.dive_type = dive_type;
    newDive.drift_dive = drift_dive;
    newDive.night_dive = night_dive;
    newDive.description = description;
    newDive.animals_spotted = animals_spotted;
    newDive.user_id = user_id;

    DivesService.insertDive(req.app.get("db"), newDive)
      .then((dive) => {
        res.status(201).json(DivesService.serializeDive(dive));
      })
      .catch(next);
  });

divesRouter
  .route("/:dive_id")
  .all((req, res, next) => {
    DivesService.getById(req.app.get("db"), req.params.dive_id).then((dive) => {
      if (!dive) {
        return res
          .status(404)
          .json({ error: { message: `Dive doesn't exist` } });
      }
      res.dive = dive;
      next();
    });
  })
  .get((req, res, next) => {
    res.json(DivesService.serializeDive(res.dive));
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      user_id,
      dive_date,
      country,
      region,
      dive_site,
      max_depth,
      duration,
      water_temp,
      dive_shop,
      guide,
      buddy,
      viz,
      dive_type,
      drift_dive,
      night_dive,
      description,
      animals_spotted,
      rating,
    } = req.body;
    const diveToUpdate = {
      user_id,
      dive_date,
      country,
      region,
      dive_site,
      max_depth,
      duration,
      water_temp,
      dive_shop,
      guide,
      buddy,
      viz,
      dive_type,
      drift_dive,
      night_dive,
      description,
      animals_spotted,
      rating,
    };

    const numberOfValues = Object.values(diveToUpdate).filter(Boolean).length;
    if (numberOfValues < 6) {
      return res.status(400).json({
        error: {
          message: `Request body must contain 'user_id', 'dive_date', 'dive_site', 'country', 'region', and 'rating'`,
        },
      });
    }

    DivesService.updateDive(req.app.get("db"), req.params.dive_id, diveToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    DivesService.deleteDive(req.app.get("db"), req.params.dive_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = divesRouter;
