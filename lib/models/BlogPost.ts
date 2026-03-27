import mongoose, { Schema, Document, Model } from "mongoose";

/** Plain data fields — used by .lean() results and serialized props */
export interface IBlogPostFields {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  tags: string[];
  category: string;
  coverImage?: string;
  author: string;
  featured: boolean;
  featuredOrder: number;
  draft: boolean;
  publishedAt: Date;
  updatedAt: Date;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

/** Full Mongoose document type — only used internally by Mongoose */
export interface IBlogPost extends Omit<IBlogPostFields, "_id">, Document {}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    summary: { type: String, required: true },
    tags: { type: [String], default: [] },
    category: { type: String, default: "" },
    coverImage: { type: String },
    author: { type: String, default: "Caspian Almerud" },
    featured: { type: Boolean, default: false },
    featuredOrder: { type: Number, default: 0 },
    draft: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    seoKeywords: { type: [String], default: [] },
  },
  {
    timestamps: true,
  },
);

export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
