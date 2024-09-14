UPDATE users
SET money = money - $1
WHERE id = $2;