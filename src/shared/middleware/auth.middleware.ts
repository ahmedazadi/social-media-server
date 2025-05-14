import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    if (!decoded) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    (req as any).user = decoded;
    next();
  } catch (e: any) {
    res.status(401).json({ message: "Token expired" });
    console.error("token error", e.message);
  }
}
