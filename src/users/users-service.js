const xss = require("xss");
const bcrypt = require("bcryptjs");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  getAllUsers(db) {
    return db.from("users").select("*");
  },
  // I think I don't need getUserById (when will I know the user id during login? I won't...)
  // I need getUserByEmail
  getUserById(db, id) {
    return db.from("users").select("*").where("id", id).first();
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("users")
      .returning("*")
      .then(([user]) => user)
      .then((user) => UsersService.getUserById(db, user.id));
  },
  serializeUser(user) {
    return {
      id: user.id,
      first_name: xss(user.first_name),
      email: xss(user.email),
      password: xss(user.password),
      wishlist: user.wishlist,
      specialties: user.specialties,
      instructor_specialties: user.instructor_specialties,
      wishlist_fulfilled: user.wishlist_fulfilled,
    };
  },
  updateUser(db, id, newUserFields) {
    return UsersService.getAllUsers(db).where({ id }).update(newUserFields);
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  hasUserWithEmail(db, email) {
    return db("users")
      .where({ email })
      .first()
      .then((user) => !!user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return "Password must be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password must be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain 1 upper case, lower case, number, and special character";
    }
    return null;
  },
};

module.exports = UsersService;
