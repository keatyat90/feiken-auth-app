import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
     res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token!, process.env.JWT_SECRET as string);
    (req as any).user = decoded; // Attach user info to request
    next(); // ✅ Ensure next() is called only if token is valid
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

export default authMiddleware;
