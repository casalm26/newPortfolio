import type { Serialized } from "@/lib/cms/queries";
import type {
  IBlogPost,
  IProject,
  IVideo,
  ITimelineEntry,
} from "@/lib/models";

export type BlogPostData = Serialized<IBlogPost>;
export type ProjectData = Serialized<IProject>;
export type VideoData = Serialized<IVideo>;
export type TimelineEntryData = Serialized<ITimelineEntry>;
