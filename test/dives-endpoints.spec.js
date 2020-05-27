const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const { TEST_DATABASE_URL } = require("../src/config");

describe.only("dives endpoints", function () {
  let db;

  const { testUsers, testDives } = helpers.makeFixtures();

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
        // return helpers.seedDives(db, testDives);
        return helpers.seedUsersAndDives(db, testUsers, testDives);
      });

      it(`responds with 200 and all of the dives`, () => {
        const expectedDives = testDives.map((dive) =>
          helpers.makeExpectedDive(dive)
        );
        return supertest(app).get("/api/dives").expect(200, expectedDives);
      });
    });

    context(`Given an XSS attack dive`, () => {
      const { maliciousDive, expectedDive } = helpers.makeMaliciousDive(
        testUsers
      );
      beforeEach("insert malicious dive", () => {
        return helpers.seedMaliciousDive(db, testUsers, maliciousDive);
      });

      it(`removes XSS attack content`, () => {
        return supertest(app)
          .get("/api/dives")
          .expect(200)
          .expect((res) => {
            expect(res.body.dive_date).to.eql(expectedDive.dive_date);
            expect(res.body.country).to.eql(expectedDive.country);
            expect(res.body.region).to.eql(expectedDive.region);
            expect(res.body.dive_site).to.eql(expectedDive.dive_site);
            expect(res.body.max_depth).to.eql(expectedDive.max_depth);
            expect(res.body.duration).to.eql(expectedDive.duration);
            expect(res.body.water_temp).to.eql(expectedDive.water_temp);
            expect(res.body.dive_shop).to.eql(expectedDive.dive_shop);
            expect(res.body.guide).to.eql(expectedDive.guide);
            expect(res.body.buddy).to.eql(expectedDive.buddy);
            expect(res.body.viz).to.eql(expectedDive.viz);
            expect(res.body.dive_type).to.eql(expectedDive.dive_type);
            expect(res.body.drift_dive).to.eql(expectedDive.drift_dive);
            expect(res.body.night_dive).to.eql(expectedDive.night_dive);
            expect(res.body.description).to.eql(expectedDive.description);
            expect(res.body.animals_spotted).to.eql(
              expectedDive.animals_spotted
            );
            expect(res.body.rating).to.eql(expectedDive.rating);
          });
      });
    });
  });
});
