const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const { TEST_DATABASE_URL } = require("../src/config");

describe.only("certs endpoints", function () {
  let db;

  const { testUsers, testCerts } = helpers.makeFixtures();

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

  describe(`GET /api/certs`, () => {
    context(`Given there are no certs`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/certs").expect(200, []);
      });
    });

    context(`Given there are certs in the database`, () => {
      beforeEach("insert certs", () => {
        helpers.seedUsersAndCerts(db, testUsers, testCerts);
      });

      it(`responds with 200 and all of the certs`, () => {
        const expectedCerts = testCerts.map((cert) =>
          helpers.makeExpectedCert(cert)
        );
        return supertest(app).get("/api/certs").expect(200, expectedCerts);
      });
    });
  });
});
