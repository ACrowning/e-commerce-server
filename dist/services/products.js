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
exports.productService = void 0;
const elements_1 = require("../database/elements");
const promises_1 = __importDefault(require("fs/promises"));
const comments_1 = require("../database/comments");
const uploadService_1 = require("../services/uploadService");
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const uid = new short_unique_id_1.default({ length: 10 });
const productService = {
    getProducts: ({ title, sortByPrice, page = 1, limit = 10, }) => {
        let filteredProducts = elements_1.products;
        if (title) {
            filteredProducts = filteredProducts.filter((product) => product.title.toLowerCase().includes(title.toLowerCase()));
        }
        if (sortByPrice) {
            filteredProducts.sort((a, b) => {
                if (sortByPrice === "asc") {
                    return a.price - b.price;
                }
                else if (sortByPrice === "desc") {
                    return b.price - a.price;
                }
                else {
                    return 0;
                }
            });
        }
        if (limit === "*") {
            return {
                currentPage: filteredProducts,
                total: 1,
            };
        }
        else {
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const currentPage = filteredProducts.slice(startIndex, endIndex);
            return {
                currentPage,
                total: Math.ceil(filteredProducts.length / limit),
            };
        }
    },
    createProduct: (title, amount, price, favorite, image, albumPhotos) => __awaiter(void 0, void 0, void 0, function* () {
        const newProduct = {
            id: uid.rnd(),
            title,
            amount,
            price: price || Math.floor(Math.random() * 10),
            favorite,
        };
        if (image) {
            newProduct.image = yield (0, uploadService_1.saveImage)(image);
        }
        if (albumPhotos && albumPhotos.length > 0) {
            newProduct.albumPhotos = yield (0, uploadService_1.saveAlbum)(albumPhotos);
        }
        elements_1.products.push(newProduct);
        return newProduct;
    }),
    editTitle: (productId, updatedData) => {
        const index = elements_1.products.findIndex((product) => product.id === productId);
        if (index !== -1) {
            elements_1.products[index] = Object.assign(Object.assign({}, elements_1.products[index]), updatedData);
            return elements_1.products[index];
        }
    },
    deleteProduct: (productId) => __awaiter(void 0, void 0, void 0, function* () {
        const index = elements_1.products.findIndex((product) => product.id === productId);
        if (index !== -1) {
            const deletedProduct = elements_1.products.splice(index, 1)[0];
            try {
                const imagePath = (0, uploadService_1.getImgPath)(deletedProduct.image);
                yield promises_1.default.unlink(imagePath);
                if (deletedProduct.albumPhotos &&
                    deletedProduct.albumPhotos.length > 0) {
                    const deletePromises = deletedProduct.albumPhotos.map((photo) => __awaiter(void 0, void 0, void 0, function* () {
                        const photoPath = (0, uploadService_1.getImgPath)(photo);
                        return promises_1.default.unlink(photoPath);
                    }));
                    yield Promise.all(deletePromises);
                }
            }
            catch (error) {
                console.error("Failed to delete product images:", error);
            }
            return deletedProduct.id;
        }
    }),
    getElementById: (productId) => {
        const product = elements_1.products.find((product) => product.id === productId);
        if (product) {
            const productComments = comments_1.comments.filter((comment) => comment.productId === productId);
            return Object.assign(Object.assign({}, product), { comments: productComments });
        }
        else {
            return null;
        }
    },
};
exports.productService = productService;
//# sourceMappingURL=products.js.map