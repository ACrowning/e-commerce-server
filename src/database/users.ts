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
  role: string;
}

export interface UserResponse {
  user: User;
  token: string;
}

export const users: User[] = [
  // {
  //   username: "john_doe",
  //   password: "password12",
  //   email: "john.doe@example.com",
  //   role: "admin",
  // },
  // {
  //   username: "jane_smith",
  //   password: "mypassword",
  //   email: "jane.smith@example.com",
  //   role: "user",
  // },
  // {
  //   username: "alice_jones",
  //   password: "alice789",
  //   email: "alice.jones@example.com",
  //   role: "moderator",
  // },
];
