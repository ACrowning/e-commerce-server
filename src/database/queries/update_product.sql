UPDATE products
SET title = COALESCE($2, title),
    amount = COALESCE($3, amount),
    price = COALESCE($4, price),
    favorite = COALESCE($5, favorite),
    image = COALESCE($6, image),
    album_photos = COALESCE($7, album_photos)
WHERE id = $1
RETURNING *;
