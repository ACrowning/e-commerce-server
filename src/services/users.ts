import { User, users } from "../database/users";
import bcrypt from "bcrypt";

export const addUser = (user: User): void => {
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(user.password, salt);
  users.push(user);
};

export const findUserByEmail = (email: string): User | undefined => {
  return users.find((user) => user.email === email);
};
