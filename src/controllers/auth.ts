import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import { userService } from "../services/users";
import { userSignupValidator, userLoginValidator } from "../validators";
import { requireLogin } from "../middlewares/requireLogin";
import { UserRequest } from "../database/users";
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
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, password, email, role } = req.body;

    const { data: existingUser } = await userService.findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const userRequest: UserRequest = { username, password, email, role };
    const { data: newUser, errorMessage } = await userService.addUser(
      userRequest
    );

    if (errorMessage) {
      res
        .status(500)
        .json({ message: "Failed to register user", error: errorMessage });
      return;
    }

    if (newUser) {
      const { user, token } = newUser;
      res
        .status(201)
        .json({ message: "User registered successfully", user, token });
      return;
    }

    res.status(500).json({ message: "Unknown error occurred" });
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

    const { data, errorMessage } = await userService.authenticateUser(
      email,
      password
    );

    if (!data) {
      res
        .status(400)
        .json({ message: errorMessage || "Invalid email or password" });
      return;
    }

    const { user, token } = data;
    res.status(200).json({ message: "Login successful", user, token });
  }
);

Router.get("/user", requireLogin, async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    const { data: user, errorMessage } = await userService.findUserById(
      decoded.id
    );

    if (errorMessage) {
      res.status(404).json({ message: errorMessage });
      return;
    }

    res.status(200).json({ user });
  } catch {
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
