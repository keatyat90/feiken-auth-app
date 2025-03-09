import mongoose from "mongoose";

export interface IScanLog extends mongoose.Document {
    qr_code_id: string;
    scanned_at: Date;
}

const ScanLogSchema = new mongoose.Schema<IScanLog>({
    qr_code_id: { type: String, required: true },
    scanned_at: { type: Date, default: Date.now },
});

export default mongoose.model<IScanLog>("ScanLog", ScanLogSchema);
