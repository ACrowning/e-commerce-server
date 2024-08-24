WITH RECURSIVE comment_hierarchy AS (
  SELECT 
    id,
    product_id,
    text,
    date,
    user_id,
    parent_comment_id
  FROM comments
  WHERE product_id = $1 AND parent_comment_id IS NULL

  UNION ALL

  SELECT 
    c.id,
    c.product_id,
    c.text,
    c.date,
    c.user_id,
    c.parent_comment_id
  FROM comments c
  INNER JOIN comment_hierarchy ch ON c.parent_comment_id = ch.id
)

SELECT * FROM comment_hierarchy;
