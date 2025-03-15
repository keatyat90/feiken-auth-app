import express from "express";
import { loginCredential } from "../controllers/userController";

const router = express.Router();

router.post("/login", (req, res, next) => {
  loginCredential(req, res).catch(next);
});

export default router;
