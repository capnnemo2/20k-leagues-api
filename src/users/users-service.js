const UsersService = {
  getAllUsers(db) {
    return db.from("users").select("*");
  },
  getUserById(db, id) {
    return db.from("users").select("*").where("id", id).first();
  },
};

module.exports = UsersService;
