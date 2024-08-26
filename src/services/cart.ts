import { products } from "../database/elements";
import { cartItems, ShopCart } from "../database/cartItems";
import {
  addProductToCart as dbAddProductToCart,
  getAllProductsInCart as dbGetAllProductsInCart,
} from "../database/repositories/shopCart";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 10 });

const cartService = {
  addProductToCart: async (
    userId: string,
    productId: string,
    amount: number,
    price: number
  ): Promise<{
    data: ShopCart | null;
    errorMessage: string | null;
    errorRaw: Error | null;
  }> => {
    const id = uid.rnd();

    const response = await dbAddProductToCart(
      id,
      userId,
      productId,
      amount,
      price
    );

    return {
      data: response.data,
      errorMessage: response.errorMessage,
      errorRaw: response.errorRaw,
    };
  },

  getAllProductsInCart: async (
    userId: string
  ): Promise<{
    data: ShopCart[] | null;
    errorMessage: string | null;
    errorRaw: Error | null;
  }> => {
    const response = await dbGetAllProductsInCart(userId);

    return {
      data: response.data,
      errorMessage: response.errorMessage,
      errorRaw: response.errorRaw,
    };
  },

  updateProductAmount: (productId: any, updatedItemData: any) => {
    const index = cartItems.findIndex((item: any) => item.id === productId);
    if (index !== -1) {
      cartItems[index] = {
        ...cartItems[index],
        ...updatedItemData,
      };
      return { success: true };
    }
  },

  deleteCartItem: (productId: any) => {
    const indexCart: any = cartItems.findIndex(
      (item: any) => item.id === productId
    );
    if (indexCart !== -1) {
      cartItems.splice(indexCart, 1);
      const indexElement = products.find((item: any) => item.id === productId);
      if (indexElement) {
        indexElement.amount += indexCart.amount;
      }
      return { success: true, cartItems: cartItems };
    }
  },
};

export { cartService };
