const xss = require("xss");

const DivesService = {
  getAllDives(db) {
    return db.from("dives").select("*");
  },
  getById(db, id) {
    return db.from("dives").select("*").where("dives.id", id).first();
  },
  getByUserId(db, user_id) {
    return db.from("dives").select("*").where("user_id", user_id);
  },
  insertDive(db, newDive) {
    return db
      .insert(newDive)
      .into("dives")
      .returning("*")
      .then(([dive]) => dive)
      .then((dive) => DivesService.getById(db, dive.id));
  },
  serializeDive(d) {
    return {
      id: d.id,
      dive_date: d.dive_date,
      country: d.country,
      region: d.region,
      dive_site: xss(d.dive_site),
      // do we need to do xss for all open input fields, even if they're marked as number/integer?
      max_depth: xss(d.max_depth),
      duration: xss(d.duration),
      water_temp: xss(d.water_temp),
      user_id: d.user_id,
      dive_shop: xss(d.dive_shop),
      guide: xss(d.guide),
      buddy: xss(d.buddy),
      viz: d.viz,
      dive_type: d.dive_type,
      drift_dive: d.drift_dive,
      night_dive: d.night_dive,
      description: xss(d.description),
      animals_spotted: d.animals_spotted,
      rating: d.rating,
    };
  },
  deleteDive(db, id) {
    return DivesService.getAllDives(db).where({ id }).delete();
  },
  updateDive(db, id, newDiveFields) {
    return DivesService.getAllDives(db).where({ id }).update(newDiveFields);
  },
};

module.exports = DivesService;
