import express from "express";
import fileUpload from "express-fileupload";
import { productService } from "../services/products";
import requireLogin from "../middlewares/requireLogin";

const Router = express.Router();

Router.post("/", (req: any, res: any) => {
  const { title, sortByPrice, page, limit } = req.body;

  const filteredProducts = productService.getProducts({
    title,
    sortByPrice,
    page,
    limit,
  });

  if (filteredProducts) {
    res.status(200).json({ data: filteredProducts });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

Router.use(fileUpload());

Router.post("/create", requireLogin, async (req: any, res: any) => {
  try {
    const { title, amount, price, favorite } = req.body;
    const image = req.files?.image || null;
    const albumPhotos = req.files?.albumPhotos || [];

    const albumPhotosArray = Array.isArray(albumPhotos)
      ? albumPhotos
      : [albumPhotos];

    const createdProduct = await productService.createProduct(
      title,
      amount,
      price,
      favorite,
      image,
      albumPhotosArray
    );

    if (createdProduct) {
      res.status(201).json({
        message: "Product created successfully",
        data: createdProduct,
      });
    } else {
      res.status(500).json({ message: "Failed to create product" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

Router.put("/:id", (req, res) => {
  const productId = req.params.id;
  const changeTitle = productService.editTitle(productId, req.body);
  if (changeTitle) {
    res
      .status(200)
      .json({ message: "Element updated successfully", data: changeTitle });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

Router.delete("/:id", (req, res) => {
  const productId = req.params.id;
  const deletedProduct = productService.deleteProduct(productId);
  if (deletedProduct) {
    res.status(200).json({
      message: "Element deleted successfully",
      data: deletedProduct,
    });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

Router.get("/:id", (req, res) => {
  const productId = req.params.id;
  const element = productService.getElementById(productId);
  if (element) {
    res.json({ data: element });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

export default Router;
