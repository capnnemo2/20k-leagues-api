// COUNTRIES
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

// ANIMALS
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

// SPECIALTIES
function makeSpecialtiesArray() {
  return [
    {
      id: 1,
      spec_name: "Altitude Diver",
    },
    {
      id: 2,
      spec_name: "Boat Diver",
    },
    {
      id: 3,
      spec_name: "Cavern Diver",
    },
  ];
}

function makeExpectedSpecialty(specialty) {
  return {
    id: specialty.id,
    spec_name: specialty.spec_name,
  };
}

function seedSpecialties(db, specialties) {
  return db.into("specialties").insert(specialties);
}

// DIVES
function makeDivesArray() {
  return [
    {
      id: 1,
      user_id: 1,
      diveDate: "2020-05-04",
      country: "Cayman Islands",
      region: "Grand Cayman, West",
      diveSite: "Cheeseburger Reef",
      maxDepth: 35,
      duration: 90,
      waterTemp: 82,
      diveShop: "Lobster Pot",
      guide: "",
      buddy: "",
      viz: 4,
      diveType: "Shore",
      driftDive: false,
      nightDive: false,
      description: "So warm and clear.",
      animalsSpotted: [1, 2],
      rating: 4,
    },
    {
      id: 2,
      user_id: 1,
      diveDate: "2020-05-05",
      country: "Cayman Islands",
      region: "Grand Cayman, West",
      diveSite: "Cheeseburger Reef",
      maxDepth: 30,
      duration: 45,
      waterTemp: 83,
      diveShop: "Lobster Pot",
      guide: "",
      buddy: "",
      viz: 4,
      diveType: "Shore",
      driftDive: false,
      nightDive: false,
      description: "So warm and clear.",
      animalsSpotted: [],
      rating: 2,
    },
  ];
}

function makeExpectedDive(dive) {
  return {
    id: dive.id,
    user_id: dive.user_id,
    diveDate: dive.diveDate,
    country: dive.country,
    region: dive.region,
    diveSite: dive.diveSite,
    maxDepth: dive.maxDepth,
    duration: dive.duration,
    waterTemp: dive.waterTemp,
    diveShop: dive.diveShop,
    guide: dive.guide,
    buddy: dive.buddy,
    viz: dive.viz,
    diveType: dive.diveType,
    driftDive: dive.driftDive,
    nightDive: dive.nightDive,
    description: dive.description,
    animalsSpotted: dive.animalsSpotted,
    rating: dive.rating,
  };
}

function seedDives(db, dives) {
  console.log("seed dives: ", dives);
  return db.into("dives").insert(dives);
}

// EVERYTHING
function makeFixtures() {
  const testCountries = makeCountriesArray();
  const testAnimals = makeAnimalsArray();
  const testSpecialties = makeSpecialtiesArray();
  const testDives = makeDivesArray();
  return { testCountries, testAnimals, testSpecialties, testDives };
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

  makeSpecialtiesArray,
  makeExpectedSpecialty,
  seedSpecialties,

  makeDivesArray,
  makeExpectedDive,
  seedDives,

  makeFixtures,
  cleanTables,
};
