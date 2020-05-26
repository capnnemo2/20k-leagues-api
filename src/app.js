require("dotenv").config;
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const countriesRouter = require("./countries/countries-router");
const animalsRouter = require("./animals/animals-router");
const specialtiesRouter = require("./specialties/specialties-router");
const divesRouter = require("./dives/dives-router");
const animalTrackerRouter = require("./animalTracker/animalTracker-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use("/api/countries", countriesRouter);
app.use("/api/animals", animalsRouter);
app.use("/api/specialties", specialtiesRouter);
app.use("/api/dives", divesRouter);
app.use("/api/animalTracker", animalTrackerRouter);

app.get("/", (req, res) => {
  res.send("Hello, world");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
