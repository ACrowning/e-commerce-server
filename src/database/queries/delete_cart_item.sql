DELETE FROM ShopCart
WHERE id = $1 AND user_id = $2
RETURNING *;
