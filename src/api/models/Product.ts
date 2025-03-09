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
  product_id: { type: String, required: true },
  qr_code_id: { type: String, required: true, unique: true },
  sku: { type: String, required: true },
  batch_number: { type: String, required: true },
  manufacture_date: { type: Date, required: true },
  verification_status: { type: String, enum: ["Authentic", "Fake", "Already Scanned"], default: "Authentic" },
});
export default mongoose.model<IProduct>('Product', ProductSchema);
