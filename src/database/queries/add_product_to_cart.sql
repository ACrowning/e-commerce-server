INSERT INTO ShopCart (id, user_id, product_id, amount, price)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;