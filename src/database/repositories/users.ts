import { pool } from "../../db";
import { User, UserRequest, UserResponse } from "../users";
import { QueryResult } from "pg";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config/config";
import ShortUniqueId from "short-unique-id";
import { readSqlFile } from "..";

const uid = new ShortUniqueId({ length: 10 });

interface RepositoryResponse<T> {
  data: T | null;
  errorMessage: string | null;
  errorRaw: Error | null;
}

export async function addUser(
  userRequest: UserRequest
): Promise<RepositoryResponse<UserResponse>> {
  const newUser: User = {
    id: uid.rnd(),
    username: userRequest.username,
    email: userRequest.email,
    password: userRequest.password,
    role: userRequest.role,
  };

  const query = await readSqlFile("add_user.sql");
  const values = [
    newUser.id,
    newUser.username,
    newUser.email,
    newUser.password,
    newUser.role,
  ];

  try {
    const result: QueryResult<User> = await pool.query(query, values);
    const token = jwt.sign({ id: newUser.id }, SECRET_KEY);
    return {
      data: { user: result.rows[0], token },
      errorMessage: null,
      errorRaw: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: "Error adding user",
      errorRaw: error as Error,
    };
  }
}

export async function findUserByEmail(
  email: string
): Promise<RepositoryResponse<User>> {
  const query = await readSqlFile("find_user_by_email.sql");
  const values = [email];

  try {
    const result: QueryResult<User> = await pool.query(query, values);
    return { data: result.rows[0] || null, errorMessage: null, errorRaw: null };
  } catch (error) {
    return {
      data: null,
      errorMessage: "Error finding user by email",
      errorRaw: error as Error,
    };
  }
}

export async function findUserById(
  id: string
): Promise<RepositoryResponse<User | null>> {
  const query = await readSqlFile("find_user_by_id.sql");
  const values = [id];

  try {
    const result: QueryResult<User> = await pool.query(query, values);
    return {
      data: result.rows[0] || null,
      errorMessage: null,
      errorRaw: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: "Error finding user by ID",
      errorRaw: error as Error,
    };
  }
}
