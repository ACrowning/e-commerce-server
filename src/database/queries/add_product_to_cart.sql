INSERT INTO ShopCart (id, user_id, product_id, amount)
VALUES ($1, $2, $3, $4)
RETURNING *;