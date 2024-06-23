import { products } from "../database/elements";
import { cartItems } from "../database/cartItems";

const cartService = {
  getCart: () => {
    return cartItems;
  },

  addItemToCart: (newItem: any) => {
    const existingItemIndex = cartItems.findIndex(
      (item: any) => item.id === newItem.id
    );
    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].amount += newItem.amount;
    } else {
      cartItems.push(newItem);
    }
    return { success: true, cartItems: cartItems };
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
    const indexCart: any = cartItems.findIndex((item: any) => item.id === productId);
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
