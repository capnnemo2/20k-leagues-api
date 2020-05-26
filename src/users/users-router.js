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

usersRouter
  .route("/:user_id")
  .all((req, res, next) => {
    UsersService.getUserById(req.app.get("db"), req.params.user_id).then(
      (user) => {
        if (!user) {
          return res
            .status(404)
            .json({ error: { message: `User doesn't exist` } });
        }
        res.user = user;
        next();
      }
    );
  })
  .get((req, res, next) => {
    res.json(res.user);
  });

module.exports = usersRouter;
