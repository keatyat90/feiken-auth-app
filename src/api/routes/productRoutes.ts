import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  createQRCodeForProduct,
  getQRCodesByProductId,
  updateQRCodesForProduct,
  searchProducts,
  verifyProduct,
  getScanHistoryByDevice,
  getProductStats,
} from "../controllers/productController";

const router = express.Router();

// ✅ Product Routes
router.get("/", getProducts as any);
router.get("/stats", getProductStats as any);
router.post("/create", createProduct as any);
router.put("/:id", updateProduct as any);
router.delete("/:id", deleteProduct as any);

// ✅ QRCode Routes
router.post("/:productId/generate-qr", createQRCodeForProduct as any);
router.get("/:productId/qr-codes", getQRCodesByProductId as any);
router.put("/:id/update-qr-codes", updateQRCodesForProduct as any);
router.get("/search", searchProducts as any);
router.put("/verify/:qr_code_id", verifyProduct as any);

// ✅ ScanLog Routes
router.get("/scan-history/:device_id", getScanHistoryByDevice as any);


export default router;
