import { connectDB, isDBAvailable } from "@/lib/db/connection";
import { BlogPost, Project, Video, TimelineEntry } from "@/lib/models";
import type {
  IBlogPostFields,
  IProjectFields,
  IVideoFields,
  ITimelineEntryFields,
} from "@/lib/models";

/**
 * Maps Date fields to string — matches what JSON.parse(JSON.stringify()) does.
 * Since *Fields interfaces already use string for _id, only Date needs mapping.
 */
export type Serialized<T> = T extends Date
  ? string
  : T extends (infer U)[]
    ? Serialized<U>[]
    : T extends Record<string, unknown>
      ? { [K in keyof T]: Serialized<T[K]> }
      : T;

// ── Projects ──

export async function getAllProjects(
  includeDrafts = false,
): Promise<IProjectFields[]> {
  if (!isDBAvailable()) return [];
  await connectDB();
  const filter = includeDrafts ? {} : { draft: false };
  return Project.find(filter)
    .sort({ publishedAt: -1 })
    .lean() as unknown as IProjectFields[];
}

export async function getProjectBySlug(
  slug: string,
): Promise<IProjectFields | null> {
  if (!isDBAvailable()) return null;
  await connectDB();
  return Project.findOne({ slug }).lean() as unknown as IProjectFields | null;
}

// ── Blog Posts ──

export async function getAllPosts(
  includeDrafts = false,
): Promise<IBlogPostFields[]> {
  if (!isDBAvailable()) return [];
  await connectDB();
  const filter = includeDrafts ? {} : { draft: false };
  return BlogPost.find(filter)
    .sort({ publishedAt: -1 })
    .lean() as unknown as IBlogPostFields[];
}

export async function getFeaturedPosts(): Promise<IBlogPostFields[]> {
  if (!isDBAvailable()) return [];
  await connectDB();
  return BlogPost.find({ featured: true, draft: false })
    .sort({ featuredOrder: 1, publishedAt: -1 })
    .lean() as unknown as IBlogPostFields[];
}

export async function getPostBySlug(
  slug: string,
): Promise<IBlogPostFields | null> {
  if (!isDBAvailable()) return null;
  await connectDB();
  return BlogPost.findOne({ slug }).lean() as unknown as IBlogPostFields | null;
}

// ── Videos ──

export async function getAllVideos(
  includeDrafts = false,
): Promise<IVideoFields[]> {
  if (!isDBAvailable()) return [];
  await connectDB();
  const filter = includeDrafts ? {} : { draft: false };
  return Video.find(filter)
    .sort({ publishedAt: -1 })
    .lean() as unknown as IVideoFields[];
}

export async function getVideoBySlug(
  slug: string,
): Promise<IVideoFields | null> {
  if (!isDBAvailable()) return null;
  await connectDB();
  return Video.findOne({ slug }).lean() as unknown as IVideoFields | null;
}

export async function getProjectNavigation(): Promise<
  Pick<IProjectFields, "slug" | "title" | "publishedAt">[]
> {
  if (!isDBAvailable()) return [];
  await connectDB();
  return Project.find({ draft: false })
    .select("slug title publishedAt")
    .sort({ publishedAt: -1 })
    .lean() as unknown as Pick<
    IProjectFields,
    "slug" | "title" | "publishedAt"
  >[];
}

// ── Timeline ──

export async function getTimelineEntries(): Promise<ITimelineEntryFields[]> {
  if (!isDBAvailable()) return [];
  await connectDB();
  return TimelineEntry.find({})
    .sort({ order: 1, startDate: -1 })
    .lean() as unknown as ITimelineEntryFields[];
}

// ── Serialization helper ──

export function serialize<T>(doc: T): Serialized<T> {
  return JSON.parse(JSON.stringify(doc));
}
