import mongoose from "mongoose";

const ScanLogSchema = new mongoose.Schema({
  qr_code_id: { type: String, required: true },
  product_id: { type: String, required: true },
  device_id: { type: String, required: true },
  scanned_at: { type: Date, default: Date.now },
  scan_count: { type: Number, default: 1 }, // ✅ Track scan count per device
});

export const ScanLog = mongoose.model("ScanLog", ScanLogSchema);
