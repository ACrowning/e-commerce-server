import { pool } from "../../db";
import { readSqlFile } from "..";
import { RepositoryResponse } from "../../types/repositoryResponse";
import { CartItem, ShopCart } from "../../types/cart";

export async function addProductToCartWithTransaction(
  id: string,
  userId: string,
  productId: string,
  amount: number
): Promise<RepositoryResponse<ShopCart>> {
  const transactionQuery = await readSqlFile("transaction_add_product.sql");
  const checkUserBalanceQuery = await readSqlFile("check_user_balance.sql");
  const checkProductStockQuery = await readSqlFile("check_product_stock.sql");

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userBalanceResult = await client.query(checkUserBalanceQuery, [
      userId,
    ]);
    const userBalance = userBalanceResult.rows[0]?.money;

    if (!userBalance) {
      throw new Error("User not found");
    }

    const productDataResult = await client.query(checkProductStockQuery, [
      productId,
    ]);
    const productData = productDataResult.rows[0];

    if (!productData) {
      throw new Error("Product not found");
    }

    const { price, amount: availableAmount } = productData;
    const totalCost = price * amount;

    if (availableAmount < amount) {
      throw new Error("Insufficient product amount");
    }

    if (userBalance < totalCost) {
      throw new Error("Insufficient funds");
    }

    const transactionValues = [id, userId, productId, amount];
    const resultAddProduct = await client.query(
      transactionQuery,
      transactionValues
    );

    await client.query("COMMIT");

    return {
      data: resultAddProduct.rows[0] || null,
      errorMessage: null,
      errorRaw: null,
    };
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error in transaction:", error);

    let errorMessage = "Error in transaction to add product to cart";

    if (error instanceof Error) {
      if (error.message === "Insufficient product amount") {
        errorMessage = "Insufficient product amount";
      } else if (error.message === "Insufficient funds") {
        errorMessage = "Insufficient funds";
      }
    }

    return {
      data: null,
      errorMessage,
      errorRaw: error as Error,
    };
  } finally {
    client.release();
  }
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
        amount: row.product_stock,
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
