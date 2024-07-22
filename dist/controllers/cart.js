"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_1 = require("../services/cart");
const Router = express_1.default.Router();
Router.get("/", (req, res) => {
    const cartItems = cart_1.cartService.getCart();
    res.send({ data: cartItems });
});
Router.post("/", (req, res) => {
    const newItem = req.body;
    const result = cart_1.cartService.addItemToCart(newItem);
    if (result.success) {
        res.status(201).json({
            message: "Item added to cart successfully",
            data: result.cartItems,
        });
    }
    else {
        res.status(400).json({
            message: "Failed to add item to cart",
            error: result.error,
        });
    }
});
Router.put("/:id", (req, res) => {
    const productId = req.params.id;
    const updatedItemData = req.body;
    const result = cart_1.cartService.updateProductAmount(productId, updatedItemData);
    if (result.success) {
        res
            .status(200)
            .json({ message: "Item updated successfully", data: productId });
    }
    else {
        res.status(404).json({ message: "Not found" });
    }
});
Router.delete("/:id", (req, res) => {
    const productId = req.params.id;
    const result = cart_1.cartService.deleteCartItem(productId);
    if (result.success) {
        res
            .status(200)
            .json({ message: "Item deleted successfully", data: result.cartItems });
    }
    else {
        res.status(404).json({ message: "Not found" });
    }
});
exports.default = Router;
//# sourceMappingURL=cart.js.map