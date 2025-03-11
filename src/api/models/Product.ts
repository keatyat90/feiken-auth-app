import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  product_id: string;
  qr_code_id: string;
  sku: string;
  batch_number: string;
  manufacture_date: Date;
  verification_status: "Authentic" | "Fake" | "Already Scanned";
}

const ProductSchema = new mongoose.Schema<IProduct>({
  product_id: { type: String },
  qr_code_id: { type: String, required: true, unique: true },
  sku: { type: String },
  batch_number: { type: String },
  manufacture_date: { type: Date },
  verification_status: { type: String, enum: ["Authentic", "Fake", "Already Scanned"], default: "Authentic" },
});
export default mongoose.model<IProduct>('Product', ProductSchema);
