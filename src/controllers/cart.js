const express = require("express");
const Router = express.Router();
const { cartService } = require("../services/cart");

Router.get("/", (req, res) => {
  const cartItems = cartService.getCart();
  res.send({ data: cartItems });
});

Router.post("/", (req, res) => {
  const newItem = req.body;
  const result = cartService.addItemToCart(newItem);
  if (result.success) {
    res.status(201).json({
      message: "Item added to cart successfully",
      data: result.cartItems,
    });
  } else {
    res.status(400).json({
      message: "Failed to add item to cart",
      error: result.error,
    });
  }
});

Router.put("/:id", (req, res) => {
  const productId = req.params.id;
  const updatedItemData = req.body;
  const result = cartService.updateProductAmount(productId, updatedItemData);
  if (result.success) {
    res
      .status(200)
      .json({ message: "Item updated successfully", data: productId });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

Router.delete("/:id", (req, res) => {
  const productId = req.params.id;
  const result = cartService.deleteCartItem(productId);
  if (result.success) {
    res
      .status(200)
      .json({ message: "Item deleted successfully", data: result.cartItems });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

module.exports = Router;
