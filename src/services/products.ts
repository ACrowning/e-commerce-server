import { GetProductsParams, Product } from "../types/products";
import {
  createProduct as dbCreateProduct,
  getProducts as dbGetProducts,
  deleteProduct as dbDeleteProduct,
  updateProduct as dbUpdateProduct,
} from "../database/repositories/products";
import fs from "fs/promises";
import { saveImage, saveAlbum, getImgPath } from "../services/uploadService";
import ShortUniqueId from "short-unique-id";
import { RepositoryResponse } from "../types/repositoryResponse";

const uid = new ShortUniqueId({ length: 10 });

const productService = {
  getProducts: async (
    params: GetProductsParams
  ): Promise<RepositoryResponse<{ products: Product[]; total: number }>> => {
    const response = await dbGetProducts(params);
    return {
      data: response.data,
      errorMessage: response.errorMessage,
      errorRaw: response.errorRaw,
    };
  },

  createProduct: async (
    title: string,
    amount: number,
    price: number,
    favorite: boolean,
    image: { name: string; data: Buffer } | null,
    albumPhotos: { name: string; data: Buffer }[]
  ): Promise<RepositoryResponse<Product>> => {
    const newProduct: Product = {
      id: uid.rnd(),
      title,
      amount,
      price: price || Math.floor(Math.random() * 10),
      favorite,
      image: image ? await saveImage(image) : null,
      albumPhotos:
        albumPhotos && albumPhotos.length > 0
          ? await saveAlbum(albumPhotos)
          : [],
    };

    const response = await dbCreateProduct(newProduct);
    return {
      data: response.data,
      errorMessage: response.errorMessage,
      errorRaw: response.errorRaw,
    };
  },

  editTitle: async (
    productId: string,
    updatedData: Partial<Product>
  ): Promise<RepositoryResponse<Product>> => {
    const response = await dbUpdateProduct(productId, updatedData);
    return {
      data: response.data,
      errorMessage: response.errorMessage,
      errorRaw: response.errorRaw,
    };
  },

  deleteProduct: async (
    productId: string
  ): Promise<RepositoryResponse<Product>> => {
    const deletedProduct = await dbDeleteProduct(productId);

    if (deletedProduct.data) {
      if (deletedProduct.data.image) {
        const imagePath = getImgPath(deletedProduct.data.image);
        if (imagePath) {
          await fs.unlink(imagePath);
        }
      }

      if (
        deletedProduct.data.albumPhotos &&
        deletedProduct.data.albumPhotos.length > 0
      ) {
        const deletePromises = deletedProduct.data.albumPhotos.map(
          async (photo) => {
            const photoPath = getImgPath(photo);
            if (photoPath) {
              return fs.unlink(photoPath);
            }
          }
        );

        await Promise.all(deletePromises);
      }
    }

    return {
      data: deletedProduct.data,
      errorMessage: deletedProduct.errorMessage,
      errorRaw: deletedProduct.errorRaw,
    };
  },
};

export { productService };
