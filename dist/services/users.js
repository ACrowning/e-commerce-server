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
exports.authenticateUser = exports.findUserById = exports.findUserByEmail = exports.addUser = void 0;
const users_1 = require("../database/users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const uid = new short_unique_id_1.default({ length: 10 });
const addUser = (userRequest) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(userRequest.password, salt);
    const newUser = Object.assign(Object.assign({ id: uid.rnd() }, userRequest), { password: hashedPassword, role: userRequest.role });
    users_1.users.push(newUser);
    const token = jsonwebtoken_1.default.sign({ id: newUser.id }, config_1.SECRET_KEY);
    return { user: newUser, token };
});
exports.addUser = addUser;
const findUserByEmail = (email) => {
    if (!email) {
        return null;
    }
    const user = users_1.users.find((user) => user.email === email);
    return user || null;
};
exports.findUserByEmail = findUserByEmail;
const findUserById = (id) => {
    if (!id) {
        return null;
    }
    const user = users_1.users.find((user) => user.id === id);
    return user || null;
};
exports.findUserById = findUserById;
const authenticateUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, exports.findUserByEmail)(email);
    if (!user) {
        return null;
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return null;
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.SECRET_KEY);
    return { user, token };
});
exports.authenticateUser = authenticateUser;
//# sourceMappingURL=users.js.map