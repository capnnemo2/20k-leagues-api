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
        // helpers.seedCerts(db, testCerts);
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

  describe(`POST /api/certs`, () => {
    beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
    const testUser = testUsers[0];

    const requiredFields = [
      "agency",
      "cert_level",
      "cert_num",
      "cert_date",
      "user_id",
    ];
    requiredFields.forEach((field) => {
      const newCert = {
        agency: "test agency",
        cert_level: "test cert level",
        cert_num: "test cert num",
        cert_date: "test cert date",
        user_id: testUser.id,
      };

      it(`responds with 400 and an error when the '${field}' is missing`, () => {
        delete newCert[field];
        return supertest(app)
          .post("/api/certs")
          .send(newCert)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });

      it(`creates a cert, responding with 201 and the new cert`, () => {
        const newCert = {
          agency: "test agency",
          cert_level: "test cert level",
          cert_num: "test cert num",
          cert_date: "test cert date",
          user_id: testUser.id,
        };

        return supertest(app)
          .post("/api/certs")
          .send(newCert)
          .expect(201)
          .expect((res) => {
            expect(res.body.agency).to.eql(newCert.agency);
            expect(res.body.cert_level).to.eql(newCert.cert_level);
            expect(res.body.cert_num).to.eql(newCert.cert_num);
            expect(res.body.cert_date).to.eql(newCert.cert_date);
            expect(res.body.user_id).to.eql(newCert.user_id);
          });
        // .then((postRes) =>
        //   supertest(app)
        //     .get(`/api/certs/${postRes.body.id}`)
        //     .expect(postRes.body)
        // );
      });

      it(`removes XSS attack content from response`, () => {
        const { maliciousCert, expectedCert } = helpers.makeMaliciousCert(
          testUsers
        );

        return supertest(app)
          .post("/api/certs")
          .send(maliciousCert)
          .expect(201)
          .expect((res) => {
            expect(res.body.agency).to.eql(expectedCert.agency);
            expect(res.body.cert_level).to.eql(expectedCert.cert_level);
            expect(res.body.cert_num).to.eql(expectedCert.cert_num);
            expect(res.body.cert_date).to.eql(expectedCert.cert_date);
            expect(res.body.user_id).to.eql(expectedCert.user_id);
          });
      });
    });
  });
});
