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
const express_validator_1 = require("express-validator");
const users_1 = require("../services/users");
const validators_1 = require("../validators");
const requireLogin_1 = require("../middlewares/requireLogin");
const adminOnly_1 = require("../middlewares/adminOnly");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const Router = express_1.default.Router();
Router.post("/signup", validators_1.userSignupValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { username, password, email, role } = req.body;
    const existingUser = (0, users_1.findUserByEmail)(email);
    if (existingUser !== null) {
        res.status(400).json({ message: "User already exists" });
        return;
    }
    const userRequest = { username, password, email, role };
    const { user, token } = yield (0, users_1.addUser)(userRequest);
    res
        .status(201)
        .json({ message: "User registered successfully", user, token });
}));
Router.post("/login", validators_1.userLoginValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password } = req.body;
    const authResult = yield (0, users_1.authenticateUser)(email, password);
    if (!authResult) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
    }
    const { user, token } = authResult;
    res.status(200).json({ message: "Login successful", user, token });
}));
Router.get("/user", requireLogin_1.requireLogin, (req, res) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.SECRET_KEY);
        const user = (0, users_1.findUserById)(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
});
Router.get("/protected", requireLogin_1.requireLogin, (req, res) => {
    const user = res.locals.user;
    res.status(200).json({
        message: "You have access to this protected route",
        user,
    });
});
Router.get("/adminOnly", adminOnly_1.adminOnly, (req, res) => {
    res.status(200).json({
        message: "You have access to this admin-only route",
        user: res.locals.user,
    });
});
exports.default = Router;
//# sourceMappingURL=auth.js.map