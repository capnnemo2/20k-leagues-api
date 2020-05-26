CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    specialties INTEGER [],
    instructor_specialties INTEGER [],
    wishlist INTEGER [],
    wishlist_fulfilled INTEGER []
);