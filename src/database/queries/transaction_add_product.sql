INSERT INTO cart (id, user_id, product_id, amount)
VALUES ($1, $2, $3, $4);

UPDATE products
SET amount = amount - $3
WHERE id = $2;

UPDATE users
SET money = money - ($3 * (SELECT price FROM products WHERE id = $2))
WHERE id = $1;
