const SpecialtiesService = {
  getAllSpecialties(db) {
    return db.from("specialties").select("*");
  },
};

module.exports = SpecialtiesService;
