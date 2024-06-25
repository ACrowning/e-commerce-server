import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { addUser, authenticateUser, findUserByEmail } from "../services/users";
import { userSignupValidator, userLoginValidator } from "../validators";

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
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const { user, token } = await addUser({
      id: "",
      username,
      password,
      email,
      role,
    });
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

export default Router;
