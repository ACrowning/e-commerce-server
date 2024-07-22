"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comments = void 0;
const elements_1 = require("./elements");
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const uid = new short_unique_id_1.default({ length: 10 });
const comments = [
    {
        id: uid.rnd(),
        productId: elements_1.products[0].id,
        text: "string",
        date: new Date(),
        user: { name: "User1", id: "user1" },
        comments: [
            {
                id: uid.rnd(),
                productId: elements_1.products[0].id,
                text: "string2",
                date: new Date(),
                user: { name: "User2", id: "user2" },
                comments: [
                    {
                        id: uid.rnd(),
                        productId: elements_1.products[0].id,
                        text: "string1",
                        date: new Date(),
                        user: { name: "User3", id: "user3" },
                        comments: [],
                    },
                ],
            },
        ],
    },
    {
        id: uid.rnd(),
        productId: elements_1.products[1].id,
        text: "string2",
        date: new Date(),
        user: { name: "User4", id: "user4" },
        comments: [
            {
                id: uid.rnd(),
                productId: elements_1.products[1].id,
                text: "string1",
                date: new Date(),
                user: { name: "User5", id: "user5" },
                comments: [],
            },
        ],
    },
];
exports.comments = comments;
//# sourceMappingURL=comments.js.map