import { Role } from "../enums";

export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  role: Role;
  money: number;
}

export interface UserRequest {
  username: string;
  password: string;
  email: string;
  role: Role;
  money: number;
}

export interface UserResponse {
  user: User;
  token: string;
}
