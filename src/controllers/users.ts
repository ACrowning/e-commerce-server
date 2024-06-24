import express from "express";
import { signup, login } from "./auth";
import { userSignupValidator, userLoginValidator } from "../validators";

const Router = express.Router();

Router.post("/signup", userSignupValidator, signup);
Router.post("/login", userLoginValidator, login);

export default Router;
