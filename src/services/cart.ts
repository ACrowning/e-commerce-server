import { CartItem, ShopCart } from "../types/cart";
import {
  getCartItems as dbGetCartItems,
  addProductToCartWithTransaction as dbAddProductToCartWithTransaction,
  removeProductFromCartWithTransaction as dbRemoveProductFromCartWithTransaction,
} from "../database/repositories/shopCart";
import ShortUniqueId from "short-unique-id";
import { RepositoryResponse } from "../types/repositoryResponse";

const uid = new ShortUniqueId({ length: 10 });

const cartService = {
  addProductToCartWithTransaction: async (
    userId: string,
    productId: string,
    amount: number
  ): Promise<{
    data: ShopCart | null;
    errorMessage: string | null;
    errorRaw: Error | null;
  }> => {
    const id = uid.rnd();
    const response = await dbAddProductToCartWithTransaction(
      id,
      userId,
      productId,
      amount
    );

    return {
      data: response.data,
      errorMessage: response.errorMessage,
      errorRaw: response.errorRaw,
    };
  },

  removeProductFromCart: async (
    cartItemId: string,
    userId: string,
    productId: string,
    amount: number
  ): Promise<RepositoryResponse<ShopCart>> => {
    try {
      const result = await dbRemoveProductFromCartWithTransaction(
        cartItemId,
        userId,
        productId,
        amount
      );

      if (result.errorMessage) {
        return {
          data: null,
          errorMessage: result.errorMessage,
          errorRaw: result.errorRaw,
        };
      }

      return {
        data: result.data,
        errorMessage: null,
        errorRaw: null,
      };
    } catch (error) {
      return {
        data: null,
        errorMessage: "Failed to remove product from cart",
        errorRaw: error as Error,
      };
    }
  },

  getCartItems: async (
    userId: string
  ): Promise<{
    data: CartItem[] | null;
    errorMessage: string | null;
    errorRaw: Error | null;
  }> => {
    const response = await dbGetCartItems(userId);

    return {
      data: response.data,
      errorMessage: response.errorMessage,
      errorRaw: response.errorRaw,
    };
  },
};

export { cartService };
