CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    country_name TEXT NOT NULL,
    regions TEXT []
);