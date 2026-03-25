import mongoose, { Schema, Document, Model } from "mongoose";

/** Plain data fields — used by .lean() results and serialized props */
export interface IProjectFields {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  projectType: string;
  category: string;
  skills: string[];
  tools: string[];
  links: Record<string, string>;
  duration?: string;
  role?: string;
  coverImage?: string;
  draft: boolean;
  publishedAt: Date;
  updatedAt: Date;
  seoTitle: string;
  seoDescription: string;
}

/** Full Mongoose document type — only used internally by Mongoose */
export interface IProject extends Omit<IProjectFields, "_id">, Document {}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    summary: { type: String, required: true },
    projectType: {
      type: String,
      required: true,
      enum: ["Technical", "Creative", "Business", "Learning"],
    },
    category: { type: String, default: "" },
    skills: { type: [String], default: [] },
    tools: { type: [String], default: [] },
    links: { type: Schema.Types.Mixed, default: {} },
    duration: { type: String },
    role: { type: String },
    coverImage: { type: String },
    draft: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
