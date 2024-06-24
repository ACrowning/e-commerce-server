import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { addUser, findUserByEmail } from "../services/users";
import bcrypt from "bcrypt";

export const signup = async (req: Request, res: Response): Promise<void> => {
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

  await addUser({ username, password, email, role });
  res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  const user = findUserByEmail(email);
  if (!user) {
    res.status(400).json({ message: "Invalid email or password" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(400).json({ message: "Invalid email or password" });
    return;
  }

  res.status(200).json({ message: "Login successful", success: true });
};
