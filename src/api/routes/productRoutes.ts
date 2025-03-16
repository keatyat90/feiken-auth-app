import express from "express";
import {
  createProduct,
  generateQRCodes,
  verifyProduct,
  deleteProduct,
  updateProduct,
  getScanHistory,
  getProductStats,
  getProducts,
  deleteQR,
  searchProducts,
} from "../controllers/productController";

const router = express.Router();

// ✅ CRUD Routes
router.get("/", getProducts as any);
router.get("/stats", getProductStats as any);
router.post("/create-product", createProduct as any);
router.post("/:product_id/generate-qr", generateQRCodes as any);
router.put("/verify/:qr_code_id", verifyProduct as any);
router.delete("/:product_id/:batch_number", deleteProduct as any);
router.delete("/:product_id/:batch_number/qr/:qr_code_id", deleteQR as any);
router.put("/:product_id/:batch_number", updateProduct as any);
router.get("/:product_id/scan-history", getScanHistory as any);
router.get("/search", searchProducts as any);

export default router;
