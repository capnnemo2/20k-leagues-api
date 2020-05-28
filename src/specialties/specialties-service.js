const SpecialtiesService = {
  getAllSpecialties(db) {
    return db.from("specialties").select("*");
  },
  getSpecById(db, id) {
    return db.from("specialties").select("*").where("id", id).first();
  },
};

module.exports = SpecialtiesService;
