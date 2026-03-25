import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVideo extends Document {
  title: string;
  slug: string;
  youtubeId: string;
  description: string;
  tags: string[];
  category: string;
  publishedAt: Date;
  duration?: string;
  thumbnail?: string;
  relatedPosts: string[];
  relatedProjects: string[];
  draft: boolean;
  seoTitle: string;
  seoDescription: string;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    youtubeId: { type: String, required: true },
    description: { type: String, default: "" },
    tags: { type: [String], default: [] },
    category: { type: String, default: "" },
    publishedAt: { type: Date, default: Date.now },
    duration: { type: String },
    thumbnail: { type: String },
    relatedPosts: { type: [String], default: [] },
    relatedProjects: { type: [String], default: [] },
    draft: { type: Boolean, default: false },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

export const Video: Model<IVideo> =
  mongoose.models.Video || mongoose.model<IVideo>("Video", VideoSchema);
