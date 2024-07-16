import { Product, products } from "../database/elements";
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
  getProducts: ({
    title,
    sortByPrice,
    page = 1,
    limit = 10,
  }: GetProductsParams) => {
    let filteredProducts = products;

    if (title) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    if (sortByPrice) {
      filteredProducts.sort((a, b) => {
        if (sortByPrice === "asc") {
          return a.price - b.price;
        } else if (sortByPrice === "desc") {
          return b.price - a.price;
        } else {
          return 0;
        }
      });
    }

    if (limit === "*") {
      return {
        currentPage: filteredProducts,
        total: 1,
      };
    } else {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const currentPage = filteredProducts.slice(startIndex, endIndex);

      return {
        currentPage,
        total: Math.ceil(filteredProducts.length / limit),
      };
    }
  },

  createProduct: async (
    title: any,
    amount: any,
    price: any,
    favorite: any,
    image: any,
    albumPhotos: any[]
  ) => {
    const newProduct: any = {
      id: uid.rnd(),
      title,
      amount,
      price: price || Math.floor(Math.random() * 10),
      favorite,
    };

    if (image) {
      newProduct.image = await saveImage(image);
    }

    if (albumPhotos && albumPhotos.length > 0) {
      newProduct.albumPhotos = await saveAlbum(albumPhotos);
    }

    products.push(newProduct);
    return newProduct;
  },

  editTitle: (productId: any, updatedData: any) => {
    const index = products.findIndex(
      (product: { id: any }) => product.id === productId
    );
    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...updatedData,
      };
      return products[index];
    }
  },

  deleteProduct: async (productId: any) => {
    const index = products.findIndex(
      (product: { id: any }) => product.id === productId
    );
    if (index !== -1) {
      const deletedProduct = products.splice(index, 1)[0];

      try {
        const imagePath = getImgPath(deletedProduct.image);
        await fs.unlink(imagePath);

        if (
          deletedProduct.albumPhotos &&
          deletedProduct.albumPhotos.length > 0
        ) {
          const deletePromises = deletedProduct.albumPhotos.map(
            async (photo: any) => {
              const photoPath = getImgPath(photo);
              return fs.unlink(photoPath);
            }
          );

          await Promise.all(deletePromises);
        }
      } catch (error) {
        console.error("Failed to delete product images:", error);
      }

      return deletedProduct.id;
    }
  },

  getElementById: (productId: any) => {
    const product = products.find(
      (product: { id: any }) => product.id === productId
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
