import { User, users, UserRequest, UserResponse } from "../database/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { Role } from "../enums";
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });

export const addUser = async (
  userRequest: UserRequest
): Promise<UserResponse> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userRequest.password, salt);

  const newUser: User = {
    id: uid.rnd(),
    ...userRequest,
    password: hashedPassword,
    role: Role[userRequest.role as keyof typeof Role],
  };

  users.push(newUser);

  const token = jwt.sign({ id: newUser.id }, SECRET_KEY);

  return { user: newUser, token };
};

export const findUserByEmail = (email: string): User | null => {
  if (!email) {
    return null;
  }

  const user = users.find((user) => user.email === email);
  return user || null;
};

export const findUserById = (id: string): User | null => {
  if (!id) {
    return null;
  }
  const user = users.find((user) => user.id === id);
  return user || null;
};

export const authenticateUser = async (
  email: string,
  password: string
): Promise<{ user: User; token: string } | null> => {
  const user = findUserByEmail(email);
  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  const token = jwt.sign({ id: user.id }, SECRET_KEY);

  return { user, token };
};
