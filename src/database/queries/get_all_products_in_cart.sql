    SELECT sc.id, sc.product_id, sc.amount, p.price, p.title 
    FROM ShopCart sc
    JOIN products p ON sc.product_id = p.id
    WHERE sc.user_id = $1;