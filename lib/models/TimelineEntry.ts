import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITimelineEntry extends Document {
  entryId: string;
  type: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  skills: string[];
  order: number;
}

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
    location: { type: String, default: "" },
    startDate: { type: String, required: true },
    endDate: { type: String, default: null },
    current: { type: Boolean, default: false },
    description: { type: String, default: "" },
    skills: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

export const TimelineEntry: Model<ITimelineEntry> =
  mongoose.models.TimelineEntry ||
  mongoose.model<ITimelineEntry>("TimelineEntry", TimelineEntrySchema);
