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
      divedate: "2020-05-04",
      country: "Cayman Islands",
      region: "Grand Cayman, West",
      divesite: "Cheeseburger Reef",
      maxdepth: 35,
      duration: 90,
      watertemp: 82,
      diveshop: "Lobster Pot",
      guide: "",
      buddy: "",
      viz: 4,
      divetype: "Shore",
      driftdive: false,
      nightdive: false,
      description: "So warm and clear.",
      animalsspotted: [1, 2],
      rating: 4,
    },
    {
      id: 2,
      user_id: 1,
      divedate: "2020-05-05",
      country: "Cayman Islands",
      region: "Grand Cayman, West",
      divesite: "Cheeseburger Reef",
      maxdepth: 30,
      duration: 45,
      watertemp: 83,
      diveshop: "Lobster Pot",
      guide: "",
      buddy: "",
      viz: 4,
      divetype: "Shore",
      driftdive: false,
      nightdive: false,
      description: "So warm and clear.",
      animalsspotted: [],
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
  return db.into("dives").insert(dives);
}

function seedUsersAndDives(db, users, dives) {
  return db
    .into("users")
    .insert(users)
    .then(() => dives.length && db.into("dives").insert(dives));
}

// ANIMALTRACKER
function makeAnimalsTrackedArray() {
  return [
    {
      id: 1,
      animal: "Whale Shark",
      country: "United States of America",
      region: "Hawaii",
    },
    {
      id: 2,
      animal: "Mola Mola",
      country: "Indonesia",
      region: "Bali, Nusa Lembongan, Nusa Penida",
    },
    {
      id: 3,
      animal: "Manta Ray",
      country: "Indonesia",
      region: "Komodo",
    },
  ];
}

function makeExpectedAnimalTracked(animal) {
  return {
    id: animal.id,
    animal: animal.animal,
    country: animal.country,
    region: animal.region,
  };
}

function seedAnimalsTracked(db, animals) {
  return db.into("animaltracker").insert(animals);
}

// EVERYTHING
function makeFixtures() {
  const testCountries = makeCountriesArray();
  const testAnimals = makeAnimalsArray();
  const testSpecialties = makeSpecialtiesArray();
  const testDives = makeDivesArray();
  const testAnimalsTracked = makeAnimalsTrackedArray();
  return {
    testCountries,
    testAnimals,
    testSpecialties,
    testDives,
    testAnimalsTracked,
  };
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
  seedUsersAndDives,

  makeAnimalsTrackedArray,
  makeExpectedAnimalTracked,
  seedAnimalsTracked,

  makeFixtures,
  cleanTables,
};
