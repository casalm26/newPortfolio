import { Types } from "mongoose";
import { connectDB } from "@/lib/db/connection";
import { BlogPost, Project, Video, TimelineEntry } from "@/lib/models";
import type { IBlogPost, IProject, IVideo, ITimelineEntry } from "@/lib/models";

/**
 * Recursively converts Mongoose Document types to their JSON-serialized
 * equivalents: ObjectId → string, Date → string, and strips Document methods.
 */
export type Serialized<T> = T extends Types.ObjectId
  ? string
  : T extends Date
    ? string
    : T extends (infer U)[]
      ? Serialized<U>[]
      : T extends Record<string, unknown>
        ? { [K in keyof T]: Serialized<T[K]> }
        : T;

// ── Projects ──

export async function getAllProjects(
  includeDrafts = false,
): Promise<IProject[]> {
  await connectDB();
  const filter = includeDrafts ? {} : { draft: false };
  return Project.find(filter).sort({ publishedAt: -1 }).lean();
}

export async function getProjectBySlug(slug: string): Promise<IProject | null> {
  await connectDB();
  return Project.findOne({ slug }).lean();
}

// ── Blog Posts ──

export async function getAllPosts(includeDrafts = false): Promise<IBlogPost[]> {
  await connectDB();
  const filter = includeDrafts ? {} : { draft: false };
  return BlogPost.find(filter).sort({ publishedAt: -1 }).lean();
}

export async function getPostBySlug(slug: string): Promise<IBlogPost | null> {
  await connectDB();
  return BlogPost.findOne({ slug }).lean();
}

// ── Videos ──

export async function getAllVideos(includeDrafts = false): Promise<IVideo[]> {
  await connectDB();
  const filter = includeDrafts ? {} : { draft: false };
  return Video.find(filter).sort({ publishedAt: -1 }).lean();
}

export async function getVideoBySlug(slug: string): Promise<IVideo | null> {
  await connectDB();
  return Video.findOne({ slug }).lean();
}

export async function getProjectNavigation(): Promise<
  Pick<IProject, "slug" | "title" | "publishedAt">[]
> {
  await connectDB();
  return Project.find({ draft: false })
    .select("slug title publishedAt")
    .sort({ publishedAt: -1 })
    .lean();
}

// ── Timeline ──

export async function getTimelineEntries(): Promise<ITimelineEntry[]> {
  await connectDB();
  return TimelineEntry.find({}).sort({ order: 1, startDate: -1 }).lean();
}

// ── Serialization helper ──

export function serialize<T>(doc: T): Serialized<T> {
  return JSON.parse(JSON.stringify(doc));
}
