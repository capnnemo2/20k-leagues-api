const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const { TEST_DATABASE_URL } = require("../src/config");

describe("animals endpoints", function () {
  let db;

  const { testAnimals } = helpers.makeFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`GET /api/animals`, () => {
    context(`Given there are animals in the database`, () => {
      beforeEach("insert animals", () => {
        return helpers.seedAnimals(db, testAnimals);
      });

      it(`responds with 200 and all of the animals`, () => {
        const expectedAnimals = testAnimals.map((animal) =>
          helpers.makeExpectedAnimal(animal)
        );
        return supertest(app).get("/api/animals").expect(200, expectedAnimals);
      });
    });
  });

  describe(`GET /api/animals/:animal_id`, () => {
    context(`Given there are animals in the database`, () => {
      beforeEach("insert animals", () => {
        return helpers.seedAnimals(db, testAnimals);
      });

      it(`responds with 200 and the specified animal`, () => {
        const animalId = 2;
        const expectedAnimal = helpers.makeExpectedAnimal(
          testAnimals[animalId - 1]
        );

        return supertest(app)
          .get(`/api/animals/${animalId}`)
          .expect(200, expectedAnimal);
      });
    });
  });
});
