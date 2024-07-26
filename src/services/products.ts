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
    const { data } = await dbGetProducts(params);

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

    const { data } = await dbCreateProduct(newProduct);

    return data;
  },

  editTitle: async (productId: string, updatedData: Partial<Product>) => {
    const { data } = await dbUpdateProduct(productId, updatedData);

    return data;
  },

  deleteProduct: async (productId: string) => {
    const { data: deletedProduct } = await dbDeleteProduct(productId);

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
    const { data: products } = await dbGetProducts({
      title: "",
      sortByPrice: undefined,
      page: 1,
      limit: "*",
    });

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
