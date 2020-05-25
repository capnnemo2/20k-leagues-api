function makeCountriesArray() {
  return [
    {
      id: 1,
      country_name: "United States of America",
      regions: ["Hawaii", "Pacific Northwest", "Florida", "California"],
    },
    {
      id: 2,
      country_name: "Mexico",
      regions: ["Riviera Maya", "Baja", "Revillagigedo Islands", "Cozumel"],
    },
    {
      id: 3,
      country_name: "Australia",
      regions: [
        "Great Barrier Reef",
        "SS Yongala",
        "Western Australia",
        "Southern Australia",
        "Tasmania",
      ],
    },
  ];
}

function makeExpectedCountry(country) {
  return {
    id: country.id,
    country_name: country.country_name,
    regions: country.regions,
  };
}

function seedCountries(db, countries) {
  return db.into("countries").insert(countries);
}

function makeAnimalsArray() {
  return [
    {
      id: 1,
      animal: "Whale Shark",
    },
    {
      id: 2,
      animal: "Mola Mola",
    },
    {
      id: 3,
      animal: "Thresher Shark",
    },
  ];
}

function makeExpectedAnimal(animal) {
  return {
    id: animal.id,
    animal: animal.animal,
  };
}

function seedAnimals(db, animals) {
  return db.into("animals").insert(animals);
}

function makeFixtures() {
  const testCountries = makeCountriesArray();
  const testAnimals = makeAnimalsArray();
  return { testCountries, testAnimals };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
            users,
            certs,
            dives,
            specialties,
            countries,
            animals,
            animalTracker
            RESTART IDENTITY CASCADE`
  );
}

module.exports = {
  makeCountriesArray,
  makeExpectedCountry,
  seedCountries,

  makeAnimalsArray,
  makeExpectedAnimal,
  seedAnimals,

  makeFixtures,
  cleanTables,
};
