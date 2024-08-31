import { Product } from "../types/products";
import {
  createProduct as dbCreateProduct,
  getProducts as dbGetProducts,
  deleteProduct as dbDeleteProduct,
  updateProduct as dbUpdateProduct,
  RepositoryResponse,
} from "../database/repositories/products";
import fs from "fs/promises";
import { saveImage, saveAlbum, getImgPath } from "../services/uploadService";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 10 });

interface GetProductsParams {
  title?: string;
  sortByPrice?: "asc" | "desc";
  page?: number;
  limit?: number | "*";
}

const productService = {
  getProducts: async (
    params: GetProductsParams
  ): Promise<RepositoryResponse<Product[]>> => {
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
      album_photos: undefined,
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

      const albumPhotos = deletedProduct.data.album_photos;

      if (albumPhotos && albumPhotos.length > 0) {
        const deletePromises = albumPhotos.map(async (photo: string | null) => {
          const photoPath = getImgPath(photo);

          if (photoPath) {
            await fs.unlink(photoPath);
          }
        });

        await Promise.allSettled(deletePromises);
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
