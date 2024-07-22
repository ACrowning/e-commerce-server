"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginValidator = exports.userSignupValidator = void 0;
const express_validator_1 = require("express-validator");
exports.userSignupValidator = [
    (0, express_validator_1.body)("username").notEmpty().withMessage("Username is required"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 3, max: 10 })
        .withMessage("Password must be between 3 and 10 characters"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Email must be valid"),
    (0, express_validator_1.body)("role").notEmpty().withMessage("Role is required"),
];
exports.userLoginValidator = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Email must be valid"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
//# sourceMappingURL=validators.js.map