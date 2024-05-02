const { elements } = require("../../database/elements");

const productService = {
  getProducts: (title, sortByPrice) => {
    const filteredElements = elements.filter((element) =>
      element.title.toLowerCase().includes(title.toLowerCase())
    );
    if (filteredElements) {
      filteredElements.sort((a, b) => {
        if (sortByPrice === "asc") {
          return a.price - b.price;
        } else if (sortByPrice === "desc") {
          return b.price - a.price;
        }
      });
    }
  },
};

module.exports = { productService };
