import express, { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { productService } from "../services/products";
import { requireLogin } from "../middlewares/requireLogin";
import { adminOnly } from "../middlewares/adminOnly";
import { GetProductsParams } from "../database/repositories/products";

const Router = express.Router();

Router.post("/", async (req: Request, res: Response) => {
  const { title, sortByPrice, page, limit } = req.body;

  const params: GetProductsParams = {
    title: title,
    sortByPrice: sortByPrice,
    page: page ? parseInt(page, 10) : 1,
    limit: limit === "*" ? "*" : limit ? parseInt(limit, 10) : 10,
  };

  try {
    const { data, errorMessage } = await productService.getProducts(params);

    if (errorMessage) {
      res.status(500).json({ data: [], error: errorMessage });
      return;
    }

    res.status(200).json({ data, error: null });
  } catch (error) {
    res.status(500).json({ data: [], error: "Failed to fetch products" });
  }
});

Router.use(fileUpload());

Router.post("/create", requireLogin, adminOnly, async (req: any, res: any) => {
  try {
    const { title, amount, price, favorite } = req.body;
    const image = req.files?.image || null;
    const albumPhotos = req.files?.albumPhotos || [];

    const albumPhotosArray = Array.isArray(albumPhotos) ? albumPhotos : [albumPhotos];

    const { data, errorMessage } = await productService.createProduct(
      title,
      amount,
      price,
      favorite,
      image,
      albumPhotosArray
    );

    if (errorMessage) {
      res.status(500).json({ data: null, error: errorMessage });
      return;
    }

    res.status(201).json({ message: "Product created successfully", data, error: null });
  } catch (error: any) {
    res.status(500).json({ data: null, error: error.message });
  }
});

Router.put("/:id", requireLogin, async (req, res) => {
  const productId = req.params.id;
  try {
    const { data, errorMessage } = await productService.editTitle(productId, req.body);
    
    if (errorMessage) {
      res.status(500).json({ data: null, error: errorMessage });
      return;
    }
    
    res.status(200).json({ message: "Element updated successfully", data, error: null });
  } catch (error: any) {
    res.status(404).json({ data: null, error: error.message });
  }
});

Router.delete("/:id", requireLogin, async (req, res) => {
  const productId = req.params.id;
  try {
    const { data, errorMessage } = await productService.deleteProduct(productId);

    if (errorMessage) {
      res.status(500).json({ data: null, error: errorMessage });
      return;
    }

    res.status(200).json({ message: "Element deleted successfully", data, error: null });
  } catch (error: any) {
    res.status(404).json({ data: null, error: error.message });
  }
});

Router.get("/:id", async (req, res) => {
  const productId = req.params.id;
  const element = productService.getElementById(productId);
  if (element) {
    res.json({ data: element });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

export default Router;
