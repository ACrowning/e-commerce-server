import { User, users } from "../database/users";
import bcrypt from "bcrypt";

export const addUser = async (user: User): Promise<void> => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  users.push(user);
};

export const findUserByEmail = (email: string): User | undefined => {
  return users.find((user) => user.email === email);
};
