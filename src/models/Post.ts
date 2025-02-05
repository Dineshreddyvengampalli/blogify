import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Post = mongoose.model("Post", postSchema);
