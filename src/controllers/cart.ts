import express, { Request, Response } from "express";
import { cartService } from "../services/cart";

const Router = express.Router();

Router.post("/add", async (req: Request, res: Response): Promise<void> => {
  const { userId, productId, amount, price } = req.body;

  try {
    const { data: newProduct, errorMessage } =
      await cartService.addProductToCart(userId, productId, amount, price);

    if (errorMessage) {
      res.status(500).json({
        message: "Failed to add product to cart",
        error: errorMessage,
      });
    } else if (newProduct) {
      res.status(201).json({
        message: "Product added to cart successfully",
        data: newProduct,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Unknown error occurred" });
  }
});

Router.get("/:userId", async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const { data: allProducts, errorMessage } =
      await cartService.getAllProductsInCart(userId);

    if (errorMessage) {
      res.status(500).json({
        message: "Failed to retrieve products from cart",
        error: errorMessage,
      });
    } else {
      res.status(200).json({ data: allProducts });
    }
  } catch (error) {
    res.status(500).json({ message: "Unknown error occurred" });
  }
});

Router.put("/:id", (req: any, res: any) => {
  const productId = req.params.id;
  const updatedItemData = req.body;
  const result: any = cartService.updateProductAmount(
    productId,
    updatedItemData
  );
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
