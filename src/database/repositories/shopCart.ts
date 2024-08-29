import { pool } from "../../db";
import { ShopCart } from "../cartItems";
import { readSqlFile } from "..";

export async function addProductToCart(
  id: string,
  userId: string,
  productId: string,
  amount: number
): Promise<{
  data: ShopCart | null;
  errorMessage: string | null;
  errorRaw: Error | null;
}> {
  const query = await readSqlFile("add_product_to_cart.sql");
  const values = [id, userId, productId, amount];

  try {
    const result = await pool.query(query, values);
    return {
      data: result.rows[0] || null,
      errorMessage: null,
      errorRaw: null,
    };
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return {
      data: null,
      errorMessage: "Error adding product to cart",
      errorRaw: error as Error,
    };
  }
}

export async function getCartItems(userId: string): Promise<{
  data: any[] | null;
  errorMessage: string | null;
  errorRaw: Error | null;
}> {
  const query = await readSqlFile("get_all_products_in_cart.sql");
  const values = [userId];

  try {
    const result = await pool.query(query, values);
    const items = result.rows.map((row) => ({
      cartItemId: row.cart_item_id,
      userId: row.user_id,
      amount: row.amount,
      product: {
        id: row.product_id,
        title: row.title,
        stock: row.product_stock,
        price: row.price,
        favorite: row.favorite,
        image: row.image,
        albumPhotos: row.album_photos,
      },
    }));

    return {
      data: items,
      errorMessage: null,
      errorRaw: null,
    };
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return {
      data: null,
      errorMessage: "Error fetching cart items",
      errorRaw: error as Error,
    };
  }
}

export async function updateCartItem(
  cartItemId: string,
  userId: string,
  amount: number
): Promise<{
  data: ShopCart | null;
  errorMessage: string | null;
  errorRaw: Error | null;
}> {
  const query = await readSqlFile("update_cart_item.sql");
  const values = [amount, cartItemId, userId];

  try {
    const result = await pool.query(query, values);
    return {
      data: result.rows[0] || null,
      errorMessage: null,
      errorRaw: null,
    };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return {
      data: null,
      errorMessage: "Error updating cart item",
      errorRaw: error as Error,
    };
  }
}

export async function deleteCartItem(
  cartItemId: string,
  userId: string
): Promise<{
  data: ShopCart | null;
  errorMessage: string | null;
  errorRaw: Error | null;
}> {
  const query = await readSqlFile("delete_cart_item.sql");
  const values = [cartItemId, userId];

  try {
    const result = await pool.query(query, values);
    return {
      data: result.rows[0] || null,
      errorMessage: null,
      errorRaw: null,
    };
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return {
      data: null,
      errorMessage: "Error deleting cart item",
      errorRaw: error as Error,
    };
  }
}
