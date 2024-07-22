CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    favorite BOOLEAN NOT NULL,
    image TEXT,
    album_photos JSONB
);
