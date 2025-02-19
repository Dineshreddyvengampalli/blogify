import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  profilePicture?: string;
  bio?: string;
  role?: 'admin' | 'author' | 'reader';
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'author', 'reader'], default: 'author' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);