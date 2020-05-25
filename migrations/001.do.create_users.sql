CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    email TEXT NOT NULL,
    "password" TEXT NOT NULL,
    specialties INTEGER [],
    instructorSpecialties INTEGER [],
    wishlist INTEGER [],
    wishlistFulfilled INTEGER [],
);