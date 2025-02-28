import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  authorId: mongoose.Types.ObjectId;
  likesCount?: number;
  commentsCount?: number;
  status?: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const postSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Post: Model<IPost> = mongoose.model<IPost>('Post', postSchema);
