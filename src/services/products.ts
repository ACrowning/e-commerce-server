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
  // getProducts: ({
  //   title,
  //   sortByPrice,
  //   page = 1,
  //   limit = 10,
  // }: GetProductsParams) => {
  //   let filteredProducts = products;

  //   if (title) {
  //     filteredProducts = filteredProducts.filter((product) =>
  //       product.title.toLowerCase().includes(title.toLowerCase())
  //     );
  //   }

  //   if (sortByPrice) {
  //     filteredProducts.sort((a, b) => {
  //       if (sortByPrice === "asc") {
  //         return a.price - b.price;
  //       } else if (sortByPrice === "desc") {
  //         return b.price - a.price;
  //       } else {
  //         return 0;
  //       }
  //     });
  //   }

  //   if (limit === "*") {
  //     return {
  //       currentPage: filteredProducts,
  //       total: 1,
  //     };
  //   } else {
  //     const startIndex = (page - 1) * limit;
  //     const endIndex = startIndex + limit;
  //     const currentPage = filteredProducts.slice(startIndex, endIndex);

  //     return {
  //       currentPage,
  //       total: Math.ceil(filteredProducts.length / limit),
  //     };
  //   }
  // },

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
    const product = await dbGetProducts({
      title: "",
      sortByPrice: undefined,
      page: 1,
      limit: "*",
    }).then((products) =>
      products.find((product: Product) => product.id === productId)
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
