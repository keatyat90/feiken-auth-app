import { Request, Response } from "express";
import Product, { IProduct } from "../models/Product";
import ScanLog from "../models/ScanLog";

// Verify Product Authenticity
// Verify Product Authenticity and Log Scan
export const verifyProduct = async (req: Request, res: Response) => {
    const { qr_code_id, device_id } = req.body;
  
    try {
      const product: IProduct | null = await Product.findOne({ qr_code_id });
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Invalid QR Code",
          product: null,
        });
      }
  
      if (product.verification_status === "Fake") {
        return res.json({
          success: false,
          message: "Fake QR Code Detected!",
          product,
        });
      }
  
      // Check the previous scan count for this QR Code and Device ID
      const lastScan = await ScanLog.findOne({ qr_code_id, device_id }).sort({ scanned_at: -1 });
  
      let newScanCount = lastScan ? lastScan.scan_count + 1 : 1;
  
      // Create a new scan log entry
      const scanLog = await ScanLog.create({
        qr_code_id,
        device_id,
        scanned_at: new Date(),
        scan_count: newScanCount, // Increment count
      });
  
      res.json({
        success: true,
        message: "QR Code Verified!",
        product,
        scan_log: scanLog, // Return the latest scan log
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

// Get Scan History
export const scanHistory = async (req: Request, res: Response) => {
  try {
    const { device_id } = req.params;
    const logs = await ScanLog.find({ device_id });

    if (!logs.length) {
      return res
        .status(404)
        .json({ message: "No scan history found for this device." });
    }

    res.json({ logs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
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
