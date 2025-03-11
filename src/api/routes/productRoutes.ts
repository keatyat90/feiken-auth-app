import express from "express";
import {
  deleteProduct,
  getProducts,
  getProductsStats,
  registerProduct,
  scanHistory,
  updateProduct,
  verifyProduct,
} from "../controllers/productController";

const router = express.Router();

router.post("/verify", (req, res) => {
  verifyProduct(req, res).catch((error) => {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  });
});

router.get("/scan-history/:device_id", (req, res) => {
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
router.delete("/:qr_code_id", async (req, res, next) => {
  try {
    await deleteProduct(req, res);
  } catch (error) {
    next(error);
  }
});
router.put("/:qr_code_id", async (req, res, next) => {
  try {
    await updateProduct(req, res);
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
router.get("/stats", async (req, res, next) => {
  try {
    await getProductsStats(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
