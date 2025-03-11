import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("❌ No token found in headers! Sending 401.");
      res.status(401).json({ error: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string);
    (req as any).user = decoded; // Attach user info to request

    next(); // ✅ Call next() only when token is valid
  } catch (err) {
    console.log("❌ Invalid or expired token. Redirecting to login.");
    res.status(401).json({ error: "Invalid token. Please login again." });
  }
};

export default authMiddleware;
