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
    return dbGetProducts(params);
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

    return dbCreateProduct(newProduct);
  },

  editTitle: async (productId: string, updatedData: Partial<Product>) => {
    return dbUpdateProduct(productId, updatedData);
  },

  deleteProduct: async (productId: string) => {
    const deletedProduct = await dbDeleteProduct(productId);

    if (deletedProduct.data) {
      try {
        if (deletedProduct.data.image) {
          const imagePath = getImgPath(deletedProduct.data.image);
          await fs.unlink(imagePath);
        }

        if (
          deletedProduct.data.albumPhotos &&
          deletedProduct.data.albumPhotos.length > 0
        ) {
          const deletePromises = deletedProduct.data.albumPhotos.map(
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

    return deletedProduct;
  },

  getElementById: async (productId: string) => {
    const productsResponse = await dbGetProducts({
      title: "",
      sortByPrice: undefined,
      page: 1,
      limit: "*",
    });

    if (productsResponse.data) {
      const product = productsResponse.data.find(
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
    } else {
      return null;
    }
  },
};

export { productService };
