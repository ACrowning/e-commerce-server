import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  addUser,
  authenticateUser,
  findUserByEmail,
  findUserById,
} from "../services/users";
import { userSignupValidator, userLoginValidator } from "../validators";
import { requireLogin } from "../middlewares/requireLogin";
import { UserRequest } from "../database/users";
import { adminOnly } from "../middlewares/adminOnly";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";

const Router = express.Router();

Router.post(
  "/signup",
  userSignupValidator,
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, password, email, role } = req.body;

    const existingUser = findUserByEmail(email);
    if (existingUser !== null) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const userRequest: UserRequest = { username, password, email, role };
    const { user, token } = await addUser(userRequest);
    res
      .status(201)
      .json({ message: "User registered successfully", user, token });
  }
);

Router.post(
  "/login",
  userLoginValidator,
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    const authResult = await authenticateUser(email, password);
    if (!authResult) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const { user, token } = authResult;
    res.status(200).json({ message: "Login successful", user, token });
  }
);

Router.get("/user", requireLogin, (req: Request, res: Response) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    const user = findUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

Router.get("/protected", requireLogin, (req: Request, res: Response) => {
  const user = res.locals.user;
  res.status(200).json({
    message: "You have access to this protected route",
    user,
  });
});

Router.get("/adminOnly", adminOnly, (req: Request, res: Response) => {
  res.status(200).json({
    message: "You have access to this admin-only route",
    user: res.locals.user,
  });
});

export default Router;
