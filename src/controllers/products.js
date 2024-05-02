const express = require("express");
const Router = express.Router();
const { productService } = require("../services/products");

const productRoutes = () => {
  Router.post("/", (req, res) => {
    const { title, sortByPrice } = req.body;

    const filteredElements = productService.getProducts(title, sortByPrice);

    if (filteredElements) {
      res.status(200).json({ sortedElements: filteredElements });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });
};

module.exports = { productRoutes };
