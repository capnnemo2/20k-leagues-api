const AnimalsService = {
  getAllAnimals(db) {
    return db.from("animals").select("*");
  },
  getAnimalById(db, id) {
    return db.from("animals").select("*").where("id", id).first();
  },
};

module.exports = AnimalsService;
