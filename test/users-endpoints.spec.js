const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const { TEST_DATABASE_URL } = require("../src/config");

describe("users endpoints", function () {
  let db;

  const { testUsers } = helpers.makeFixtures();

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

  describe(`GET /api/users`, () => {
    context(`Given there are no users`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/users").expect(200, []);
      });
    });

    context(`Given there are users in the database`, () => {
      beforeEach("insert users", () => {
        return helpers.seedUsers(db, testUsers);
      });

      it(`responds with 200 and all of the users`, () => {
        const expectedUsers = testUsers.map((user) =>
          helpers.makeExpectedUser(user)
        );
        return supertest(app).get("/api/users").expect(200, expectedUsers);
      });
    });
  });
});
