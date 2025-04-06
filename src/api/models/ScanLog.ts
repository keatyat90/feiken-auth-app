import mongoose from "mongoose";

const ScanLogSchema = new mongoose.Schema({
  qr_code_id: { type: String, required: true },
  product_id: { type: String, required: true },
  device_id: { type: String, required: true },
  scan_count: { type: Number, default: 1 },
  scanned_at: { type: Date, default: Date.now }
});

export const ScanLog = mongoose.model("ScanLog", ScanLogSchema);
