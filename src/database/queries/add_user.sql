INSERT INTO users (id, username, email, password, role)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;