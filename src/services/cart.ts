import { products } from "../database/elements";
import { cartItems, ShopCart } from "../database/cartItems";
import {
  addProductToCart as dbAddProductToCart,
  getCartItems as dbGetCartItems,
  updateCartItem as dbUpdateCartItem,
  deleteCartItem as dbDeleteCartItem,
} from "../database/repositories/shopCart";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 10 });

const cartService = {
  addProductToCart: async (
    userId: string,
    productId: string,
    amount: number
  ): Promise<{
    data: ShopCart | null;
    errorMessage: string | null;
    errorRaw: Error | null;
  }> => {
    const id = uid.rnd();

    const response = await dbAddProductToCart(id, userId, productId, amount);

    return {
      data: response.data,
      errorMessage: response.errorMessage,
      errorRaw: response.errorRaw,
    };
  },

  getCartItems: async (
    userId: string
  ): Promise<{
    data: any[] | null;
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

  updateCartItem: async (
    cartItemId: string,
    userId: string,
    amount: number
  ): Promise<{
    data: ShopCart | null;
    errorMessage: string | null;
    errorRaw: Error | null;
  }> => {
    const response = await dbUpdateCartItem(cartItemId, userId, amount);

    return {
      data: response.data,
      errorMessage: response.errorMessage,
      errorRaw: response.errorRaw,
    };
  },

  deleteCartItem: async (
    cartItemId: string,
    userId: string
  ): Promise<{
    data: ShopCart | null;
    errorMessage: string | null;
    errorRaw: Error | null;
  }> => {
    const response = await dbDeleteCartItem(cartItemId, userId);

    return {
      data: response.data,
      errorMessage: response.errorMessage,
      errorRaw: response.errorRaw,
    };
  },
};

export { cartService };
