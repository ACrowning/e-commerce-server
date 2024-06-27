import { Role } from "../enums";

export interface User {
  id: any;
  username: string;
  password: string;
  email: string;
  role: Role;
}

export interface UserRequest {
  username: string;
  password: string;
  email: string;
  role: Role;
}

export interface UserResponse {
  user: User;
  token: string;
}

export const users: User[] = [];
