const express = require("express");
const UsersService = require("./users-service");

const usersRouter = express.Router();

usersRouter.route("/").get((req, res, next) => {
  UsersService.getAllUsers(req.app.get("db"))
    .then((users) => {
      res.json(users);
    })
    .catch(next);
});

module.exports = usersRouter;
