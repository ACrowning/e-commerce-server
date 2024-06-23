import express from "express";
import { cartService } from "../services/cart";

const Router = express.Router();

Router.get("/", (req: any, res: any) => {
  const cartItems = cartService.getCart();
  res.send({ data: cartItems });
});

Router.post("/", (req: any, res: any) => {
  const newItem = req.body;
  const result: any = cartService.addItemToCart(newItem);
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

Router.put("/:id", (req: any, res: any) => {
  const productId = req.params.id;
  const updatedItemData = req.body;
  const result: any = cartService.updateProductAmount(productId, updatedItemData);
  if (result.success) {
    res
      .status(200)
      .json({ message: "Item updated successfully", data: productId });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

Router.delete("/:id", (req: any, res: any) => {
  const productId = req.params.id;
  const result: any = cartService.deleteCartItem(productId);
  if (result.success) {
    res
      .status(200)
      .json({ message: "Item deleted successfully", data: result.cartItems });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

export default Router;
