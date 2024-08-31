import { pool } from "../../db";
import { ShopCart } from "../../types/cart";
import { readSqlFile } from "..";
import { Product } from "../../types/products";
import { RepositoryResponse } from "../../types/repositoryResponse";

interface CartItem {
  cartItemId: string;
  userId: string;
  amount: number;
  product: Product;
}

export async function addProductToCart(
  id: string,
  userId: string,
  productId: string,
  amount: number
): Promise<RepositoryResponse<ShopCart>> {
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
    return {
      data: null,
      errorMessage: "Error adding product to cart",
      errorRaw: error as Error,
    };
  }
}

export async function getCartItems(
  userId: string
): Promise<RepositoryResponse<CartItem[]>> {
  const query = await readSqlFile("get_all_products_in_cart.sql");
  const values = [userId];

  try {
    const result = await pool.query(query, values);
    const items: CartItem[] = result.rows.map((row) => ({
      cartItemId: row.cart_item_id,
      userId: row.user_id,
      amount: row.amount,
      product: {
        id: row.product_id,
        title: row.title,
        stock: row.product_stock,
        price: row.price,
        favorite: row.favorite,
        image: row.image ? String(row.image) : null,
        albumPhotos: Array.isArray(row.album_photos)
          ? row.album_photos.map(String)
          : [],
      },
    }));

    return {
      data: items,
      errorMessage: null,
      errorRaw: null,
    };
  } catch (error) {
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
): Promise<RepositoryResponse<ShopCart>> {
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
): Promise<RepositoryResponse<ShopCart>> {
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
    return {
      data: null,
      errorMessage: "Error deleting cart item",
      errorRaw: error as Error,
    };
  }
}
