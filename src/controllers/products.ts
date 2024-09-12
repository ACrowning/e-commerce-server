import express, { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { productService } from "../services/products";
import { requireLogin } from "../middlewares/requireLogin";
import { adminOnly } from "../middlewares/adminOnly";
import { GetProductsParams } from "../types/products";

const Router = express.Router();

Router.use(fileUpload());

Router.post("/", async (req: Request, res: Response) => {
  const { title, sortByPrice, page, limit } = req.body;

  const params: GetProductsParams = {
    title: title,
    sortByPrice: sortByPrice,
    page: page ? parseInt(page, 10) : 1,
    limit: limit === "*" ? "*" : limit ? parseInt(limit, 10) : 10,
  };

  const { data, errorMessage, errorRaw } = await productService.getProducts(
    params
  );

  if (!data) {
    return res.status(500).json({
      message: errorMessage,
      error: errorRaw,
      data: null,
    });
  }

  res.status(200).json({
    message: "Products fetched successfully",
    error: null,
    data: data.products,
    total: data.total,
  });
});

Router.get("/:id", requireLogin, async (req: Request, res: Response) => {
  const productId = req.params.id;

  const { data, errorMessage, errorRaw } = await productService.getProductById(
    productId
  );

  if (errorMessage) {
    return res.status(500).json({
      message: errorMessage,
      error: errorRaw,
      data: null,
    });
  }

  res.status(200).json({
    message: "Product fetched successfully",
    error: null,
    data,
  });
});

Router.post(
  "/create",
  requireLogin,
  adminOnly,
  async (req: Request, res: Response) => {
    const { title, amount, price, favorite } = req.body;

    const image = req.files?.image;
    const imageFile =
      image && !Array.isArray(image)
        ? { name: image.name, data: image.data }
        : null;

    const albumPhotos = req.files?.albumPhotos;
    const photos =
      albumPhotos && Array.isArray(albumPhotos) ? albumPhotos : [albumPhotos];

    const albumPhotosArray = photos.map((photo: any) => ({
      name: photo.name,
      data: photo.data,
    }));

    const { data, errorMessage, errorRaw } = await productService.createProduct(
      title,
      amount,
      price,
      favorite,
      imageFile,
      albumPhotosArray
    );

    if (errorMessage) {
      return res.status(500).json({
        message: errorMessage,
        error: errorRaw,
        data: null,
      });
    }

    res.status(201).json({
      message: "Product created successfully",
      error: null,
      data,
    });
  }
);

Router.put("/:id", requireLogin, async (req: Request, res: Response) => {
  const productId = req.params.id;

  const { data, errorMessage, errorRaw } = await productService.editTitle(
    productId,
    req.body
  );

  if (errorMessage) {
    return res.status(500).json({
      message: errorMessage,
      error: errorRaw,
      data: null,
    });
  }

  res.status(200).json({
    message: "Element updated successfully",
    error: null,
    data,
  });
});

Router.delete("/:id", requireLogin, async (req: Request, res: Response) => {
  const productId = req.params.id;

  const { data, errorMessage, errorRaw } = await productService.deleteProduct(
    productId
  );

  if (errorMessage) {
    return res.status(500).json({
      message: errorMessage,
      error: errorRaw,
      data: null,
    });
  }

  res.status(200).json({
    message: "Element deleted successfully",
    error: null,
    data,
  });
});

export default Router;
