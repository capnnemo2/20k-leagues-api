const AnimalTrackerService = {
  getAllAnimalsTracked(db) {
    return db.from("animaltracker").select("*");
  },
  getById(db, id) {
    return db.from("animaltracker").select("*").where("id", id).first();
  },
  getByAnimal(db, animal) {
    return db.from("animaltracker").select("*").where("animal", animal);
  },
  getByRegion(db, region) {
    return db.from("animaltracker").select("*").where("region", region);
  },
  insertAnimalsTracked(db, newAnimals) {
    return db.insert(newAnimals).into("animaltracker").returning("*");
  },
  deleteAnimalTracked(db, id) {
    return AnimalTrackerService.getById(db, id).delete();
  },
};

module.exports = AnimalTrackerService;
