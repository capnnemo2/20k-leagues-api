CREATE TABLE certs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    agency TEXT NOT NULL,
    cert_level TEXT NOT NULL,
    cert_num TEXT NOT NULL,
    cert_date TEXT NOT NULL
);