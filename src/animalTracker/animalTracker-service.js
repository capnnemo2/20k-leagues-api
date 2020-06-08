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

  insertAnimalTracked(db, newAnimal) {
    return db
      .insert(newAnimal)
      .into("animaltracker")
      .returning("*")
      .then(([animal]) => animal)
      .then((animal) => AnimalTrackerService.getById(db, animal.id));
  },

  // which of these fns is being used?? need to check, get rid of the other one!
  updateAnimalsTracked(db, animal, region) {
    return AnimalTrackerService.getByAnimal(db, animal)
      .where("region", region)
      .delete()
      .limit(1);
  },
  updateTracked(db, animal, region) {
    return db
      .from("animaltracker")
      .select("*")
      .where("animal", animal)
      .andWhere("region", region)
      .delete()
      .limit(1);
  },
};

module.exports = AnimalTrackerService;
