const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const { TEST_DATABASE_URL } = require("../src/config");
const supertest = require("supertest");

describe("animalTracker", function () {
  let db;

  const { testAnimalsTracked } = helpers.makeFixtures();

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

  describe(`GET /api/animalTracker`, () => {
    context(`Given no animals have been tracked`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/animalTracker").expect(200, []);
      });
    });

    context(`Given there are animals that have been tracked`, () => {
      beforeEach("insert animals tracked", () => {
        return helpers.seedAnimalsTracked(db, testAnimalsTracked);
      });

      it(`responds with 200 and all of the animals tracked`, () => {
        const expectedAnimalsTracked = testAnimalsTracked.map((animal) =>
          helpers.makeExpectedAnimalTracked(animal)
        );
        return supertest(app)
          .get("/api/animalTracker")
          .expect(200, expectedAnimalsTracked);
      });
    });
  });

  describe(`GET /api/animalTracker/animal/:animal`, () => {
    context(`Given no animals tracked`, () => {
      it(`responds with 404`, () => {
        const animal = "Sea Unicorn";
        return supertest(app)
          .get(`/api/animalTracker/animal/${animal}`)
          .expect(404, { error: { message: `Animal doesn't exist` } });
      });
    });

    context(`Given there are animals that have been tracked`, () => {
      beforeEach("insert animals tracked", () => {
        return helpers.seedAnimalsTracked(db, testAnimalsTracked);
      });

      it(`responds with 200 and a list of the specified animal`, () => {
        const animal = "Mola Mola";
        const expectedList = testAnimalsTracked.filter(
          (a) => a.animal === animal
        );

        return supertest(app)
          .get(`/api/animalTracker/animal/${animal}`)
          .expect(200, expectedList);
      });
    });
  });

  describe(`GET /api/animalTracker/region/:region`, () => {
    context(`Given no animals tracked`, () => {
      it(`reponds with 404`, () => {
        const region = "The Moon";
        return supertest(app)
          .get(`/api/animalTracker/region/${region}`)
          .expect(404, { error: { message: `Region doesn't exist` } });
      });
    });

    context(`Given there are animals that have been tracked`, () => {
      beforeEach("insert animals tracked", () => {
        return helpers.seedAnimalsTracked(db, testAnimalsTracked);
      });

      it(`responds with 200 and a list of the specified region`, () => {
        const region = "Hawaii";
        const expectedList = testAnimalsTracked.filter(
          (a) => a.region === region
        );

        return supertest(app)
          .get(`/api/animalTracker/region/${region}`)
          .expect(200, expectedList);
      });
    });
  });

  describe(`POST /api/animalTracker`, () => {
    const requiredFields = ["animal", "country", "region"];
    requiredFields.forEach((field) => {
      const newAnimalsTracked = [
        {
          animal: "Walrus",
          country: "North Pole",
          region: "Santa's Neighborhood",
        },
      ];

      it(`responds with 400 and an error when the '${field}' is missing`, () => {
        newAnimalsTracked.forEach((animal) => {
          delete animal[field];
          return supertest(app)
            .post("/api/animalTracker")
            .send(newAnimalsTracked)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` },
            });
        });
      });
    });

    it(`creates a new animal tracked, responding with 201 and the new animal tracked`, () => {
      const newAnimalsTracked = [
        {
          animal: "Walrus",
          country: "North Pole",
          region: "Santa's Neighborhood",
        },
      ];
      return supertest(app)
        .post("/api/animalTracker")
        .send(newAnimalsTracked)
        .expect(201)
        .expect((res) => {
          expect(res.body.animal).to.eql(newAnimalsTracked.animal);
          expect(res.body.country).to.eql(newAnimalsTracked.country);
          expect(res.body.region).to.eql(newAnimalsTracked.region);
        });
    });
  });

  describe(`DELETE /api/animalTracker`, () => {
    context(`Given no animals tracked`, () => {
      it(`responds with 404`, () => {
        const animalInstance = [
          {
            id: 2,
            animal: "Dinosaur",
            region: "Space",
          },
        ];
        return supertest(app)
          .delete("/api/animalTracker")
          .send(animalInstance)
          .expect(404, { error: { message: `Animal doesn't exist` } });
      });
    });

    context(`Given there are animals tracked in the database`, () => {
      const testAnimalsTracked = helpers.makeAnimalsTrackedArray();
      beforeEach("insert animals tracked", () => {
        return helpers.seedAnimalsTracked(db, testAnimalsTracked);
      });

      it(`responds with 204 and removes the animal instance`, () => {
        const animalInstance = [
          {
            id: 2,
            animal: "Manta Ray",
            region: "Komodo",
          },
        ];
        const expectedAnimalsTracked = testAnimalsTracked.filter(
          (ai) =>
            ai.animal !== animalInstance.animal &&
            ai.region !== animalInstance.region
        );

        return supertest(app)
          .delete("/api/animalTracker")
          .send(animalInstance)
          .expect(204)
          .then((res) => {
            supertest(app)
              .get("/api/animalTracker")
              .expect(expectedAnimalsTracked);
          });
      });
    });

    const requiredFields = ["animal", "region"];
    requiredFields.forEach((field) => {
      const animalInstance = [
        {
          id: 2,
          animal: "animal",
          region: "region",
        },
      ];

      it(`responds with 400 and an error when the '${field}' is missing`, () => {
        animalInstance.forEach((animal) => {
          delete animal[field];
          return supertest(app)
            .delete("/api/animalTracker")
            .send(animalInstance)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` },
            });
        });
      });
    });
  });
});
