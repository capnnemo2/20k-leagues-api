const CertsService = {
  getAllCerts(db) {
    return db.from("certs").select("*");
  },
};

module.exports = CertsService;
