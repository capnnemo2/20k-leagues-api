const AnimalsService = {
  getAllAnimals(db) {
    return db.from("animals").select("*");
  },
};

module.exports = AnimalsService;
