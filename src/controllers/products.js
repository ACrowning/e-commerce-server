const express = require("express");
const Router = express.Router();
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const { productService } = require("../services/products");

Router.post("/", (req, res) => {
  const { title, sortByPrice, page, limit } = req.body;

  const filteredProducts = productService.getProducts({
    title,
    sortByPrice,
    page,
    limit,
  });

  if (filteredProducts) {
    res.status(200).json({ data: filteredProducts });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

Router.use(fileUpload());

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

Router.post("/create", (req, res) => {
  const { title, amount, price, favorite } = req.body;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let image = req.files.image;

  let uploadPath = path.join(uploadDir, image.name);

  image.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    const createdProduct = productService.createProduct(
      title,
      amount,
      price,
      favorite,
      uploadPath
    );

    if (createdProduct) {
      res.status(201).json({
        message: "Element created successfully",
        data: createdProduct,
      });
    } else {
      res.status(500).json({ message: "Failed to create element" });
    }
  });
});

Router.put("/:id", (req, res) => {
  const productId = req.params.id;
  const changeTitle = productService.editTitle(productId, req.body);
  if (changeTitle) {
    res
      .status(200)
      .json({ message: "Element updated successfully", data: changeTitle });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

Router.delete("/:id", (req, res) => {
  const productId = req.params.id;
  const deletedProduct = productService.deleteProduct(productId);
  if (deletedProduct) {
    res.status(200).json({
      message: "Element deleted successfully",
      data: deletedProduct,
    });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

Router.get("/:id", (req, res) => {
  const productId = req.params.id;
  const element = productService.getElementById(productId);
  if (element) {
    res.json({ data: element });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

module.exports = Router;
