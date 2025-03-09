import express from "express";
import {
  getProducts,
  registerProduct,
  scanHistory,
  verifyProduct,
} from "../controllers/productController";

const router = express.Router();

router.post("/verify", (req, res) => {
  verifyProduct(req, res).catch((error) => {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  });
});

router.get("/scan-history/:qr_code_id", (req, res) => {
  scanHistory(req, res).catch((error) => {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  });
});

// Admin routes
router.post("/register-product", async (req, res, next) => {
  try {
    await registerProduct(req, res);
  } catch (error) {
    next(error);
  }
});
router.get("/", async (req, res, next) => {
  try {
    await getProducts(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
