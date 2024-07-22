"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartService = void 0;
const elements_1 = require("../database/elements");
const cartItems_1 = require("../database/cartItems");
const cartService = {
    getCart: () => {
        return cartItems_1.cartItems;
    },
    addItemToCart: (newItem) => {
        const existingItemIndex = cartItems_1.cartItems.findIndex((item) => item.id === newItem.id);
        if (existingItemIndex !== -1) {
            cartItems_1.cartItems[existingItemIndex].amount += newItem.amount;
        }
        else {
            cartItems_1.cartItems.push(newItem);
        }
        return { success: true, cartItems: cartItems_1.cartItems };
    },
    updateProductAmount: (productId, updatedItemData) => {
        const index = cartItems_1.cartItems.findIndex((item) => item.id === productId);
        if (index !== -1) {
            cartItems_1.cartItems[index] = Object.assign(Object.assign({}, cartItems_1.cartItems[index]), updatedItemData);
            return { success: true };
        }
    },
    deleteCartItem: (productId) => {
        const indexCart = cartItems_1.cartItems.findIndex((item) => item.id === productId);
        if (indexCart !== -1) {
            cartItems_1.cartItems.splice(indexCart, 1);
            const indexElement = elements_1.products.find((item) => item.id === productId);
            if (indexElement) {
                indexElement.amount += indexCart.amount;
            }
            return { success: true, cartItems: cartItems_1.cartItems };
        }
    },
};
exports.cartService = cartService;
//# sourceMappingURL=cart.js.map