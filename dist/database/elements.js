"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.products = void 0;
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });
const products = Array(20)
    .fill(0)
    .map((_, index) => {
    return {
        id: uid.rnd(),
        title: `Product_${index + 1}`,
        amount: 1,
        price: 1 + index + 1,
        favorite: false,
        image: null,
        albumPhotos: [],
    };
});
exports.products = products;
//# sourceMappingURL=elements.js.map