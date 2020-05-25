CREATE TABLE certs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    agency TEXT NOT NULL,
    certLevel TEXT NOT NULL,
    certNum TEXT NOT NULL,
    certDate DATE NOT NULL,
);