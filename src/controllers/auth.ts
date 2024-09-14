import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import { userService } from "../services/users";
import { userSignupValidator, userLoginValidator } from "../validators";
import { requireLogin } from "../middlewares/requireLogin";
import { UserRequest } from "../types/users";
import { adminOnly } from "../middlewares/adminOnly";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config";

const Router = express.Router();

Router.post(
  "/signup",
  userSignupValidator,
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "Validation failed",
        error: errors.array(),
        data: null,
      });
      return;
    }

    const { username, password, email, role, money } = req.body;
    const userRequest: UserRequest = { username, password, email, role, money };

    const {
      data: newUser,
      errorMessage,
      errorRaw,
    } = await userService.addUser(userRequest);

    if (errorMessage) {
      res.status(500).json({
        message: errorMessage,
        error: errorRaw,
        data: null,
      });
      return;
    }

    res.status(201).json({
      message: "User registered successfully",
      error: null,
      data: newUser,
    });
  }
);

Router.post(
  "/login",
  userLoginValidator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        error: errors.array(),
        data: null,
      });
    }

    const { email, password } = req.body;

    const { data, errorMessage, errorRaw } = await userService.authenticateUser(
      email,
      password
    );

    if (!data) {
      return res.status(400).json({
        message: errorMessage || "Invalid email or password",
        error: errorRaw,
        data: null,
      });
    }

    res.status(200).json({
      message: "Login successful",
      error: null,
      data: data,
    });
  }
);

Router.get("/user", requireLogin, async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
      error: null,
      data: null,
    });
  }

  const decoded = jwt.verify(token, SECRET_KEY) as { id: string };

  const {
    data: user,
    errorMessage,
    errorRaw,
  } = await userService.findUserById(decoded.id);

  if (errorMessage) {
    return res.status(404).json({
      message: errorMessage,
      error: errorRaw,
      data: null,
    });
  }

  res.status(200).json({
    message: "User retrieved successfully",
    error: null,
    data: user,
  });
});

Router.get("/protected", requireLogin, (req: Request, res: Response) => {
  const user = res.locals.user;
  res.status(200).json({
    message: "You have access to this protected route",
    error: null,
    data: { user },
  });
});

Router.get("/adminOnly", adminOnly, (req: Request, res: Response) => {
  res.status(200).json({
    message: "You have access to this admin-only route",
    error: null,
    data: { user: res.locals.user },
  });
});

export default Router;
