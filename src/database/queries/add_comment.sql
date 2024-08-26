INSERT INTO comments (id, product_id, text, date, user_id, parent_comment_id) 
VALUES ($1, $2, $3, $4, $5, $6) 
RETURNING *;