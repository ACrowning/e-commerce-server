INSERT INTO products (id, title, amount, price, favorite, image, album_photos)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;