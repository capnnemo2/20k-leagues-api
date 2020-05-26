const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const { TEST_DATABASE_URL } = require("../src/config");

describe("animalTracker", function () {
  let db;

  const { testAnimalsTracked } = helpers.makeFixtures();

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

  describe(`GET /api/animalTracker`, () => {
    context(`Given no animals have been tracked`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/animalTracker").expect(200, []);
      });
    });

    context(`Given there are animals that have been tracked`, () => {
      beforeEach("insert animals tracked", () => {
        return helpers.seedAnimalsTracked(db, testAnimalsTracked);
      });

      it(`responds with 200 and all of the animals tracked`, () => {
        const expectedAnimalsTracked = testAnimalsTracked.map((animal) =>
          helpers.makeExpectedAnimalTracked(animal)
        );
        return supertest(app)
          .get("/api/animalTracker")
          .expect(200, expectedAnimalsTracked);
      });
    });
  });

  describe(`GET /api/animalTracker/:animal`, () => {
    context(`Given there are animals that have been tracked`, () => {
      beforeEach("insert animals tracked", () => {
        return helpers.seedAnimalsTracked(db, testAnimalsTracked);
      });

      it(`responds with 200 and a list of the specified animal`, () => {
        const animal = "Whale Shark";
        const expectedAnimal = helpers
          .makeExpectedAnimalTracked
          //   does this mean I have to use the animal id from animals for this???
          // and then to search by country, use the country id from countries?
          ();
      });
    });
  });
});
