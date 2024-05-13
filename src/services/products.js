const products = require("../../database/elements");
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
  createProduct: (title, amount, price, favorite) => {
    const newUser = {
      id: uid.rnd(),
      title,
      amount,
      price: price || Math.floor(Math.random() * 10),
      favorite,
    };
    products.push(newUser);
    return newUser;
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
    return products.find((product) => product.id === productId);
  },
};

module.exports = { productService };
