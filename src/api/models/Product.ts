import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  product_id: string;
  batch_number: string;
  qr_codes: { qr_code_id: string; verification_status: string }[];
}

const ProductSchema: Schema = new Schema({
  product_id: { type: String, required: true },
  batch_number: { type: String, required: true },
  qr_codes: [
    {
      qr_code_id: { type: String, required: true, unique: true },
      verification_status: { type: String, default: "Pending" }, // Possible values: Pending, Verified, Fake
    },
  ],
});

export default mongoose.model<IProduct>("Product", ProductSchema);
