INSERT INTO users (id, username, email, password, role, money)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;