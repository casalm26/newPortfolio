import { Types } from "mongoose";
import { connectDB } from "@/lib/db/connection";
import { BlogPost, Project, Video, TimelineEntry } from "@/lib/models";
import type { IBlogPost, IProject, IVideo, ITimelineEntry } from "@/lib/models";

/**
 * Converts Mongoose lean() result types to their JSON-serialized equivalents.
 * ObjectId → string, Date → string, arrays and objects handled recursively.
 * Document methods are stripped by .lean() at runtime; this type does so statically.
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
  const db = await connectDB();
  if (!db) return [];
  const filter = includeDrafts ? {} : { draft: false };
  return Project.find(filter).sort({ publishedAt: -1 }).lean();
}

export async function getProjectBySlug(slug: string): Promise<IProject | null> {
  const db = await connectDB();
  if (!db) return null;
  return Project.findOne({ slug }).lean();
}

// ── Blog Posts ──

export async function getAllPosts(includeDrafts = false): Promise<IBlogPost[]> {
  const db = await connectDB();
  if (!db) return [];
  const filter = includeDrafts ? {} : { draft: false };
  return BlogPost.find(filter).sort({ publishedAt: -1 }).lean();
}

export async function getPostBySlug(slug: string): Promise<IBlogPost | null> {
  const db = await connectDB();
  if (!db) return null;
  return BlogPost.findOne({ slug }).lean();
}

// ── Videos ──

export async function getAllVideos(includeDrafts = false): Promise<IVideo[]> {
  const db = await connectDB();
  if (!db) return [];
  const filter = includeDrafts ? {} : { draft: false };
  return Video.find(filter).sort({ publishedAt: -1 }).lean();
}

export async function getVideoBySlug(slug: string): Promise<IVideo | null> {
  const db = await connectDB();
  if (!db) return null;
  return Video.findOne({ slug }).lean();
}

export async function getProjectNavigation(): Promise<
  Pick<IProject, "slug" | "title" | "publishedAt">[]
> {
  const db = await connectDB();
  if (!db) return [];
  return Project.find({ draft: false })
    .select("slug title publishedAt")
    .sort({ publishedAt: -1 })
    .lean();
}

// ── Timeline ──

export async function getTimelineEntries(): Promise<ITimelineEntry[]> {
  const db = await connectDB();
  if (!db) return [];
  return TimelineEntry.find({}).sort({ order: 1, startDate: -1 }).lean();
}

// ── Serialization helper ──

/**
 * JSON round-trips a value, converting ObjectId → string and Date → string.
 * Use at the server→client boundary to produce serializable props.
 */
export function serialize<T>(doc: T): Serialized<T> {
  return JSON.parse(JSON.stringify(doc));
}
