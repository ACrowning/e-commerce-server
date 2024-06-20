const products = require("../../database/elements");
const fs = require("fs/promises");
const path = require("path");
const { comments } = require("../../database/comments");
const { saveImage, saveAlbum } = require("../services/uploadService");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });

const productService = {
  getProducts: ({ title, sortByPrice, page = 1, limit = 10 }) => {
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(title.toLowerCase())
    );
    if (filteredProducts) {
      filteredProducts.sort((a, b) => {
        if (sortByPrice === "asc") {
          return a.price - b.price;
        } else if (sortByPrice === "desc") {
          return b.price - a.price;
        }
      });

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const currentPage = filteredProducts.slice(startIndex, endIndex);

      return {
        currentPage,
        total: Math.ceil(filteredProducts.length / limit),
      };
    } else {
      return {
        currentPage: [],
        total: 0,
      };
    }
  },

  createProduct: async (title, amount, price, favorite, image, albumPhotos) => {
    const newProduct = {
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

  editTitle: (productId, updatedData) => {
    const index = products.findIndex((product) => product.id === productId);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...updatedData,
      };
      return products[index];
    }
  },

  deleteProduct: async (productId) => {
    const index = products.findIndex((product) => product.id === productId);
    if (index !== -1) {
      const deletedProduct = products.splice(index, 1)[0];

      try {
        const imagePath = path.join(
          __dirname,
          "../../uploads",
          deletedProduct.image
        );
        await fs.unlink(imagePath);

        if (
          deletedProduct.albumPhotos &&
          deletedProduct.albumPhotos.length > 0
        ) {
          const deletePromises = deletedProduct.albumPhotos.map(
            async (photo) => {
              const photoPath = path.join(__dirname, "../../uploads", photo);
              await fs.unlink(photoPath);
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

  getElementById: (productId) => {
    const product = products.find((product) => product.id === productId);
    if (product) {
      const productComments = comments.filter(
        (comment) => comment.productId === productId
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

module.exports = { productService };
