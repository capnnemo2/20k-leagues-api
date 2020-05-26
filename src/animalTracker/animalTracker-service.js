const AnimalTrackerService = {
  getAllAnimalsTracked(db) {
    return db.from("animaltracker").select("*");
  },
};

module.exports = AnimalTrackerService;
