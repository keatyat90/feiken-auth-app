import { Request, Response } from "express";
import Product, { IProduct } from "../models/Product";
import ScanLog from "../models/ScanLog";

// Verify Product Authenticity
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

    // Check if the device has scanned this QR code before
    let scanLog = await ScanLog.findOne({ qr_code_id, device_id });

    if (scanLog) {
      scanLog.scan_count += 1;
      scanLog.scanned_at = new Date();
    } else {
      scanLog = new ScanLog({ qr_code_id, device_id, scan_count: 1 });
    }

    await scanLog.save();
    res.json({
      message: "QR Code Verified!",
      product,
      scan_count: scanLog.scan_count,
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
