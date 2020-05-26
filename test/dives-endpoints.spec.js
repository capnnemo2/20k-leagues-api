const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const { TEST_DATABASE_URL } = require("../src/config");

describe("dives endpoints", function () {
  let db;

  const { testDives } = helpers.makeFixtures();

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

  describe(`GET /api/dives`, () => {
    context(`Given there are no dives in the database`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/dives").expect(200, []);
      });
    });

    context(`Given there are dives in the database`, () => {
      beforeEach("insert dives", () => {
        console.log("test dives: ", testDives);

        return helpers.seedDives(db, testDives);
      });

      it(`responds with 200 and all of the dives`, () => {
        const expectedDives = testDives.map((dive) =>
          helpers.makeExpectedDive(dive)
        );
        return supertest(app).get("/api/dives").expect(200, expectedDives);
      });
    });
  });
});
