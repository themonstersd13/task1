import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

interface TokenPayload extends JwtPayload {
  userId: string;
  role: "USER" | "ADMIN";
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authorization token missing" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch (_error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
