import { User, UserRequest, UserResponse } from "../database/users";
import {
  addUser as dbAddUser,
  findUserByEmail as dbFindUserByEmail,
  findUserById as dbFindUserById,
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
      }
      return {
        data: null,
        errorMessage: response.errorMessage,
        errorRaw: response.errorRaw,
      };
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
      }
      return {
        data: null,
        errorMessage: "User not found",
        errorRaw: null,
      };
    } catch (error) {
      return {
        data: null,
        errorMessage: "Error finding user by email",
        errorRaw: error as Error,
      };
    }
  },

  authenticateUser: async (
    email: string,
    password: string
  ): Promise<{
    data: UserResponse | null;
    errorMessage: string | null;
    errorRaw: Error | null;
  }> => {
    const { data: user } = await userService.findUserByEmail(email);

    if (!user) {
      return { data: null, errorMessage: "User not found", errorRaw: null };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { data: null, errorMessage: "Invalid password", errorRaw: null };
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY || "");

    return { data: { user, token }, errorMessage: null, errorRaw: null };
  },

  findUserById: async (
    id: string
  ): Promise<{
    data: User | null;
    errorMessage: string | null;
    errorRaw: Error | null;
  }> => {
    try {
      const response = await dbFindUserById(id);

      if (response.data) {
        return {
          data: response.data,
          errorMessage: null,
          errorRaw: null,
        };
      }
      return {
        data: null,
        errorMessage: "User not found",
        errorRaw: null,
      };
    } catch (error) {
      return {
        data: null,
        errorMessage: "Error finding user by ID",
        errorRaw: error as Error,
      };
    }
  },
};

export { userService };
