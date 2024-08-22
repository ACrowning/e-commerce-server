import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config";
import { userService } from "../services/users";

interface JwtPayload {
  id: string;
}

const requireLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access Denied: No token provided" });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY) as JwtPayload;
    const userId = decodedToken.id;

    const { data: user, errorMessage } = await userService.findUserById(userId);

    if (errorMessage || !user) {
      res.status(401).json({ message: "Access Denied: User not found" });
      return;
    }

    res.locals.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

export { requireLogin };
