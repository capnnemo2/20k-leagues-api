const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Protected endpoints", () => {
  let db;

  const { testUsers, testCerts, testDives } = helpers.makeFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  //   beforeEach insert users? or insert users, dives, and certs?

  const protectedEndpoints = [
    // {
    //   // this is a template, not real
    //   name: "GET /api/example/:example",
    //   path: "/api/example/1",
    //   method: supertest(app).get,
    // },
    {
      name: "POST /api/certs",
      path: "/api/certs",
      method: supertest(app).post,
    },
    {
      name: "GET /api/certs/:cert_id",
      path: "/api/certs/1",
      method: supertest(app).get,
    },
    {
      name: "DELETE /api/certs/:cert_id",
      path: "/api/certs/1",
      method: supertest(app).delete,
    },
    {
      name: "POST /api/dives",
      path: "/api/dives",
      method: supertest(app).post,
    },
    {
      name: "GET /api/dives/:dive_id",
      path: "/api/dives/1",
      method: supertest(app).get,
    },
    {
      name: "PATCH /api/dives/:dive_id",
      path: "/api/dives/1",
      method: supertest(app).patch,
    },
    {
      name: "DELETE /api/dives/:dive_id",
      path: "/api/dives/1",
      method: supertest(app).delete,
    },
    {
      name: "PATCH /api/users/:user_id",
      path: "/api/users/1",
      method: supertest(app).patch,
    },
  ];

  protectedEndpoints.forEach((endpoint) => {
    describe(endpoint.name, () => {
      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint
          .method(endpoint.path)
          .expect(401, { error: { message: `Missing bearer token` } });
      });

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0];
        const invalidSecret = "bad-secret";
        return endpoint
          .method(endpoint.path)
          .set(
            "Authorization",
            helpers.makeAuthHeader(validUser, invalidSecret)
          )
          .expect(401, { error: { message: `Unauthorized request` } });
      });

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { email: "not-real", id: 1 };
        return endpoint
          .method(endpoint.path)
          .set("Authorization", helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: { message: `Unauthorized request` } });
      });
    });
  });
});
