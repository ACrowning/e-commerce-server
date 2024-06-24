import express from "express";
import { body } from "express-validator";
import { signup, login } from "../services/auth";

const Router = express.Router();

Router.post(
  "/signup",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password")
      .isLength({ min: 3, max: 10 })
      .withMessage("Password must be between 3 and 10 characters"),
    body("email").isEmail().withMessage("Email must be valid"),
    body("role").notEmpty().withMessage("Role is required"),
  ],
  signup
);

Router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

export default Router;
