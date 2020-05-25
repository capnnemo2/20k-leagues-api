CREATE TABLE dives (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    diveDate DATE NOT NULL,
    country TEXT NOT NULL,
    region TEXT NOT NULL,
    diveSite TEXT NOT NULL,
    maxDepth INTEGER,
    duration INTEGER,
    waterTemp INTEGER,
    diveShop TEXT,
    guide TEXT,
    buddy TEXT,
    viz INTEGER,
    diveType TEXT,
    driftDive TEXT,
    nightDive TEXT,
    description TEXT,
     animalsSpotted INTEGER [],
     rating INTEGER NOT NULL
);