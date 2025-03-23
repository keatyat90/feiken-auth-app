// import { NextFunction, Request, Response } from "express";
// import Product from "../models/Product";
// import { v4 as uuidv4 } from "uuid";
// import { ScanLog } from "../models/ScanLog";

// // Get All Products (Admin use)
// export const getProducts = async (req: Request, res: Response) => {
//   try {
//     const products = await Product.find();

//     if (products.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No products found.",
//         products: [],
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Products retrieved successfully.",
//       products,
//     });
//   } catch (error) {
//     console.error("Fetch error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error.",
//     });
//   }
// };

// // ✅ Create a New Product
// export const createProduct = async (req: Request, res: Response) => {
//   try {
//     const { product_id, batch_number, qr_codes } = req.body;

//     if (!qr_codes || qr_codes.length === 0) {
//       return res.status(400).json({ success: false, message: "QR codes are required." });
//     }

//     // ✅ Create a single product with multiple QR codes
//     const newProduct = new Product({
//       product_id,
//       batch_number,
//       qr_codes: qr_codes.map((qr_code: { qr_code_id: string }) => ({
//         qr_code_id: qr_code.qr_code_id,
//         verification_status: "A",
//       })),
//     });

//     await newProduct.save();

//     return res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       product: newProduct,
//     });
//   } catch (error: any) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };


// // ✅ Generate QR Codes for a Product
// export const generateQRCodes = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const { product_id } = req.params;
//     const { batch_number, count } = req.body;

//     if (!count || count <= 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid QR code count" });
//     }

//     const product = await Product.findOne({ product_id, batch_number });

//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }

//     const newQRCodes = Array.from({ length: count }, () => ({
//       qr_code_id: uuidv4(),
//       verification_status: "Pending",
//     }));

//     product.qr_codes.push(...newQRCodes);
//     await product.save();

//     return res.status(200).json({
//       success: true,
//       message: "QR Codes generated",
//       qr_codes: newQRCodes,
//     });
//   } catch (error: any) {
//     return res.status(500).json({ success: false, message: error.message });
//   } 
// };

// // ✅ Verify a Product (Update QR Code Status)
// export const verifyProduct = async (req: Request, res: Response) => {
//   console.log("🔑 Verifying QR Code:", req.params.qr_code_id);

//   try {
//     const { qr_code_id } = req.params;
//     const { device_id } = req.body;

//     // ✅ Ensure the QR Code exists in a product
//     const product = await Product.findOne(
//       { "qr_codes.qr_code_id": qr_code_id },
//       { product_id: 1, batch_number: 1, "qr_codes.$": 1 }
//     );

//     if (!product) {
//       return res.status(404).json({ success: false, message: "QR Code not found" });
//     }

//     // ✅ Check if this device has scanned this QR code before
//     let scanLog = await ScanLog.findOne({ qr_code_id, device_id });

//     if (scanLog) {
//       scanLog.scan_count += 1; // Increment scan count
//     } else {
//       scanLog = new ScanLog({ qr_code_id, device_id, product_id: product.product_id, scan_count: 1 });
//     }

//     await scanLog.save(); // ✅ Save scan log

//     // ✅ Update product status if scanned more than 5 times
//     const updatedStatus = scanLog.scan_count > 5 ? "Scanned" : product.qr_codes[0].verification_status;

//     await Product.updateOne(
//       { "qr_codes.qr_code_id": qr_code_id },
//       { $set: { "qr_codes.$.verification_status": updatedStatus } }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Product verified successfully",
//       product,
//       scan_log: scanLog,
//     });
//   } catch (error: any) {
//     console.error("❌ Error in verifyProduct:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };




// // ✅ Delete a Product
// export const deleteProduct = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const { product_id, batch_number } = req.params;

//     const deletedProduct = await Product.findOneAndDelete({ product_id, batch_number });

//     if (!deletedProduct) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }

//     return res
//       .status(200)
//       .json({ success: true, message: "Product deleted successfully" });
//   } catch (error: any) {
//     return res.status(500).json({ success: false, message: error.message });
//   } 
// };

// // ✅ Delete a specific QR Code from a Product
// export const deleteQR = async (req: Request, res: Response) => {
//   try {
//     const { product_id, batch_number, qr_code_id } = req.params;

//     const product = await Product.findOne({ product_id, batch_number });

//     if (!product) {
//       return res.status(404).json({ success: false, message: "Product not found" });
//     }

//     // ✅ Remove only the selected QR code
//     product.qr_codes = product.qr_codes.filter(qr => qr.qr_code_id !== qr_code_id);

//     // ✅ If no QR codes left, delete the entire product
//     if (product.qr_codes.length === 0) {
//       await Product.deleteOne({ product_id });
//       return res.status(200).json({ success: true, message: "Product and all QR Codes deleted" });
//     }

//     await product.save();
//     return res.status(200).json({ success: true, message: "QR Code deleted successfully" });
//   } catch (error: any) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ Update a Product
// export const updateProduct = async (req: Request, res: Response) => {
//   try {
//     const { product_id } = req.params;
//     const { batch_number, qr_codes } = req.body;

//     if (!qr_codes || !Array.isArray(qr_codes)) {
//       return res.status(400).json({ success: false, message: "Invalid QR codes format." });
//     }

//     const product = await Product.findOne({ product_id });

//     if (!product) {
//       return res.status(404).json({ success: false, message: "Product not found" });
//     }

//     // ✅ Fully replace `qr_codes` to prevent duplicate key errors
//     await Product.updateOne(
//       { product_id },
//       {
//         $set: {
//           batch_number,
//           qr_codes: qr_codes.map(qr => ({
//             qr_code_id: qr.qr_code_id,
//             verification_status: qr.verification_status || "Pending",
//           })),
//         },
//       }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//     });
//   } catch (error: any) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };


// // ✅ Get Scan History
// export const getScanHistory = async (req: Request, res: Response) => {
//   try {
//     const { device_id } = req.params;

//     const logs = await ScanLog.find({ device_id }).sort({ scanned_at: -1 });

//     return res.status(200).json({ success: true, logs });
//   } catch (error: any) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ Get Product Stats
// export const getProductStats = async (_req: Request, res: Response) => {
//   try {
//     const totalProducts = await Product.countDocuments();

//     const qrCodeAggregation = await Product.aggregate([
//       { $unwind: { path: "$qr_codes", preserveNullAndEmptyArrays: true } },
//       { $group: { _id: null, totalQRCodes: { $sum: 1 } } },
//     ]);

//     const totalQRCodes = qrCodeAggregation.length > 0 ? qrCodeAggregation[0].totalQRCodes : 0;

//     return res.status(200).json({
//       success: true,
//       stats: {
//         totalProducts,
//         totalQRCodes,
//       },
//     });
//   } catch (error: any) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const searchProducts = async (req: Request, res: Response) => {
//   try {
//     const { product_id, batch_number, qr_code_id, verification_status, lastId, limit = 10, latest = false } = req.query;

//     let filter: any = {};

//     // ✅ Apply individual filters based on request parameters
//     if (product_id) {
//       filter.product_id = { $regex: new RegExp(product_id as string, "i") };
//     }
//     if (batch_number) {
//       filter.batch_number = { $regex: new RegExp(batch_number as string, "i") };
//     }
//     if (qr_code_id) {
//       filter["qr_codes.qr_code_id"] = { $regex: new RegExp(qr_code_id as string, "i") };
//     }
//     if (verification_status) {
//       filter["qr_codes.verification_status"] = verification_status;
//     }

//     // ✅ If no filters are applied, fetch the latest created/updated products
//     if (latest && !product_id && !batch_number && !qr_code_id && !verification_status) {
//       filter = {};
//     }

//     // ✅ If `lastId` is provided, use `_id` for efficient pagination
//     if (lastId) {
//       filter._id = { $lt: lastId };
//     }

//     const products = await Product.find(filter)
//       .sort(latest ? { updatedAt: -1 } : { _id: -1 }) // ✅ Sort by latest updated/created or `_id`
//       .limit(Number(limit));

//     const totalResults = await Product.countDocuments(filter);

//     return res.status(200).json({
//       success: true,
//       totalResults,
//       totalPages: Math.ceil(totalResults / Number(limit)),
//       currentPage: Number(lastId) ? Math.ceil(totalResults / Number(limit)) : 1,
//       lastId: products.length ? products[products.length - 1]._id : null,
//       products,
//     });
//   } catch (error: any) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

