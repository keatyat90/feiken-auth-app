import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  productId: string;
  name: string;
  description?: string;
  manufacturer?: string;
  productionDate?: Date;
  expiryDate?: Date;
  batchNumber?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  manufacturer: { type: String },
  productionDate: { type: Date },
  expiryDate: { type: Date },
  batchNumber: { type: String },
  verified: { type: Boolean, default: true },
}, {
  timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema);
