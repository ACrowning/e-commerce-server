"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const products_1 = require("../services/products");
const requireLogin_1 = require("../middlewares/requireLogin");
const adminOnly_1 = require("../middlewares/adminOnly");
const Router = express_1.default.Router();
Router.post("/", (req, res) => {
    const { title, sortByPrice, page, limit } = req.body;
    try {
        const result = products_1.productService.getProducts({
            title,
            sortByPrice,
            page,
            limit,
        });
        res.status(200).json({ data: result });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch products" });
    }
});
Router.use((0, express_fileupload_1.default)());
Router.post("/create", requireLogin_1.requireLogin, adminOnly_1.adminOnly, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { title, amount, price, favorite } = req.body;
        const image = ((_a = req.files) === null || _a === void 0 ? void 0 : _a.image) || null;
        const albumPhotos = ((_b = req.files) === null || _b === void 0 ? void 0 : _b.albumPhotos) || [];
        const albumPhotosArray = Array.isArray(albumPhotos)
            ? albumPhotos
            : [albumPhotos];
        const createdProduct = yield products_1.productService.createProduct(title, amount, price, favorite, image, albumPhotosArray);
        if (createdProduct) {
            res.status(201).json({
                message: "Product created successfully",
                data: createdProduct,
            });
        }
        else {
            res.status(500).json({ message: "Failed to create product" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
Router.put("/:id", requireLogin_1.requireLogin, (req, res) => {
    const productId = req.params.id;
    const changeTitle = products_1.productService.editTitle(productId, req.body);
    if (changeTitle) {
        res
            .status(200)
            .json({ message: "Element updated successfully", data: changeTitle });
    }
    else {
        res.status(404).json({ message: "Not found" });
    }
});
Router.delete("/:id", requireLogin_1.requireLogin, (req, res) => {
    const productId = req.params.id;
    const deletedProduct = products_1.productService.deleteProduct(productId);
    if (deletedProduct) {
        res.status(200).json({
            message: "Element deleted successfully",
            data: deletedProduct,
        });
    }
    else {
        res.status(404).json({ message: "Not found" });
    }
});
Router.get("/:id", (req, res) => {
    const productId = req.params.id;
    const element = products_1.productService.getElementById(productId);
    if (element) {
        res.json({ data: element });
    }
    else {
        res.status(404).json({ message: "Not found" });
    }
});
exports.default = Router;
//# sourceMappingURL=products.js.map