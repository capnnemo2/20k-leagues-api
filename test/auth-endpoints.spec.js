const knex = require("knex");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe.only("Auth endpoints", function () {
  let db;

  const { testUsers } = helpers.makeFixtures();
  const testUser = testUsers[0];
  let authToken;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  /*before("logging user in", () => {
    supertest(app)
      .post("/api/users")
      .send(testUser)
      .then((user) => {
        supertest(app)
          .post("/api/auth/login")
          .send(testUser)
          .then((loggedInUser) => {
            authToken = loggedInUser.authToken;
          });
      });
  });*/

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`POST /api/auth/login`, () => {
    beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

    const requiredFields = ["email", "password"];

    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        email: testUser.email,
        password: testUser.password,
      };

      it(`reponds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];
        return supertest(app)
          .post("/api/auth/login")
          .send(loginAttemptBody)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });

    it(`responds 400 'invalid email or password' when bad email`, () => {
      const invalidUserEmail = {
        email: "thisIsNotAnEmail",
        password: "noproblemo",
      };
      return supertest(app)
        .post("/api/auth/login")
        .send(invalidUserEmail)
        .expect(400, { error: { message: `Incorrect email or password` } });
    });

    it(`responds 400 'invalid email or password' when bad password`, () => {
      const invalidUserPass = { email: testUser.email, password: "4" };
      return supertest(app)
        .post("/api/auth/login")
        .send(invalidUserPass)
        .expect(400, { error: { message: `Incorrect email or password` } });
    });

    it(`responds with 200 and JWT auth token using secret when valid credentials`, () => {
      const validUserCreds = {
        email: testUser.email,
        password: testUser.password,
      };
      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.email,
          expiresIn: process.env.JWT_EXPIRY,
          algorithm: "HS256",
        }
      );
      return supertest(app)
        .post("/api/auth/login")
        .send(validUserCreds)
        .expect(200, { authToken: expectedToken });
    });
  });

  describe(`POST /api/auth/refresh`, () => {
    beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

    it(`responds 200 and JWT auth token using secret`, () => {
      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.email,
          expiresIn: process.env.JWT_EXPIRY,
          algorithm: "HS256",
        }
      );
      return supertest(app)
        .post("/api/auth/refresh")
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .expect(200, { authToken: expectedToken });
    });
  });
});
