const knex = require("knex");
const bcrypt = require("bcryptjs");
const app = require("../src/app");
const helpers = require("./test-helpers");
const { TEST_DATABASE_URL } = require("../src/config");

describe("users endpoints", function () {
  let db;

  const { testUsers } = helpers.makeFixtures();
  const testUser = testUsers[0];

  let authToken;

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

  beforeEach("register and login user", () => {
    const user = {
      id: 1,
      first_name: "Bob5",
      email: "bob5@email.com",
      password: "P@ssword5",
      specialties: [1, 2],
      instructor_specialties: [],
      wishlist: [1, 2, 3, 4, 5],
      wishlist_fulfilled: [],
    };
    return supertest(app)
      .post("/api/users")
      .send(user)
      .then((res) => {
        return supertest(app)
          .post("/api/auth/login")
          .send(user)
          .then((res) => {
            authToken = res.body.authToken;
          });
      });
  });

  describe(`GET /api/users`, () => {
    context(`Given there are users in the database`, () => {
      beforeEach("insert users", () => {
        return helpers.seedUsers(db, testUsers);
      });

      it(`responds with 200 and all of the users`, () => {
        const expectedUsers = testUsers.map((user) =>
          helpers.makeExpectedUser(user)
        );

        return supertest(app)
          .get("/api/users")
          .expect(200)
          .expect((res) => {
            expect(res.body[1].first_name).to.eql(expectedUsers[0].first_name);
            expect(res.body[1].email).to.eql(expectedUsers[0].email);
            expect(res.body[1].wishlist).to.eql(expectedUsers[0].wishlist);
            expect(res.body[1].specialties).to.eql(
              expectedUsers[0].specialties
            );
            expect(res.body[1].instructor_specialties).to.eql(
              expectedUsers[0].instructor_specialties
            );
          });
      });
    });
  });

  describe(`POST /api/users`, () => {
    context(`User validation`, () => {
      beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

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

      it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
        const userShortPassword = {
          email: "test email",
          password: "1234567",
          first_name: "test first_name",
        };
        return supertest(app)
          .post("/api/users")
          .send(userShortPassword)
          .expect(400, {
            error: { message: `Password must be longer than 8 characters` },
          });
      });

      it(`responds with 400 'Password must be less than 72 characters' when long password`, () => {
        const userLongPassword = {
          email: "test email",
          password: "*".repeat(73),
          first_name: "test first_name",
        };
        return supertest(app)
          .post("/api/users")
          .send(userLongPassword)
          .expect(400, {
            error: { message: `Password must be less than 72 characters` },
          });
      });

      it(`responds with 400 error when password starts with spaces`, () => {
        const userPasswordStartsSpaces = {
          email: "test email",
          password: " 1Aa!2Bb@",
          first_name: "test first_name",
        };
        return supertest(app)
          .post("/api/users")
          .send(userPasswordStartsSpaces)
          .expect(400, {
            error: {
              message: `Password must not start or end with empty spaces`,
            },
          });
      });

      it(`responds with 400 error when password ends with spaces`, () => {
        const userPasswordEndsSpaces = {
          email: "test email",
          password: "1Aa!2Bb@ ",
          first_name: "test first_name",
        };
        return supertest(app)
          .post("/api/users")
          .send(userPasswordEndsSpaces)
          .expect(400, {
            error: {
              message: `Password must not start or end with empty spaces`,
            },
          });
      });

      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          email: "test email",
          password: "11AAaabb",
          first_name: "test first_name",
        };
        return supertest(app)
          .post("/api/users")
          .send(userPasswordNotComplex)
          .expect(400, {
            error: {
              message: `Password must contain 1 upper case, lower case, number, and special character`,
            },
          });
      });

      it(`responds 400 'Email already exists in database' when email isn't unique`, () => {
        const duplicateUser = {
          email: testUser.email,
          password: "11AAaa!!",
          first_name: "test first_name",
        };
        return supertest(app)
          .post("/api/users")
          .send(duplicateUser)
          .expect(400, {
            error: { message: `Email already exists in database` },
          });
      });
    });

    context(`Happy path`, () => {
      it(`creates a user, storing bcrypted password, responding with 201`, () => {
        const newUser = {
          first_name: "test first name",
          email: "test email",
          password: "11AAaa!!",
        };
        return supertest(app)
          .post("/api/users")
          .send(newUser)
          .expect(201)
          .expect((res) => {
            expect(res.body).to.have.property("id");
            expect(res.body.first_name).to.eql(newUser.first_name);
            expect(res.body.email).to.eql(newUser.email);
          })
          .expect((res) =>
            db
              .from("users")
              .select("*")
              .where({ id: res.body.id })
              .first()
              .then((row) => {
                expect(row.email).to.eql(newUser.email);
                expect(row.first_name).to.eql(newUser.first_name);
                return bcrypt.compare(newUser.password, row.password);
              })
              .then((compareMatch) => {
                expect(compareMatch).to.be.true;
              })
          );
      });
    });
  });

  describe(`GET /api/users/:user_id`, () => {
    context(`Given no users`, () => {
      it(`responds with 404`, () => {
        const userId = 1234567;
        return supertest(app)
          .get(`/api/users/${userId}`)
          .set({ Authorization: `Bearer ${authToken}` })
          .expect(404, { error: { message: `User doesn't exist` } });
      });
    });

    context(`Given there are users in the database`, () => {
      beforeEach("insert users", () => {
        return helpers.seedUsers(db, testUsers);
      });

      it(`responds with 200 and the specified user`, () => {
        const userId = 2;
        const expectedUser = helpers.makeExpectedUser(testUsers[userId - 2]);

        return supertest(app)
          .get(`/api/users/${userId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect((res) => {
            expect(res.body.first_name).to.eql(expectedUser.first_name);
            expect(res.body.email).to.eql(expectedUser.email);
            expect(res.body.wishlist).to.eql(expectedUser.wishlist);
            expect(res.body.specialties).to.eql(expectedUser.specialties);
          });
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
          .set({ Authorization: `Bearer ${authToken}` })
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
      before("insert users", () => {
        return helpers.seedUsers(db, testUsers);
      });
      it(`responds with 404`, () => {
        const userId = 1234567;
        return supertest(app)
          .patch(`/api/users/${userId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
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
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
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
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
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
