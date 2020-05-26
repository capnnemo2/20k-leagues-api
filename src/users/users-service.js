const UsersService = {
  getAllUsers(db) {
    return db.from("users").select("*");
  },
};

module.exports = UsersService;
