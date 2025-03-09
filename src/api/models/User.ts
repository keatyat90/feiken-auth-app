

import mongoose, { Schema } from 'mongoose';
export interface IUser extends mongoose.Document {
  name: string,
  email: string,
  password: string,
  role: string,
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);