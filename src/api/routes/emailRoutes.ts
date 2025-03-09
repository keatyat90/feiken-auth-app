import express from "express";
import { sendEmail } from "../controllers/emailController"; // Ensure correct path

const router = express.Router();

router.post("/", (req, res, next) => {
    sendEmail(req, res).catch(next);
  });

export default router;
