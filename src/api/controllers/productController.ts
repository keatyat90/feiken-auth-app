import { Request, Response } from "express";
import Product, { IProduct } from "../models/Product";
import QRCode, { IQRCode } from "../models/QRCode";
import { ScanLog } from "../models/ScanLog";
import mongoose from "mongoose";

// Create a new Product
export const createProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const product: IProduct = new Product(req.body);
  await product.save();
  return res.status(201).json(product);
};

// Get all Products
export const getProducts = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  const products = await Product.find();
  return res.json(products);
};

// Get Product by ID
export const getProductById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json(product);
};

// Update Product
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json(product);
};

// Delete Product
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  await QRCode.deleteMany({ product: req.params.id });
  return res.json({
    message: "Product and associated QR codes deleted successfully",
  });
};

// Create a QRCode for Product
export const createQRCodeForProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const qrCode: IQRCode = new QRCode({
    ...req.body,
    product: req.params.productId,
  });
  await qrCode.save();
  return res.status(201).json(qrCode);
};

// Get QR codes for a specific Product
export const getQRCodesByProductId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { productId } = req.params;
  const limit = parseInt(req.query.limit as string) || 20;
  const page = parseInt(req.query.page as string) || 1;

  const qrCodes = await QRCode.find({ product: productId })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await QRCode.countDocuments({ product: productId });

  return res.json({ qrCodes, total });
};

// ✅ Update QR Codes for existing Product
export const updateQRCodesForProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id: productId } = req.params;
  const { qr_codes } = req.body;

  if (!Array.isArray(qr_codes)) {
    return res.status(400).json({ message: "Invalid QR codes data." });
  }

  try {
    // Remove existing QR codes associated with the product
    await QRCode.deleteMany({ product: productId });

    // Insert new QR codes
    const qrCodesToInsert = qr_codes.map((qr: { qr_code_id: string }) => ({
      product: productId,
      qr_code_id: qr.qr_code_id,
      scan_count: 0,
    }));

    await QRCode.insertMany(qrCodesToInsert);

    return res.json(qrCodesToInsert);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update QR codes." });
  }
};

export const searchProducts = async (req: Request, res: Response): Promise<Response> => {
  const {
    product_id,
    batch_number,
    country_origin,
    qr_code_id,
    scan_count_min,
    scan_count_max,
    page = 1,
    limit = 10,
  } = req.query;

  const productFilter: any = {};
  const qrFilter: any = {};

  if (product_id) productFilter.product_id = { $regex: product_id, $options: "i" };
  if (batch_number) productFilter.batch_number = { $regex: batch_number, $options: "i" };
  if (country_origin) productFilter.country_origin = country_origin;

  if (qr_code_id) qrFilter.qr_code_id = { $regex: qr_code_id, $options: "i" };
  if (scan_count_min || scan_count_max) {
    qrFilter.scan_count = {};
    if (scan_count_min) qrFilter.scan_count.$gte = Number(scan_count_min);
    if (scan_count_max) qrFilter.scan_count.$lte = Number(scan_count_max);
  }

  const skip = (Number(page) - 1) * Number(limit);

  try {
    let matchingProductIds: mongoose.Types.ObjectId[] = [];

    if (Object.keys(qrFilter).length > 0) {
      // Find matching QR codes first if QR code filters exist
      const matchingQRCodes = await QRCode.find(qrFilter).select("product").lean();
      matchingProductIds = matchingQRCodes.map((qr) => qr.product);
      // Ensure product filter includes these matching product IDs
      productFilter._id = { $in: matchingProductIds };
    }

    // Count total after applying QR code filters
    const total = await Product.countDocuments(productFilter);

    // Apply pagination directly to filtered products
    const products = await Product.find(productFilter).skip(skip).limit(Number(limit)).lean();

    // Fetch related QR codes for each paginated product
    const productsWithQRCodes = await Promise.all(
      products.map(async (product) => {
        const qrCodes = await QRCode.find({
          product: product._id,
          ...qrFilter,
        }).lean();

        return { ...product, qr_codes: qrCodes };
      })
    );

    return res.json({ products: productsWithQRCodes, total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to search products" });
  }
};

// // ✅ Verify a Product (Update QR Code Status)
export const verifyProduct = async (req: Request, res: Response) => {
  console.log("🔑 Verifying QR Code:", req.params.qr_code_id);

  try {
    const { qr_code_id } = req.params;
    const { device_id } = req.body;

    // ✅ Find QR code in QRCode collection
    const qrCode = await QRCode.findOne({ qr_code_id });
    if (!qrCode) {
      return res.status(404).json({ success: false, message: "QR Code not found" });
    }

    // ✅ Get related product
    const product = await Product.findById(qrCode.product);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found for QR code" });
    }

    // ✅ Check if this device has scanned this QR code before
    let scanLog = await ScanLog.findOne({ qr_code_id, device_id });
    if (scanLog) {
      scanLog.scan_count += 1;
    } else {
      scanLog = new ScanLog({
        qr_code_id,
        device_id,
        product_id: product.product_id,
        scanned_at: new Date(),
        scan_count: 1,
      });
    }
    await scanLog.save();

    // ✅ Update QRCode scan count
    qrCode.scan_count = scanLog.scan_count;
    await qrCode.save();

    return res.status(200).json({
      success: true,
      message: "Product verified successfully",
      product,
      scan_log: scanLog,
    });
  } catch (error: any) {
    console.error("❌ Error in verifyProduct:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Record scan for a QRCode
export const recordQRCodeScan = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { device_id } = req.body;
  const qrCode = await QRCode.findOne({ qr_code_id: req.params.qrCodeId });
  if (!qrCode) return res.status(404).json({ message: "QR Code not found" });

  qrCode.scan_count += 1;
  await qrCode.save();

  const scanLog = new ScanLog({
    qr_code_id: qrCode.qr_code_id,
    product_id: qrCode.product,
    device_id,
    scanned_at: new Date(),
  });

  await scanLog.save();
  return res.json(scanLog);
};
