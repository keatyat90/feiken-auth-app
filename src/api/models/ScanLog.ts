
import mongoose from "mongoose";

const ScanLogSchema = new mongoose.Schema({
    qr_code_id: { type: String, required: true },
    device_id: { type: String, required: true },  // Tracks which device scanned it
    scanned_at: { type: Date, default: Date.now },
    scan_count: { type: Number, default: 1 },    // Increment count when scanned again
});

export default mongoose.model("ScanLog", ScanLogSchema);
