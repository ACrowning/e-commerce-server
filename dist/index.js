"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const path_1 = __importDefault(require("path"));
const products_1 = __importDefault(require("./controllers/products"));
const cart_1 = __importDefault(require("./controllers/cart"));
const comments_1 = __importDefault(require("./controllers/comments"));
const auth_1 = __importDefault(require("./controllers/auth"));
const PORT = process.env.PORT || 4000;
const readyMessage = () => console.log("Server on http://localhost:" + PORT);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin: "*" }));
app.use("/products", products_1.default);
app.use("/cart", cart_1.default);
app.use("/comments", comments_1.default);
app.use("/static", express_1.default.static(path_1.default.join("uploads")));
app.use("/auth", auth_1.default);
app.get("/", (req, res) => {
    res.send({ data: "The server works successfully!!!!" });
});
app.listen(PORT, readyMessage);
app.listen(80, function () {
    console.log("CORS-enabled web server listening on port 80");
});
//# sourceMappingURL=index.js.map