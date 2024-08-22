CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    favorite BOOLEAN NOT NULL,
    image TEXT,
    album_photos JSONB
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL
);