UPDATE products
SET amount = amount - $1
WHERE id = $2;