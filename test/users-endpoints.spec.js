const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const { TEST_DATABASE_URL } = require("../src/config");

describe.only("users endpoints", function () {
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

    context(`Given an XSS attack user`, () => {
      const { maliciousUser, expectedUser } = helpers.makeMaliciousUser();

      beforeEach("insert malicious user", () => {
        return helpers.seedMaliciousUser(db, maliciousUser);
      });

      it(`removes XSS attack content`, () => {
        return supertest(app)
          .get("/api/users")
          .expect(200)
          .expect((res) => {
            expect(res.body[0].first_name).to.eql(expectedUser.first_name);
            expect(res.body[0].email).to.eql(expectedUser.email);
            expect(res.body[0].password).to.eql(expectedUser.password);
          });
      });
    });
  });

  describe(`POST /api/users`, () => {
    const requiredFields = ["first_name", "email", "password"];
    requiredFields.forEach((field) => {
      const newUser = {
        first_name: "test first name",
        email: "test email",
        password: "test password",
      };
      it(`responds with 400 and an error when the ${field} is missing`, () => {
        delete newUser[field];
        return supertest(app)
          .post("/api/users")
          .send(newUser)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });

    // this test does not include a last bit to test navigating to the login page
    it(`creates a user, responding with 201`, () => {
      const newUser = {
        first_name: "test first name",
        email: "test email",
        password: "test password",
      };
      return supertest(app)
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.first_name).to.eql(newUser.first_name);
          expect(res.body.email).to.eql(newUser.email);
          expect(res.body.password).to.eql(newUser.password);
        });
    });

    it(`removes xss attack content from response`, () => {
      const { maliciousUser, expectedUser } = helpers.makeMaliciousUser();
      return supertest(app)
        .post(`/api/users`)
        .send(maliciousUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.first_name).to.eql(expectedUser.first_name);
          expect(res.body.email).to.eql(expectedUser.email);
          expect(res.body.password).to.eql(expectedUser.password);
        });
    });
  });

  describe(`GET /api/users/:user_id`, () => {
    context(`Given no users`, () => {
      it(`responds with 404`, () => {
        const userId = 1234567;
        return supertest(app)
          .get(`/api/users/${userId}`)
          .expect(404, { error: { message: `User doesn't exist` } });
      });
    });

    context(`Given there are users in the database`, () => {
      beforeEach("insert users", () => {
        return helpers.seedUsers(db, testUsers);
      });

      it(`responds with 200 and the specified user`, () => {
        const userId = 2;
        const expectedUser = helpers.makeExpectedUser(testUsers[userId - 1]);

        return supertest(app)
          .get(`/api/users/${userId}`)
          .expect(200, expectedUser);
      });
    });

    context(`Given an XSS attack user`, () => {
      const testUser = helpers.makeUsersArray()[1];
      const { maliciousUser, expectedUser } = helpers.makeMaliciousUser(
        testUser
      );

      beforeEach("insert malicious user", () => {
        return helpers.seedMaliciousUser(db, maliciousUser);
      });

      it(`removes XSS attack content`, () => {
        return supertest(app)
          .get(`/api/users/${maliciousUser.id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.first_name).to.eql(expectedUser.first_name);
            expect(res.body.email).to.eql(expectedUser.email);
            expect(res.body.password).to.eql(expectedUser.password);
          });
      });
    });
  });

  describe(`PATCH /api/users/:user_id`, () => {
    context(`Given no users`, () => {
      it(`responds with 404`, () => {
        const userId = 1234567;
        return supertest(app)
          .patch(`/api/users/${userId}`)
          .expect(404, { error: { message: `User doesn't exist` } });
      });
    });

    context(`Given there are users in the database`, () => {
      const testUsers = helpers.makeUsersArray();

      beforeEach("insert users", () => {
        return helpers.seedUsers(db, testUsers);
      });

      it(`responds with 204 and updates the product`, () => {
        const idToUpdate = 2;
        const updatedUser = {
          first_name: "first name",
          email: "email",
          password: "password",
          specialties: [1, 2],
          instructor_specialties: [1, 2, 3],
          wishlist: [1, 2, 3, 4],
          wishlist_fulfilled: [1, 2, 3],
        };

        const expectedUser = {
          ...testUsers[idToUpdate - 1],
          ...updatedUser,
        };

        return supertest(app)
          .patch(`/api/users/${idToUpdate}`)
          .send(updatedUser)
          .expect(204)
          .then((res) => {
            supertest(app).get(`/api/users/${idToUpdate}`).expect(expectedUser);
          });
      });

      it(`responds with 400 when required fields are not supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/users/${idToUpdate}`)
          .send({ irrelevantField: "foo" })
          .expect(400, {
            error: {
              message: `Request body must contain 'first_name', 'email', and 'password'`,
            },
          });
      });
    });
  });
});
