import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config";
import { userService } from "../services/users";
import { Role } from "../enums";

const adminOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access Denied: No token provided" });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY) as { id: string };
    const userId = decodedToken.id;

    const { data: user, errorMessage } = await userService.findUserById(userId);

    if (errorMessage || !user) {
      res.status(401).json({ message: "Access Denied: User not found" });
      return;
    }

    if (user.role !== Role.ADMIN) {
      res.status(403).json({ message: "Access Denied: Admins only" });
      return;
    }

    res.locals.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

export { adminOnly };
