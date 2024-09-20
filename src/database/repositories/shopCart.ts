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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const getProductPriceAndAmountQuery = `
      SELECT price, amount 
      FROM products 
      WHERE id = $1;
    `;
    const productDataResult = await client.query(
      getProductPriceAndAmountQuery,
      [productId]
    );
    const productData = productDataResult.rows[0];

    if (!productData) {
      return {
        data: null,
        errorMessage: "Product not found",
        errorRaw: null,
      };
    }

    const { price, amount: availableAmount } = productData;
    const totalCost = price * amount;

    if (availableAmount < amount) {
      return {
        data: null,
        errorMessage: "Insufficient product amount",
        errorRaw: null,
      };
    }

    const getUserBalanceQuery = `
      SELECT money 
      FROM users 
      WHERE id = $1;
    `;
    const userBalanceResult = await client.query(getUserBalanceQuery, [userId]);
    const userBalance = userBalanceResult.rows[0]?.money;

    if (userBalance < totalCost) {
      return {
        data: null,
        errorMessage: "Insufficient funds",
        errorRaw: null,
      };
    }

    const addProductQuery = `
      INSERT INTO ShopCart (id, user_id, product_id, amount)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const addProductValues = [id, userId, productId, amount];
    const resultAddProduct = await client.query(
      addProductQuery,
      addProductValues
    );

    const updateProductAmountQuery = `
      UPDATE products
      SET amount = amount - $1
      WHERE id = $2;
    `;
    const updateAmountValues = [amount, productId];
    await client.query(updateProductAmountQuery, updateAmountValues);

    const deductUserMoneyQuery = `
      UPDATE users
      SET money = money - $1
      WHERE id = $2;
    `;
    const deductMoneyValues = [totalCost, userId];
    await client.query(deductUserMoneyQuery, deductMoneyValues);

    await client.query("COMMIT");

    return {
      data: resultAddProduct.rows[0] || null,
      errorMessage: null,
      errorRaw: null,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    return {
      data: null,
      errorMessage: "Error in transaction to add product to cart",
      errorRaw: error as Error,
    };
  } finally {
    client.release();
  }
}

export async function removeProductFromCartWithTransaction(
  cartItemId: string,
  userId: string,
  productId: string,
  amount: number
): Promise<RepositoryResponse<ShopCart>> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const getProductPriceQuery = `
      SELECT price 
      FROM products 
      WHERE id = $1;
    `;
    const productPriceResult = await client.query(getProductPriceQuery, [
      productId,
    ]);
    const productPrice = productPriceResult.rows[0]?.price;

    if (!productPrice) {
      throw new Error("Product not found");
    }

    const totalRefund = productPrice * amount;

    const removeProductQuery = `
      DELETE FROM ShopCart 
      WHERE id = $1
      RETURNING *;
    `;
    const resultRemoveProduct = await client.query(removeProductQuery, [
      cartItemId,
    ]);

    const updateProductAmountQuery = `
      UPDATE products
      SET amount = amount + $1
      WHERE id = $2;
    `;
    const updateAmountValues = [amount, productId];
    await client.query(updateProductAmountQuery, updateAmountValues);

    const refundUserMoneyQuery = `
      UPDATE users
      SET money = money + $1
      WHERE id = $2;
    `;
    const refundMoneyValues = [totalRefund, userId];
    await client.query(refundUserMoneyQuery, refundMoneyValues);

    await client.query("COMMIT");

    return {
      data: resultRemoveProduct.rows[0] || null,
      errorMessage: null,
      errorRaw: null,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    return {
      data: null,
      errorMessage: "Error in transaction to remove product from cart",
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
