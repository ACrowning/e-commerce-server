import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { addUser, findUserByEmail } from "./users";
import bcrypt from "bcrypt";

export const signup = (req: Request, res: Response): any => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, email, role } = req.body;

  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  addUser({ username, password, email, role });
  res.status(201).json({ message: "User registered successfully" });
};

export const login = (req: Request, res: Response): any => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  res.status(200).json({ message: "Login successful", success: true });
};
