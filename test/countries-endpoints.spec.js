const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const { TEST_DATABASE_URL } = require("../src/config");

describe("countries endpoints", function () {
  let db;

  const { testCountries } = helpers.makeFixtures();

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

  describe(`GET /api/countries`, () => {
    context(`Given there are countries in the database`, () => {
      beforeEach("insert countries", () => {
        return helpers.seedCountries(db, testCountries);
      });

      it(`responds with 200 and all of the countries`, () => {
        const expectedCountries = testCountries.map((country) =>
          helpers.makeExpectedCountry(country)
        );
        return supertest(app)
          .get("/api/countries")
          .expect(200, expectedCountries);
      });
    });
  });
});
