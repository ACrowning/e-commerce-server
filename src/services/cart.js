const products = require("../../database/elements");
const { cartItems } = require("../../database/cartItems");

const cartService = {
  getCart: () => {
    return cartItems;
  },

  addItemToCart: (newItem) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === newItem.id
    );
    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].amount += newItem.amount;
    } else {
      cartItems.push(newItem);
    }
    return { success: true, cartItems: cartItems };
  },

  updateProductAmount: (productId, updatedItemData) => {
    const index = cartItems.findIndex((item) => item.id === productId);
    if (index !== -1) {
      cartItems[index] = {
        ...cartItems[index],
        ...updatedItemData,
      };
      return { success: true };
    }
  },

  deleteCartItem: (productId) => {
    const indexCart = cartItems.findIndex((item) => item.id === productId);
    if (indexCart !== -1) {
      cartItems.splice(indexCart, 1);
      const indexElement = products.find((item) => item.id === productId);
      if (indexElement) {
        indexElement.amount += indexCart.amount;
      }
      return { success: true, cartItems: cartItems };
    }
  },
};

module.exports = { cartService };
