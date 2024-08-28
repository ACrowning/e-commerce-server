SELECT 
  sc.id AS cart_item_id,
  sc.user_id,
  sc.amount,
  p.id AS product_id,
  p.title,
  p.amount AS product_stock,
  p.price,
  p.favorite,
  p.image,
  p.album_photos
FROM ShopCart sc
JOIN products p ON sc.product_id = p.id
WHERE sc.user_id = $1;