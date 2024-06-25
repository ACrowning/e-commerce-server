import { User, users } from "../database/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });

export const addUser = async (
  user: User
): Promise<{ user: User; token: string }> => {
  const { id, ...rest } = user;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(rest.password, salt);

  const newUser: User = {
    id: uid.rnd(),
    ...rest,
    password: hashedPassword,
  };

  users.push(newUser);

  const token = jwt.sign({ id: newUser.id }, SECRET_KEY);

  return { user: newUser, token };
};

export const findUserByEmail = (email: string): User | undefined => {
  return users.find((user) => user.email === email);
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
