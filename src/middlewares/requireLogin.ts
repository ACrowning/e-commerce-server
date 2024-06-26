import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";

interface JwtPayload {
  id: string;
}

const requireLogin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY) as JwtPayload;
    res.locals.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

export default requireLogin;
