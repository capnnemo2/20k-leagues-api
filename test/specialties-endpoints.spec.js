const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const { TEST_DATABASE_URL } = require("../src/config");

describe("specialties endpoints", function () {
  let db;

  const { testSpecialties } = helpers.makeFixtures();

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

  describe(`GET /api/specialties`, () => {
    context(`Given there are specialties in the database`, () => {
      beforeEach("insert specialties", () => {
        return helpers.seedSpecialties(db, testSpecialties);
      });

      it(`responds with 200 and all of the specials`, () => {
        const expectedSpecialties = testSpecialties.map((spec) =>
          helpers.makeExpectedSpecialty(spec)
        );
        return supertest(app)
          .get("/api/specialties")
          .expect(200, expectedSpecialties);
      });
    });
  });

  describe(`GET /api/specialties/:spec_id`, () => {
    context(`Given there are specialties in the database`, () => {
      beforeEach("insert specialties", () => {
        return helpers.seedSpecialties(db, testSpecialties);
      });

      it(`responds with 200 and the specified specialty`, () => {
        const specId = 2;
        const expectedSpec = helpers.makeExpectedSpecialty(
          testSpecialties[specId - 1]
        );

        return supertest(app)
          .get(`/api/specialties/${specId}`)
          .expect(200, expectedSpec);
      });
    });
  });
});
