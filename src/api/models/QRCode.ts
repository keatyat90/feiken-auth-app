import mongoose, { Schema, Document } from "mongoose";

export interface IQRCode extends Document {
  product: mongoose.Types.ObjectId;
  qr_code_id: string;
  scan_count: number;
  verification_status: number;
}

const QRCodeSchema = new Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  qr_code_id: { type: String, required: true, unique: true },
  scan_count: { type: Number, default: 0 },
  verification_status: { type: Number, default: 1 },
});

export default mongoose.model<IQRCode>("QRCode", QRCodeSchema);

