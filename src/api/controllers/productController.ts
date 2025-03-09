import { Request, Response } from "express";
import Product, { IProduct } from "../models/Product";
import ScanLog, { IScanLog } from "../models/ScanLog";

// Verify Product Authenticity
export const verifyProduct = async (req: Request, res: Response) => {
  const { qr_code_id } = req.body;

  try {
    const product: IProduct | null = await Product.findOne({ qr_code_id });

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Invalid QR Code", 
        product: null 
      });
    }

    if (product.verification_status === "Fake") {
      return res.json({
        success: false,
        message: "Fake QR Code Detected!",
        product,
      });
    }

    if (product.verification_status === "Already Scanned") {
      return res.json({
        success: false,
        message: "This QR Code has already been scanned!",
        product,
      });
    }

    // Mark as Scanned if first-time scan
    product.verification_status = "Already Scanned";
    await product.save();

    // Log Scan Event
    const scanLog: IScanLog = await ScanLog.create({
      qr_code_id,
    });

    res.json({
      success: true,
      message: "QR Code Verified!",
      product,
      scanLog,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Scan History
export const scanHistory = async (req: Request, res: Response) => {
  try {
    const logs: IScanLog[] = await ScanLog.find({
      qr_code_id: req.params.qr_code_id,
    });

    if (logs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No scan history found for this QR code.",
        logs: [],
      });
    }

    res.json({
      success: true,
      message: "Scan history retrieved successfully.",
      logs,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create new Product (Admin use)
export const registerProduct = async (req: Request, res: Response) => {
  const { bearing_id, qr_code_id, sku, batch_number, manufacture_date } =
    req.body;

  try {
    const newProduct: IProduct = await Product.create({
      bearing_id,
      qr_code_id,
      sku,
      batch_number,
      manufacture_date,
    });

    res.status(201).json({
      success: true,
      message: "Product Registered Successfully!",
      product: newProduct,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get All Products (Admin use)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found.",
        products: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully.",
      products,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
