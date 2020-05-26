const DivesService = {
  getAllDives(db) {
    return db.from("dives").select("*");
  },
  // I want to grab all of the dives with the same user id
  getDivesById(db, user_id) {
    return db.from("dives").select("*").where("user_id", user_id);
  },
};

module.exports = DivesService;
