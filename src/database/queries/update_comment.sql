UPDATE comments
SET text = $1
WHERE id = $2
RETURNING *;