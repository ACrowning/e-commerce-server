const products = require("../../database/elements");
const { comments } = require("../../database/comments");
const uploadService = require("../services/uploadService");
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
    const imageName = await uploadService.saveImage(image);
    const albumNames = await uploadService.saveAlbum(albumPhotos);

    const newProduct = {
      id: uid.rnd(),
      title,
      amount,
      price: price || Math.floor(Math.random() * 10),
      favorite,
      imageName,
      album: albumNames,
    };
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

  deleteProduct: (productId) => {
    const index = products.findIndex((product) => product.id === productId);
    if (index !== -1) {
      const deletedProduct = products.splice(index, 1)[0];
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
