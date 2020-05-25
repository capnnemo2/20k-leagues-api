const CountriesService = {
  getAllCountries(db) {
    return db.from("countries").select("*");
  },
};

module.exports = CountriesService;
