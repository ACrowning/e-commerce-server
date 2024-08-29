import express, { Request, Response } from "express";
import { cartService } from "../services/cart";

const Router = express.Router();

Router.post("/add", async (req: Request, res: Response): Promise<void> => {
  const { userId, productId, amount } = req.body;

  const { data: newProduct, errorMessage } = await cartService.addProductToCart(
    userId,
    productId,
    amount
  );

  if (errorMessage) {
    res.status(500).json({
      message: "Failed to add product to cart",
      error: errorMessage,
    });
    return;
  }

  if (newProduct) {
    res.status(201).json({
      message: "Product added to cart successfully",
      data: newProduct,
    });
  }
});

Router.get("/:userId", async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  const { data: allProducts, errorMessage } = await cartService.getCartItems(
    userId
  );

  if (errorMessage) {
    res.status(500).json({
      message: "Failed to retrieve products from cart",
      error: errorMessage,
    });
    return;
  }

  res.status(200).json({ data: allProducts });
});

Router.put("/update", async (req: Request, res: Response): Promise<void> => {
  const { cartItemId, userId, amount } = req.body;

  const { data: updatedItem, errorMessage } = await cartService.updateCartItem(
    cartItemId,
    userId,
    amount
  );

  if (errorMessage) {
    res.status(500).json({
      message: "Failed to update cart item",
      error: errorMessage,
    });
    return;
  }

  if (updatedItem) {
    res.status(200).json({
      message: "Cart item updated successfully",
      data: updatedItem,
    });
  }
});

Router.delete("/delete", async (req: Request, res: Response): Promise<void> => {
  const { cartItemId, userId } = req.body;

  const { data: deletedItem, errorMessage } = await cartService.deleteCartItem(
    cartItemId,
    userId
  );

  if (errorMessage) {
    res.status(500).json({
      message: "Failed to delete cart item",
      error: errorMessage,
    });
    return;
  }

  if (deletedItem) {
    res.status(200).json({
      message: "Cart item deleted successfully",
      data: deletedItem,
    });
  }
});

export default Router;
