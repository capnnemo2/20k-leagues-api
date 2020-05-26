const xss = require("xss");

const UsersService = {
  getAllUsers(db) {
    return db.from("users").select("*");
  },
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
};

module.exports = UsersService;
