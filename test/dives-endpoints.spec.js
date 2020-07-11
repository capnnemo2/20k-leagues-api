const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const { TEST_DATABASE_URL } = require("../src/config");
const supertest = require("supertest");

describe("dives endpoints", function () {
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
            const body = res.body[0];
            expect(body.dive_date).to.eql(expectedDive.dive_date);
            expect(body.country).to.eql(expectedDive.country);
            expect(body.region).to.eql(expectedDive.region);
            expect(body.dive_site).to.eql(expectedDive.dive_site);
            expect(body.max_depth).to.eql(expectedDive.max_depth);
            expect(body.duration).to.eql(expectedDive.duration);
            expect(body.water_temp).to.eql(expectedDive.water_temp);
            expect(body.dive_shop).to.eql(expectedDive.dive_shop);
            expect(body.guide).to.eql(expectedDive.guide);
            expect(body.buddy).to.eql(expectedDive.buddy);
            expect(body.viz).to.eql(expectedDive.viz);
            expect(body.dive_type).to.eql(expectedDive.dive_type);
            expect(body.drift_dive).to.eql(expectedDive.drift_dive);
            expect(body.night_dive).to.eql(expectedDive.night_dive);
            expect(body.description).to.eql(expectedDive.description);
            expect(body.animals_spotted).to.eql(expectedDive.animals_spotted);
            expect(body.rating).to.eql(expectedDive.rating);
          });
      });
    });
  });

  describe(`POST /api/dives`, () => {
    beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
    const testUser = testUsers[0];
    const requiredFields = [
      "user_id",
      "dive_date",
      "country",
      "region",
      "dive_site",
      "rating",
    ];
    requiredFields.forEach((field) => {
      const newDive = {
        user_id: testUser.id,
        dive_date: "2020-05-05",
        country: "test country",
        region: "test region",
        dive_site: "test site",
        rating: 5,
      };

      it(`responds with 400 and an error when the '${field}' is missing`, () => {
        delete newDive[field];
        return supertest(app)
          .post("/api/dives")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(newDive)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });

    it(`creates a new dive, responding with 201 and the new dive`, () => {
      const newDive = {
        user_id: testUser.id,
        dive_date: "2020-05-05T00:00:00.000Z",
        country: "test country",
        region: "test region",
        dive_site: "test site",
        rating: 5,
      };
      return supertest(app)
        .post("/api/dives")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(newDive)
        .expect(201)
        .expect((res) => {
          expect(res.body.user_id).to.eql(newDive.user_id);
          expect(res.body.dive_date).to.eql(newDive.dive_date);
          expect(res.body.country).to.eql(newDive.country);
          expect(res.body.region).to.eql(newDive.region);
          expect(res.body.dive_site).to.eql(newDive.dive_site);
          expect(res.body.rating).to.eql(newDive.rating);
        });
    });
  });

  describe(`GET /api/dives/:dive_id`, () => {
    context(`Given no dives`, () => {
      before("insert users", () => {
        return helpers.seedUsers(db, testUsers);
      });
      it(`responds with 404`, () => {
        const diveId = 1234567;
        return supertest(app)
          .get(`/api/dives/${diveId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `Dive doesn't exist` } });
      });
    });

    context(`Given there are dives in the database`, () => {
      beforeEach("insert dives", () => {
        return helpers.seedUsersAndDives(db, testUsers, testDives);
      });

      it(`responds with 200 and the specified dive`, () => {
        const diveId = 2;
        const expectedDive = helpers.makeExpectedDive(testDives[diveId - 1]);

        return supertest(app)
          .get(`/api/dives/${diveId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedDive);
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
          .get(`/api/dives/${maliciousDive.id}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
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

  describe(`GET /api/dives/user/:user_id`, () => {
    context(`Given no user`, () => {
      before("insert users", () => {
        return helpers.seedUsers(db, testUsers);
      });
      it(`responds with 404`, () => {
        const userId = 2;
        return supertest(app)
          .get(`/api/dives/user/${userId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `User doesn't exist` } });
      });
    });

    context(`Given there are user dives`, () => {
      beforeEach("insert dives", () => {
        return helpers.seedUsersAndDives(db, testUsers, testDives);
      });

      it(`responds with 200 and a list of all user dives`, () => {
        const userId = 2;
        const expectedList = helpers.makeExpectedUserDives(userId, testDives);
        return supertest(app)
          .get(`/api/dives/user/${userId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedList);
      });
    });
  });

  describe.only(`PATCH /api/dives/:dive_id`, () => {
    context(`Given no dives`, () => {
      before("insert users", () => {
        return helpers.seedUsers(db, testUsers);
      });
      it(`responds with 404`, () => {
        const diveId = 1234567;
        return supertest(app)
          .patch(`/api/dives/${diveId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `Dive doesn't exist` } });
      });
    });

    context(`Given there are dives in the database`, () => {
      const testDives = helpers.makeDivesArray(testUsers);
      beforeEach("insert dives", () => {
        return helpers.seedUsersAndDives(db, testUsers, testDives);
      });

      it(`responds with 204 and updates the dive`, () => {
        const idToUpdate = 2;
        const updatedDive = {
          user_id: testUsers[0].id,
          dive_date: "2020-05-10T07:00:00.000Z",
          country: "dive country",
          region: "dive region",
          dive_site: "dive site",
          max_depth: null,
          duration: "5",
          water_temp: "5",
          dive_shop: "dive shop",
          guide: "guide",
          buddy: "buddy",
          viz: null,
          dive_type: "dive type",
          drift_dive: true,
          night_dive: false,
          description: "a dive",
          animals_spotted: [1, 2],
          rating: 5,
        };

        const expectedDive = { ...testDives[idToUpdate - 1], ...updatedDive };

        return supertest(app)
          .patch(`/api/dives/${idToUpdate}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(updatedDive)
          .expect(204)
          .then((res) => {
            supertest(app).get(`/api/dives/${idToUpdate}`).expect(expectedDive);
          });
      });
    });
  });

  describe(`DELETE /api/dives/:dive_id`, () => {
    context(`Given no dives`, () => {
      before("insert users", () => {
        return helpers.seedUsers(db, testUsers);
      });
      it(`responds with 404`, () => {
        const diveId = 1234567;
        return supertest(app)
          .delete(`/api/dives/${diveId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `Dive doesn't exist` } });
      });
    });

    context(`Given there are dives in the database`, () => {
      const testDives = helpers.makeDivesArray(testUsers);
      beforeEach("insert dives", () => {
        return helpers.seedUsersAndDives(db, testUsers, testDives);
      });

      it(`responds with 204 and removes the dive`, () => {
        const idToRemove = 2;
        const expectedDives = testDives.filter((d) => d.id !== idToRemove);

        return supertest(app)
          .delete(`/api/dives/${idToRemove}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(204)
          .then((res) => {
            supertest(app).get(`/api/dives`).expect(expectedDives);
          });
      });
    });
  });
});
