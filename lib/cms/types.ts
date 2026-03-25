import type { Serialized } from "@/lib/cms/queries";
import type {
  IBlogPostFields,
  IProjectFields,
  IVideoFields,
  ITimelineEntryFields,
} from "@/lib/models";

/** Serialized types for client components (Date → string) */
export type BlogPostData = Serialized<IBlogPostFields>;
export type ProjectData = Serialized<IProjectFields>;
export type VideoData = Serialized<IVideoFields>;
export type TimelineEntryData = Serialized<ITimelineEntryFields>;
