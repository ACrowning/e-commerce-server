import express, { Request, Response } from "express";
import { cartService } from "../services/cart";

const Router = express.Router();

Router.post("/add", async (req: Request, res: Response) => {
  const { userId, productId, amount } = req.body;

  const {
    data: newProduct,
    errorMessage,
    errorRaw,
  } = await cartService.addProductToCartWithTransaction(
    userId,
    productId,
    amount
  );

  if (errorMessage) {
    if (errorMessage.includes("Insufficient funds")) {
      return res.status(400).json({
        message: "Insufficient funds to complete the transaction",
        error: errorRaw,
        data: null,
      });
    }

    return res.status(500).json({
      message: errorMessage,
      error: errorRaw,
      data: null,
    });
  }

  res.status(201).json({
    message: "Product added to cart and transaction processed successfully",
    error: null,
    data: newProduct,
  });
});

Router.put("/update", async (req: Request, res: Response) => {
  const { cartId, productId, amount } = req.body;

  const {
    data: updatedCart,
    errorMessage,
    errorRaw,
  } = await cartService.updateCartItemAmount(cartId, productId, amount);

  if (errorMessage) {
    return res.status(500).json({
      message: errorMessage,
      error: errorRaw,
      data: null,
    });
  }

  res.status(200).json({
    message: "Cart item amount updated successfully",
    error: null,
    data: updatedCart,
  });
});

Router.post("/delete", async (req: Request, res: Response) => {
  const { cartItemId, userId, productId, amount } = req.body;

  const {
    data: removedProduct,
    errorMessage,
    errorRaw,
  } = await cartService.removeProductFromCart(
    cartItemId,
    userId,
    productId,
    amount
  );

  if (errorMessage) {
    if (errorMessage.includes("Insufficient product amount")) {
      return res.status(400).json({
        message: "Insufficient product amount in stock",
        error: errorRaw,
        data: null,
      });
    }

    return res.status(500).json({
      message: errorMessage,
      error: errorRaw,
      data: null,
    });
  }

  return res.status(200).json({
    message: "Product removed from cart and transaction processed successfully",
    error: null,
    data: removedProduct,
  });
});

Router.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  const {
    data: allProducts,
    errorMessage,
    errorRaw,
  } = await cartService.getCartItems(userId);

  if (errorMessage) {
    return res.status(500).json({
      message: errorMessage,
      error: errorRaw,
      data: null,
    });
  }

  res.status(200).json({
    message: "Products retrieved from cart successfully",
    error: null,
    data: allProducts,
  });
});

export default Router;
