const AnimalTrackerService = {
  getAllAnimalsTracked(db) {
    return db.from("animaltracker").select("*");
  },
  getByAnimal(db, animal) {
    return db.from("animaltracker").select("*").where("animal", animal);
  },
  getByCountry(db, country) {
    return db.from("animaltracker").select("*").where("country", country);
  },
};

module.exports = AnimalTrackerService;
