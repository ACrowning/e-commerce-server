import { User, users, UserRequest, UserResponse } from "../database/users";
import {
  addUser as dbAddUser,
  findUserByEmail as dbFindUserByEmail,
} from "../database/repositories/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 10 });

const userService = {
  addUser: async (
    userRequest: UserRequest
  ): Promise<{
    data: UserResponse | null;
    errorMessage: string | null;
    errorRaw: Error | null;
  }> => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userRequest.password, salt);

      const newUser: User = {
        id: uid.rnd(),
        username: userRequest.username,
        password: hashedPassword,
        email: userRequest.email,
        role: userRequest.role,
      };

      const response = await dbAddUser(newUser);

      if (response.data) {
        const token = jwt.sign({ id: newUser.id }, SECRET_KEY, {
          expiresIn: "1h",
        });
        return {
          data: { user: response.data.user, token },
          errorMessage: null,
          errorRaw: null,
        };
      } else {
        return {
          data: null,
          errorMessage: response.errorMessage,
          errorRaw: response.errorRaw,
        };
      }
    } catch (error) {
      return {
        data: null,
        errorMessage: "Error adding user",
        errorRaw: error as Error,
      };
    }
  },

  findUserByEmail: async (email: string) => {
    try {
      const response = await dbFindUserByEmail(email);

      if (response.data) {
        return {
          data: response.data,
          errorMessage: null,
          errorRaw: null,
        };
      } else {
        return {
          data: null,
          errorMessage: "User not found",
          errorRaw: null,
        };
      }
    } catch (error) {
      return {
        data: null,
        errorMessage: "Error finding user by email",
        errorRaw: error as Error,
      };
    }
  },
};

export const addUser = async (
  userRequest: UserRequest
): Promise<UserResponse> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userRequest.password, salt);

  const newUser: User = {
    id: uid.rnd(),
    ...userRequest,
    password: hashedPassword,
    role: userRequest.role,
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

  const token = jwt.sign({ id: user.id }, SECRET_KEY || "");

  return { user, token };
};

export { userService };
