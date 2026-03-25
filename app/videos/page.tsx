import { getAllVideos, serialize } from "@/lib/cms/queries";
import type { VideoData } from "@/lib/cms/types";
import { VideosPageClient } from "./VideosPageClient";

export const metadata = {
  title: "Videos",
  description: "Video content on development, tutorials, and tech topics.",
};

export default async function VideosPage() {
  const videos = await getAllVideos();
  return <VideosPageClient videos={serialize<typeof videos, VideoData[]>(videos)} />;
}
