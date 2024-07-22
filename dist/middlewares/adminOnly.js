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
exports.adminOnly = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const users_1 = require("../services/users");
const enums_1 = require("../enums");
const adminOnly = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Access Denied: No token provided" });
        return;
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.SECRET_KEY);
        const userId = decodedToken.id;
        const user = yield (0, users_1.findUserById)(userId);
        if (!user) {
            res.status(401).json({ message: "Access Denied: User not found" });
            return;
        }
        if (user.role !== enums_1.Role.ADMIN) {
            res.status(403).json({ message: "Access Denied: Admins only" });
            return;
        }
        res.locals.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
});
exports.adminOnly = adminOnly;
//# sourceMappingURL=adminOnly.js.map