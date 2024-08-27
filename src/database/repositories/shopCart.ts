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

export async function getAllProductsInCart(userId: string): Promise<{
  data: ShopCart[] | null;
  errorMessage: string | null;
  errorRaw: Error | null;
}> {
  const query = await readSqlFile("get_all_products_in_cart.sql");
  const values = [userId];

  try {
    const result = await pool.query(query, values);
    return {
      data: result.rows,
      errorMessage: null,
      errorRaw: null,
    };
  } catch (error) {
    console.error("Error retrieving products from cart:", error);
    return {
      data: null,
      errorMessage: "Error retrieving products from cart",
      errorRaw: error as Error,
    };
  }
}
