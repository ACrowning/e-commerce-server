// src/services/productService.ts
import { Product } from "../database/elements";
import {
  createProduct as dbCreateProduct,
  getProducts as dbGetProducts,
  deleteProduct as dbDeleteProduct,
  updateProduct as dbUpdateProduct,
} from "../database/repositories/products";
import fs from "fs/promises";
import { comments } from "../database/comments";
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
  getProducts: async (params: GetProductsParams) => {
    const { data, errorMessage, errorRaw } = await dbGetProducts(params);
    if (errorMessage) {
      return `${errorMessage}: ${errorRaw}`;
    }
    return data;
  },

  createProduct: async (
    title: string,
    amount: number,
    price: number,
    favorite: boolean,
    image: any,
    albumPhotos: any[]
  ) => {
    const newProduct: any = {
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

    const { data, errorMessage, errorRaw } = await dbCreateProduct(newProduct);
    if (errorMessage) {
      return `${errorMessage}: ${errorRaw}`;
    }
    return data;
  },

  editTitle: async (productId: string, updatedData: Partial<Product>) => {
    const { data, errorMessage, errorRaw } = await dbUpdateProduct(
      productId,
      updatedData
    );
    if (errorMessage) {
      return `${errorMessage}: ${errorRaw}`;
    }
    return data;
  },

  deleteProduct: async (productId: string) => {
    const {
      data: deletedProduct,
      errorMessage,
      errorRaw,
    } = await dbDeleteProduct(productId);

    if (errorMessage) {
      return `${errorMessage}: ${errorRaw}`;
    }

    if (deletedProduct) {
      try {
        if (deletedProduct.image) {
          const imagePath = getImgPath(deletedProduct.image);
          await fs.unlink(imagePath);
        }

        if (
          deletedProduct.albumPhotos &&
          deletedProduct.albumPhotos.length > 0
        ) {
          const deletePromises = deletedProduct.albumPhotos.map(
            async (photo: string) => {
              const photoPath = getImgPath(photo);
              return fs.unlink(photoPath);
            }
          );

          await Promise.all(deletePromises);
        }
      } catch (error) {
        console.error("Failed to delete product images:", error);
      }
    }

    return deletedProduct?.id || null;
  },

  getElementById: async (productId: string) => {
    const {
      data: products,
      errorMessage,
      errorRaw,
    } = await dbGetProducts({
      title: "",
      sortByPrice: undefined,
      page: 1,
      limit: "*",
    });
    if (errorMessage) {
      return `${errorMessage}: ${errorRaw}`;
    }

    const product = products?.find(
      (product: Product) => product.id === productId
    );

    if (product) {
      const productComments = comments.filter(
        (comment: { productId: any }) => comment.productId === productId
      );
      return {
        ...product,
        comments: productComments,
      };
    } else {
      return null;
    }
  },
};

export { productService };
