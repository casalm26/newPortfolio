import mongoose, { Schema, Document, Model } from "mongoose";

/** Plain data fields — used by .lean() results and serialized props */
export interface ITimelineEntryFields {
  _id: string;
  entryId: string;
  type: string;
  title: string;
  company: string;
  institution: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  responsibilities: string[];
  details: string[];
  achievements: string[];
  skills: string[];
  level: string;
  yearsOfExperience: number | null;
  impact: string;
  issuer: string;
  credentialId: string;
  links: Record<string, string>;
  order: number;
  updatedAt: Date;
}

/** Full Mongoose document type — only used internally by Mongoose */
export interface ITimelineEntry extends Omit<ITimelineEntryFields, "_id">, Document {}

const TimelineEntrySchema = new Schema<ITimelineEntry>(
  {
    entryId: { type: String, required: true, unique: true, index: true },
    type: {
      type: String,
      required: true,
      enum: [
        "work",
        "education",
        "skill",
        "personal",
        "certification",
        "project",
        "volunteer",
      ],
    },
    title: { type: String, required: true },
    company: { type: String, default: "" },
    institution: { type: String, default: "" },
    category: { type: String, default: "" },
    location: { type: String, default: "" },
    startDate: { type: String, required: true },
    endDate: { type: String, default: null },
    current: { type: Boolean, default: false },
    description: { type: String, default: "" },
    responsibilities: { type: [String], default: [] },
    details: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    level: { type: String, default: "" },
    yearsOfExperience: { type: Number, default: null },
    impact: { type: String, default: "" },
    issuer: { type: String, default: "" },
    credentialId: { type: String, default: "" },
    links: { type: Schema.Types.Mixed, default: {} },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

export const TimelineEntry: Model<ITimelineEntry> =
  mongoose.models.TimelineEntry ||
  mongoose.model<ITimelineEntry>("TimelineEntry", TimelineEntrySchema);
