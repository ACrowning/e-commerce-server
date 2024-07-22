"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const users_1 = require("../services/users");
const requireLogin = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Access Denied: No token provided" });
        return;
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.SECRET_KEY);
        const userId = decodedToken.id;
        const user = (0, users_1.findUserById)(userId);
        if (!user) {
            res.status(401).json({ message: "Access Denied: User not found" });
            return;
        }
        res.locals.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};
exports.requireLogin = requireLogin;
//# sourceMappingURL=requireLogin.js.map