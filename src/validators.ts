import { body } from "express-validator";

export const userSignupValidator = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .isLength({ min: 3, max: 10 })
    .withMessage("Password must be between 3 and 10 characters"),
  body("email").isEmail().withMessage("Email must be valid"),
  body("role").notEmpty().withMessage("Role is required"),
];

export const userLoginValidator = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password").notEmpty().withMessage("Password is required"),
];
