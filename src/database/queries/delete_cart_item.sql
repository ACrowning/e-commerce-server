DELETE FROM cart_items
WHERE id = $1 AND user_id = $2
RETURNING *;
