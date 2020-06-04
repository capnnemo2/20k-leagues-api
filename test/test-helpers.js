const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

// USERS
function makeUsersArray() {
  return [
    {
      id: 2,
      first_name: "Bob",
      email: "bob@email.com",
      password: "P@ssword1",
      specialties: [1, 2],
      instructor_specialties: [],
      wishlist: [1, 2, 3, 4, 5],
      wishlist_fulfilled: [],
    },
    {
      id: 3,
      first_name: "Tim",
      email: "tim@email.com",
      password: "pop",
      specialties: [3, 4],
      instructor_specialties: [],
      wishlist: [6, 7, 8, 9],
      wishlist_fulfilled: [],
    },
  ];
}

function makeExpectedUser(user) {
  return {
    id: user.id,
    first_name: user.first_name,
    email: user.email,
    password: user.password,
    specialties: user.specialties,
    instructor_specialties: user.instructor_specialties,
    wishlist: user.wishlist,
    wishlist_fulfilled: user.wishlist_fulfilled,
  };
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));

  return db
    .into("users")
    .insert(preppedUsers)
    .then(() =>
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    );
}

function makeMaliciousUser() {
  const maliciousUser = {
    id: 911,
    first_name: '<script>alert("xss");</script>',
    email: '<script>alert("xss");</script>',
    password: '<script>alert("xss");</script>',
  };

  const expectedUser = {
    id: 911,
    first_name: '&lt;script&gt;alert("xss");&lt;/script&gt;',
    email: '&lt;script&gt;alert("xss");&lt;/script&gt;',
    password: '&lt;script&gt;alert("xss");&lt;/script&gt;',
  };

  return {
    maliciousUser,
    expectedUser,
  };
}

function seedMaliciousUser(db, user) {
  return db.into("users").insert([user]);
}

// DIVES
function makeDivesArray(users) {
  return [
    {
      id: 1,
      user_id: users[0].id,
      dive_date: "2020-05-04T00:00:00.000Z",
      country: "Cayman Islands",
      region: "Grand Cayman, West",
      dive_site: "Cheeseburger Reef",
      max_depth: "35",
      duration: "90",
      water_temp: "82",
      dive_shop: "Lobster Pot",
      guide: "",
      buddy: "",
      viz: 4,
      dive_type: "Shore",
      drift_dive: "false",
      night_dive: "false",
      description: "So warm and clear.",
      animals_spotted: [1, 2],
      rating: 4,
    },
    {
      id: 2,
      user_id: users[users.length - 1].id,
      dive_date: "2020-05-05T00:00:00.000Z",
      country: "Cayman Islands",
      region: "Grand Cayman, West",
      dive_site: "Cheeseburger Reef",
      max_depth: "30",
      duration: "45",
      water_temp: "83",
      dive_shop: "Lobster Pot",
      guide: "",
      buddy: "",
      viz: 4,
      dive_type: "Shore",
      drift_dive: "false",
      night_dive: "false",
      description: "So warm and clear.",
      animals_spotted: [],
      rating: 2,
    },
  ];
}

function makeExpectedDive(dive) {
  return {
    id: dive.id,
    user_id: dive.user_id,
    dive_date: dive.dive_date,
    country: dive.country,
    region: dive.region,
    dive_site: dive.dive_site,
    max_depth: dive.max_depth,
    duration: dive.duration,
    water_temp: dive.water_temp,
    dive_shop: dive.dive_shop,
    guide: dive.guide,
    buddy: dive.buddy,
    viz: dive.viz,
    dive_type: dive.dive_type,
    drift_dive: dive.drift_dive,
    night_dive: dive.night_dive,
    description: dive.description,
    animals_spotted: dive.animals_spotted,
    rating: dive.rating,
  };
}

function makeExpectedUserDives(userId, dives) {
  const expectedDives = dives.filter((dive) => dive.user_id === userId);
  return expectedDives.map((dive) => {
    return {
      id: dive.id,
      user_id: dive.user_id,
      dive_date: dive.dive_date,
      country: dive.country,
      region: dive.region,
      dive_site: dive.dive_site,
      max_depth: dive.max_depth,
      duration: dive.duration,
      water_temp: dive.water_temp,
      dive_shop: dive.dive_shop,
      guide: dive.guide,
      buddy: dive.buddy,
      viz: dive.viz,
      dive_type: dive.dive_type,
      drift_dive: dive.drift_dive,
      night_dive: dive.night_dive,
      description: dive.description,
      animals_spotted: dive.animals_spotted,
      rating: dive.rating,
    };
  });
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

function makeMaliciousDive(users) {
  const maliciousDive = {
    id: 911,
    user_id: users[0].id,
    dive_date: "2020-05-10T00:00:00.000Z",
    country: "dive country",
    region: "dive region",
    dive_site: '<script>alert("xss");</script>',
    max_depth: "5",
    duration: "5",
    water_temp: "5",
    dive_shop: '<script>alert("xss");</script>',
    guide: '<script>alert("xss");</script>',
    buddy: '<script>alert("xss");</script>',
    viz: 5,
    dive_type: "dive type",
    drift_dive: "drift dive",
    night_dive: "night dive",
    description: '<script>alert("xss");</script>',
    animals_spotted: [],
    rating: 5,
  };
  const expectedDive = {
    id: 911,
    user_id: users[0].id,
    dive_date: "2020-05-10T00:00:00.000Z",
    country: "dive country",
    region: "dive region",
    dive_site: '&lt;script&gt;alert("xss");&lt;/script&gt;',
    max_depth: "5",
    duration: "5",
    water_temp: "5",
    dive_shop: '&lt;script&gt;alert("xss");&lt;/script&gt;',
    guide: '&lt;script&gt;alert("xss");&lt;/script&gt;',
    buddy: '&lt;script&gt;alert("xss");&lt;/script&gt;',
    viz: 5,
    dive_type: "dive type",
    drift_dive: "drift dive",
    night_dive: "night dive",
    description: '&lt;script&gt;alert("xss");&lt;/script&gt;',
    animals_spotted: [],
    rating: 5,
  };
  return { maliciousDive, expectedDive };
}

function seedMaliciousDive(db, users, dive) {
  return db
    .into("users")
    .insert(users)
    .then(() =>
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    )
    .then(() => db.into("dives").insert([dive]));

  // is the correct way to include implementing seedUsers, which is hashing passwords?
  // return seedUsers(db, [users]).then(() => db.into('dives').insert([dive]))
}

// CERTS
function makeCertsArray(users) {
  return [
    {
      id: 1,
      user_id: users[0].id,
      agency: "test agency",
      cert_level: "test cert level",
      cert_num: "test cert num",
      cert_date: "test cert date",
    },
    {
      id: 2,
      user_id: users[users.length - 1].id,
      agency: "test agency",
      cert_level: "test cert level",
      cert_num: "test cert num",
      cert_date: "test cert date",
    },
  ];
}

function makeExpectedCert(cert) {
  return {
    id: cert.id,
    user_id: cert.user_id,
    agency: cert.agency,
    cert_level: cert.cert_level,
    cert_num: cert.cert_num,
    cert_date: cert.cert_date,
  };
}

function makeExpectedUserCerts(userId, certs) {
  const expectedCerts = certs.filter((cert) => cert.user_id === userId);
  return expectedCerts.map((c) => {
    return {
      id: c.id,
      user_id: c.user_id,
      agency: c.agency,
      cert_level: c.cert_level,
      cert_num: c.cert_num,
      cert_date: c.cert_date,
    };
  });
}

function seedCerts(db, certs) {
  return db.into("certs").insert(certs);
}

function seedUsersAndCerts(db, users, certs = []) {
  return db
    .into("users")
    .insert(users)
    .then(() => certs.length && db.into("certs").insert(certs));
}

function makeMaliciousCert(users) {
  const maliciousCert = {
    id: 911,
    user_id: users[0].id,
    agency: '<script>alert("xss");</script>',
    cert_level: "Course Director",
    cert_num: '<script>alert("xss");</script>',
    cert_date: "2020-05",
  };
  const expectedCert = {
    id: 911,
    user_id: users[0].id,
    agency: '&lt;script&gt;alert("xss");&lt;/script&gt;',
    cert_level: "Course Director",
    cert_num: '&lt;script&gt;alert("xss");&lt;/script&gt;',
    cert_date: "2020-05",
  };
  return { maliciousCert, expectedCert };
}

function seedMaliciousCert(db, users, cert) {
  return db
    .into("users")
    .insert(users)
    .then(() =>
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    )
    .then(() => db.into("certs").insert([cert]));

  // is the correct way to include implementing seedUsers, which is hashing passwords?
  // return seedUsers(db, [users]).then(() => db.into("certs").insert([cert]));
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
  const testUsers = makeUsersArray();
  const testCountries = makeCountriesArray();
  const testAnimals = makeAnimalsArray();
  const testSpecialties = makeSpecialtiesArray();
  const testDives = makeDivesArray(testUsers);
  const testCerts = makeCertsArray(testUsers);
  const testAnimalsTracked = makeAnimalsTrackedArray();

  return {
    testCountries,
    testAnimals,
    testSpecialties,
    testDives,
    testCerts,
    testAnimalsTracked,
    testUsers,
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

function seedUsersCertsAndDives(db, users, certs, dives) {
  return db.transaction(async (trx) => {
    await seedUsers(trx, users);
    await trx.into("certs").insert(certs);
    await trx.raw(`SELECT setval ('certs_id_seq', ?)`, [
      certs[certs.length - 1].id,
    ]);
    if (dives.length) {
      await trx.into("dives").insert(dives);
      await trx.raw(`SELECT setval 'dives_id_seq', ?`, [
        dives[dives.length - 1].id,
      ]);
    }
  });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
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

  makeUsersArray,
  makeExpectedUser,
  seedUsers,
  makeMaliciousUser,
  seedMaliciousUser,

  makeDivesArray,
  makeExpectedDive,
  makeExpectedUserDives,
  seedDives,
  seedUsersAndDives,
  makeMaliciousDive,
  seedMaliciousDive,

  makeCertsArray,
  makeExpectedCert,
  makeExpectedUserCerts,
  seedCerts,
  seedUsersAndCerts,
  makeMaliciousCert,
  seedMaliciousCert,

  makeAnimalsTrackedArray,
  makeExpectedAnimalTracked,
  seedAnimalsTracked,

  makeFixtures,
  cleanTables,

  seedUsersCertsAndDives,

  makeAuthHeader,
};
