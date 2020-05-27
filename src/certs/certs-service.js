const xss = require("xss");

const CertsService = {
  getAllCerts(db) {
    return db.from("certs").select("*");
  },
  getById(db, id) {
    return db.from("certs").select("*").where("certs.id", id).first();
  },
  getByUserId(db, userId) {
    return db.from("certs").select("*").where("certs.user_id", userId);
  },
  insertCert(db, newCert) {
    return db
      .insert(newCert)
      .into("certs")
      .returning("*")
      .then(([cert]) => cert)
      .then((cert) => CertsService.getById(db, cert.id));
  },
  serializeCert(cert) {
    return {
      id: cert.id,
      user_id: cert.user_id,
      agency: xss(cert.agency),
      cert_level: cert.cert_level,
      cert_num: xss(cert.cert_num),
      cert_date: cert.cert_date,
    };
  },
};

module.exports = CertsService;
