import express from "express";
import {
  createProduct,
  getProducts,
  verifyProduct,
} from "../controllers/productController";

const router = express.Router();

router.get("/verify/:productId", (req, res) => {
  verifyProduct(req, res).catch((error) => {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  });
});

// Admin routes
router.post("/", async (req, res, next) => {
  try {
    await createProduct(req, res);
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
