const express = require("express");
const UsersService = require("./users-service");
const { requireAuth } = require("../middleware/jwt-auth");

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter
  .route("/")
  .get((req, res, next) => {
    UsersService.getAllUsers(req.app.get("db"))
      .then((users) => {
        res.json(users.map(UsersService.serializeUser));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { first_name, email, password, wishlist } = req.body;
    const newUser = { first_name, email, password };

    for (const [key, value] of Object.entries(newUser)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing '${key}' in request body` } });
      }
    }

    const passwordError = UsersService.validatePassword(password);

    if (passwordError)
      return res.status(400).json({ error: { message: passwordError } });

    UsersService.hasUserWithEmail(req.app.get("db"), email).then(
      (hasUserWithEmail) => {
        if (hasUserWithEmail)
          return res
            .status(400)
            .json({ error: { message: `Email already exists in database` } });

        return UsersService.hashPassword(password)
          .then((hashedPassword) => {
            const newUser = {
              first_name,
              email,
              password: hashedPassword,
              wishlist: wishlist,
              specialties: [],
              instructor_specialties: [],
              wishlist_fulfilled: [],
            };

            return UsersService.insertUser(req.app.get("db"), newUser).then(
              (user) => {
                res.status(201).json(UsersService.serializeUser(user));
              }
            );
          })
          .catch(next);
      }
    );
  });

usersRouter.route("/getinfo").get(requireAuth, (req, res) => {
  res.send(req.user);
});

usersRouter
  .route("/:user_id")
  .all(requireAuth)
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
    res.json(UsersService.serializeUser(res.user));
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      first_name,
      email,
      password,
      specialties,
      instructor_specialties,
      wishlist,
      wishlist_fulfilled,
    } = req.body;
    const userToUpdate = {
      first_name,
      email,
      password,
      specialties,
      instructor_specialties,
      wishlist,
      wishlist_fulfilled,
    };

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length;
    if (numberOfValues < 3) {
      return res.status(400).json({
        error: {
          message: `Request body must contain 'first_name', 'email', and 'password'`,
        },
      });
    }

    UsersService.updateUser(req.app.get("db"), req.params.user_id, userToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = usersRouter;
