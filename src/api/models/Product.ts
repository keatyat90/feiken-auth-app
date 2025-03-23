import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  product_id: string;
  batch_number: string;
  country_origin: number;
}

const ProductSchema = new Schema({
  product_id: { type: String, required: true },
  batch_number: { type: String, required: true },
  country_origin: { type: Number, required: true },
});

export default mongoose.model<IProduct>("Product", ProductSchema);

